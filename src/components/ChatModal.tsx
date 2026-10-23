import React, { useState, useEffect, useRef } from 'react';

import { 

  X, 

  Send, 

  Lock,


  Phone,

  Video

} from 'lucide-react';

import type { MatrimonialProfile } from '../data/mockProfiles';



import { api } from '../api';

import { useCalls } from './Calls';



interface ChatModalProps {

  profile: MatrimonialProfile | null;

  currentUser: MatrimonialProfile;

  isOpen: boolean;

  onClose: () => void;

}



interface Message {

  id: string;

  sender: 'me' | 'them';

  text: string;

  time: string;

}



export const ChatModal: React.FC<ChatModalProps> = ({

  profile,

  isOpen,

  onClose

}) => {

  const startCall = useCalls();

  const bottomRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages.length]);

  const [inputVal, setInputVal] = useState('');

  const [connectionId, setConnectionId] = useState<number | null>(null);

  const [error, setError] = useState('');

  const [sending, setSending] = useState(false);

  const [canCall, setCanCall] = useState(false);
  const [online, setOnline] = useState(false);

  useEffect(() => {

    if (!isOpen || !profile) return;

    let active = true;

    setMessages([]); setInputVal(''); setCanCall(false); setConnectionId(null); setError(''); setOnline(profile.isOnline);

    const load = async () => {

      try {

        const [connection, latestProfile] = await Promise.all([

          api<{ id: number; status: string }>(`profiles/${profile.id}/interest/`, 'POST'), api<MatrimonialProfile>(`profiles/${profile.id}/`),

        ]);

        if (active) { setOnline(latestProfile.isOnline); setCanCall(connection.status === 'accepted'); }

        if (connection.status === 'declined') throw new Error('This conversation is closed.');

        let path: string | null = `interests/${connection.id}/messages/`;

        const history: Message[] = [];

        while (path) {

          const page: { results: Message[]; next: string | null } = await api(path);

          history.push(...page.results);

          path = page.next ? `interests/${connection.id}/messages/${new URL(page.next).search}` : null;

        }

        if (active) { setConnectionId(connection.id); setMessages(history);

          if (history.length && !document.hidden) await api(`interests/${connection.id}/read/`, 'POST', { through: history[history.length - 1].id }); }

      } catch (err) { if (active) setError(err instanceof Error ? err.message : 'Unable to load messages.'); }

    };

    void load();

    const timer = window.setInterval(() => { void load(); }, 5000);

    return () => { active = false; window.clearInterval(timer); };

  }, [isOpen, profile?.id]);

  if (!isOpen || !profile) return null;

  const handleSend = async (textToSend?: string) => {

    const text = (textToSend || inputVal).trim();

    if (!text || !connectionId || sending) return;

    setSending(true); setError('');

    try {

      const message = await api<Message>(`interests/${connectionId}/messages/`, 'POST', { text });

      setMessages(prev => prev.some(item => item.id === message.id) ? prev : [...prev, message]); setInputVal('');

    } catch (err) { setError(err instanceof Error ? err.message : 'Unable to send message.'); }

    finally { setSending(false); }

  };



  const icebreakers = [

    `Namaste! Your educational and life outlook resonates strongly with me.`,

    `Would love to discuss our shared thoughts on family traditions and travel!`,

    `Our Nakshatra and Gunas match wonderfully. Are your parents available for a brief call?`

  ];



  return (

    <div role="dialog" aria-modal="true" aria-label={`Chat with ${profile.name}`} className="fixed inset-0 z-[60] bg-zinc-950/30 flex justify-end items-end sm:p-5">

      <div 

        className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl border border-red-100 overflow-hidden flex flex-col h-[650px] max-h-[90vh] text-zinc-800 animate-slideUp"

        onClick={(e) => e.stopPropagation()}

      >

        {error && <p role="alert" className="p-3 text-red-700 text-sm">{error}</p>}

        {/* Top Chat Header */}

        <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between bg-gradient-to-r from-red-50/70 via-white to-rose-50/50">

          <div className="flex items-center gap-3">

            <div className="relative">

              <img

                src={profile.photos[0]}

                alt={profile.name}

                className="w-11 h-11 rounded-full object-cover ring-2 ring-red-200"

              />

              <span aria-label={online ? 'Online' : 'Offline'} className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-white ${online ? 'bg-emerald-500' : 'bg-zinc-300'}`} />

            </div>



            <div>

              <div className="flex items-center gap-1.5">

                <h3 className="font-serif font-bold text-base text-[#18181B]">

                  {profile.name}

                </h3>

                {online && <span className="text-xs font-semibold text-emerald-700">Online</span>}

                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-800">

                  Messages

                </span>

              </div>

              <p className="text-xs text-zinc-500">

                {profile.occupation.title} • {profile.city}

              </p>

            </div>

          </div>



          <div className="flex items-center gap-1">

          <button type="button" aria-label="Start voice call" title={canCall ? "Voice call" : "Calls are available after an interest is accepted"} disabled={!connectionId || !canCall} onClick={() => startCall(profile.id, 'voice')} className="p-2 rounded-full hover:bg-red-100 text-red-700 disabled:opacity-40"><Phone size={20} /></button>

          <button type="button" aria-label="Start video call" title={canCall ? "Video call" : "Calls are available after an interest is accepted"} disabled={!connectionId || !canCall} onClick={() => startCall(profile.id, 'video')} className="p-2 rounded-full hover:bg-red-100 text-red-700 disabled:opacity-40"><Video size={20} /></button>

          <button

            type="button"

            onClick={onClose}

            aria-label="Close chat"

            className="w-9 h-9 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-500 flex items-center justify-center transition-colors cursor-pointer"

          >

            <X className="w-5 h-5" />

          </button>

          </div>

        </div>



        {/* Safety & Privacy Notice */}

        <div className="px-4 py-2 bg-red-50/70 border-b border-red-100 text-[11px] text-red-900 flex items-center justify-between">

          <div className="flex items-center gap-1.5">

            <Lock className="w-3.5 h-3.5 text-red-600" />

            <span>Private conversation • Say hello and get to know each other</span>

          </div>



        </div>



        {/* Chat Messages Body */}

        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 bg-[#FAFAFA]">

          {!messages.length && !error && <p className="text-center text-sm text-zinc-500 py-10">Start your conversation. Send a friendly hello!</p>}

          {messages.map((m) => {

            const isMe = m.sender === 'me';

            return (

              <div

                key={m.id}

                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}

              >

                <div

                  className={`max-w-[82%] px-4 py-3 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${

                    isMe

                      ? 'bg-[#C71F37] text-white rounded-br-none'

                      : 'bg-white text-zinc-800 border border-zinc-200 rounded-bl-none'

                  }`}

                >

                  <p>{m.text}</p>

                  <div

                    className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${

                      isMe ? 'text-red-100' : 'text-zinc-400'

                    }`}

                  >

                    <span>{new Date(m.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>

                    

                  </div>

                </div>

              </div>

            );

          })}

          <div ref={bottomRef} />

        </div>



        {/* Matrimonial Icebreakers */}

        <div className="px-4 py-2 bg-white border-t border-zinc-100 overflow-x-auto">

          <div className="flex gap-2">

            {icebreakers.map((ib, idx) => (

              <button

                key={idx}

                type="button"

                onClick={() => handleSend(ib)}

                className="shrink-0 text-[11px] font-medium px-3 py-1 rounded-full bg-zinc-50 hover:bg-red-50 text-zinc-600 hover:text-red-800 border border-zinc-200 hover:border-red-200 transition-colors cursor-pointer"

              >

                💬 {ib.slice(0, 38)}...

              </button>

            ))}

          </div>

        </div>



        {/* Message Input Box */}

        <div className="p-3 sm:p-4 bg-white border-t border-zinc-200 flex items-center gap-2">

          <input

            type="text"

            value={inputVal}

            onChange={(e) => setInputVal(e.target.value)}

            onKeyDown={(e) => {

              if (e.key === 'Enter' && !e.nativeEvent.isComposing) handleSend();

            }}

            placeholder="Write a message…"

            className="flex-1 px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-500"

          />



          <button

            type="button"

            onClick={() => handleSend()}

            aria-label="Send message"

            disabled={!inputVal.trim() || !connectionId || sending}

            className="w-10 h-10 rounded-2xl bg-[#C71F37] hover:bg-[#A6192D] disabled:opacity-40 text-white flex items-center justify-center transition-all shadow-md shadow-red-900/15 cursor-pointer"

          >

            <Send className="w-4 h-4" />

          </button>

        </div>



      </div>

    </div>

  );

};

