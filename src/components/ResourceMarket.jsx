import React, { useState } from 'react';
import { 
  Package, 
  MapPin, 
  MessageSquare, 
  Plus, 
  Filter, 
  Search, 
  Heart, 
  Sparkles, 
  Tag, 
  Send, 
  X, 
  Check, 
  Info,
  Gift
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DANISH_KOMMUNER } from '../data/danishMunicipalities';

// Seed sensory items for the community exchange board
const INITIAL_ITEMS = [
  {
    id: 'res-1',
    title: 'Weighted Blanket (Protac Kugledyne 5kg)',
    category: 'Sensory Bedding',
    priceType: 'free', // 'free' or 'sale'
    price: 0,
    kommune: 'Albertslund',
    condition: 'Gently Used (Excellent)',
    description: 'Our son has outgrown this 5kg sensory ball blanket. Clean, washed in non-perfumed detergent (neutral). Free to an immigrant family in need.',
    imageUrl: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80',
    parentName: 'Fatima & Ahmed',
    createdAt: '2026-03-22'
  },
  {
    id: 'res-2',
    title: 'Visual Time Timer (Large 20cm Magnet)',
    category: 'Visual Structure & Schedules',
    priceType: 'free',
    price: 0,
    kommune: 'København',
    condition: 'Like New',
    description: 'Helps children with autism visualize transitions between screen time, homework, and dinner. Magnetic back for the fridge.',
    imageUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80',
    parentName: 'Olena K.',
    createdAt: '2026-03-23'
  },
  {
    id: 'res-3',
    title: 'Kids Noise-Cancelling Ear Defenders (Peltor Kid Neon Green)',
    category: 'Acoustic Protection',
    priceType: 'free',
    price: 0,
    kommune: 'Frederiksberg',
    condition: 'Good Condition',
    description: 'Essential for Copenhagen Metro, DSB trains, and school events. Soft headband, fits ages 3 to 10.',
    imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80',
    parentName: 'Sarah J.',
    createdAt: '2026-03-24'
  },
  {
    id: 'res-4',
    title: 'Chewelry Sensory Necklace Kit (Medical Grade Silicone)',
    category: 'Oral Sensory Stimulation',
    priceType: 'free',
    price: 0,
    kommune: 'Aarhus',
    condition: 'Brand New (Unused 3-pack in box)',
    description: 'BPA-free sensory chew necklaces for children who chew collars or sleeves. New and sterile.',
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80',
    parentName: 'Mehmet Y.',
    createdAt: '2026-03-21'
  },
  {
    id: 'res-5',
    title: 'Complete Pictogram Schedule Board with Danish Magnets',
    category: 'Visual Structure & Schedules',
    priceType: 'sale',
    price: 75,
    kommune: 'Gladsaxe',
    condition: 'Complete set with 80 visual cards',
    description: 'Morning and evening routine pictograms (børste tænder, tage tøj på, skole, lege). Minor wear on corners.',
    imageUrl: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=600&q=80',
    parentName: 'Rasmus & Maria',
    createdAt: '2026-03-19'
  },
  {
    id: 'res-6',
    title: 'Inflatable Sensory Pod Swing (Indoor / Outdoor)',
    category: 'Vestibular & Balance',
    priceType: 'sale',
    price: 100,
    kommune: 'Odense',
    condition: 'Great condition with ceiling hook',
    description: 'Calming sensory hammock swing. Great for vestibular regulation and reading quiet books.',
    imageUrl: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=600&q=80',
    parentName: 'Amina S.',
    createdAt: '2026-03-18'
  }
];

