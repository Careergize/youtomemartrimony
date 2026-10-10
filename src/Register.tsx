import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ArrowLeft, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { authenticate } from './api';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    password: '',
    lastName: '',
    gender: 'Bride',
    religion: 'Hindu',
    age: 24,
    city: 'Kochi'
  });
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authenticate('register', formData);
      setIsSuccess(true);
      navigate('/');
    } catch (err) { setError(err instanceof Error ? err.message : 'Unable to register.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#F8FAF8] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      
      {/* Back Link */}
      <div className="max-w-3xl mx-auto w-full mb-6">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#059669] transition-colors p-2 rounded-lg hover:bg-emerald-50"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to YOU2ME Matrimony Home</span>
        </Link>
      </div>

      <div className="max-w-3xl mx-auto w-full bg-white rounded-3xl shadow-xl border border-emerald-100 overflow-hidden text-left">
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-[#064E3B] via-[#047857] to-[#065F46] p-6 sm:p-8 text-white relative">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#059669] to-[#047857] flex items-center justify-center shadow-md">
              <Heart className="w-5 h-5 text-white stroke-[2.5] fill-none" />
            </div>
            <div className="flex flex-col text-left leading-none">
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                YOU2ME
              </span>
              <span className="text-[10px] font-extrabold tracking-[0.22em] uppercase text-emerald-300 mt-1">
                MATRIMONY
              </span>
            </div>
          </div>

          <h1 className="font-serif text-2xl sm:text-3xl font-bold mt-4">
            Begin Your Story Today
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 mt-1 max-w-xl">
            Join India's most trusted matrimonial community. Free confidential registration takes under 2 minutes.
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8">
          {isSuccess ? (
            <div className="py-12 text-center space-y-3">
              <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto animate-bounce" />
              <h2 className="font-serif text-2xl font-bold text-slate-900">
                Welcome to YOU2ME Matrimony!
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                Your profile has been created. Directing you to your personalized match discovery feed...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} onInvalidCapture={(event) => {
              const field = event.target as HTMLInputElement;
              setError(field.type === 'email'
                ? 'Enter a valid email address, for example name@example.com.'
                : field.type === 'password'
                  ? 'Enter a password with at least 8 characters.'
                  : field.validationMessage);
            }} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="text-xs font-bold text-slate-700">Email
                  <input type="email" required autoComplete="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="mt-1 w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl" />
                </label>
                <label className="text-xs font-bold text-slate-700">Password
                  <input type="password" required minLength={8} autoComplete="new-password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} className="mt-1 w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl" />
                </label>
              </div>
              {loading && <p role="status" className="text-sm text-slate-600">Creating your account...</p>}
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="Enter first name"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="Enter last name"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Looking for a</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                  >
                    <option value="Bride">Bride</option>
                    <option value="Groom">Groom</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Religion / Community</label>
                  <select
                    value={formData.religion}
                    onChange={(e) => setFormData({ ...formData, religion: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                  >
                    <option value="Hindu">Hindu</option>
                    <option value="Christian">Christian</option>
                    <option value="Muslim">Muslim</option>
                    <option value="Sikh">Sikh</option>
                    <option value="Jain">Jain</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Age</label>
                  <input
                    type="number"
                    min="18"
                    max="65"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">City / Region</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. Kochi, Bengaluru..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="p-3 bg-[#F8FAF8] border border-emerald-100 rounded-xl text-xs text-slate-600 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  All submitted data is strictly protected under YOU2ME's Privacy Guarantee.
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-[#059669] hover:bg-[#047857] text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-900/15 transition-all cursor-pointer"
              >
                {loading ? 'Creating your profile...' : 'Create My Profile & Explore Matches'}
              </button>
              {error && <p role="alert" className="text-sm text-red-700">{error}</p>}

            </form>
          )}

          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Already registered on YOU2ME?</span>
            <Link to="/login" className="font-bold text-[#059669] hover:underline">
              Log in to your account →
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Register;
