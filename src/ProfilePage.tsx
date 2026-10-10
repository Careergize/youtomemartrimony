import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { api, hasSession } from './api';
import type { MatrimonialProfile } from './data/mockProfiles';
import { Footer } from './components/Footer';

type Field = { path: string; label: string; type?: 'number' | 'url' | 'textarea'; options?: string[]; min?: number; max?: number; required?: boolean };
const sections: { title: string; fields: Field[] }[] = [
  { title: 'Personal details', fields: [
    { path: 'name', label: 'Full name', required: true },
    { path: 'gender', label: 'Profile type', options: ['Bride', 'Groom'] },
    { path: 'age', label: 'Age', type: 'number', min: 18, max: 100, required: true },
    { path: 'height', label: 'Height description' },
    { path: 'heightInches', label: 'Height in inches', type: 'number', min: 36, max: 96, required: true },
    { path: 'city', label: 'City / Region', required: true },
    { path: 'state', label: 'State' }, { path: 'country', label: 'Country' },
    { path: 'religion', label: 'Religion', options: ['Hindu', 'Christian', 'Muslim', 'Sikh', 'Jain'] },
    { path: 'community', label: 'Community / Caste' },
    { path: 'motherTongue', label: 'Mother tongue', options: ['Malayalam', 'Tamil', 'Hindi', 'Telugu', 'Kannada', 'Bengali', 'Marathi', 'English'] },
    { path: 'diet', label: 'Diet', options: ['Vegetarian', 'Non-Vegetarian', 'Eggetarian', 'Vegan'] },
  ] },
  { title: 'Education & career', fields: [
    { path: 'education.degree', label: 'Highest degree' }, { path: 'education.college', label: 'College' },
    { path: 'education.field', label: 'Field of study' }, { path: 'occupation.title', label: 'Job title' },
    { path: 'occupation.companySector', label: 'Industry sector', options: ['Technology', 'Healthcare', 'Finance', 'Creative & Design', 'Engineering', 'Civil Services', 'Business & Entrepreneurship'] },
    { path: 'occupation.employer', label: 'Employer' }, { path: 'occupation.annualIncome', label: 'Annual income' },
    { path: 'occupation.incomeBracket', label: 'Income bracket', options: ['10-20L', '20-35L', '35-50L', '50L+'] },
  ] },
  { title: 'Family & horoscope', fields: [
    { path: 'family.type', label: 'Family type', options: ['Nuclear', 'Joint'] },
    { path: 'family.values', label: 'Family values', options: ['Liberal & Cultured', 'Moderate & Traditional', 'Progressive', 'Orthodox'] },
    { path: 'family.fatherOccupation', label: "Father’s occupation" }, { path: 'family.motherOccupation', label: "Mother’s occupation" },
    { path: 'family.siblings', label: 'Siblings' }, { path: 'family.nativePlace', label: 'Native place' },
    { path: 'horoscope.nakshatra', label: 'Nakshatra' }, { path: 'horoscope.rasi', label: 'Rasi' },
  ] },
  { title: 'About you & photo', fields: [
    { path: 'bio', label: 'About you', type: 'textarea' }, { path: 'photos.0', label: 'Profile photo URL', type: 'url' },
  ] },
];

function fieldValue(profile: MatrimonialProfile, path: string): string | number {
  let value: unknown = profile;
  for (const key of path.split('.')) value = value && typeof value === 'object' ? (value as Record<string, unknown>)[key] : undefined;
  return typeof value === 'string' || typeof value === 'number' ? value : '';
}

