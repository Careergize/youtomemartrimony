import { useEffect, useRef, useState } from 'react';
import { MessageCircle, Search, X, ChevronRight } from 'lucide-react';
import { api } from '../api';
import type { MatrimonialProfile } from '../data/mockProfiles';

type Conversation = { id: number; profile: MatrimonialProfile; unread: number; lastMessage: { id: number; text: string; time: string; sender: 'me' | 'them' } };
export function Messenger({ profiles, visible, activeProfileId, onOpen, onShowInbox }: {
  profiles: MatrimonialProfile[]; visible: boolean; activeProfileId?: string;
  onOpen: (profile: MatrimonialProfile) => void; onShowInbox: () => void;
}) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [notice, setNotice] = useState<Conversation | null>(null);
  const seen = useRef<Map<number, number>>(new Map());
  const initialized = useRef(false);
  useEffect(() => {
    let live = true;
    let pending = false;
    const refresh = async () => {
      if (pending) return;
      pending = true;
      try {
        const rows = await api<Conversation[]>('inbox/');
        if (!live) return;
        const incoming = rows.find(row => row.unread > 0 && row.profile.id !== activeProfileId &&
          (!initialized.current || row.lastMessage.id > (seen.current.get(row.id) ?? 0)) && row.lastMessage.sender === 'them');
        if (incoming) setNotice(incoming);
        seen.current = new Map(rows.map(row => [row.id, row.lastMessage.id]));
        initialized.current = true;
        setConversations(rows); setError('');
      } catch (err) { if (live) setError(err instanceof Error ? err.message : 'Unable to load messages.'); }
      finally { pending = false; if (live) setLoaded(true); }
    };
    void refresh();
    const timer = window.setInterval(() => { void refresh(); }, 5000);
    window.addEventListener('focus', refresh);
    return () => { live = false; window.clearInterval(timer); window.removeEventListener('focus', refresh); };
  }, [activeProfileId]);
  const unread = conversations.reduce((total, row) => total + row.unread, 0);
  useEffect(() => {
    const title = document.title;
    if (unread) document.title = `(${unread}) New messages · YOU2ME`;
    return () => { document.title = title; };
  }, [unread]);
  const open = (profile: MatrimonialProfile) => { setNotice(null); onOpen(profile); };
  const matches = (profile: MatrimonialProfile) => profile.name.toLowerCase().includes(query.toLowerCase());
  return <>
    <button type="button" onClick={onShowInbox} title="Messages" aria-label={`Messages, ${unread} unread`} className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#C71F37] text-white shadow-xl hover:bg-red-800">
      <MessageCircle size={25} aria-hidden="true" />
      {unread > 0 && <span className="absolute -right-1 -top-1 rounded-full bg-white px-2 text-sm font-bold text-red-700 shadow-sm">{unread}</span>}
    </button>
    {notice && <div role="status" aria-live="polite" className="fixed right-4 top-32 z-[55] flex w-[min(360px,calc(100vw-32px))] items-start gap-2 rounded-2xl border border-zinc-200 bg-white p-4 shadow-xl">
      <button type="button" onClick={() => open(notice.profile)} className="flex min-w-0 flex-1 gap-3 text-left">
        <img src={notice.profile.photos[0]} alt="" className="h-11 w-11 rounded-full object-cover" />
        <span className="min-w-0"><span className="block text-xs font-semibold text-red-700">New message</span><strong className="block">{notice.profile.name}</strong><span className="block truncate text-sm text-zinc-600">{notice.lastMessage.text}</span><span className="text-xs text-red-700">Click to reply</span></span>
      </button>
      <button type="button" aria-label="Dismiss notification" onClick={() => setNotice(null)}><X size={17} /></button>
    </div>}
    {visible && <section className="mx-auto my-8 max-w-6xl overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
      <div className="border-b border-zinc-100 p-6"><h1 className="text-2xl font-bold">Messages {unread > 0 && <span className="text-base text-red-700">({unread} unread)</span>}</h1><p className="mt-1 text-sm text-zinc-500">Find someone and say hello. No mutual match needed.</p></div>
      <div className="grid md:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-h-96 border-r border-zinc-100 p-4">
          <label className="mb-4 flex items-center gap-2 rounded-xl bg-zinc-100 px-3 py-2"><Search size={18} /><input aria-label="Search people and conversations" placeholder="Search messages or people" value={query} onChange={e => setQuery(e.target.value)} className="w-full bg-transparent outline-none" /></label>
          {error && <p role="alert" className="p-3 text-sm text-red-700">{error} Retrying automatically…</p>}
          {!loaded && <p className="p-6 text-zinc-500">Loading messages…</p>}
          {loaded && !error && !conversations.filter(row => matches(row.profile)).length && <div className="px-5 py-14 text-center"><MessageCircle className="mx-auto mb-3 text-red-400" size={40} /><h2 className="font-semibold">{query ? 'No conversations found' : 'Your conversations start here'}</h2><p className="mt-2 text-sm text-zinc-500">Choose a member to send your first message.</p></div>}
          {conversations.filter(row => matches(row.profile)).map(row => <button key={row.id} type="button" onClick={() => open(row.profile)} className={`mb-1 flex w-full items-center gap-3 rounded-2xl p-3 text-left hover:bg-red-50 ${row.unread ? 'bg-red-50/70' : ''}`}>
            <img src={row.profile.photos[0]} alt="" className="h-12 w-12 rounded-full object-cover" />
            <span className="min-w-0 flex-1"><span className="flex justify-between gap-2"><strong className="truncate">{row.profile.name}</strong><time className="shrink-0 text-xs text-zinc-400">{new Date(row.lastMessage.time).toLocaleDateString([], { month: 'short', day: 'numeric' })}</time></span><span className={`block truncate text-sm ${row.unread ? 'font-semibold text-zinc-900' : 'text-zinc-500'}`}>{row.lastMessage.sender === 'me' ? 'You: ' : ''}{row.lastMessage.text}</span></span>
            {row.unread > 0 && <span aria-label={`${row.unread} unread messages`} className="rounded-full bg-red-600 px-2 py-0.5 text-xs font-bold text-white">{row.unread}</span>}<ChevronRight size={17} />
          </button>)}
        </div>
        <aside className="p-5"><h2 className="mb-1 font-semibold">Start a new chat</h2><p className="mb-4 text-xs text-zinc-500">Choose a person to message</p><div className="max-h-[560px] overflow-y-auto">{profiles.filter(matches).map(profile => <button key={profile.id} type="button" onClick={() => open(profile)} className="flex w-full items-center gap-3 rounded-xl p-2 text-left hover:bg-zinc-50"><span className="relative"><img src={profile.photos[0]} alt="" className="h-10 w-10 rounded-full object-cover" />{profile.isOnline && <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />}</span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold">{profile.name}</span><span className="text-xs text-zinc-500">{profile.isOnline ? 'Active now' : profile.city}</span></span><MessageCircle size={17} className="text-red-600" /></button>)}</div></aside>
      </div>
    </section>}
  </>;
}
