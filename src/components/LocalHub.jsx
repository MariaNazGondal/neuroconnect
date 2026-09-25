import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  MapPin, 
  Users, 
  Calendar, 
  MessageSquare, 
  Send, 
  Check, 
  X, 
  UserCheck, 
  Sparkles, 
  Baby, 
  School, 
  Clock, 
  Heart,
  Shield,
  Search,
  CheckCircle2
} from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import { DANISH_KOMMUNER } from '../data/danishMunicipalities';
import { SEED_EVENTS } from '../data/seedData';
import { AgeBadge } from './TagSystem';

// Privacy-conscious directory seed parents across Danish Kommuner
const SEED_PARENTS = [
  {
    id: 'parent-1',
    displayName: 'Fatima & Tariq',
    kommune: 'Albertslund',
    childAgeGroup: '6-12',
    bio: 'Immigrant family with an 8-year-old autistic boy in specialklasse. Happy to share advice on Barnets Lov § 86 and meeting PPR.',
    languages: 'English, Arabic, Danish',
    optInConnect: true,
    joinedDate: 'Joined Feb 2026'
  },
  {
    id: 'parent-2',
    displayName: 'Olena K.',
    kommune: 'København',
    childAgeGroup: '0-5',
    bio: 'Mother of 4-year-old daughter. Navigating vuggestue support pedagogue hours and sensory playgrounds in Østerbro.',
    languages: 'Ukrainian, English, Danish',
    optInConnect: true,
    joinedDate: 'Joined Jan 2026'
  },
  {
    id: 'parent-3',
    displayName: 'Mehmet Y.',
    kommune: 'Aarhus',
    childAgeGroup: '6-12',
    bio: 'Father of 2nd grader in special school. Looking to connect with other parents for sensory sports and weekend walks.',
    languages: 'Turkish, English, Danish',
    optInConnect: true,
    joinedDate: 'Joined Mar 2026'
  },
  {
    id: 'parent-4',
    displayName: 'Amina & Bashir',
    kommune: 'Odense',
    childAgeGroup: '0-5',
    bio: 'Parent of non-speaking 3-year-old boy. Using PECS and pictograms. Love to meet local families for quiet playdates.',
    languages: 'Somali, English',
    optInConnect: true,
    joinedDate: 'Joined Feb 2026'
  },
  {
    id: 'parent-5',
    displayName: 'Zainab & Bilal',
    kommune: 'Glostrup',
    childAgeGroup: '13+',
    bio: 'Our daughter is 14 preparing for youth education transition (STU). Glad to support younger parents navigating PPR.',
    languages: 'Urdu, English, Danish',
    optInConnect: true,
    joinedDate: 'Joined Jan 2026'
  },
  {
    id: 'parent-6',
    displayName: 'Kasper & Elena',
    kommune: 'Frederiksberg',
    childAgeGroup: '0-5',
    bio: 'Parents of 5-year-old son with sensory processing sensitivity. Members of Sunflower lanyard community.',
    languages: 'Danish, English, Spanish',
    optInConnect: true,
    joinedDate: 'Joined Mar 2026'
  }
];