export default function ProfilePage() {
  const [saved, setSaved] = useState<MatrimonialProfile | null>(null);
  const [draft, setDraft] = useState<MatrimonialProfile | null>(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const load = async () => {
    setLoading(true); setError('');
    try { const profile = await api<MatrimonialProfile>('me/'); setSaved(profile); setDraft(structuredClone(profile)); }
    catch (err) { setError(err instanceof Error ? err.message : 'Unable to load your profile.'); }
    finally { setLoading(false); }
  };
  useEffect(() => { if (hasSession()) void load(); }, []);
  if (!hasSession()) return <Navigate to="/login" replace />;

  const update = (field: Field, value: string) => {
    setDraft(previous => {
      if (!previous) return previous;
      const next = structuredClone(previous);
      const keys = field.path.split('.');
      let target = next as unknown as Record<string, unknown>;
      for (const key of keys.slice(0, -1)) target = target[key] as Record<string, unknown>;
      target[keys[keys.length - 1]] = field.type === 'number' ? Number(value) : value;
      return next;
    });
    setNotice('');
  };
  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!draft || saving) return;
    setSaving(true); setError(''); setNotice('');
    try {
      const profile = await api<MatrimonialProfile>('me/', 'PATCH', { ...draft, photos: draft.photos.filter(Boolean) });
      setSaved(profile); setDraft(structuredClone(profile)); setEditing(false); setNotice('Your profile has been saved.');
    } catch (err) { setError(err instanceof Error ? err.message : 'Unable to save. Your edits are still here.'); }
    finally { setSaving(false); }
  };

  return <div className="min-h-screen flex flex-col bg-[#F8FAF8] text-slate-800">
    <header className="border-b border-emerald-100 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between gap-4">
        <Link to="/" className="font-serif text-xl font-bold text-[#064E3B]">YOU2ME <span className="text-xs font-sans">MATRIMONY</span></Link>
        <Link to="/" className="text-sm font-semibold text-emerald-700">Back to discovery</Link>
      </div>
    </header>
    <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex-1">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div><h1 className="font-serif text-3xl font-bold text-[#064E3B]">My profile</h1><p className="mt-2 text-sm text-slate-600">View your details and keep your profile up to date.</p></div>
        {saved && !editing && <button type="button" onClick={() => { setEditing(true); setNotice(''); setError(''); }} className="rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white">Edit profile</button>}
      </div>
      {loading && <p role="status">Loading your profile...</p>}
      {error && <p role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error} {!saved && <button onClick={() => void load()} className="ml-2 underline">Retry</button>}</p>}
      {notice && <p role="status" className="mb-5 rounded-xl bg-emerald-100 p-4 text-sm text-emerald-900">{notice}</p>}
      {saved && (!saved.age || !saved.gender) && <p className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">Your account is ready. Choose Edit profile to add your details. Your profile will appear in discovery after you add your age and profile type.</p>}
      {saved && draft && <>
        <div className="mb-6 rounded-2xl border border-emerald-100 bg-white p-6 flex items-center gap-4">
          {saved.photos[0] ? <img src={saved.photos[0]} alt={saved.name} className="w-20 h-20 rounded-full object-cover" /> : <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center text-2xl font-bold text-emerald-800">{saved.name.slice(0, 1)}</div>}
          <div><h2 className="text-xl font-semibold">{saved.name}</h2><p className="text-sm text-slate-500">{saved.age ? `${saved.age} years` : 'Age not added'} · {saved.city || 'City not added'}</p>{saved.mobile && <p className="mt-1 text-sm text-slate-600">{saved.mobile} · Private</p>}<p className="mt-1 text-xs text-emerald-700">{saved.verification.mobileVerified ? 'Mobile verified' : saved.verification.badgeText}</p></div>
        </div>
        <form onSubmit={save} className="space-y-6">
          {sections.map(section => <section key={section.title} className="rounded-2xl border border-emerald-100 bg-white p-5 sm:p-6">
            <h2 className="font-serif text-xl font-bold text-[#064E3B] mb-5">{section.title}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {section.fields.map(field => <div key={field.path} className={field.type === 'textarea' ? 'sm:col-span-2' : ''}>
                {editing ? <label className="block text-sm font-semibold text-slate-700">{field.label}
                  {field.options ? <select required value={fieldValue(draft, field.path)} onChange={e => update(field, e.target.value)} disabled={saving} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"><option value="" disabled>Select {field.label.toLowerCase()}</option>{field.options.map(option => <option key={option}>{option}</option>)}</select>
                    : field.type === 'textarea' ? <textarea rows={5} value={fieldValue(draft, field.path)} onChange={e => update(field, e.target.value)} disabled={saving} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                    : <input type={field.type || 'text'} required={field.required} min={field.min} max={field.max} value={fieldValue(draft, field.path)} onChange={e => update(field, e.target.value)} disabled={saving} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />}
                </label> : <><p className="text-xs font-semibold text-slate-500">{field.label}</p><p className="mt-1 text-sm whitespace-pre-wrap break-words">{fieldValue(saved, field.path) || 'Not added'}</p></>}
              </div>)}
            </div>
          </section>)}
          {editing && <div className="flex justify-end gap-3">
            <button type="button" disabled={saving} onClick={() => { setDraft(structuredClone(saved)); setEditing(false); setError(''); }} className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold disabled:opacity-50">Cancel</button>
            <button type="submit" disabled={saving} className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">{saving ? 'Saving...' : 'Save changes'}</button>
          </div>}
        </form>
      </>}
    </main>
    <Footer />
  </div>;
}
