/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { Forum } from './components/Forum';
import { EventsMap } from './components/EventsMap';
import { Glossary } from './components/Glossary';
import { DocumentScanner } from './components/DocumentScanner';
import { ResourceMarket } from './components/ResourceMarket';
import { LocalHub } from './components/LocalHub';
import { RightsAssistant } from './components/RightsAssistant';
import { AuthModal } from './components/AuthModal';
import { ProfileModal } from './components/ProfileModal';
import { GuidedTourModal } from './components/GuidedTourModal';
import { Heart, Globe, Shield, Sparkles, MapPin } from 'lucide-react';

function AppContent() {
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'forum' | 'map' | 'glossary' | 'decoder' | 'exchange' | 'hub' | 'rights'>('dashboard');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const { profile } = useAuth();

  // Automatically trigger guided tour overlay upon first login
  useEffect(() => {
    if (profile) {
      const tourSeen = localStorage.getItem('autismdk_tour_completed_v1');
      if (!tourSeen) {
        const timer = setTimeout(() => {
          setIsTourOpen(true);
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [profile]);

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f9f8] text-[#243330] selection:bg-[#d8e7e1] selection:text-[#18312a]">
      
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenTour={() => setIsTourOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentTab === 'dashboard' && (
          <Dashboard
            onSelectTab={setCurrentTab}
            onOpenAuth={() => setIsAuthOpen(true)}
            onOpenProfile={() => setIsProfileOpen(true)}
            onOpenTour={() => setIsTourOpen(true)}
          />
        )}

        {currentTab === 'hub' && (
          <LocalHub onOpenAuth={() => setIsAuthOpen(true)} />
        )}

        {currentTab === 'rights' && (
          <RightsAssistant />
        )}

        {currentTab === 'forum' && (
          <Forum onOpenAuth={() => setIsAuthOpen(true)} />
        )}

        {currentTab === 'decoder' && (
          <DocumentScanner />
        )}

        {currentTab === 'exchange' && (
          <ResourceMarket onOpenAuth={() => setIsAuthOpen(true)} />
        )}

        {currentTab === 'map' && (
          <EventsMap onOpenAuth={() => setIsAuthOpen(true)} />
        )}

        {currentTab === 'glossary' && (
          <Glossary />
        )}
      </main>

      {/* Sensory-Friendly Footer */}
      <footer className="mt-16 bg-[#edf3f0] border-t border-[#d8e4de] py-10 text-xs text-[#526c65]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">🌻</span>
              <div>
                <span className="font-bold text-sm text-[#1e312b]">AutismDK</span>
                <p className="text-[11px] text-[#647f77]">
                  Multilingual community for parents of children with autism & special needs across Denmark
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-[#415d55]">
              <button onClick={() => setCurrentTab('dashboard')} className="hover:underline cursor-pointer">Home</button>
              <span>•</span>
              <button onClick={() => setCurrentTab('hub')} className="hover:underline cursor-pointer">Kommune Hubs</button>
              <span>•</span>
              <button onClick={() => setCurrentTab('rights')} className="hover:underline cursor-pointer">Rights AI</button>
              <span>•</span>
              <button onClick={() => setCurrentTab('forum')} className="hover:underline cursor-pointer">Channels</button>
              <span>•</span>
              <button onClick={() => setCurrentTab('decoder')} className="hover:underline cursor-pointer">Decoder</button>
              <span>•</span>
              <button onClick={() => setCurrentTab('exchange')} className="hover:underline cursor-pointer">Exchange</button>
              <span>•</span>
              <button onClick={() => setCurrentTab('map')} className="hover:underline cursor-pointer">Events Map</button>
              <span>•</span>
              <button onClick={() => setCurrentTab('glossary')} className="hover:underline cursor-pointer">Glossary</button>
            </div>
          </div>

          <div className="pt-4 border-t border-[#dce6e1] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#6d8680]">
            <p>
              🌻 Solsikkeprogrammet friendly • Supporting families in all 98 Danish Kommuner • Free & non-profit community
            </p>
            <p className="flex items-center gap-1.5">
              <span>Sensory-friendly</span>
              <span>•</span>
              <span>Always consult official Danish authorities (PPR, VISO, Sagsbehandler) for binding legal decisions</span>
            </p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />

      <GuidedTourModal
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
        onNavigateTab={setCurrentTab}
      />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
