import React, { useState } from 'react';
import { X, User, MapPin, Globe, Check, LogOut, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DANISH_KOMMUNER, SUPPORTED_LANGUAGES } from '../data/danishMunicipalities';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { profile, updateUserProfile, logout } = useAuth();

  const [displayName, setDisplayName] = useState(profile?.displayName || '');
  const [kommune, setKommune] = useState(profile?.kommune || 'København');
  const [language, setLanguage] = useState(profile?.preferredLanguage || 'en');
  const [bio, setBio] = useState(profile?.bio || '');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  if (!isOpen || !profile) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateUserProfile({
        displayName,
        kommune,
        preferredLanguage: language,
        bio
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1f2f2b]/40 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-[#f8faf9] rounded-2xl border border-[#d3ded9] shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#eaf2ee] border-b border-[#dce6e1] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#44655c] text-white flex items-center justify-center font-bold text-sm">
              {displayName.charAt(0).toUpperCase() || 'P'}
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1f312c]">Parent Profile Settings</h2>
              <p className="text-xs text-[#526a63]">{profile.email}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-[#5e7771] hover:text-[#233530] hover:bg-[#dce6e1] rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-4">
          {savedSuccess && (
            <div className="p-3 text-xs text-[#285042] bg-[#e6f3ec] border border-[#c4e3d3] rounded-xl flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Your profile and preferences have been updated!</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#293e38] mb-1">
              Display Name
            </label>
            <input
              type="text"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-[#d2ded8] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#52776c]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Kommune Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-[#293e38] mb-1">
                Your Danish Kommune
              </label>
              <select
                value={kommune}
                onChange={(e) => setKommune(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-[#d2ded8] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#52776c]"
              >
                {DANISH_KOMMUNER.map(k => (
                  <option key={k.name} value={k.name}>
                    {k.name} ({k.region})
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-[#637d76] mt-0.5">Used to filter local meetups & PPR advice.</p>
            </div>

            {/* Preferred Language */}
            <div>
              <label className="block text-xs font-semibold text-[#293e38] mb-1">
                Preferred Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-[#d2ded8] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#52776c]"
              >
                {SUPPORTED_LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name} ({lang.native})
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-[#637d76] mt-0.5">Forum posts will offer 1-click translation into this language.</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#293e38] mb-1">
              About Your Family (Optional)
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="e.g. Immigrant parent of two, 5-year-old son recently diagnosed with autism in Gladsaxe. Looking for sensory-friendly activities and PPR support."
              className="w-full px-3 py-2 text-sm bg-white border border-[#d2ded8] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#52776c] resize-none"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-3 border-t border-[#dce5e0] flex items-center justify-between">
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#7d3f3f] hover:bg-[#faeded] rounded-lg transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-[#3f6158] hover:bg-[#324f47] text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
            >
              {saving ? 'Saving...' : 'Save Preferences'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
