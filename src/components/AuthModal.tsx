import React, { useState } from 'react';
import { X, Sparkles, Mail, Lock, User, Globe, MapPin, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DANISH_KOMMUNER, SUPPORTED_LANGUAGES } from '../data/danishMunicipalities';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, loginAsGuestDemo } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signup');
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [kommune, setKommune] = useState('København');
  const [language, setLanguage] = useState('en');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      await signInWithGoogle();
      onClose();
      onSuccess?.();
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setErrorMsg('Google sign in could not be completed. You can also sign up with email below or try Guest mode.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (!name.trim()) {
          throw new Error('Please enter your name');
        }
        await signUpWithEmail(email, password, name, kommune, language);
      } else {
        await signInWithEmail(email, password);
      }
      onClose();
      onSuccess?.();
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setErrorMsg('An account with this email already exists. Try signing in instead.');
      } else if (err.code === 'auth/weak-password') {
        setErrorMsg('Password should be at least 6 characters.');
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        setErrorMsg('Invalid email or password.');
      } else {
        setErrorMsg(err.message || 'Authentication error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignIn = async () => {
    setLoading(true);
    await loginAsGuestDemo(kommune, language);
    setLoading(false);
    onClose();
    onSuccess?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1f2f2b]/40 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-[#f8faf9] rounded-2xl border border-[#d3ded9] shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 pt-6 pb-4 bg-gradient-to-b from-[#eaf2ee] to-[#f8faf9] border-b border-[#dce6e1] relative">
          <button 
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 text-[#5e7771] hover:text-[#233530] hover:bg-[#dce6e1] rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🌻</span>
            <span className="text-xs font-semibold tracking-wider uppercase text-[#476a60] bg-[#dbe8e2] px-2.5 py-0.5 rounded-full">
              NeuroConnect DK
            </span>
          </div>

          <h2 className="text-xl font-bold text-[#1f312c]">
            {mode === 'signup' ? 'Join Our Parent Community' : 'Welcome Back'}
          </h2>
          <p className="text-xs text-[#526a63] mt-1">
            Free, safe, and sensory-friendly support for immigrant families of children with special needs and autism in Denmark.
          </p>

          {/* Mode Switch Tabs */}
          <div className="flex gap-2 mt-4 p-1 bg-[#dbe7e1] rounded-xl">
            <button
              type="button"
              onClick={() => { setMode('signup'); setErrorMsg(null); }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                mode === 'signup' 
                  ? 'bg-white text-[#213831] shadow-xs' 
                  : 'text-[#48635b] hover:text-[#1e302a]'
              }`}
            >
              Sign Up (Free)
            </button>
            <button
              type="button"
              onClick={() => { setMode('signin'); setErrorMsg(null); }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                mode === 'signin' 
                  ? 'bg-white text-[#213831] shadow-xs' 
                  : 'text-[#48635b] hover:text-[#1e302a]'
              }`}
            >
              Sign In
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 text-xs text-[#703b3b] bg-[#fbeded] border border-[#ebd0d0] rounded-xl">
              {errorMsg}
            </div>
          )}

          {/* Google Sign-in */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-white hover:bg-[#edf3f0] border border-[#d1ded8] rounded-xl text-sm font-semibold text-[#273d36] transition-colors shadow-xs"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.87c2.27-2.09 3.675-5.17 3.675-9.15z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3.05c-1.08.72-2.45 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.96H1.28v3.15C3.26 21.36 7.34 24 12 24z"/>
              <path fill="#FBBC05" d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.28C.46 8.23 0 10.06 0 12s.46 3.77 1.28 5.39l3.99-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.28 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.73-4.96z"/>
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-[#d8e3de]" />
            <span className="text-[11px] text-[#637d76] uppercase tracking-wider font-medium">Or with email</span>
            <div className="flex-1 h-px bg-[#d8e3de]" />
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleEmailAuth} className="space-y-3">
            {mode === 'signup' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-[#293e38] mb-1">
                    Your Name / Nickname
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-3 text-[#648078]" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Leila or Ahmed"
                      className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-[#d2ded8] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#52776c]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Danish Kommune Selection */}
                  <div>
                    <label className="block text-xs font-semibold text-[#293e38] mb-1">
                      Your Danish Kommune
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 absolute left-3 top-3 text-[#648078]" />
                      <select
                        value={kommune}
                        onChange={(e) => setKommune(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-[#d2ded8] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#52776c]"
                      >
                        {DANISH_KOMMUNER.map(k => (
                          <option key={k.name} value={k.name}>
                            {k.name} ({k.region})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Preferred Language */}
                  <div>
                    <label className="block text-xs font-semibold text-[#293e38] mb-1">
                      Preferred Language
                    </label>
                    <div className="relative">
                      <Globe className="w-4 h-4 absolute left-3 top-3 text-[#648078]" />
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-[#d2ded8] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#52776c]"
                      >
                        {SUPPORTED_LANGUAGES.map(lang => (
                          <option key={lang.code} value={lang.code}>
                            {lang.flag} {lang.name} ({lang.native})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#293e38] mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-[#648078]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="parent@example.com"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-[#d2ded8] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#52776c]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#293e38] mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-[#648078]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-[#d2ded8] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#52776c]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-[#3d5e55] hover:bg-[#314c44] text-white font-semibold text-sm rounded-xl transition-colors shadow-xs mt-2"
            >
              {loading 
                ? 'Processing...' 
                : mode === 'signup' 
                  ? 'Complete Free Sign-Up' 
                  : 'Sign In to Your Account'}
            </button>
          </form>

          {/* Quick Demo Guest Button */}
          <div className="pt-2 border-t border-[#dce5e0] flex items-center justify-between">
            <span className="text-xs text-[#546e67]">Just exploring?</span>
            <button
              type="button"
              onClick={handleDemoSignIn}
              disabled={loading}
              className="text-xs font-semibold text-[#3b5951] hover:text-[#223933] flex items-center gap-1 hover:underline"
            >
              <span>Instant Guest Mode</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
