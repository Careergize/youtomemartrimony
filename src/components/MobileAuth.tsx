import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, X } from 'lucide-react';
import { api } from '../api';

interface OtpResult { nameRequired?: boolean; challengeId?: string; mobile?: string; expiresIn?: number; resendAfter?: number; devOtp?: string; otpLength?: number; detail: string }
export default function MobileAuth({ registration = false, onClose }: { registration?: boolean; onClose: () => void }) {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [needsName, setNeedsName] = useState(registration);
  const [challenge, setChallenge] = useState<OtpResult | null>(null);
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [resendAt, setResendAt] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const dialog = useRef<HTMLDivElement>(null);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    const previous = document.activeElement as HTMLElement | null;
    dialog.current?.querySelector<HTMLInputElement>('input')?.focus();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { mounted.current = false; document.body.style.overflow = overflow; previous?.focus(); };
  }, []);
  useEffect(() => {
    const tick = () => setSeconds(Math.max(0, Math.ceil((resendAt - Date.now()) / 1000)));
    tick(); const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [resendAt]);
  useEffect(() => { dialog.current?.querySelector<HTMLInputElement>('input')?.focus(); }, [challenge?.challengeId, needsName]);
  const requestCode = async () => {
    setBusy(true); setError('');
    try {
      const result = await api<OtpResult>('auth/otp/request/', 'POST', { mobile, name: needsName ? name.trim() : '' });
      if (!mounted.current) return;
      if (result.nameRequired) { setNeedsName(true); setError('Welcome! Add your name to create your account.'); return; }
      setChallenge(result); setCode(result.devOtp || ''); setResendAt(Date.now() + (result.resendAfter || 60) * 1000);
    } catch (err) { if (mounted.current) setError(err instanceof Error ? err.message : 'Unable to request a code.'); }
    finally { if (mounted.current) setBusy(false); }
  };
  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); if (busy) return;
    if (!challenge) { await requestCode(); return; }
    setBusy(true); setError('');
    try {
      const result = await api<{ token: string; isNewUser: boolean }>('auth/otp/verify/', 'POST', { challengeId: challenge.challengeId, mobile: challenge.mobile, code });
      sessionStorage.setItem('you2me-token', result.token);
      sessionStorage.setItem('you2me-auth-dismissed', 'true');
      window.location.assign(result.isNewUser ? '/profile' : '/');
    } catch (err) { if (mounted.current) setError(err instanceof Error ? err.message : 'Unable to verify the code.'); }
    finally { if (mounted.current) setBusy(false); }
  };
  return <div className="fixed inset-0 z-[70] bg-zinc-950/60 backdrop-blur-sm flex items-center justify-center p-4">
    <div ref={dialog} role="dialog" aria-modal="true" aria-labelledby="mobile-auth-title" className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 sm:p-8 shadow-xl" onKeyDown={event => {
      if (event.key === 'Escape' && !busy) onClose();
      if (event.key === 'Tab') {
        const nodes = dialog.current?.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), a[href]');
        if (!nodes?.length) return;
        const first = nodes[0], last = nodes[nodes.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    }}>
      <button type="button" aria-label="Close login" disabled={busy} onClick={onClose} className="absolute right-4 top-4 rounded-full p-2 text-zinc-500 hover:bg-zinc-100"><X className="h-5 w-5" /></button>
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-700"><Heart className="h-6 w-6" /></div>
      <h1 id="mobile-auth-title" className="font-serif text-2xl font-bold text-[#18181B]">{challenge ? 'Verify your mobile' : needsName ? 'Welcome to YOU2ME' : 'Log in to YOU2ME'}</h1>
      <p className="mt-2 mb-6 text-sm text-zinc-600">{challenge ? `Enter the ${challenge.otpLength || 4}-digit code for ${challenge.mobile}. It expires in 5 minutes.` : needsName ? 'Start with your name and mobile number. Add your profile details after logging in.' : 'Enter your mobile number to continue with a one-time code.'}</p>
      <form onSubmit={submit} className="space-y-4">
        {!challenge ? <>
          {needsName && <label className="block text-sm font-semibold text-zinc-700">Your name<input required maxLength={120} autoComplete="name" value={name} onChange={e => setName(e.target.value)} disabled={busy} className="mt-1.5 w-full rounded-xl border border-zinc-200 p-3 focus:outline-none focus:ring-2 focus:ring-red-500" /></label>}
          <label className="block text-sm font-semibold text-zinc-700">Mobile number<input type="tel" required autoComplete="tel" placeholder="10-digit Indian number or +country code" value={mobile} onChange={e => setMobile(e.target.value)} disabled={busy} maxLength={30} className="mt-1.5 w-full rounded-xl border border-zinc-200 p-3 focus:outline-none focus:ring-2 focus:ring-red-500" /></label>
        </> : <>
          {challenge.devOtp && <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">Local test mode: <strong>{challenge.devOtp}</strong>. No SMS was sent.</p>}
          <label className="block text-sm font-semibold text-zinc-700">Verification code<input required inputMode="numeric" autoComplete="one-time-code" pattern={`[0-9]{${challenge.otpLength || 4}}`} maxLength={challenge.otpLength || 4} value={code} onChange={e => setCode(e.target.value.replace(/\D/g, ''))} disabled={busy} className="mt-1.5 w-full rounded-xl border border-zinc-200 p-3 text-center text-xl tracking-[0.4em] focus:outline-none focus:ring-2 focus:ring-red-500" /></label>
        </>}
        {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
        <button type="submit" disabled={busy} className="w-full rounded-xl bg-red-700 py-3 font-semibold text-white hover:bg-red-800 disabled:opacity-50">{busy ? 'Please wait...' : challenge ? 'Verify & continue' : 'Get OTP'}</button>
        {challenge && <div className="flex justify-between gap-3 text-xs">
          <button type="button" disabled={busy} onClick={() => { setChallenge(null); setCode(''); setError(''); }} className="text-zinc-600 underline">Change mobile number</button>
          <button type="button" disabled={busy || seconds > 0} onClick={() => void requestCode()} className="text-red-700 underline disabled:text-zinc-400">{seconds > 0 ? `Resend in ${seconds}s` : 'Resend OTP'}</button>
        </div>}
      </form>
      <p className="mt-5 text-center text-xs text-zinc-500">Your number stays private on your public profile.</p>
      <Link to="/login/email" onClick={() => sessionStorage.setItem('you2me-auth-dismissed', 'true')} className="mt-4 block text-center text-xs text-red-700 underline">Use an existing email account</Link>
    </div>
  </div>;
}
