import { createContext, useContext, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Phone, Video, Mic, MicOff, VideoOff, PhoneOff, X } from 'lucide-react';
import { api, apiUrl, connectionFor, hasSession } from '../api';

type Kind = 'voice' | 'video';
interface Call {
  id: string;
  kind: Kind;
  status: 'ringing' | 'active' | 'ended' | 'declined' | 'missed';
  outgoing: boolean;
  peer: { id: string; name: string };
  offer: RTCSessionDescriptionInit;
  answer: RTCSessionDescriptionInit;
  candidates: RTCIceCandidateInit[];
}
const CallContext = createContext<(id: string, kind: Kind) => void>(() => {});
export const useCalls = () => useContext(CallContext);
const message = (error: unknown) => error instanceof Error ? error.message : 'Unable to connect the call.';

function StreamVideo({ stream, muted = false, className = '' }: { stream: MediaStream | null; muted?: boolean; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [needsPlay, setNeedsPlay] = useState(false);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    let active = true;
    video.srcObject = stream;
    if (stream) void video.play().then(() => { if (active) setNeedsPlay(false); }).catch(() => { if (active && !muted) setNeedsPlay(true); });
    return () => { active = false; video.srcObject = null; };
  }, [stream, muted]);
  return <div className={className}>
    <video ref={ref} autoPlay playsInline muted={muted} className="w-full h-full object-cover rounded-2xl" />
    {needsPlay && !muted && <button className="absolute bottom-3 left-3 rounded-xl bg-white text-zinc-900 px-3 py-2" onClick={() => { void ref.current?.play().then(() => setNeedsPlay(false)).catch(() => setNeedsPlay(true)); }}>Play call audio</button>}
  </div>;
}

