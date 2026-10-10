import React, { useState } from 'react';
import { 
  X, 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  User, 
  Briefcase, 
  Home, 
  Heart, 
  Camera,
  CheckCircle2
} from 'lucide-react';
import type { MatrimonialProfile } from '../data/mockProfiles';

interface OnboardingWizardProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: MatrimonialProfile;
  onSaveProfile: (updated: MatrimonialProfile) => Promise<void>;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSaveProfile
}) => {
  const [step, setStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: currentUser.name,
    gender: currentUser.gender,
    age: currentUser.age,
    height: currentUser.height,
    city: currentUser.city,
    state: currentUser.state,
    religion: currentUser.religion,
    community: currentUser.community,
    motherTongue: currentUser.motherTongue,
    diet: currentUser.diet,
    // Step 2
    degree: currentUser.education.degree,
    college: currentUser.education.college,
    field: currentUser.education.field,
    occupationTitle: currentUser.occupation.title,
    companySector: currentUser.occupation.companySector,
    employer: currentUser.occupation.employer,
    annualIncome: currentUser.occupation.annualIncome,
    // Step 3
    familyType: currentUser.family.type,
    fatherOccupation: currentUser.family.fatherOccupation,
    motherOccupation: currentUser.family.motherOccupation,
    siblings: currentUser.family.siblings,
    familyValues: currentUser.family.values,
    nakshatra: currentUser.horoscope.nakshatra,
    rasi: currentUser.horoscope.rasi,
    // Step 4
    bio: currentUser.bio,
    photoUrl: currentUser.photos[0] || ''
  });

  if (!isOpen) return null;

  const handleNext = async () => {
    if (saving) return;
    if (step < 4) {
      setStep(step + 1);
    } else {
      // Save
      const updatedUser: MatrimonialProfile = {
        ...currentUser,
        name: formData.name,
        gender: formData.gender,
        age: Number(formData.age),
        height: formData.height,
        city: formData.city,
        state: formData.state,
        religion: formData.religion as any,
        community: formData.community,
        motherTongue: formData.motherTongue as any,
        diet: formData.diet as any,
        bio: formData.bio,
        education: {
          degree: formData.degree,
          college: formData.college,
          field: formData.field
        },
        occupation: {
          ...currentUser.occupation,
          title: formData.occupationTitle,
          companySector: formData.companySector as any,
          employer: formData.employer,
          annualIncome: formData.annualIncome
        },
        family: {
          ...currentUser.family,
          type: formData.familyType as any,
          fatherOccupation: formData.fatherOccupation,
          motherOccupation: formData.motherOccupation,
          siblings: formData.siblings,
          values: formData.familyValues as any
        },
        horoscope: {
          ...currentUser.horoscope,
          nakshatra: formData.nakshatra,
          rasi: formData.rasi
        },
        photos: [formData.photoUrl, ...currentUser.photos.slice(1)].filter(Boolean)
      };

      setSaving(true); setError('');
      try {
        await onSaveProfile(updatedUser);
        setIsSuccess(true);
        onClose();
      } catch (err) { setError(err instanceof Error ? err.message : 'Unable to save profile.'); }
      finally { setSaving(false); }
    }
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const stepsList = [
    { num: 1, title: 'Identity', icon: User },
    { num: 2, title: 'Career', icon: Briefcase },
    { num: 3, title: 'Family & Star', icon: Home },
    { num: 4, title: 'Bio & Photo', icon: Heart },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-md flex justify-center items-center p-3 sm:p-6 animate-fadeIn">
      <div 
        className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden flex flex-col text-slate-800 animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        
        {error && <p role="alert" className="p-3 text-sm text-red-700">{error}</p>}
        {saving && <p role="status" className="p-3 text-sm">Saving profile...</p>}
        {/* Top Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-50/70 via-white to-teal-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#059669] text-white flex items-center justify-center font-bold shadow-md shadow-emerald-900/15">
              <User className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-[#064E3B]">
                Matrimonial Profile Setup
              </h2>
              <p className="text-xs text-slate-500">
                Step {step} of 4: {stepsList[step - 1].title} Details
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

        {/* Step Progress Bar */}
        <div className="px-6 pt-5 pb-3 border-b border-slate-100 bg-[#F8FAF8]">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-1 bg-slate-200 z-0" />
            <div 
              className="absolute top-1/2 left-0 -translate-y-1/2 h-1 bg-[#059669] transition-all duration-300 z-0"
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            />

            {stepsList.map((s) => {
              const Icon = s.icon;
              const isPassed = step > s.num;
              const isCurrent = step === s.num;

              return (
                <div key={s.num} className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isPassed
                        ? 'bg-emerald-600 text-white'
                        : isCurrent
                        ? 'bg-[#059669] text-white ring-4 ring-emerald-100 shadow-sm'
                        : 'bg-white border-2 border-slate-300 text-slate-400'
                    }`}
                  >
                    {isPassed ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <span className={`text-[11px] font-semibold mt-1 hidden sm:block ${isCurrent ? 'text-[#059669]' : 'text-slate-500'}`}>
                    {s.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8 overflow-y-auto max-h-[60vh] space-y-5 text-left">
          
          {isSuccess ? (
            <div className="py-12 text-center space-y-3">
              <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto animate-bounce" />
              <h3 className="font-serif text-2xl font-bold text-slate-900">Profile Updated Successfully!</h3>
              <p className="text-sm text-slate-600">
                Your credentials and preferences have been synchronized with the matchmaking algorithm.
              </p>
            </div>
          ) : (
            <>
              {/* STEP 1: Basic Details */}
              {step === 1 && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Full Legal Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Gender</label>
                      <select
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      >
                        <option value="Bride">Bride</option>
                        <option value="Groom">Groom</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Age</label>
                      <input
                        type="number"
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Height Description</label>
                      <input
                        type="text"
                        value={formData.height}
                        onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                        placeholder="e.g. 5' 5 (165 cm)"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Current City</label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Religion</label>
                      <select
                        value={formData.religion}
                        onChange={(e) => setFormData({ ...formData, religion: e.target.value as any })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      >
                        <option value="Hindu">Hindu</option>
                        <option value="Muslim">Muslim</option>
                        <option value="Christian">Christian</option>
                        <option value="Sikh">Sikh</option>
                        <option value="Jain">Jain</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Community / Caste</label>
                      <input
                        type="text"
                        value={formData.community}
                        onChange={(e) => setFormData({ ...formData, community: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Mother Tongue</label>
                      <select
                        value={formData.motherTongue}
                        onChange={(e) => setFormData({ ...formData, motherTongue: e.target.value as any })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      >
                        <option value="Malayalam">Malayalam</option>
                        <option value="Tamil">Tamil</option>
                        <option value="Hindi">Hindi</option>
                        <option value="Telugu">Telugu</option>
                        <option value="Kannada">Kannada</option>
                        <option value="Bengali">Bengali</option>
                        <option value="Marathi">Marathi</option>
                        <option value="English">English</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Education & Career */}
              {step === 2 && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Highest Degree</label>
                      <input
                        type="text"
                        value={formData.degree}
                        onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                        placeholder="e.g. Master of Design (M.Des)"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">College / Alma Mater</label>
                      <input
                        type="text"
                        value={formData.college}
                        onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                        placeholder="e.g. NID / IIT / IIM"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Job Designation</label>
                      <input
                        type="text"
                        value={formData.occupationTitle}
                        onChange={(e) => setFormData({ ...formData, occupationTitle: e.target.value })}
                        placeholder="e.g. Lead Product Designer"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Industry Sector</label>
                      <select
                        value={formData.companySector}
                        onChange={(e) => setFormData({ ...formData, companySector: e.target.value as any })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      >
                        <option value="Creative & Design">Creative & Design</option>
                        <option value="Technology">Technology</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Finance">Finance</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Civil Services">Civil Services</option>
                        <option value="Business & Entrepreneurship">Business & Entrepreneurship</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Current Employer</label>
                      <input
                        type="text"
                        value={formData.employer}
                        onChange={(e) => setFormData({ ...formData, employer: e.target.value })}
                        placeholder="e.g. Tech Unicorn, Indiranagar"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Annual Compensation</label>
                      <input
                        type="text"
                        value={formData.annualIncome}
                        onChange={(e) => setFormData({ ...formData, annualIncome: e.target.value })}
                        placeholder="e.g. ₹28 - 32 Lakhs"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Family & Horoscope */}
              {step === 3 && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Family Type</label>
                      <select
                        value={formData.familyType}
                        onChange={(e) => setFormData({ ...formData, familyType: e.target.value as any })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      >
                        <option value="Nuclear">Nuclear</option>
                        <option value="Joint">Joint</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Family Values</label>
                      <select
                        value={formData.familyValues}
                        onChange={(e) => setFormData({ ...formData, familyValues: e.target.value as any })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      >
                        <option value="Liberal & Cultured">Liberal & Cultured</option>
                        <option value="Moderate & Traditional">Moderate & Traditional</option>
                        <option value="Progressive">Progressive</option>
                        <option value="Orthodox">Orthodox</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Father's Occupation</label>
                      <input
                        type="text"
                        value={formData.fatherOccupation}
                        onChange={(e) => setFormData({ ...formData, fatherOccupation: e.target.value })}
                        placeholder="e.g. Retired Chief Engineer, CPWD"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Mother's Occupation</label>
                      <input
                        type="text"
                        value={formData.motherOccupation}
                        onChange={(e) => setFormData({ ...formData, motherOccupation: e.target.value })}
                        placeholder="e.g. Professor of Literature"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Nakshatra (Birth Star)</label>
                      <input
                        type="text"
                        value={formData.nakshatra}
                        onChange={(e) => setFormData({ ...formData, nakshatra: e.target.value })}
                        placeholder="e.g. Rohini"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Rasi (Moon Sign)</label>
                      <input
                        type="text"
                        value={formData.rasi}
                        onChange={(e) => setFormData({ ...formData, rasi: e.target.value })}
                        placeholder="e.g. Vrishabha (Taurus)"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Bio & Photo */}
              {step === 4 && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex items-center gap-4 p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl">
                    <img
                      src={formData.photoUrl}
                      alt="Avatar Preview"
                      className="w-20 h-20 rounded-2xl object-cover ring-2 ring-[#059669] shadow-sm"
                    />
                    <div className="flex-1 space-y-1">
                      <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Camera className="w-4 h-4 text-[#059669]" />
                        <span>Profile Portrait Image URL</span>
                      </label>
                      <input
                        type="text"
                        value={formData.photoUrl}
                        onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs"
                      />
                      <span className="text-[10px] text-slate-500">
                        Paste any high-resolution portrait URL for instant preview
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Personal Narrative & Outlook on Marriage
                    </label>
                    <textarea
                      rows={4}
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      placeholder="Share a thoughtful introduction about your passions, values, and ideal partnership..."
                      className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      Authentic bios receive 4.2x higher mutual interest acceptance.
                    </span>
                  </div>
                </div>
              )}
            </>
          )}

        </div>

        {/* Wizard Footer Controls */}
        {!isSuccess && (
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50">
            <button
              type="button"
              onClick={handlePrev}
              disabled={step === 1}
              className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                step === 1 ? 'opacity-40 cursor-not-allowed text-slate-400' : 'text-slate-700 hover:bg-slate-200/70'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold shadow-md shadow-emerald-900/15 transition-all cursor-pointer"
            >
              <span>{step === 4 ? 'Save & Sync Profile' : 'Next Step'}</span>
              {step !== 4 && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
