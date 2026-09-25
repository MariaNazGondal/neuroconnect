import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Sparkles, 
  Plus, 
  Filter, 
  Search, 
  Eye, 
  Info, 
  Check, 
  Volume2, 
  Sun,
  Navigation
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { EventService, EventItem } from '../services/eventService';
import { DANISH_KOMMUNER } from '../data/danishMunicipalities';

export const EventsMap: React.FC<{ onOpenAuth: () => void }> = ({ onOpenAuth }) => {
  const { profile } = useAuth();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});

  const [events, setEvents] = useState<EventItem[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [kommuneFilter, setKommuneFilter] = useState<string>('all');
  const [sunflowerOnly, setSunflowerOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Add Event Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [kommune, setKommune] = useState(profile?.kommune || 'København');
  const [dateTime, setDateTime] = useState('');
  const [isSunflowerLanyardFriendly, setIsSunflowerLanyardFriendly] = useState(true);
  const [category, setCategory] = useState<'meetup' | 'sensory_place' | 'workshop' | 'quiet_hour'>('meetup');
  const [sensoryNotes, setSensoryNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Subscribe to real-time events
  useEffect(() => {
    const unsub = EventService.subscribeToEvents(
      kommuneFilter,
      sunflowerOnly,
      (fetched) => {
        setEvents(fetched);
      }
    );
    return () => unsub();
  }, [kommuneFilter, sunflowerOnly]);

  // Initialize Leaflet Map once
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Centered over Denmark
    const initialMap = L.map(mapContainerRef.current, {
      center: [55.6761, 12.5683], // Default Copenhagen
      zoom: 11,
      zoomControl: false,
    });

    // Add gentle zoom control to bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(initialMap);

    // Sensory-friendly tile layer (CartoDB Positron: clean, muted, soft grey-green roads, non-overstimulating)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors, CartoDB',
      maxZoom: 19,
    }).addTo(initialMap);

    mapInstanceRef.current = initialMap;

    return () => {
      initialMap.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Map Markers when events change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear previous markers
    Object.values(markersRef.current).forEach(m => m.remove());
    markersRef.current = {};

    const bounds = L.latLngBounds([]);

    events.forEach(evt => {
      if (!evt.latitude || !evt.longitude) return;

      const isSunflower = evt.isSunflowerLanyardFriendly;
      const isSelected = evt.id === selectedEventId;

      // Custom calming sensory pin HTML
      const pinHtml = `
        <div style="
          width: 38px;
          height: 38px;
          background: ${isSunflower ? '#fdf8e2' : '#eaf2ee'};
          border: 2px solid ${isSunflower ? '#cca21a' : '#4d6f65'};
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 10px rgba(0,0,0,0.12);
          cursor: pointer;
          transform: ${isSelected ? 'scale(1.2)' : 'scale(1)'};
          transition: transform 0.2s ease;
        ">
          <span style="font-size: ${isSunflower ? '20px' : '16px'}; line-height: 1;">
            ${isSunflower ? '🌻' : '📍'}
          </span>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-sensory-pin-container',
        html: pinHtml,
        iconSize: [38, 38],
        iconAnchor: [19, 19],
        popupAnchor: [0, -20],
      });

      const marker = L.marker([evt.latitude, evt.longitude], { icon: customIcon }).addTo(map);

      // Popup Content
      const popupHtml = `
        <div style="font-family: 'Plus Jakarta Sans', sans-serif; padding: 4px; min-width: 220px; max-width: 280px;">
          <div style="display: flex; align-items: center; gap: 4px; margin-bottom: 4px;">
            ${isSunflower ? '<span style="background: #fdf3cd; color: #856404; font-size: 10px; font-weight: bold; padding: 2px 6px; border-radius: 4px;">🌻 Solsikke Friendly</span>' : ''}
            <span style="color: #637d76; font-size: 10px; font-weight: 600;">${evt.kommune}</span>
          </div>
          <h4 style="font-size: 13px; font-weight: 700; color: #1e312b; margin: 0 0 4px 0; line-height: 1.3;">${evt.title}</h4>
          <p style="font-size: 11px; color: #49635b; margin: 0 0 6px 0;">📍 ${evt.address}</p>
          <p style="font-size: 11px; color: #2d453f; margin: 0 0 6px 0; line-height: 1.4;">${evt.description}</p>
          ${evt.sensoryNotes ? `<div style="background: #eef5f1; border-left: 3px solid #557b70; padding: 4px 6px; font-size: 10px; color: #2e4a42; border-radius: 2px;">👂 ${evt.sensoryNotes}</div>` : ''}
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('click', () => {
        setSelectedEventId(evt.id);
        const cardElem = document.getElementById(`event-card-${evt.id}`);
        if (cardElem) {
          cardElem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      });

      markersRef.current[evt.id] = marker;
      bounds.extend([evt.latitude, evt.longitude]);
    });

    // Fit bounds if we have markers and no explicit focus
    if (events.length > 0 && !selectedEventId) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 });
    }
  }, [events, selectedEventId]);

  // Center on event when list card clicked
  const handleSelectEvent = (evt: EventItem) => {
    setSelectedEventId(evt.id);
    const map = mapInstanceRef.current;
    if (map && evt.latitude && evt.longitude) {
      map.flyTo([evt.latitude, evt.longitude], 14, { duration: 1 });
      const marker = markersRef.current[evt.id];
      if (marker) {
        marker.openPopup();
      }
    }
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) {
      onOpenAuth();
      return;
    }

    if (!title.trim() || !address.trim() || !dateTime.trim()) return;

    setSubmitting(true);
    try {
      const matchKommune = DANISH_KOMMUNER.find(k => k.name.toLowerCase() === kommune.toLowerCase());
      const lat = matchKommune ? matchKommune.lat : 55.6761;
      const lng = matchKommune ? matchKommune.lng : 12.5683;

      const created = await EventService.createEvent({
        title,
        description: sensoryNotes || 'Parent organized meetup & low-sensory activity in Denmark.',
        address,
        kommune,
        latitude: lat,
        longitude: lng,
        dateTime,
        isSunflowerLanyardFriendly,
        category,
        sensoryNotes,
        createdBy: profile.uid,
        createdByName: profile.displayName || 'Parent Host'
      });

      setEvents(prev => [created, ...prev]);
      setShowAddModal(false);
      setTitle('');
      setAddress('');
      setDateTime('');
      setSensoryNotes('');

      // Focus map to newly created event
      setTimeout(() => {
        handleSelectEvent(created);
      }, 300);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredEvents = events.filter(evt => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return evt.title.toLowerCase().includes(q) || 
      evt.address.toLowerCase().includes(q) || 
      evt.kommune.toLowerCase().includes(q) ||
      evt.sensoryNotes.toLowerCase().includes(q);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#e7efe9] via-[#edf4ef] to-[#f4f7f5] rounded-3xl p-6 sm:p-8 border border-[#d6e3dc] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#d5e4dc] rounded-full text-xs font-semibold text-[#2f4b43] mb-3">
              <span>🌻 Solsikkesnoren Friendly Map</span>
              <span>•</span>
              <span>Sensory Spaces across Denmark</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1b2f29] tracking-tight">
              Interactive Events & Autism-Friendly Places
            </h1>
            <p className="text-sm text-[#4d665e] mt-2 max-w-2xl leading-relaxed">
              Find and share quiet mornings, sensory-safe playgrounds, low-noise venues, and local parent coffee meetups in your Kommune. 
              Venues displaying the 🌻 icon are verified Sunflower Lanyard friendly.
            </p>
          </div>

          <button
            onClick={() => {
              if (!profile) onOpenAuth();
              else setShowAddModal(true);
            }}
            className="self-start md:self-center flex items-center gap-2 px-5 py-3 bg-[#3d5e55] hover:bg-[#304d45] text-white font-semibold text-sm rounded-2xl shadow-xs transition-all transform hover:-translate-y-0.5"
          >
            <Plus className="w-5 h-5" />
            <span>Add Event or Place</span>
          </button>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#d8e3dd] shadow-xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-3 text-[#648078]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events by title, address, or sensory details..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-[#f9fbf9] border border-[#dce6e0] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#52776c]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Kommune selector */}
          <div className="flex items-center gap-1.5 bg-[#f5f8f6] px-3 py-2 rounded-xl border border-[#dce6e0] text-xs font-medium text-[#465f58]">
            <MapPin className="w-3.5 h-3.5 text-[#5e8277]" />
            <span>Kommune:</span>
            <select
              value={kommuneFilter}
              onChange={(e) => setKommuneFilter(e.target.value)}
              className="bg-transparent font-semibold text-[#1e312b] focus:outline-hidden cursor-pointer"
            >
              <option value="all">All Denmark</option>
              {DANISH_KOMMUNER.map(k => (
                <option key={k.name} value={k.name}>{k.name}</option>
              ))}
            </select>
          </div>

          {/* Sunflower Lanyard Toggle */}
          <button
            onClick={() => setSunflowerOnly(!sunflowerOnly)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-colors ${
              sunflowerOnly
                ? 'bg-[#fcf7de] border-[#dfc346] text-[#785913]'
                : 'bg-[#f5f8f6] border-[#dce6e0] text-[#4f6b63] hover:bg-[#edf3f0]'
            }`}
          >
            <span>🌻</span>
            <span>Sunflower Only</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Interactive Map + Side-by-Side Event List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[580px]">
        
        {/* Left Side: Map Container */}
        <div className="lg:col-span-7 xl:col-span-7 rounded-3xl overflow-hidden border border-[#d5e2dc] shadow-xs relative bg-[#e7eee9] min-h-[420px] lg:min-h-full">
          <div ref={mapContainerRef} className="w-full h-full min-h-[420px] lg:min-h-[580px]" />

          {/* Map Legend Overlay */}
          <div className="absolute top-3 left-3 z-20 bg-white/95 backdrop-blur-xs p-2.5 rounded-2xl border border-[#d3ded8] shadow-xs text-xs space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-base">🌻</span>
              <span className="font-semibold text-[#273d36]">Sunflower Lanyard Recognized</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-base">📍</span>
              <span className="text-[#49635c]">Sensory-Friendly Meetup/Place</span>
            </div>
          </div>
        </div>

        {/* Right Side: Closest Upcoming Events List */}
        <div className="lg:col-span-5 xl:col-span-5 space-y-3.5 max-h-[580px] overflow-y-auto pr-1">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#355249]">
              Upcoming Events & Locations ({filteredEvents.length})
            </h3>
            <span className="text-xs text-[#637d76]">Click card to center map</span>
          </div>

          {filteredEvents.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-[#d8e3dd] p-6">
              <span className="text-3xl mb-2 block">🌻</span>
              <h4 className="text-sm font-bold text-[#1f312c]">No events match this filter</h4>
              <p className="text-xs text-[#5e7771] mt-1">Try clearing the Kommune filter or add a local meetup.</p>
            </div>
          ) : (
            filteredEvents.map(evt => {
              const isSelected = evt.id === selectedEventId;
              return (
                <div
                  id={`event-card-${evt.id}`}
                  key={evt.id}
                  onClick={() => handleSelectEvent(evt)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#f0f6f3] border-[#446d61] ring-2 ring-[#446d61]/25 shadow-xs'
                      : 'bg-white border-[#d8e3dd] hover:border-[#adc4bb]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h4 className="text-sm font-bold text-[#1b2f29] leading-snug">
                      {evt.title}
                    </h4>
                    {evt.isSunflowerLanyardFriendly && (
                      <span className="shrink-0 inline-flex items-center gap-1 text-[11px] font-bold bg-[#fbf5dc] text-[#7a5b17] border border-[#ecd98d] px-2 py-0.5 rounded-full">
                        <span>🌻</span>
                        <span>Solsikke</span>
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[#48635b] flex items-center gap-1 mb-2">
                    <MapPin className="w-3.5 h-3.5 text-[#597f74] shrink-0" />
                    <span>{evt.address} ({evt.kommune})</span>
                  </p>

                  <p className="text-xs text-[#39504a] leading-relaxed line-clamp-2 mb-3">
                    {evt.description}
                  </p>

                  {/* Sensory notes highlight */}
                  {evt.sensoryNotes && (
                    <div className="bg-[#f2f7f4] border border-[#d7e5de] rounded-xl p-2 text-[11px] text-[#2f4f46] mb-3 flex items-start gap-1.5">
                      <Volume2 className="w-3.5 h-3.5 text-[#4e746a] shrink-0 mt-0.5" />
                      <span>{evt.sensoryNotes}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-[#e5eeea] text-[11px] text-[#5e7771]">
                    <div className="flex items-center gap-1 text-[#2d4740] font-medium">
                      <Calendar className="w-3.5 h-3.5 text-[#54796f]" />
                      <span>{evt.dateTime}</span>
                    </div>
                    <span className="text-[10px] text-[#79928b]">Host: {evt.createdByName}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>

      {/* Floating Add Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1f2f2b]/40 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-[#f8faf9] rounded-2xl border border-[#d3ded9] shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            
            <div className="px-6 py-4 bg-[#eaf2ee] border-b border-[#dce6e1] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">🌻</span>
                <h2 className="text-base font-bold text-[#1f312c]">Add Event or Sensory Place</h2>
              </div>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-1 text-[#5c7770] hover:text-[#21352f] rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddEvent} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#293e38] mb-1">
                  Event / Location Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Quiet Morning at Experimentarium or Parent Coffee in Valby"
                  className="w-full px-3 py-2 text-sm bg-white border border-[#d2ded8] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#52776c]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#293e38] mb-1">
                    Street Address & Postal Code
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. Tuborg Havnevej 7, 2900 Hellerup"
                    className="w-full px-3 py-2 text-sm bg-white border border-[#d2ded8] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#52776c]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#293e38] mb-1">
                    Danish Kommune
                  </label>
                  <select
                    value={kommune}
                    onChange={(e) => setKommune(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#d2ded8] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#52776c]"
                  >
                    {DANISH_KOMMUNER.map(k => (
                      <option key={k.name} value={k.name}>{k.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#293e38] mb-1">
                  Date & Time
                </label>
                <input
                  type="text"
                  required
                  value={dateTime}
                  onChange={(e) => setDateTime(e.target.value)}
                  placeholder="e.g. Saturday, April 18, 2026 • 10:00 - 12:00 or Daily Opening Hours"
                  className="w-full px-3 py-2 text-sm bg-white border border-[#d2ded8] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#52776c]"
                />
              </div>

              {/* Sunflower Lanyard Checkbox */}
              <div className="p-3.5 bg-[#fcf9e8] border border-[#edd78a] rounded-xl flex items-start gap-3">
                <input
                  type="checkbox"
                  id="sunflower-checkbox"
                  checked={isSunflowerLanyardFriendly}
                  onChange={(e) => setIsSunflowerLanyardFriendly(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-[#8a681a] rounded-sm focus:ring-[#8a681a] cursor-pointer"
                />
                <label htmlFor="sunflower-checkbox" className="text-xs text-[#634c11] cursor-pointer">
                  <span className="font-bold block">Sunflower Lanyard (Solsikkesnoren) Friendly 🌻</span>
                  Venue staff are trained to recognize the green sunflower lanyard, offer extra patience, or provide a calm retreat.
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#293e38] mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e: any) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-[#d2ded8] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#52776c]"
                >
                  <option value="meetup">Parent Meetup / Peer Support Coffee</option>
                  <option value="sensory_place">Sensory-Friendly Playground / Park</option>
                  <option value="quiet_hour">Quiet Hour Museum / Low Sensory Time</option>
                  <option value="workshop">Parent Workshop & Danish Law Advice</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#293e38] mb-1">
                  Sensory Details & Accommodations
                </label>
                <textarea
                  rows={3}
                  value={sensoryNotes}
                  onChange={(e) => setSensoryNotes(e.target.value)}
                  placeholder="e.g. Low background noise, no flashing lights, separate sensory break tent with beanbags, wheelchair/stroller accessible."
                  className="w-full px-3 py-2 text-sm bg-white border border-[#d2ded8] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#52776c] resize-none"
                />
              </div>

              <div className="pt-2 border-t border-[#dce5e0] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-medium text-[#4b635c] hover:bg-[#e4ece7] rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-[#3f6158] hover:bg-[#324f47] text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
                >
                  {submitting ? 'Adding...' : 'Pin on Map'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