export function ResourceMarket({ onOpenAuth }) {
  const { profile } = useAuth();
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [filterType, setFilterType] = useState('all'); // 'all', 'free', 'sale'
  const [selectedKommune, setSelectedKommune] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Messaging Modal State
  const [activeItemForMessage, setActiveItemForMessage] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [messageSent, setMessageSent] = useState(false);

  // Listing Modal State
  const [showListModal, setShowListModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Sensory Bedding');
  const [newPriceType, setNewPriceType] = useState('free');
  const [newPrice, setNewPrice] = useState(0);
  const [newKommune, setNewKommune] = useState(profile?.kommune || 'København');
  const [newCondition, setNewCondition] = useState('Gently Used');
  const [newDescription, setNewDescription] = useState('');

  // Filter items
  const filteredItems = items.filter(item => {
    const matchesType = filterType === 'all' || item.priceType === filterType;
    const matchesKommune = selectedKommune === 'all' || item.kommune.toLowerCase() === selectedKommune.toLowerCase();
    const q = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery || 
      item.title.toLowerCase().includes(q) || 
      item.description.toLowerCase().includes(q) || 
      item.kommune.toLowerCase().includes(q);

    return matchesType && matchesKommune && matchesSearch;
  });

  const handleOpenMessage = (item) => {
    if (!profile) {
      if (onOpenAuth) onOpenAuth();
      return;
    }
    setActiveItemForMessage(item);
    setMessageText(`Hej ${item.parentName}! I saw your listing for "${item.title}" on AutismDK. Is it still available? We live in ${profile.kommune || 'Denmark'} and would love to pick it up.`);
    setMessageSent(false);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    setMessageSent(true);
    setTimeout(() => {
      setActiveItemForMessage(null);
      setMessageSent(false);
    }, 1800);
  };

  const handleCreateListing = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newItem = {
      id: `res-${Date.now()}`,
      title: newTitle,
      category: newCategory,
      priceType: newPriceType,
      price: newPriceType === 'free' ? 0 : Number(newPrice),
      kommune: newKommune,
      condition: newCondition,
      description: newDescription,
      imageUrl: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80',
      parentName: profile?.displayName || 'Parent Member',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setItems([newItem, ...items]);
    setShowListModal(false);
    setNewTitle('');
    setNewDescription('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#e7efe9] via-[#edf4ef] to-[#f4f7f5] rounded-3xl p-6 sm:p-8 border border-[#d6e3dc] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#d5e4dc] rounded-full text-xs font-semibold text-[#2f4b43] mb-3">
              <span>🎁 Sensory Equipment Exchange</span>
              <span>•</span>
              <span>Parent-to-Parent Sharing</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1b2f29] tracking-tight">
              Resource & Sensory Item Exchange
            </h1>
            <p className="text-sm text-[#4d665e] mt-2 max-w-2xl leading-relaxed">
              Autism and sensory items (weighted blankets, timers, ear defenders) are expensive to buy new. 
              Swap, donate, or find affordable sensory equipment from families in your Danish Kommune.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              if (!profile) {
                if (onOpenAuth) onOpenAuth();
              } else {
                setShowListModal(true);
              }
            }}
            className="self-start md:self-center flex items-center gap-2 px-5 py-3 bg-[#3d5e55] hover:bg-[#304d45] text-white font-semibold text-sm rounded-2xl shadow-xs transition-transform transform hover:-translate-y-0.5 cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            <span>List a Sensory Item</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#d8e3dd] shadow-xs">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-3 text-[#648078]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items (e.g., 'kugledyne', 'headphones', 'timer', 'vest')..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-[#f9fbf9] border border-[#dce6e0] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#52776c]"
          />
        </div>

        {/* Free vs For Sale Toggle */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex p-1 bg-[#edf4f0] rounded-xl border border-[#d4e2db] text-xs font-semibold">
            <button
              type="button"
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                filterType === 'all' ? 'bg-white text-[#1f352e] shadow-2xs' : 'text-[#506c64]'
              }`}
            >
              All Items
            </button>
            <button
              type="button"
              onClick={() => setFilterType('free')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                filterType === 'free' ? 'bg-white text-[#1f352e] shadow-2xs' : 'text-[#506c64]'
              }`}
            >
              <Gift className="w-3.5 h-3.5 text-emerald-600" />
              <span>Free / Giveaway</span>
            </button>
            <button
              type="button"
              onClick={() => setFilterType('sale')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                filterType === 'sale' ? 'bg-white text-[#1f352e] shadow-2xs' : 'text-[#506c64]'
              }`}
            >
              Fair Price (DKK)
            </button>
          </div>

          {/* Kommune selector */}
          <div className="flex items-center gap-1.5 bg-[#f5f8f6] px-3 py-2 rounded-xl border border-[#dce6e0] text-xs font-medium text-[#465f58]">
            <MapPin className="w-3.5 h-3.5 text-[#5e8277]" />
            <select
              value={selectedKommune}
              onChange={(e) => setSelectedKommune(e.target.value)}
              className="bg-transparent font-semibold text-[#1e312b] focus:outline-hidden cursor-pointer"
            >
              <option value="all">All Denmark</option>
              {DANISH_KOMMUNER.map(k => (
                <option key={k.name} value={k.name}>{k.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Item Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.length === 0 ? (
          <div className="col-span-full text-center py-16 bg-white rounded-3xl border border-[#d8e3dd] p-8">
            <Package className="w-10 h-10 text-[#648078] mx-auto mb-2" />
            <h3 className="text-base font-bold text-[#1f312c]">No items found</h3>
            <p className="text-xs text-[#5e7771] mt-1">Try another search or list an item for other parents.</p>
          </div>
        ) : (
          filteredItems.map(item => (
            <div 
              key={item.id}
              className="bg-white rounded-2xl border border-[#d6e2dc] overflow-hidden shadow-xs hover:border-[#b4cec2] transition-all flex flex-col justify-between"
            >
              <div>
                {/* Image & Badges */}
                <div className="relative h-44 bg-[#e9f0ec] overflow-hidden">
                  <img 
                    src={item.imageUrl} 
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    {item.priceType === 'free' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#d4eedf] text-[#1b5038] shadow-xs">
                        <Gift className="w-3.5 h-3.5" />
                        <span>FREE (Gives væk)</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#fef7d8] text-[#71540a] shadow-xs">
                        <span>{item.price} DKK</span>
                      </span>
                    )}
                  </div>

                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-[#304e45]">
                    {item.condition}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-5 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-[#5c7770]">
                    <span className="font-semibold bg-[#edf4f0] px-2 py-0.5 rounded-md text-[#36534b]">
                      {item.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#50776b]" />
                      <strong>{item.kommune}</strong>
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#1e312b] leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-[#48635b] leading-relaxed line-clamp-3">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Card Footer: Message Parent Button */}
              <div className="p-4 sm:p-5 pt-0">
                <div className="pt-3 border-t border-[#e2ece7] flex items-center justify-between gap-3">
                  <div className="text-[11px] text-[#6d8881]">
                    <span>Shared by </span>
                    <strong className="text-[#2b443d]">{item.parentName}</strong>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenMessage(item)}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-[#3e6057] hover:bg-[#304d45] text-white text-xs font-semibold rounded-xl shadow-2xs transition-colors cursor-pointer min-h-[40px]"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Message Parent</span>
                  </button>
                </div>
              </div>

            </div>
          ))
        )}
      </div>

      {/* Message Parent Modal */}
      {activeItemForMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1f2f2b]/40 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-[#f8faf9] rounded-2xl border border-[#d3ded9] shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-[#eaf2ee] border-b border-[#dce6e1] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#40655b]" />
                <h3 className="text-base font-bold text-[#1f312c]">Message {activeItemForMessage.parentName}</h3>
              </div>
              <button 
                type="button"
                onClick={() => setActiveItemForMessage(null)}
                className="p-1 text-[#5c7770] hover:text-[#21352f] rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendMessage} className="p-6 space-y-4">
              {messageSent ? (
                <div className="p-4 text-xs text-[#2b5446] bg-[#eef7f2] border border-[#cbe5d7] rounded-xl flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Message sent! {activeItemForMessage.parentName} will be notified via their registered email.</span>
                </div>
              ) : (
                <>
                  <div className="bg-[#f2f7f4] p-3 rounded-xl border border-[#d5e2dc] text-xs text-[#304e45]">
                    <span className="font-bold">Item: </span>
                    <span>{activeItemForMessage.title} ({activeItemForMessage.kommune})</span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#293e38] mb-1">
                      Your Message
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border border-[#d2ded8] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#52776c] resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#dce5e0]">
                    <button
                      type="button"
                      onClick={() => setActiveItemForMessage(null)}
                      className="px-4 py-2 text-xs font-medium text-[#4b635c] hover:bg-[#e4ece7] rounded-xl cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex items-center gap-1.5 px-5 py-2 bg-[#3f6158] hover:bg-[#324f47] text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Message</span>
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}

      {/* List an Item Modal */}
      {showListModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1f2f2b]/40 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-[#f8faf9] rounded-2xl border border-[#d3ded9] shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            
            <div className="px-6 py-4 bg-[#eaf2ee] border-b border-[#dce6e1] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-[#40655b]" />
                <h3 className="text-base font-bold text-[#1f312c]">List a Sensory Item or Equipment</h3>
              </div>
              <button 
                type="button"
                onClick={() => setShowListModal(false)}
                className="p-1 text-[#5c7770] hover:text-[#21352f] rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateListing} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#293e38] mb-1">
                  Item Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Protac Ball Blanket 5kg or Peltor Kids Ear Muffs"
                  className="w-full px-3 py-2 text-sm bg-white border border-[#d2ded8] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#52776c]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#293e38] mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#d2ded8] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#52776c]"
                  >
                    <option value="Sensory Bedding">Sensory Bedding (Blankets/Sheets)</option>
                    <option value="Acoustic Protection">Acoustic (Ear Defenders/Headphones)</option>
                    <option value="Visual Structure & Schedules">Visual Timers & Pictograms</option>
                    <option value="Oral Sensory Stimulation">Chewelry & Oral Sensory</option>
                    <option value="Vestibular & Balance">Swings & Wobble Cushions</option>
                    <option value="Compression & Clothing">Compression Vests / Seamless</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#293e38] mb-1">
                    Condition
                  </label>
                  <select
                    value={newCondition}
                    onChange={(e) => setNewCondition(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#d2ded8] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#52776c]"
                  >
                    <option value="Like New">Like New</option>
                    <option value="Gently Used">Gently Used (Good condition)</option>
                    <option value="Well Loved">Well Loved (Functional)</option>
                    <option value="Brand New">Brand New (Unopened)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#293e38] mb-1">
                    Price Option
                  </label>
                  <div className="flex gap-2 p-1 bg-[#edf4f0] rounded-xl">
                    <button
                      type="button"
                      onClick={() => setNewPriceType('free')}
                      className={`flex-1 py-1.5 text-xs font-semibold rounded-lg cursor-pointer ${
                        newPriceType === 'free' ? 'bg-white text-[#1f352e] shadow-2xs' : 'text-[#506c64]'
                      }`}
                    >
                      Free Giveaway
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewPriceType('sale')}
                      className={`flex-1 py-1.5 text-xs font-semibold rounded-lg cursor-pointer ${
                        newPriceType === 'sale' ? 'bg-white text-[#1f352e] shadow-2xs' : 'text-[#506c64]'
                      }`}
                    >
                      Sell (DKK)
                    </button>
                  </div>
                </div>

                {newPriceType === 'sale' && (
                  <div>
                    <label className="block text-xs font-semibold text-[#293e38] mb-1">
                      Price in DKK
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      placeholder="e.g. 50"
                      className="w-full px-3 py-2 text-sm bg-white border border-[#d2ded8] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#52776c]"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#293e38] mb-1">
                  Location / Kommune
                </label>
                <select
                  value={newKommune}
                  onChange={(e) => setNewKommune(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-[#d2ded8] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#52776c]"
                >
                  {DANISH_KOMMUNER.map(k => (
                    <option key={k.name} value={k.name}>{k.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#293e38] mb-1">
                  Description & Details
                </label>
                <textarea
                  required
                  rows={4}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Mention weight, size, whether washed in neutral detergent, and pickup details."
                  className="w-full px-3 py-2 text-sm bg-white border border-[#d2ded8] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#52776c] resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#dce5e0]">
                <button
                  type="button"
                  onClick={() => setShowListModal(false)}
                  className="px-4 py-2 text-xs font-medium text-[#4b635c] hover:bg-[#e4ece7] rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#3f6158] hover:bg-[#324f47] text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Publish Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default ResourceMarket;
