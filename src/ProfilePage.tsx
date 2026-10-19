import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { api, hasSession } from './api';
import type { MatrimonialProfile } from './data/mockProfiles';
import { Footer } from './components/Footer';

type Field = { path: string; label: string; type?: 'number' | 'url' | 'textarea' | 'date' | 'list'; options?: string[]; min?: number; max?: number; required?: boolean };
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
    { path: 'subCaste', label: 'Subcaste' }, { path: 'gothram', label: 'Gothram' },
    { path: 'dateOfBirth', label: 'Date of birth (calculates age)', type: 'date' },
    { path: 'weightKg', label: 'Weight (kg)' },
    { path: 'bodyType', label: 'Body type', options: ['Slim', 'Average', 'Athletic', 'Heavy'] },
    { path: 'profileCreatedBy', label: 'Profile created by', options: ['Self', 'Parents', 'Sibling', 'Relative', 'Friend'] },
    { path: 'maritalStatus', label: 'Marital status', options: ['Never Married', 'Divorced', 'Awaiting Divorce'] },
    { path: 'motherTongue', label: 'Mother tongue', options: ['Malayalam', 'Tamil', 'Hindi', 'Telugu', 'Kannada', 'Bengali', 'Marathi', 'English'] },
    { path: 'diet', label: 'Diet', options: ['Vegetarian', 'Non-Vegetarian', 'Eggetarian', 'Vegan'] },
  ] },
  { title: 'Education & career', fields: [
    { path: 'education.degree', label: 'Highest degree' }, { path: 'education.college', label: 'College' },
    { path: 'education.field', label: 'Field of study' }, { path: 'occupation.title', label: 'Job title' },
    { path: 'occupation.companySector', label: 'Industry sector', options: ['Technology', 'Healthcare', 'Finance', 'Creative & Design', 'Engineering', 'Civil Services', 'Business & Entrepreneurship', 'Teaching / Academia', 'Other'] },
    { path: 'occupation.employmentType', label: 'Employed in', options: ['Private Sector', 'Government', 'Business', 'Self Employed', 'Not Working'] },
    { path: 'occupation.employer', label: 'Employer' }, { path: 'occupation.annualIncome', label: 'Annual income' },
    { path: 'occupation.incomeBracket', label: 'Income bracket', options: ['0-2L', '2-5L', '5-10L', '10-20L', '20-35L', '35-50L', '50L+'] },
  ] },
  { title: 'Family & horoscope', fields: [
    { path: 'family.type', label: 'Family type', options: ['Nuclear', 'Joint'] },
    { path: 'family.values', label: 'Family values', options: ['Liberal & Cultured', 'Moderate & Traditional', 'Progressive', 'Orthodox'] },
    { path: 'family.fatherOccupation', label: "Father’s occupation" }, { path: 'family.motherOccupation', label: "Mother’s occupation" },
    { path: 'family.siblings', label: 'Siblings' }, { path: 'family.nativePlace', label: 'Native place' },
    { path: 'family.sisters', label: 'Sisters' }, { path: 'family.brothers', label: 'Brothers' },
    { path: 'family.ancestralOrigin', label: 'Ancestral origin' },
    { path: 'family.affluenceLevel', label: 'Family status', options: ['Middle Class', 'Upper Middle Class', 'High Net Worth', 'Affluent / Business'] },
    { path: 'horoscope.nakshatra', label: 'Nakshatra' }, { path: 'horoscope.rasi', label: 'Rasi' },
    { path: 'horoscope.birthTime', label: 'Birth time' }, { path: 'horoscope.birthPlace', label: 'Birth place' },
    { path: 'horoscope.manglik', label: 'Manglik', options: ['Non-Manglik', 'Manglik', 'Anshik / Partial', "Doesn't Matter"] },
    { path: 'horoscope.horoscopeUrl', label: 'Horoscope document URL', type: 'url' },
  ] },
  { title: 'Partner preferences', fields: [
    { path: 'partnerPreferences.ageRange.0', label: 'Minimum partner age', type: 'number', min: 18, max: 100 },
    { path: 'partnerPreferences.ageRange.1', label: 'Maximum partner age', type: 'number', min: 18, max: 100 },
    { path: 'partnerPreferences.heightRange.0', label: 'Minimum partner height (inches)', type: 'number', min: 36, max: 96 },
    { path: 'partnerPreferences.heightRange.1', label: 'Maximum partner height (inches)', type: 'number', min: 36, max: 96 },
    ...['maritalStatus', 'religion', 'motherTongue', 'education', 'occupationSectors', 'preferredLocations', 'diet'].map(path => ({ path: `partnerPreferences.${path}`, label: ({ maritalStatus: 'Marital status', religion: 'Religion', motherTongue: 'Mother tongue', education: 'Education', occupationSectors: 'Career sectors', preferredLocations: 'Locations', diet: 'Diet' } as Record<string, string>)[path] + ' (comma-separated; blank means any)', type: 'list' as const })),
    { path: 'partnerPreferences.manglikPreference', label: 'Manglik preference', options: ["Doesn't Matter", 'Non-Manglik', 'Manglik', 'Anshik / Partial'] },
  ] },
  { title: 'About you & photo', fields: [
    { path: 'bio', label: 'About you', type: 'textarea' },
    { path: 'hobbies', label: 'Hobbies (comma-separated)', type: 'list' },
    { path: 'values', label: 'Personality & values (comma-separated)', type: 'list' },
    { path: 'languagesSpoken', label: 'Languages spoken (comma-separated)', type: 'list' },
    { path: 'smoke', label: 'Smoking', options: ['Never', 'Occasionally'] },
    { path: 'drink', label: 'Drinking', options: ['Never', 'Occasionally'] },
  ] },
];