export function CallProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    let pending = false;
    const heartbeat = async () => {
      if (pending || !hasSession() || document.hidden) return;
      pending = true;
      try { await api('presence/', 'POST'); }
      catch { /* A missed heartbeat expires naturally; retry next interval. */ }
      finally { pending = false; }
    };
    void heartbeat();
    const timer = window.setInterval(() => { void heartbeat(); }, 25000);
    window.addEventListener('focus', heartbeat);
    document.addEventListener('visibilitychange', heartbeat);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener('focus', heartbeat);
      document.removeEventListener('visibilitychange', heartbeat);
    };
  }, []);
  const [call, setCall] = useState<Call | null>(null);
  const callRef = useRef<Call | null>(null);
  const peer = useRef<RTCPeerConnection | null>(null);
  const local = useRef<MediaStream | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [busy, setBusy] = useState(false);
  const working = useRef(false);
  const generation = useRef(0);
  const candidates = useRef<RTCIceCandidateInit[]>([]);
  const received = useRef(0);
  const sending = useRef<Promise<unknown>>(Promise.resolve());
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [connected, setConnected] = useState(false);
  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const lastHeartbeat = useRef(0);
  const connectingSince = useRef(0);

  const update = (value: Call | null) => { callRef.current = value; setCall(value); };
  const cleanup = () => {
    generation.current++;
    peer.current?.close(); peer.current = null;
    local.current?.getTracks().forEach(track => track.stop()); local.current = null;
    setLocalStream(null); setRemoteStream(null); setConnected(false);
    candidates.current = []; received.current = 0; lastHeartbeat.current = 0; connectingSince.current = 0;
    setMuted(false); setCameraOff(false); working.current = false; setBusy(false);
    update(null);
  };
  const finish = async (action: 'end' | 'decline' = 'end') => {
    const current = callRef.current;
    cleanup();
    if (current) {
      try { await api(`calls/${current.id}/`, 'PATCH', { action }); }
      catch (err) { setError(message(err)); }
    }
  };
  const sendCandidate = (id: string, candidate: RTCIceCandidateInit) => {
    sending.current = sending.current.catch(() => {}).then(async () => {
      if (callRef.current?.id !== id) return;
      try { await api(`calls/${id}/`, 'PATCH', { action: 'candidate', candidate }); }
      catch (err) { if (callRef.current?.id === id) setError(message(err)); }
    });
  };
  const flush = () => {
    const id = callRef.current?.id;
    if (id) candidates.current.splice(0).forEach(candidate => sendCandidate(id, candidate));
  };
  const prepare = async (kind: Kind, version: number) => {
    if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia || !window.RTCPeerConnection) {
      throw new Error('Calling requires HTTPS or localhost and a browser with microphone support.');
    }
    const config = await api<RTCConfiguration>('calls/config/');
    if (generation.current !== version) throw new Error('Call cancelled.');
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: kind === 'video' });
    if (generation.current !== version) { stream.getTracks().forEach(track => track.stop()); throw new Error('Call cancelled.'); }
    local.current = stream; setLocalStream(stream);
    const pc = new RTCPeerConnection(config); peer.current = pc;
    stream.getTracks().forEach(track => pc.addTrack(track, stream));
    pc.onicecandidate = event => {
      if (!event.candidate || peer.current !== pc) return;
      candidates.current.push(event.candidate.toJSON()); flush();
    };
    const remote = new MediaStream();
    pc.ontrack = event => {
      if (peer.current !== pc) return;
      remote.addTrack(event.track); setRemoteStream(new MediaStream(remote.getTracks()));
    };
    pc.onconnectionstatechange = () => {
      if (peer.current !== pc) return;
      setConnected(pc.connectionState === 'connected');
      if (pc.connectionState === 'failed') {
        setError('The call could not connect. Try again; some networks require a configured TURN relay.');
        void finish();
      }
    };
    return pc;
  };
  const start = async (profileId: string, kind: Kind) => {
    if (working.current || callRef.current) { setError('Finish your current call first.'); return; }
    working.current = true; setBusy(true); setError(''); setNotice('');
    const version = ++generation.current;
    try {
      const connection = await connectionFor(profileId);
      if (connection.status !== 'accepted') throw new Error('Calls unlock after your interest is accepted.');
      const pc = await prepare(kind, version);
      await pc.setLocalDescription(await pc.createOffer());
      if (generation.current !== version) return;
      const created = await api<Call>('calls/', 'POST', { interestId: connection.id, kind, offer: pc.localDescription?.toJSON() });
      if (generation.current !== version) { await api(`calls/${created.id}/`, 'PATCH', { action: 'end' }); return; }
      update(created); flush();
    } catch (err) {
      if (generation.current === version) { setError(message(err)); cleanup(); }
    } finally {
      if (generation.current === version) { working.current = false; setBusy(false); }
    }
  };
  const accept = async () => {
    const current = callRef.current;
    if (!current || working.current) return;
    working.current = true; setBusy(true); setError('');
    const version = ++generation.current;
    try {
      const pc = await prepare(current.kind, version);
      await pc.setRemoteDescription(current.offer);
      await pc.setLocalDescription(await pc.createAnswer());
      if (generation.current !== version) return;
      const answered = await api<Call>(`calls/${current.id}/`, 'PATCH', { action: 'answer', answer: pc.localDescription?.toJSON() });
      if (generation.current !== version) return;
      update(answered); flush();
    } catch (err) {
      if (generation.current === version) { setError(message(err)); await finish(); }
    } finally {
      if (generation.current === version) { working.current = false; setBusy(false); }
    }
  };

  // Refs keep the single polling loop attached to current operations and media.
  const tick = useRef<() => Promise<void>>(async () => {});
  tick.current = async () => {
    if (!hasSession()) { if (callRef.current || peer.current) cleanup(); return; }
    const current = callRef.current;
    if (!current) {
      if (working.current) return;
      const incoming = await api<Call[]>('calls/');
      if (!callRef.current && !working.current) {
        const ringing = incoming.find(item => !item.outgoing && item.status === 'ringing');
        if (ringing) { setError(''); setNotice(''); update(ringing); }
      }
      return;
    }
    const latest = await api<Call>(`calls/${current.id}/`);
    if (callRef.current?.id !== current.id) return;
    if (!['ringing', 'active'].includes(latest.status)) {
      setNotice(latest.status === 'missed' ? 'Call was not answered.' : latest.status === 'declined' ? 'Call declined.' : 'Call ended.');
      cleanup(); return;
    }
    if (working.current) return;
    update(latest);
    const pc = peer.current;
    if (!pc) return;
    if (latest.status === 'active') {
      if (pc.connectionState === 'connected') connectingSince.current = 0;
      else {
        if (!connectingSince.current) connectingSince.current = Date.now();
        if (Date.now() - connectingSince.current > 30000) {
          setError('The call was accepted, but the media connection timed out. Try both devices on the same Wi-Fi. If that works, a TURN relay is needed for calls across these networks.');
          await finish();
          return;
        }
      }
    }
    if (latest.outgoing && latest.answer?.sdp && !pc.remoteDescription) await pc.setRemoteDescription(latest.answer);
    if (pc.remoteDescription) {
      while (received.current < latest.candidates.length && peer.current === pc) {
        await pc.addIceCandidate(latest.candidates[received.current]); received.current++;
      }
    }
    if (Date.now() - lastHeartbeat.current > 15000 && callRef.current?.id === current.id) {
      await api(`calls/${current.id}/`, 'PATCH', { action: 'heartbeat' }); lastHeartbeat.current = Date.now();
    }
  };
  useEffect(() => {
    let pending = false;
    const poll = async () => {
      if (pending) return;
      pending = true;
      try { await tick.current(); }
      catch (err) { if (callRef.current) setError(message(err)); }
      finally { pending = false; }
    };
    void poll();
    const timer = window.setInterval(() => { void poll(); }, 2500);
    const close = () => {
      const current = callRef.current;
      const token = sessionStorage.getItem('you2me-token');
      if (current && token) void fetch(apiUrl(`calls/${current.id}/`), { method: 'PATCH', keepalive: true, headers: { 'Content-Type': 'application/json', Authorization: `Token ${token}` }, body: JSON.stringify({ action: 'end' }) }).catch(() => {});
    };
    window.addEventListener('pagehide', close);
    return () => {
      window.clearInterval(timer); window.removeEventListener('pagehide', close);
      generation.current++; peer.current?.close(); local.current?.getTracks().forEach(track => track.stop());
    };
  }, []);

  return <CallContext.Provider value={(id, kind) => { void start(id, kind); }}>
    {children}
    {(error || notice) && <div role="status" className="fixed bottom-5 left-4 right-4 sm:left-auto sm:w-96 z-[80] rounded-2xl bg-white border border-rose-200 shadow-xl p-4 flex gap-3 text-sm text-zinc-800">
      <p className="flex-1">{error || notice}</p><button aria-label="Dismiss call notice" onClick={() => { setError(''); setNotice(''); }}><X size={18} /></button>
    </div>}
    {(call || busy) && <div className="fixed inset-0 z-[70] bg-zinc-950/85 backdrop-blur flex items-center justify-center p-4">
      <section role="dialog" aria-modal="true" aria-label={`${call?.kind || ''} call`} className="w-full max-w-2xl rounded-3xl bg-zinc-900 text-white p-5 shadow-2xl space-y-5">
        <div className="text-center"><p className="text-rose-300 text-sm">{call?.kind === 'video' ? 'Video call' : 'Voice call'}</p><h2 className="text-2xl font-semibold mt-1">{call?.peer.name || 'Preparing call…'}</h2>
          <p role="status" className="text-sm text-zinc-300 mt-2">{busy ? 'Requesting device access…' : connected ? 'Connected' : call?.status === 'ringing' ? call.outgoing ? 'Ringing…' : 'Incoming call' : 'Connecting…'}</p></div>
        <div className={`relative rounded-2xl overflow-hidden bg-zinc-800 ${call?.kind === 'video' && localStream ? 'h-72 sm:h-96' : 'h-24'}`}>
          <StreamVideo stream={remoteStream} className="absolute inset-0" />
          {call?.kind === 'video' && localStream && <StreamVideo stream={localStream} muted className="absolute right-3 bottom-3 w-28 h-24 ring-1 ring-white/20 rounded-2xl" />}
          {call?.kind !== 'video' && <Phone className="absolute top-6 left-[calc(50%-24px)] text-rose-300" size={48} />}
        </div>
        <div className="flex justify-center flex-wrap gap-3">
          {call && !call.outgoing && call.status === 'ringing' && !localStream && <button disabled={busy} onClick={() => { void accept(); }} className="px-5 py-3 rounded-full bg-emerald-600 disabled:opacity-50 flex items-center gap-2"><Phone size={20} /> Accept</button>}
          {localStream && <button aria-label={muted ? 'Unmute microphone' : 'Mute microphone'} onClick={() => { local.current?.getAudioTracks().forEach(track => { track.enabled = muted; }); setMuted(!muted); }} className="p-3 rounded-full bg-zinc-700">{muted ? <MicOff /> : <Mic />}</button>}
          {localStream && call?.kind === 'video' && <button aria-label={cameraOff ? 'Turn camera on' : 'Turn camera off'} onClick={() => { local.current?.getVideoTracks().forEach(track => { track.enabled = cameraOff; }); setCameraOff(!cameraOff); }} className="p-3 rounded-full bg-zinc-700">{cameraOff ? <VideoOff /> : <Video />}</button>}
          <button onClick={() => { void finish(call && !call.outgoing && call.status === 'ringing' ? 'decline' : 'end'); }} className="px-5 py-3 rounded-full bg-rose-600 flex items-center gap-2"><PhoneOff size={20} />{call && !call.outgoing && call.status === 'ringing' ? 'Decline' : 'End call'}</button>
        </div>
        <p className="text-center text-xs text-zinc-400">Your microphone and camera are shared only after you start or accept a call.</p>
      </section>
    </div>}
  </CallContext.Provider>;
}