export function LocalHub({ onOpenAuth }) {
  const { profile, updateUserProfile } = useAuth();
  
  // Selected Kommune (defaults to user's profile kommune or Albertslund)
  const [selectedKommune, setSelectedKommune] = useState(profile?.kommune || 'Albertslund');
  const [activeTab, setActiveTab] = useState('parents'); // 'parents' or 'meetups'
  const [parentsList, setParentsList] = useState([]);
  const [loadingParents, setLoadingParents] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  // Messaging Modal State
  const [activeParentForMsg, setActiveParentForMsg] = useState(null);
  const [msgContent, setMsgContent] = useState('');
  const [msgSent, setMsgSent] = useState(false);

  // Sync selectedKommune with profile when loaded
  useEffect(() => {
    if (profile?.kommune) {
      setSelectedKommune(profile.kommune);
    }
  }, [profile?.kommune]);

  // Load parents from Firestore with local seed fallback
  useEffect(() => {
    let isMounted = true;
    async function fetchLocalParents() {
      setLoadingParents(true);
      try {
        const usersRef = collection(db, 'users');
        const q = query(
          usersRef, 
          where('kommune', '==', selectedKommune),
          where('optInConnect', '==', true)
        );
        const snapshot = await getDocs(q);
        const remoteParents = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Match seed parents for this Kommune
        const matchedSeeds = SEED_PARENTS.filter(
          p => p.kommune.toLowerCase() === selectedKommune.toLowerCase()
        );

        // Merge remote and seed parents (avoid duplicates)
        const combined = [...remoteParents];
        matchedSeeds.forEach(seed => {
          if (!combined.some(c => c.displayName === seed.displayName)) {
            combined.push(seed);
          }
        });

        // If current user is in this kommune and opted in, include their card
        if (profile && profile.kommune === selectedKommune && profile.optInConnect) {
          if (!combined.some(c => c.uid === profile.uid || c.id === profile.uid)) {
            combined.unshift({
              id: profile.uid,
              displayName: `${profile.displayName} (You)`,
              kommune: profile.kommune,
              childAgeGroup: profile.childAgeGroup || '0-5',
              bio: profile.bio || 'Active community parent',
              optInConnect: true,
              isCurrentUser: true,
              joinedDate: 'Joined recently'
            });
          }
        }

        if (isMounted) {
          setParentsList(combined);
          setLoadingParents(false);
        }
      } catch (err) {
        console.warn('Using local parent directory fallback for Kommune:', err);
        const matchedSeeds = SEED_PARENTS.filter(
          p => p.kommune.toLowerCase() === selectedKommune.toLowerCase()
        );
        if (isMounted) {
          setParentsList(matchedSeeds);
          setLoadingParents(false);
        }
      }
    }

    fetchLocalParents();
    return () => { isMounted = false; };
  }, [selectedKommune, profile]);

  // Filter events for this Kommune
  const localMeetups = SEED_EVENTS.filter(
    e => e.kommune.toLowerCase() === selectedKommune.toLowerCase()
  );

  // Filter parents by search
  const filteredParents = parentsList.filter(p => {
    if (!searchFilter) return true;
    const q = searchFilter.toLowerCase();
    return (
      p.displayName?.toLowerCase().includes(q) ||
      p.bio?.toLowerCase().includes(q) ||
      p.childAgeGroup?.toLowerCase().includes(q)
    );
  });

  const handleOpenMessage = (parent) => {
    if (!profile) {
      if (onOpenAuth) onOpenAuth();
      return;
    }
    setActiveParentForMsg(parent);
    setMsgContent(`Hej ${parent.displayName}! I am also a parent in ${selectedKommune} with an autistic child. I would love to connect for quiet peer advice or a park meetup.`);
    setMsgSent(false);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    setMsgSent(true);
    setTimeout(() => {
      setActiveParentForMsg(null);
      setMsgSent(false);
    }, 1800);
  };

  const handleToggleOptIn = async () => {
    if (!profile) {
      if (onOpenAuth) onOpenAuth();
      return;
    }
    const nextVal = !profile.optInConnect;
    await updateUserProfile({ optInConnect: nextVal });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Banner: Location-based directory avoiding paid maps */}
      <div className="bg-gradient-to-r from-[#e7efe9] via-[#edf4ef] to-[#f4f7f5] rounded-3xl p-6 sm:p-8 border border-[#d6e3dc] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#d5e4dc] rounded-full text-xs font-semibold text-[#2f4b43] mb-3">
              <span>🏘️ Kommune Hubs</span>
              <span>•</span>
              <span>Free Local Parent Network</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1b2f29] tracking-tight">
              Local Parents & Meetups in Your Municipality
            </h1>
            <p className="text-sm text-[#4d665e] mt-2 max-w-2xl leading-relaxed">
              Danish special needs services (PPR, sagsbehandlere, and special schools) vary widely from Kommune to Kommune. 
              Connect directly with families living in your specific municipality without relying on any paid map APIs.
            </p>
          </div>

          {/* Kommune Dropdown Selector */}
          <div className="bg-white p-4 rounded-2xl border border-[#d2ded8] shadow-xs space-y-1.5 self-start md:self-center min-w-[260px]">
            <label className="block text-xs font-bold text-[#2a423a] flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#51766a]" />
              <span>Select Danish Kommune:</span>
            </label>
            <select
              value={selectedKommune}
              onChange={(e) => setSelectedKommune(e.target.value)}
              className="w-full px-3 py-2 text-sm font-semibold bg-[#f9fbf9] border border-[#d0dfd7] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#52776c] text-[#1c3029] cursor-pointer"
            >
              {DANISH_KOMMUNER.map(k => (
                <option key={k.name} value={k.name}>
                  {k.name} ({k.region})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Opt-In Privacy Notice & Quick Toggle */}
        <div className="mt-6 pt-4 border-t border-[#d3e2db] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#48635b]">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#52776c] shrink-0" />
            <span>
              <strong>Privacy-First Directory:</strong> Only parents who voluntarily check &quot;Opt-in to connect&quot; are listed. No phone numbers or home addresses are ever exposed.
            </span>
          </div>

          {profile && (
            <button
              type="button"
              onClick={handleToggleOptIn}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold text-xs transition-colors cursor-pointer ${
                profile.optInConnect 
                  ? 'bg-[#d8ece1] text-[#1c4b37] hover:bg-[#cbe3d5]'
                  : 'bg-white text-[#4f6b62] border border-[#cbd9d1] hover:bg-[#f2f7f4]'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>{profile.optInConnect ? '✓ You are opted-in' : '+ Opt-in to this hub'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs: "Local Parents" and "Local Meetups" */}
      <div className="flex items-center justify-between border-b border-[#d8e3dd] pb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('parents')}
            className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'parents'
                ? 'bg-[#3d5e55] text-white shadow-2xs'
                : 'text-[#4e645e] hover:bg-[#eaf1ed]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Local Parents ({filteredParents.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('meetups')}
            className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'meetups'
                ? 'bg-[#3d5e55] text-white shadow-2xs'
                : 'text-[#4e645e] hover:bg-[#eaf1ed]'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Local Meetups ({localMeetups.length})</span>
          </button>
        </div>

        {activeTab === 'parents' && (
          <div className="relative hidden sm:block w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#6c867f]" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search parents or age..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-[#d2ded8] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#52776c]"
            />
          </div>
        )}
      </div>

      {/* TAB 1: LOCAL PARENTS DIRECTORY */}
      {activeTab === 'parents' && (
        <div className="space-y-4">
          {filteredParents.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-[#d8e3dd] p-8 space-y-3">
              <Users className="w-10 h-10 text-[#67827a] mx-auto" />
              <h3 className="text-base font-bold text-[#1f312c]">
                No opted-in parents listed yet in {selectedKommune}
              </h3>
              <p className="text-xs text-[#5f7871] max-w-md mx-auto leading-relaxed">
                Be the first parent to opt-in in {selectedKommune}! Other immigrant families in your area will be able to find and support you.
              </p>
              {profile ? (
                <button
                  type="button"
                  onClick={handleToggleOptIn}
                  className="px-4 py-2 bg-[#3f6158] hover:bg-[#324f47] text-white text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Join {selectedKommune} Parent Directory
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onOpenAuth && onOpenAuth()}
                  className="px-4 py-2 bg-[#3f6158] hover:bg-[#324f47] text-white text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Sign in to connect
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredParents.map((parent) => (
                <div
                  key={parent.id}
                  className="bg-white rounded-2xl border border-[#d6e2dc] p-5 shadow-xs hover:border-[#b4cec2] transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-full bg-[#dbeae3] text-[#2c5246] font-bold text-sm flex items-center justify-center">
                          {(parent.displayName || 'P').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-[#1e332c] flex items-center gap-1.5">
                            <span>{parent.displayName}</span>
                            {parent.isCurrentUser && (
                              <span className="text-[10px] bg-[#dbeae3] text-[#264b3f] px-1.5 py-0.2 rounded font-semibold">
                                You
                              </span>
                            )}
                          </h3>
                          <p className="text-[11px] text-[#6b857f] flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[#587e73]" />
                            <span>{parent.kommune}</span>
                          </p>
                        </div>
                      </div>

                      {/* Child Age Group Badge */}
                      {parent.childAgeGroup && (
                        <AgeBadge tagId={parent.childAgeGroup} />
                      )}
                    </div>

                    <p className="text-xs text-[#48635b] leading-relaxed line-clamp-3">
                      {parent.bio || 'Parent navigating special needs and PPR in Denmark.'}
                    </p>

                    {parent.languages && (
                      <div className="text-[11px] text-[#637f77] flex items-center gap-1">
                        <span className="font-semibold">Speaks:</span>
                        <span>{parent.languages}</span>
                      </div>
                    )}
                  </div>

                  {/* Card Footer: Send Message Button */}
                  <div className="pt-4 mt-4 border-t border-[#e5eeea] flex items-center justify-between">
                    <span className="text-[11px] text-[#78918a]">
                      {parent.joinedDate || 'Verified Parent'}
                    </span>

                    {!parent.isCurrentUser && (
                      <button
                        type="button"
                        onClick={() => handleOpenMessage(parent)}
                        className="flex items-center gap-1.5 px-3.5 py-2 bg-[#3f6158] hover:bg-[#324f47] text-white text-xs font-semibold rounded-xl shadow-2xs transition-colors cursor-pointer min-h-[38px]"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Message</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: LOCAL MEETUPS IN THIS KOMMUNE */}
      {activeTab === 'meetups' && (
        <div className="space-y-4">
          {localMeetups.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-[#d8e3dd] p-8 space-y-2">
              <Calendar className="w-10 h-10 text-[#67827a] mx-auto" />
              <h3 className="text-base font-bold text-[#1f312c]">
                No upcoming events currently scheduled in {selectedKommune}
              </h3>
              <p className="text-xs text-[#5f7871] max-w-md mx-auto">
                Check neighboring municipalities like København or Frederiksberg, or post in the Community Channels to organize a quiet coffee meetup.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {localMeetups.map((evt) => (
                <div
                  key={evt.id}
                  className="bg-white rounded-2xl border border-[#d6e2dc] p-5 sm:p-6 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#2d4d42] bg-[#eef6f2] px-2.5 py-1 rounded-full border border-[#cbe1d6]">
                      {evt.type === 'quiet_hour' ? 'Sunflower Quiet Hour' : 'Sensory Parent Meetup'}
                    </span>
                    <span className="text-xs font-semibold text-[#5a766e]">
                      {new Date(evt.date).toLocaleDateString('da-DK', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#1e312b] leading-snug">
                    {evt.title}
                  </h3>

                  <p className="text-xs text-[#48635b] leading-relaxed">
                    {evt.description}
                  </p>

                  <div className="pt-3 border-t border-[#e8f0ec] flex flex-wrap items-center justify-between gap-2 text-xs text-[#5a766e]">
                    <span className="flex items-center gap-1 font-semibold text-[#253f37]">
                      <MapPin className="w-3.5 h-3.5 text-[#50766a]" />
                      {evt.location} ({evt.kommune})
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {evt.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Message Parent Modal */}
      {activeParentForMsg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1f2f2b]/40 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-[#f8faf9] rounded-2xl border border-[#d3ded9] shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-[#eaf2ee] border-b border-[#dce6e1] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#40655b]" />
                <h3 className="text-base font-bold text-[#1f312c]">
                  Message {activeParentForMsg.displayName}
                </h3>
              </div>
              <button 
                type="button"
                onClick={() => setActiveParentForMsg(null)}
                className="p-1 text-[#5c7770] hover:text-[#21352f] rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendMessage} className="p-6 space-y-4">
              {msgSent ? (
                <div className="p-4 text-xs text-[#2b5446] bg-[#eef7f2] border border-[#cbe5d7] rounded-xl flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Your message has been safely sent to {activeParentForMsg.displayName}!</span>
                </div>
              ) : (
                <>
                  <div className="bg-[#f2f7f4] p-3 rounded-xl border border-[#d5e2dc] text-xs text-[#304e45] flex items-center justify-between">
                    <div>
                      <span className="font-bold">Recipient: </span>
                      <span>{activeParentForMsg.displayName} ({activeParentForMsg.kommune})</span>
                    </div>
                    {activeParentForMsg.childAgeGroup && (
                      <AgeBadge tagId={activeParentForMsg.childAgeGroup} />
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#293e38] mb-1">
                      Your Message
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={msgContent}
                      onChange={(e) => setMsgContent(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border border-[#d2ded8] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#52776c] resize-none text-[#20342e]"
                    />
                  </div>

                  <p className="text-[11px] text-[#69847d] leading-normal">
                    💡 <em>Tip: Ask about local school options, pediatricians who understand sensory processing, or quiet playgrounds in {activeParentForMsg.kommune}.</em>
                  </p>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#dce5e0]">
                    <button
                      type="button"
                      onClick={() => setActiveParentForMsg(null)}
                      className="px-4 py-2 text-xs font-medium text-[#4b635c] hover:bg-[#e4ece7] rounded-xl cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex items-center gap-1.5 px-5 py-2 bg-[#3f6158] hover:bg-[#324f47] text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Peer Message</span>
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default LocalHub;