function fieldValue(profile: MatrimonialProfile, path: string): string | number {
  let value: unknown = profile;
  for (const key of path.split('.')) value = value && typeof value === 'object' ? (value as Record<string, unknown>)[key] : undefined;
  return Array.isArray(value) ? value.join(',') : typeof value === 'string' || typeof value === 'number' ? value : '';
}

export default function ProfilePage() {
  const [saved, setSaved] = useState<MatrimonialProfile | null>(null);
  const [draft, setDraft] = useState<MatrimonialProfile | null>(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
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
      target[keys[keys.length - 1]] = field.type === 'number' ? Number(value) : field.type === 'list' ? value.split(',') : value;
      return next;
    });
    setNotice('');
  };
  const uploadPhoto = async (file: File) => {
    if (uploading || saving) return;
    if (file.size > 5 * 1024 * 1024) { setError('Choose a photo smaller than 5 MB.'); return; }
    setUploading(true); setError(''); setNotice('');
    try {
      const data = new FormData(); data.append('photo', file);
      const result = await api<{ url: string }>('me/photo/', 'POST', data);
      update({ path: 'photos.0', label: 'Profile photo' }, result.url);
      setNotice('Photo uploaded. Choose Save changes to update your profile.');
    } catch (err) { setError(err instanceof Error ? err.message : 'Unable to upload your photo.'); }
    finally { setUploading(false); }
  };
  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!draft || saving || uploading) return;
    setSaving(true); setError(''); setNotice('');
    try {
      const payload = structuredClone(draft);
      for (const field of sections.flatMap(section => section.fields).filter(field => field.type === 'list')) {
        const keys = field.path.split('.');
        let target = payload as unknown as Record<string, unknown>;
        for (const key of keys.slice(0, -1)) target = target[key] as Record<string, unknown>;
        const key = keys[keys.length - 1];
        target[key] = (target[key] as string[]).map(value => value.trim()).filter(Boolean);
      }
      const profile = await api<MatrimonialProfile>('me/', 'PATCH', { ...payload, photos: payload.photos.filter(Boolean) });
      setSaved(profile); setDraft(structuredClone(profile)); setEditing(false); setNotice('Your profile has been saved.');
    } catch (err) { setError(err instanceof Error ? err.message : 'Unable to save. Your edits are still here.'); }
    finally { setSaving(false); }
  };

  return <div className="min-h-screen flex flex-col bg-[#FAFAFA] text-zinc-800">
    <header className="border-b border-red-100 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between gap-4">
        <Link to="/" className="font-serif text-xl font-bold text-[#18181B]">YOU2ME <span className="text-xs font-sans">MATRIMONY</span></Link>
        <Link to="/" className="text-sm font-semibold text-red-700">Back to discovery</Link>
      </div>
    </header>
    <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex-1">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div><h1 className="font-serif text-3xl font-bold text-[#18181B]">My profile</h1><p className="mt-2 text-sm text-zinc-600">View your details and keep your profile up to date.</p></div>
        {saved && !editing && <button type="button" onClick={() => { setEditing(true); setNotice(''); setError(''); }} className="rounded-xl bg-red-700 px-5 py-2.5 text-sm font-semibold text-white">Edit profile</button>}
      </div>
      {loading && <p role="status">Loading your profile...</p>}
      {error && <p role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error} {!saved && <button onClick={() => void load()} className="ml-2 underline">Retry</button>}</p>}
      {notice && <p role="status" className="mb-5 rounded-xl bg-red-100 p-4 text-sm text-red-900">{notice}</p>}
      {saved && (!saved.age || !saved.gender) && <p className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-900">Your account is ready. Choose Edit profile to add your details. Your profile will appear in discovery after you add your age and profile type.</p>}
      {saved && draft && <>
        <div className="mb-6 rounded-2xl border border-red-100 bg-white p-6 flex items-center gap-4">
          {saved.photos[0] ? <img src={saved.photos[0]} alt={saved.name} className="w-20 h-20 rounded-full object-cover" /> : <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center text-2xl font-bold text-red-800">{saved.name.slice(0, 1)}</div>}
          <div><h2 className="text-xl font-semibold">{saved.name}</h2><p className="text-sm text-zinc-500">{saved.age ? `${saved.age} years` : 'Age not added'} · {saved.city || 'City not added'}</p>{saved.mobile && <p className="mt-1 text-sm text-zinc-600">{saved.mobile} · Private</p>}<p className="mt-1 text-xs text-red-700">{saved.verification.mobileVerified ? 'Mobile verified' : saved.verification.badgeText}</p></div>
        </div>
        <form onSubmit={save} className="space-y-6">
          <section className="rounded-2xl border border-red-100 bg-white p-5 sm:p-6">
            <h2 className="font-serif text-xl font-bold mb-4">Profile photo</h2>
            {(editing ? draft : saved).photos[0] && <img src={(editing ? draft : saved).photos[0]} alt="Profile photo preview" className="mb-4 h-40 w-40 rounded-2xl object-cover" />}
            {editing ? <>
              <label className="block text-sm font-semibold">Upload a photo
                <input type="file" accept="image/jpeg,image/png,image/webp" disabled={saving || uploading} onChange={event => { const file = event.target.files?.[0]; event.target.value = ''; if (file) void uploadPhoto(file); }} className="mt-2 block w-full text-sm file:mr-4 file:rounded-xl file:border-0 file:bg-red-50 file:px-4 file:py-3 file:font-semibold file:text-red-700" />
              </label>
              <p className="mt-2 text-xs text-zinc-500">JPEG, PNG, or WebP. Maximum 5 MB.</p>
              {uploading && <p role="status" className="mt-2 text-sm">Uploading photo...</p>}
            </> : !saved.photos[0] && <p className="text-sm text-zinc-500">Choose Edit profile to upload your photo.</p>}
          </section>
          {sections.map(section => <section key={section.title} className="rounded-2xl border border-red-100 bg-white p-5 sm:p-6">
            <h2 className="font-serif text-xl font-bold text-[#18181B] mb-5">{section.title}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {section.fields.map(field => <div key={field.path} className={field.type === 'textarea' ? 'sm:col-span-2' : ''}>
                {editing ? <label className="block text-sm font-semibold text-zinc-700">{field.label}
                  {field.options ? <select required={field.required || field.path === 'gender'} value={fieldValue(draft, field.path)} onChange={e => update(field, e.target.value)} disabled={saving || uploading} className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"><option value="">Select {field.label.toLowerCase()}</option>{field.options.map(option => <option key={option}>{option}</option>)}</select>
                    : field.type === 'textarea' ? <textarea rows={5} value={fieldValue(draft, field.path)} onChange={e => update(field, e.target.value)} disabled={saving || uploading} className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
                    : <input type={field.type === 'list' ? 'text' : field.type || 'text'} required={field.required} min={field.min} max={field.max} value={fieldValue(draft, field.path)} onChange={e => update(field, e.target.value)} disabled={saving || uploading} className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />}
                </label> : <><p className="text-xs font-semibold text-zinc-500">{field.label}</p><p className="mt-1 text-sm whitespace-pre-wrap break-words">{fieldValue(saved, field.path) || 'Not added'}</p></>}
              </div>)}
            </div>
          </section>)}
          {editing && <div className="flex justify-end gap-3">
            <button type="button" disabled={saving || uploading} onClick={() => { setDraft(structuredClone(saved)); setEditing(false); setError(''); }} className="rounded-xl border border-zinc-300 px-5 py-3 text-sm font-semibold disabled:opacity-50">Cancel</button>
            <button type="submit" disabled={saving || uploading} className="rounded-xl bg-red-700 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">{saving ? 'Saving...' : 'Save changes'}</button>
          </div>}
        </form>
      </>}
    </main>
    <Footer />
  </div>;
}
