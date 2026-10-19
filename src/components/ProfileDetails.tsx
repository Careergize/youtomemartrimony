import type { MatrimonialProfile } from '../data/mockProfiles';

export function ProfileDetails({ profile }: { profile: MatrimonialProfile }) {
  const groups: { title: string; rows: [string, string | number | undefined][] }[] = [
    { title: 'Personal information', rows: [
      ['Age', profile.age ? `${profile.age} years` : ''], ['Height', profile.height],
      ['Weight', profile.weightKg ? `${profile.weightKg} kg` : ''], ['Body type', profile.bodyType],
      ['Mother tongue', profile.motherTongue], ['Profile created by', profile.profileCreatedBy],
      ['Marital status', profile.maritalStatus], ['Lives in', [profile.city, profile.state, profile.country].filter(Boolean).join(', ')],
      ['Eating habits', profile.diet], ['Religion', profile.religion], ['Caste', profile.community],
      ['Subcaste', profile.subCaste], ['Gothram', profile.gothram], ['Date of birth', profile.dateOfBirth],
    ] },
    { title: 'Family information', rows: [
      ['Family status', profile.family.affluenceLevel], ['Father', profile.family.fatherOccupation],
      ['Mother', profile.family.motherOccupation], ['Siblings', profile.family.siblings],
      ['Sisters', profile.family.sisters], ['Brothers', profile.family.brothers],
      ['Ancestral origin', profile.family.ancestralOrigin], ['Native place', profile.family.nativePlace],
    ] },
    { title: 'Horoscope', rows: [
      ['Star / Nakshatra', profile.horoscope.nakshatra], ['Raasi', profile.horoscope.rasi],
      ['Manglik', profile.horoscope.manglik], ['Birth time', profile.horoscope.birthTime], ['Birth place', profile.horoscope.birthPlace],
    ] },
    { title: 'Contact information', rows: [['Mobile number', profile.mobile || 'Private — connect through an accepted interest and chat']] },
  ];
  return <div className="space-y-5">{groups.map(group => <section key={group.title} className="rounded-2xl border border-zinc-200 p-4 sm:p-5">
    <h3 className="mb-4 font-serif text-lg font-bold">{group.title}</h3>
    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">{group.rows.map(([label, value]) => <div key={label}>
      <dt className="text-xs text-zinc-500">{label}</dt><dd className="mt-1 text-sm font-medium break-words">{value || 'Not specified'}</dd>
    </div>)}</dl>
    {group.title === 'Horoscope' && profile.horoscope.horoscopeUrl && /^https?:\/\//.test(profile.horoscope.horoscopeUrl) && <a href={profile.horoscope.horoscopeUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-sm text-red-700 underline">View horoscope document</a>}
  </section>)}</div>;
}
