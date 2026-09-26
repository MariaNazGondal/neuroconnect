import React, { useState } from 'react';
import { 
  Heart, 
  MapPin, 
  MessageSquare, 
  Map as MapIcon, 
  BookOpen, 
  User as UserIcon, 
  Eye, 
  EyeOff, 
  Menu, 
  X, 
  Sparkles,
  Globe,
  Sun,
  FileText,
  Package,
  Building2,
  Scale
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SUPPORTED_LANGUAGES } from '../data/danishMunicipalities';

interface NavbarProps {
  currentTab: 'dashboard' | 'forum' | 'map' | 'glossary' | 'decoder' | 'exchange' | 'hub' | 'rights';
  onSelectTab: (tab: 'dashboard' | 'forum' | 'map' | 'glossary' | 'decoder' | 'exchange' | 'hub' | 'rights') => void;
  onOpenAuth: () => void;
  onOpenProfile: () => void;
  onOpenTour?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenAuth,
  onOpenProfile,
  onOpenTour,
}) => {
  const { profile, lowSensoryMode, toggleLowSensoryMode } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const currentLang = SUPPORTED_LANGUAGES.find(l => l.code === profile?.preferredLanguage) || SUPPORTED_LANGUAGES[0];

  return (
    <header className="sticky top-0 z-40 bg-[#f4f7f5]/95 backdrop-blur-md border-b border-[#d8e3de] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => { onSelectTab('dashboard'); setMobileMenuOpen(false); }}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#3f6158] text-white flex items-center justify-center shadow-xs group-hover:bg-[#324f47] transition-colors">
              <span className="text-xl">🌻</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg tracking-tight text-[#1a2d27]">AutismDK</span>
                <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-md bg-[#dce7e2] text-[#335048]">Sol 🌻</span>
              </div>
              <p className="text-[11px] text-[#5c726c] hidden sm:block">Special Needs Parent Community in Denmark</p>
            </div>
          </div>

          {/* Navigation Links - Desktop */}
          <nav className="hidden xl:flex items-center gap-1 bg-[#eaf0ed] p-1.5 rounded-xl border border-[#d6e2dc]">
            <button
              onClick={() => onSelectTab('dashboard')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                currentTab === 'dashboard'
                  ? 'bg-white text-[#203932] shadow-xs'
                  : 'text-[#4e645e] hover:text-[#1c2e29] hover:bg-white/50'
              }`}
            >
              <Heart className="w-3.5 h-3.5 text-[#52776c]" />
              <span>Home</span>
            </button>

            <button
              onClick={() => onSelectTab('hub')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                currentTab === 'hub'
                  ? 'bg-white text-[#203932] shadow-xs'
                  : 'text-[#4e645e] hover:text-[#1c2e29] hover:bg-white/50'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-[#52776c]" />
              <span>Kommune Hubs</span>
            </button>

            <button
              onClick={() => onSelectTab('rights')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                currentTab === 'rights'
                  ? 'bg-white text-[#203932] shadow-xs'
                  : 'text-[#4e645e] hover:text-[#1c2e29] hover:bg-white/50'
              }`}
            >
              <Scale className="w-3.5 h-3.5 text-[#52776c]" />
              <span>Rights AI</span>
            </button>

            <button
              onClick={() => onSelectTab('forum')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                currentTab === 'forum'
                  ? 'bg-white text-[#203932] shadow-xs'
                  : 'text-[#4e645e] hover:text-[#1c2e29] hover:bg-white/50'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#52776c]" />
              <span>Channels</span>
            </button>

            <button
              onClick={() => onSelectTab('decoder')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                currentTab === 'decoder'
                  ? 'bg-white text-[#203932] shadow-xs'
                  : 'text-[#4e645e] hover:text-[#1c2e29] hover:bg-white/50'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-[#52776c]" />
              <span>Decoder</span>
            </button>

            <button
              onClick={() => onSelectTab('exchange')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                currentTab === 'exchange'
                  ? 'bg-white text-[#203932] shadow-xs'
                  : 'text-[#4e645e] hover:text-[#1c2e29] hover:bg-white/50'
              }`}
            >
              <Package className="w-3.5 h-3.5 text-[#52776c]" />
              <span>Exchange</span>
            </button>

            <button
              onClick={() => onSelectTab('map')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                currentTab === 'map'
                  ? 'bg-white text-[#203932] shadow-xs'
                  : 'text-[#4e645e] hover:text-[#1c2e29] hover:bg-white/50'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5 text-[#52776c]" />
              <span>Events Map</span>
            </button>

            <button
              onClick={() => onSelectTab('glossary')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                currentTab === 'glossary'
                  ? 'bg-white text-[#203932] shadow-xs'
                  : 'text-[#4e645e] hover:text-[#1c2e29] hover:bg-white/50'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-[#52776c]" />
              <span>Glossary</span>
            </button>
          </nav>

          {/* Sensory Mode Toggle & User Profile Controls */}
          <div className="flex items-center gap-2">
            
            {/* Guided Tour Launcher */}
            {onOpenTour && (
              <button
                onClick={onOpenTour}
                title="Open AutismDK guided feature tour"
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors border bg-[#e8f1ec] text-[#244238] border-[#cddcd4] hover:bg-[#d9e7e0] cursor-pointer"
              >
                <span>🌻</span>
                <span className="hidden sm:inline">Tour</span>
              </button>
            )}

            {/* Sensory Mode Button */}
            <button
              onClick={toggleLowSensoryMode}
              title={lowSensoryMode ? "Low sensory mode is ON (gentle contrast & muted motion)" : "Turn on Low Sensory Mode"}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors border ${
                lowSensoryMode 
                  ? 'bg-[#3e564f] text-white border-[#334741]' 
                  : 'bg-white text-[#4a635c] border-[#d8e3de] hover:bg-[#edf3f0]'
              }`}
            >
              {lowSensoryMode ? <EyeOff className="w-3.5 h-3.5 text-emerald-200" /> : <Eye className="w-3.5 h-3.5 text-[#5e7771]" />}
              <span className="hidden lg:inline">{lowSensoryMode ? 'Calm Mode ON' : 'Calm Mode'}</span>
            </button>

            {/* Profile or Sign in */}
            {profile ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenProfile}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 bg-white hover:bg-[#edf3f0] border border-[#d8e3de] rounded-xl text-xs text-[#2b413b] font-medium transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-[#dbe8e3] text-[#33534a] flex items-center justify-center font-bold text-[11px]">
                    {profile.displayName.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className="leading-tight text-xs font-semibold text-[#1e2f2a] truncate max-w-[100px]">{profile.displayName}</p>
                    <p className="text-[10px] text-[#637d76] flex items-center gap-0.5">
                      <MapPin className="w-2.5 h-2.5" />
                      {profile.kommune}
                    </p>
                  </div>
                  <span className="text-sm pl-1">{currentLang.flag}</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#426159] hover:bg-[#344d47] text-white text-xs font-medium rounded-xl shadow-xs transition-colors"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>Join Community (Free)</span>
              </button>
            )}

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#465f58] hover:text-[#1e302b] rounded-lg hover:bg-[#e4ede8]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#edf3f0] border-b border-[#d4dfd9] px-4 pt-2 pb-4 space-y-2">
          <button
            onClick={() => { onSelectTab('dashboard'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-left ${
              currentTab === 'dashboard' ? 'bg-white text-[#1f342e]' : 'text-[#48615a]'
            }`}
          >
            <Heart className="w-4 h-4 text-[#52776c]" />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => { onSelectTab('hub'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-left ${
              currentTab === 'hub' ? 'bg-white text-[#1f342e]' : 'text-[#48615a]'
            }`}
          >
            <Building2 className="w-4 h-4 text-[#52776c]" />
            <span>Kommune Hubs (Parents & Meetups)</span>
          </button>
          <button
            onClick={() => { onSelectTab('rights'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-left ${
              currentTab === 'rights' ? 'bg-white text-[#1f342e]' : 'text-[#48615a]'
            }`}
          >
            <Scale className="w-4 h-4 text-[#52776c]" />
            <span>Danish Rights AI Assistant</span>
          </button>
          <button
            onClick={() => { onSelectTab('forum'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-left ${
              currentTab === 'forum' ? 'bg-white text-[#1f342e]' : 'text-[#48615a]'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-[#52776c]" />
            <span>Community Channels (Forum)</span>
          </button>
          <button
            onClick={() => { onSelectTab('decoder'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-left ${
              currentTab === 'decoder' ? 'bg-white text-[#1f342e]' : 'text-[#48615a]'
            }`}
          >
            <FileText className="w-4 h-4 text-[#52776c]" />
            <span>Kommune Letter Decoder</span>
          </button>
          <button
            onClick={() => { onSelectTab('exchange'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-left ${
              currentTab === 'exchange' ? 'bg-white text-[#1f342e]' : 'text-[#48615a]'
            }`}
          >
            <Package className="w-4 h-4 text-[#52776c]" />
            <span>Sensory Resource Exchange</span>
          </button>
          <button
            onClick={() => { onSelectTab('map'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-left ${
              currentTab === 'map' ? 'bg-white text-[#1f342e]' : 'text-[#48615a]'
            }`}
          >
            <MapIcon className="w-4 h-4 text-[#52776c]" />
            <span>Interactive Events Map</span>
          </button>
          <button
            onClick={() => { onSelectTab('glossary'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-left ${
              currentTab === 'glossary' ? 'bg-white text-[#1f342e]' : 'text-[#48615a]'
            }`}
          >
            <BookOpen className="w-4 h-4 text-[#52776c]" />
            <span>Danish System Glossary</span>
          </button>

          {onOpenTour && (
            <button
              onClick={() => { onOpenTour(); setMobileMenuOpen(false); }}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm font-bold rounded-lg text-left bg-[#e4ede8] text-[#244238] border border-[#cddcd4]"
            >
              <span className="text-base">🌻</span>
              <span>AutismDK Guided Tour</span>
            </button>
          )}

          {profile && (
            <button
              onClick={() => { onOpenProfile(); setMobileMenuOpen(false); }}
              className="w-full flex items-center justify-between px-3 py-2 bg-white/70 rounded-lg text-sm text-[#2b413b] font-medium"
            >
              <span className="flex items-center gap-2">
                <UserIcon className="w-4 h-4 text-[#4f7066]" />
                Profile Settings ({profile.kommune})
              </span>
              <span>{currentLang.flag} {currentLang.name}</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};
