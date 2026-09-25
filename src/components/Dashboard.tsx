import React from 'react';
import { 
  Heart, 
  MapPin, 
  MessageSquare, 
  Map as MapIcon, 
  BookOpen, 
  Globe, 
  ShieldCheck, 
  Sun, 
  ArrowRight, 
  Sparkles, 
  Calendar,
  Users,
  Compass,
  FileText
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SEED_POSTS, SEED_EVENTS } from '../data/seedData';
import { SUPPORTED_LANGUAGES } from '../data/danishMunicipalities';

interface DashboardProps {
  onSelectTab: (tab: 'dashboard' | 'forum' | 'map' | 'glossary') => void;
  onOpenAuth: () => void;
  onOpenProfile: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onSelectTab,
  onOpenAuth,
  onOpenProfile
}) => {
  const { profile } = useAuth();

  const currentLang = SUPPORTED_LANGUAGES.find(l => l.code === profile?.preferredLanguage) || SUPPORTED_LANGUAGES[0];
  const userKommune = profile?.kommune || 'København';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Hero Welcome Banner */}
      <div className="bg-gradient-to-br from-[#e4eee8] via-[#ebf3ee] to-[#f4f7f5] rounded-3xl p-6 sm:p-10 border border-[#d3ded8] shadow-xs relative overflow-hidden">
        
        {/* Decorative subtle background sunflower */}
        <div className="absolute -right-8 -bottom-10 opacity-15 pointer-events-none select-none text-9xl">
          🌻
        </div>

        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#d5e4dc] rounded-full text-xs font-semibold text-[#29463e] mb-4">
            <span className="text-base">🌻</span>
            <span>NeuroConnect DK • For immigrant parents of children with autism in Denmark</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#192f28] tracking-tight leading-tight">
            {profile ? `Velkommen, ${profile.displayName}!` : 'You Are Not Alone in Navigating Denmark.'}
          </h1>

          <p className="text-sm sm:text-base text-[#465f57] mt-3 leading-relaxed">
            Raising a neurodivergent child or a child with autism is a journey that shouldn&apos;t be complicated 
            by language barriers and confusing municipal bureaucracy. Connect with other immigrant parents, 
            find quiet sensory-safe spaces, and understand your rights in your local Kommune.
          </p>

          {/* User Status Bar if logged in */}
          {profile ? (
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 px-3.5 py-1.5 bg-white/90 rounded-xl border border-[#d6e3dc] text-xs font-medium text-[#2d463f] shadow-2xs">
                <MapPin className="w-3.5 h-3.5 text-[#51756b]" />
                <span>Local Kommune: <strong>{userKommune}</strong></span>
              </div>
              <div className="flex items-center gap-2 px-3.5 py-1.5 bg-white/90 rounded-xl border border-[#d6e3dc] text-xs font-medium text-[#2d463f] shadow-2xs">
                <Globe className="w-3.5 h-3.5 text-[#51756b]" />
                <span>Language: <strong>{currentLang.flag} {currentLang.name}</strong></span>
              </div>
              <button
                onClick={onOpenProfile}
                className="text-xs font-semibold text-[#3b5b52] hover:underline ml-1"
              >
                Change Preferences
              </button>
            </div>
          ) : (
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#3c5e55] hover:bg-[#2f4b43] text-white font-semibold text-sm rounded-xl shadow-xs transition-transform transform hover:-translate-y-0.5"
              >
                <span>Join Community (Free)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onSelectTab('glossary')}
                className="flex items-center gap-2 px-4 py-2.5 bg-white/80 hover:bg-white text-[#38554d] border border-[#d4e1db] font-semibold text-sm rounded-xl transition-colors"
              >
                <BookOpen className="w-4 h-4 text-[#547a6f]" />
                <span>Browse Danish Glossary</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Solsikkesnoren (Sunflower Lanyard) Feature Callout */}
      <div className="bg-[#fcf8e3] border border-[#ecd98d] rounded-3xl p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#f5e9ad] text-[#6d510e] flex items-center justify-center shrink-0 text-2xl shadow-2xs">
              🌻
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-base font-bold text-[#453308]">
                  Solsikkesnoren (Sunflower Lanyard) in Denmark
                </h3>
                <span className="text-[11px] font-bold bg-[#faea9e] text-[#674b05] px-2 py-0.5 rounded-full">
                  Free in Denmark
                </span>
              </div>
              <p className="text-xs text-[#5c4714] leading-relaxed max-w-2xl">
                The green sunflower lanyard signals an invisible disability (autism, sensory processing, ADHD). 
                In Denmark, it is recognized at Copenhagen Airport (CPH), DSB trains, supermarkets (Føtex, Netto), 
                and Tivoli. You can pick one up for <strong>free</strong> at any major train station ticket office or local library with no medical proof required.
              </p>
            </div>
          </div>

          <button
            onClick={() => onSelectTab('map')}
            className="shrink-0 px-4 py-2 bg-[#70520b] hover:bg-[#573f08] text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
          >
            Find Sunflower Venues on Map
          </button>
        </div>
      </div>

      {/* Three Pillars for Immigrant Families */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-[#d6e2dc] shadow-xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-[#e3ede8] text-[#2c4b42] flex items-center justify-center">
            <Globe className="w-5 h-5 text-[#40675c]" />
          </div>
          <h3 className="text-sm font-bold text-[#1f312c]">1. Right to an Interpreter (Tolk)</h3>
          <p className="text-xs text-[#526b64] leading-relaxed">
            Under Danish law (Forvaltningsloven § 7), the municipality must provide and pay for an authorized translator if you do not communicate fluently in Danish regarding your child&apos;s case.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#d6e2dc] shadow-xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-[#e3ede8] text-[#2c4b42] flex items-center justify-center">
            <Users className="w-5 h-5 text-[#40675c]" />
          </div>
          <h3 className="text-sm font-bold text-[#1f312c]">2. Right to a Bisidder (Support Person)</h3>
          <p className="text-xs text-[#526b64] leading-relaxed">
            You are always legally permitted to bring a friend, family member, or trained volunteer advocate to any meeting with PPR, school, or municipal case workers.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#d6e2dc] shadow-xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-[#e3ede8] text-[#2c4b42] flex items-center justify-center">
            <FileText className="w-5 h-5 text-[#40675c]" />
          </div>
          <h3 className="text-sm font-bold text-[#1f312c]">3. Extra Costs Support (Merudgifter)</h3>
          <p className="text-xs text-[#526b64] leading-relaxed">
            Barnets Lov § 86 allows families to receive monthly reimbursement for extra disability expenses such as specialized clothing, sensory items, therapy travel, and broken household goods.
          </p>
        </div>
      </div>

      {/* Side-by-side Previews: Community Discussions & Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Community Discussions Preview */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#496d63]" />
              <h2 className="text-base font-bold text-[#1e312b]">Recent Community Discussions</h2>
            </div>
            <button
              onClick={() => onSelectTab('forum')}
              className="text-xs font-semibold text-[#3b5b52] hover:underline flex items-center gap-1"
            >
              <span>View All Discussions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {SEED_POSTS.slice(0, 3).map(post => (
              <div
                key={post.id}
                onClick={() => onSelectTab('forum')}
                className="bg-white p-4 sm:p-5 rounded-2xl border border-[#d7e3dd] hover:border-[#adc4bb] transition-all cursor-pointer shadow-xs group"
              >
                <div className="flex items-center justify-between text-xs text-[#637d76] mb-1.5">
                  <span className="font-semibold text-[#29423b] flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#587e73]" />
                    {post.authorKommune}
                  </span>
                  <span>{new Date(post.createdAt).toLocaleDateString('da-DK', { month: 'short', day: 'numeric' })}</span>
                </div>

                <h3 className="text-sm font-bold text-[#1b2f29] group-hover:text-[#2d4e44] transition-colors leading-snug mb-1">
                  {post.title}
                </h3>
                <p className="text-xs text-[#48635b] line-clamp-2 leading-relaxed mb-3">
                  {post.content}
                </p>

                <div className="flex items-center justify-between text-[11px] text-[#6b857f] pt-2 border-t border-[#eaf0ec]">
                  <span className="bg-[#edf4f0] px-2 py-0.5 rounded-md font-medium text-[#38534c]">
                    {post.category.replace('_', ' ').toUpperCase()}
                  </span>
                  <span>{post.commentsCount} replies • {post.likesCount} helpful</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Upcoming Sensory Events Preview */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#496d63]" />
              <h2 className="text-base font-bold text-[#1e312b]">Sensory-Friendly Meetups</h2>
            </div>
            <button
              onClick={() => onSelectTab('map')}
              className="text-xs font-semibold text-[#3b5b52] hover:underline flex items-center gap-1"
            >
              <span>Explore Interactive Map</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {SEED_EVENTS.slice(0, 3).map(evt => (
              <div
                key={evt.id}
                onClick={() => onSelectTab('map')}
                className="bg-white p-4 rounded-2xl border border-[#d7e3dd] hover:border-[#adc4bb] transition-all cursor-pointer shadow-xs group"
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <h3 className="text-xs font-bold text-[#1d312b] group-hover:text-[#2a4a40] line-clamp-1">
                    {evt.title}
                  </h3>
                  {evt.isSunflowerLanyardFriendly && (
                    <span className="text-sm shrink-0">🌻</span>
                  )}
                </div>

                <p className="text-xs text-[#506861] flex items-center gap-1 mb-2">
                  <MapPin className="w-3 h-3 text-[#587e73] shrink-0" />
                  <span className="truncate">{evt.address} ({evt.kommune})</span>
                </p>

                <div className="bg-[#f2f7f4] rounded-lg p-2 text-[11px] text-[#334e46] leading-tight">
                  👂 {evt.sensoryNotes}
                </div>

                <div className="mt-2 text-[11px] font-semibold text-[#38554d] flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{evt.dateTime}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Danish Glossary Helper Card */}
          <div className="bg-[#e9f2ee] border border-[#d2ded8] rounded-2xl p-4 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-[#233f37]">
              <BookOpen className="w-4 h-4 text-[#446b60]" />
              <span>Need help with a Danish letter?</span>
            </div>
            <p className="text-[#49655d] leading-relaxed">
              Look up terms like <em>PPR, VISO, Bisidder, Specialklasse</em> in our Knowledge Hub with clear explanations and copyable Danish sentences.
            </p>
            <button
              onClick={() => onSelectTab('glossary')}
              className="text-xs font-bold text-[#294c42] hover:underline"
            >
              Open Danish System Glossary →
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
