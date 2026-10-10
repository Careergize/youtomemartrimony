import React, { useState } from 'react';
import { 
  X, 
  Send, 
  PhoneCall, 
  Lock,
  CheckCheck
} from 'lucide-react';
import type { MatrimonialProfile } from '../data/mockProfiles';

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
  currentUser,
  isOpen,
  onClose
}) => {
  if (!isOpen || !profile) return null;

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'them',
      text: `Hello ${currentUser.name.split(' ')[0]}! It's wonderful to connect with you. Our families and partner preferences appear to share many values.`,
      time: '11:15 AM'
    },
    {
      id: 'm2',
      sender: 'them',
      text: 'I read your bio and appreciated your balance of career aspirations with cultural grounding. Would love to know more about your weekend passions!',
      time: '11:16 AM'
    }
  ]);

  const [inputVal, setInputVal] = useState('');
  const [contactShared, setContactShared] = useState(false);

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputVal;
    if (!text.trim()) return;

    const newMsg: Message = {
      id: String(Date.now()),
      sender: 'me',
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputVal('');

    // Simulated reply after 1.5 seconds
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          sender: 'them',
          text: `Thank you for sharing, ${currentUser.name.split(' ')[0]}! That aligns closely with how my family and I see things. Let me know if you would like our parents to coordinate a call as well.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1500);
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
            <span>End-to-End Encrypted Matrimonial Channel</span>
          </div>

          <button
            type="button"
            onClick={() => setContactShared(true)}
            className="font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 text-[11px] cursor-pointer"
          >
            <PhoneCall className="w-3 h-3" />
            <span>{contactShared ? 'Contact Details Shared' : 'Share Family Contact'}</span>
          </button>
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
                    <span>{m.time}</span>
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
            disabled={!inputVal.trim()}
            className="w-10 h-10 rounded-2xl bg-[#059669] hover:bg-[#047857] disabled:opacity-40 text-white flex items-center justify-center transition-all shadow-md shadow-emerald-900/15 cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
