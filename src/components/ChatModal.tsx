import React, { useState, useEffect } from 'react';
import { 
  X, 
  Send, 
  Lock,
  CheckCheck
} from 'lucide-react';
import type { MatrimonialProfile } from '../data/mockProfiles';

import { api, connectionFor } from '../api';

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
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [connectionId, setConnectionId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  useEffect(() => {
    if (!isOpen || !profile) return;
    let active = true;
    setMessages([]); setConnectionId(null); setError('');
    const load = async () => {
      try {
        const connection = await connectionFor(profile.id);
        if (connection.status !== 'accepted') throw new Error('Messaging unlocks after your interest is accepted.');
        let path: string | null = `interests/${connection.id}/messages/`;
        const history: Message[] = [];
        while (path) {
          const page: { results: Message[]; next: string | null } = await api(path);
          history.push(...page.results);
          path = page.next ? `interests/${connection.id}/messages/${new URL(page.next).search}` : null;
        }
        if (active) { setConnectionId(connection.id); setMessages(history); }
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
      setMessages(prev => [...prev, message]); setInputVal('');
    } catch (err) { setError(err instanceof Error ? err.message : 'Unable to send message.'); }
    finally { setSending(false); }
  };

  const icebreakers = [
    `Namaste! Your educational and life outlook resonates strongly with me.`,
    `Would love to discuss our shared thoughts on family traditions and travel!`,
    `Our Nakshatra and Gunas match wonderfully. Are your parents available for a brief call?`
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-md flex justify-center items-center p-3 sm:p-6 animate-fadeIn">
      <div 
        className="relative bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden flex flex-col h-[650px] max-h-[90vh] text-slate-800 animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {error && <p role="alert" className="p-3 text-red-700 text-sm">{error}</p>}
        {/* Top Chat Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-50/70 via-white to-teal-50/50">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={profile.photos[0]}
                alt={profile.name}
                className="w-11 h-11 rounded-full object-cover ring-2 ring-emerald-200"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-white" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-serif font-bold text-base text-[#064E3B]">
                  {profile.name}
                </h3>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  Verified Match
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {profile.occupation.title} • {profile.city}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Safety & Privacy Notice */}
        <div className="px-4 py-2 bg-emerald-50/70 border-b border-emerald-100 text-[11px] text-emerald-900 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>Private conversation for accepted connections</span>
          </div>

        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 bg-[#F8FAF8]">
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
                      ? 'bg-[#059669] text-white rounded-br-none'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                  }`}
                >
                  <p>{m.text}</p>
                  <div
                    className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${
                      isMe ? 'text-emerald-100' : 'text-slate-400'
                    }`}
                  >
                    <span>{new Date(m.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    {isMe && <CheckCheck className="w-3 h-3 text-emerald-200" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Matrimonial Icebreakers */}
        <div className="px-4 py-2 bg-white border-t border-slate-100 overflow-x-auto">
          <div className="flex gap-2">
            {icebreakers.map((ib, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(ib)}
                className="shrink-0 text-[11px] font-medium px-3 py-1 rounded-full bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-800 border border-slate-200 hover:border-emerald-200 transition-colors cursor-pointer"
              >
                💬 {ib.slice(0, 38)}...
              </button>
            ))}
          </div>
        </div>

        {/* Message Input Box */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            placeholder="Type a polite, meaningful message..."
            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

          <button
            type="button"
            onClick={() => handleSend()}
            disabled={!inputVal.trim() || !connectionId || sending}
            className="w-10 h-10 rounded-2xl bg-[#059669] hover:bg-[#047857] disabled:opacity-40 text-white flex items-center justify-center transition-all shadow-md shadow-emerald-900/15 cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
