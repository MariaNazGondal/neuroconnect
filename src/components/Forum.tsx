import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Plus, 
  MapPin, 
  Globe, 
  Heart, 
  Share2, 
  Search, 
  Filter, 
  Sparkles, 
  Send, 
  User, 
  CheckCircle,
  HelpCircle,
  School,
  TreePine,
  Users,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ForumService, ForumPostItem, ForumCommentItem } from '../services/forumService';
import { translateText, LANGUAGE_LABELS } from '../services/translationService';
import { DANISH_KOMMUNER, SUPPORTED_LANGUAGES } from '../data/danishMunicipalities';

const CATEGORIES = [
  { id: 'all', label: 'All Discussions', icon: MessageSquare, desc: 'All community topics' },
  { id: 'ppr_viso', label: 'PPR & VISO Navigation', icon: HelpCircle, desc: 'Assessments, case workers, appeals & rights' },
  { id: 'school_education', label: 'School & Education', icon: School, desc: 'Specialklasser, support hours & daycare' },
  { id: 'sensory_places', label: 'Sensory-Friendly Places', icon: TreePine, desc: 'Quiet parks, playgrounds & low-noise spaces' },
  { id: 'local_meetups', label: 'Local Meetups', icon: Users, desc: 'Parent circles, coffee catchups & family play' }
];

export const Forum: React.FC<{ onOpenAuth: () => void }> = ({ onOpenAuth }) => {
  const { profile } = useAuth();
  const [posts, setPosts] = useState<ForumPostItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedKommune, setSelectedKommune] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Post translation state map: { [postId]: { title: string, content: string, translated: boolean, lang: string } }
  const [translations, setTranslations] = useState<Record<string, { title: string; content: string; lang: string }>>({});
  const [translatingPostId, setTranslatingPostId] = useState<string | null>(null);

  // Comments state map: { [postId]: ForumCommentItem[] }
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [commentsMap, setCommentsMap] = useState<Record<string, ForumCommentItem[]>>({});
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [submittingComment, setSubmittingComment] = useState<string | null>(null);

  // New post modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<'ppr_viso' | 'school_education' | 'sensory_places' | 'local_meetups'>('ppr_viso');
  const [newKommune, setNewKommune] = useState(profile?.kommune || 'København');
  const [creating, setCreating] = useState(false);

  const preferredLang = profile?.preferredLanguage || 'en';
  const preferredLangObj = SUPPORTED_LANGUAGES.find(l => l.code === preferredLang) || SUPPORTED_LANGUAGES[0];

  // Subscribe to posts
  useEffect(() => {
    const unsub = ForumService.subscribeToPosts(
      selectedCategory,
      selectedKommune,
      (fetched) => {
        setPosts(fetched);
      }
    );
    return () => unsub();
  }, [selectedCategory, selectedKommune]);

  // Load comments when accordion expanded
  const toggleComments = async (postId: string) => {
    const isExpanded = !!expandedComments[postId];
    setExpandedComments(prev => ({ ...prev, [postId]: !isExpanded }));

    if (!isExpanded && !commentsMap[postId]) {
      const items = await ForumService.getComments(postId);
      setCommentsMap(prev => ({ ...prev, [postId]: items }));
    }
  };

  const handleTranslate = async (post: ForumPostItem) => {
    // If already translated, toggle back
    if (translations[post.id]) {
      setTranslations(prev => {
        const copy = { ...prev };
        delete copy[post.id];
        return copy;
      });
      return;
    }

    try {
      setTranslatingPostId(post.id);
      const titleRes = await translateText(post.title, preferredLang, post.authorLanguage || 'en');
      const contentRes = await translateText(post.content, preferredLang, post.authorLanguage || 'en');
      
      setTranslations(prev => ({
        ...prev,
        [post.id]: {
          title: titleRes.translatedText,
          content: contentRes.translatedText,
          lang: preferredLang
        }
      }));
    } catch (err) {
      console.error('Translation failed:', err);
    } finally {
      setTranslatingPostId(null);
    }
  };

  const handleLike = async (postId: string) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, likesCount: (p.likesCount || 0) + 1 } : p));
    await ForumService.toggleLike(postId);
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) {
      onOpenAuth();
      return;
    }

    if (!newTitle.trim() || !newContent.trim()) return;

    setCreating(true);
    try {
      const created = await ForumService.createPost({
        title: newTitle,
        content: newContent,
        category: newCategory,
        authorId: profile.uid,
        authorName: profile.displayName || 'Parent',
        authorKommune: newKommune,
        authorLanguage: profile.preferredLanguage || 'en',
        createdAt: new Date().toISOString()
      });

      setPosts(prev => [created, ...prev]);
      setShowCreateModal(false);
      setNewTitle('');
      setNewContent('');
    } catch (err) {
      console.error('Failed to create post:', err);
    } finally {
      setCreating(false);
    }
  };

  const handleAddComment = async (postId: string) => {
    if (!profile) {
      onOpenAuth();
      return;
    }

    const text = commentInputs[postId]?.trim();
    if (!text) return;

    setSubmittingComment(postId);
    try {
      const newComment = await ForumService.addComment(postId, {
        content: text,
        authorId: profile.uid,
        authorName: profile.displayName || 'Parent',
        authorKommune: profile.kommune || 'København'
      });

      setCommentsMap(prev => ({
        ...prev,
        [postId]: [...(prev[postId] || []), newComment]
      }));

      setCommentInputs(prev => ({ ...prev, [postId]: '' }));

      // Update post counter
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, commentsCount: (p.commentsCount || 0) + 1 } : p));
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingComment(null);
    }
  };

  // Filter posts by search query if any
  const filteredPosts = posts.filter(p => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q) || p.authorKommune.toLowerCase().includes(q);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#e7efe9] via-[#edf4ef] to-[#f4f7f5] rounded-3xl p-6 sm:p-8 border border-[#d6e3dc] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#d5e4dc] rounded-full text-xs font-semibold text-[#2f4b43] mb-3">
              <span>🌻 Solsikke Safe Space</span>
              <span>•</span>
              <span>Multilingual Parent Channels</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1b2f29] tracking-tight">
              Community Discussion Channels
            </h1>
            <p className="text-sm text-[#4d665e] mt-2 max-w-2xl leading-relaxed">
              Connect with fellow immigrant parents across Denmark. Ask questions about PPR assessments, 
              find school inclusion experiences, discover quiet sensory spots, and exchange tips in your preferred language.
            </p>
          </div>

          <button
            onClick={() => {
              if (!profile) {
                onOpenAuth();
              } else {
                setShowCreateModal(true);
              }
            }}
            className="self-start md:self-center flex items-center gap-2 px-5 py-3 bg-[#3d5e55] hover:bg-[#304d45] text-white font-semibold text-sm rounded-2xl shadow-xs transition-all transform hover:-translate-y-0.5"
          >
            <Plus className="w-5 h-5" />
            <span>Start a Discussion</span>
          </button>
        </div>

        {/* Translation Banner Callout */}
        <div className="mt-6 pt-4 border-t border-[#d3e2db] flex flex-wrap items-center justify-between gap-3 text-xs text-[#48635b]">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#52776c]" />
            <span>
              All posts can be instantly translated into <strong>{preferredLangObj.name} ({preferredLangObj.flag})</strong> with one click.
            </span>
          </div>
          <span className="bg-white/80 px-2.5 py-1 rounded-lg border border-[#d6e2dc] text-[11px]">
            No robotic jargon • Sensory safe language
          </span>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {CATEGORIES.map(cat => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`p-3.5 rounded-2xl text-left border transition-all ${
                isSelected
                  ? 'bg-white border-[#4d6f65] ring-2 ring-[#4d6f65]/20 shadow-xs'
                  : 'bg-[#f0f4f1] border-[#d8e3dd] hover:bg-white text-[#415952]'
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-[#e2ede7] text-[#29453c]' : 'bg-[#e4ede8] text-[#557068]'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className={`text-xs font-bold leading-tight ${isSelected ? 'text-[#1a2d28]' : 'text-[#354c46]'}`}>
                  {cat.label}
                </span>
              </div>
              <p className="text-[11px] text-[#637d76] line-clamp-1">{cat.desc}</p>
            </button>
          );
        })}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-3 rounded-2xl border border-[#d8e3dd] shadow-xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-3 text-[#648078]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search discussions by keyword (e.g., 'PPR', 'specialklasse', 'playground', 'tolk')..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-[#f9fbf9] border border-[#dce6e0] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#52776c]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 bg-[#f5f8f6] px-3 py-2 rounded-xl border border-[#dce6e0] text-xs font-medium text-[#465f58] whitespace-nowrap">
            <MapPin className="w-3.5 h-3.5 text-[#5e8277]" />
            <span>Kommune:</span>
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

      {/* Posts List */}
      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#d8e3dd] p-8">
            <div className="w-12 h-12 rounded-full bg-[#e9f2ee] text-[#4d6f65] flex items-center justify-center mx-auto mb-3">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#1f312c]">No discussions found in this view</h3>
            <p className="text-xs text-[#5f7871] mt-1 max-w-md mx-auto">
              Be the first to share a question or advice for this category or municipality!
            </p>
            <button
              onClick={() => {
                if (!profile) onOpenAuth();
                else setShowCreateModal(true);
              }}
              className="mt-4 px-4 py-2 bg-[#42645b] text-white text-xs font-semibold rounded-xl"
            >
              Start New Topic
            </button>
          </div>
        ) : (
          filteredPosts.map(post => {
            const isTranslated = !!translations[post.id];
            const currentTitle = isTranslated ? translations[post.id].title : post.title;
            const currentBody = isTranslated ? translations[post.id].content : post.content;
            const comments = commentsMap[post.id] || (post.comments || []);
            const isExpanded = !!expandedComments[post.id];

            return (
              <div 
                key={post.id}
                className="bg-white rounded-2xl border border-[#d6e2dc] p-5 sm:p-6 shadow-xs hover:border-[#b8cfc5] transition-colors"
              >
                {/* Post Top Meta */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#dbeae3] text-[#305349] font-bold text-xs flex items-center justify-center">
                      {post.authorName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#1f312c]">{post.authorName}</span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#4b665f] bg-[#eef4f0] px-2 py-0.5 rounded-md">
                          <MapPin className="w-3 h-3 text-[#587e73]" />
                          {post.authorKommune}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#78918a]">
                        {new Date(post.createdAt).toLocaleDateString('da-DK', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  </div>

                  {/* Category Pill */}
                  <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-[#e8f1ec] text-[#33534a]">
                    {CATEGORIES.find(c => c.id === post.category)?.label || post.category}
                  </span>
                </div>

                {/* Translation Banner if Active */}
                {isTranslated && (
                  <div className="mb-3 px-3 py-1.5 bg-[#eaf4ef] border border-[#cbe1d6] rounded-xl text-xs text-[#2b4c42] flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Translated into {preferredLangObj.name} ({preferredLangObj.flag})</span>
                    </span>
                    <button
                      onClick={() => handleTranslate(post)}
                      className="text-[11px] font-semibold underline text-[#365c51] hover:text-[#19322b]"
                    >
                      Show Original
                    </button>
                  </div>
                )}

                {/* Post Content */}
                <h3 className="text-base sm:text-lg font-bold text-[#1e2f2a] mb-2 leading-snug">
                  {currentTitle}
                </h3>
                <div className="text-sm text-[#3b524c] whitespace-pre-line leading-relaxed mb-4">
                  {currentBody}
                </div>

                {/* Action Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#e2ece7] text-xs">
                  <div className="flex items-center gap-2">
                    {/* Translate Button */}
                    <button
                      onClick={() => handleTranslate(post)}
                      disabled={translatingPostId === post.id}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium transition-all ${
                        isTranslated
                          ? 'bg-[#3b5950] text-white'
                          : 'bg-[#f0f4f2] text-[#3d5951] hover:bg-[#e4ede8]'
                      }`}
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>
                        {translatingPostId === post.id 
                          ? 'Translating...' 
                          : isTranslated 
                            ? 'Original Language' 
                            : `Translate (${preferredLangObj.code.toUpperCase()})`}
                      </span>
                    </button>

                    {/* Like / Helpful button */}
                    <button
                      onClick={() => handleLike(post.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#f0f4f2] hover:bg-[#faeded] text-[#4d6760] hover:text-[#7f3939] font-medium transition-colors"
                    >
                      <Heart className="w-3.5 h-3.5 text-[#728f87]" />
                      <span>{post.likesCount || 0} Helpful</span>
                    </button>
                  </div>

                  {/* Comments accordion button */}
                  <button
                    onClick={() => toggleComments(post.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#f0f4f2] hover:bg-[#e2ebe6] text-[#365149] font-medium transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-[#517369]" />
                    <span>{comments.length || post.commentsCount || 0} Replies</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Comments Accordion Section */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-[#e2ece7] space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#57726a]">
                      Community Responses ({comments.length})
                    </h4>

                    {/* Existing Comments */}
                    {comments.length === 0 ? (
                      <p className="text-xs text-[#718b84] italic py-2">
                        No responses yet. Share your experience or advice below.
                      </p>
                    ) : (
                      <div className="space-y-2.5">
                        {comments.map((c: any) => (
                          <div 
                            key={c.id} 
                            className="bg-[#f7faf8] p-3 rounded-xl border border-[#dde7e2] text-xs space-y-1"
                          >
                            <div className="flex items-center justify-between text-[#536d66]">
                              <span className="font-bold text-[#233832]">{c.authorName} ({c.authorKommune || 'Kommune'})</span>
                              <span className="text-[10px] text-[#7e968f]">
                                {new Date(c.createdAt).toLocaleDateString('da-DK', { month: 'short', day: 'numeric' })}
                              </span>
                            </div>
                            <p className="text-[#304741] leading-relaxed">{c.content}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add Comment Input */}
                    <div className="pt-2 flex gap-2">
                      <input
                        type="text"
                        value={commentInputs[post.id] || ''}
                        onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleAddComment(post.id); }}
                        placeholder="Write an encouraging reply or helpful Danish tip..."
                        className="flex-1 px-3 py-2 text-xs bg-[#fbfdfb] border border-[#d5e0da] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#52776c]"
                      />
                      <button
                        onClick={() => handleAddComment(post.id)}
                        disabled={submittingComment === post.id}
                        className="px-4 py-2 bg-[#3e6057] hover:bg-[#314d45] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Reply</span>
                      </button>
                    </div>
                  </div>
                )}

              </div>
            );
          })
        )}
      </div>

      {/* Create Post Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1f2f2b]/40 backdrop-blur-xs">
          <div className="w-full max-w-xl bg-[#f8faf9] rounded-2xl border border-[#d3ded9] shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-[#eaf2ee] border-b border-[#dce6e1] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">🌻</span>
                <h2 className="text-base font-bold text-[#1f312c]">Start a New Discussion</h2>
              </div>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="p-1 text-[#5c7770] hover:text-[#21352f] rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#293e38] mb-1">
                  Discussion Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e: any) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-[#d2ded8] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#52776c]"
                >
                  <option value="ppr_viso">PPR & VISO Navigation (Assessments, case workers)</option>
                  <option value="school_education">School & Education (Specialklasser, support hours)</option>
                  <option value="sensory_places">Sensory-Friendly Places (Playgrounds, quiet venues)</option>
                  <option value="local_meetups">Local Meetups (Parent coffee, peer support)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#293e38] mb-1">
                  Discussion Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Questions regarding VISO second opinion in Gladsaxe..."
                  className="w-full px-3 py-2 text-sm bg-white border border-[#d2ded8] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#52776c]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#293e38] mb-1">
                  Relevant Danish Kommune
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
                  Details / Your Question or Experience
                </label>
                <textarea
                  required
                  rows={5}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Share details about what you are seeking or experiencing. You can write in English, Danish, or your native language; parents can translate it easily."
                  className="w-full px-3 py-2 text-sm bg-white border border-[#d2ded8] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#52776c] resize-none"
                />
              </div>

              <div className="pt-2 border-t border-[#dce5e0] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-medium text-[#4b635c] hover:bg-[#e4ece7] rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2 bg-[#3f6158] hover:bg-[#324f47] text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
                >
                  {creating ? 'Publishing...' : 'Publish Discussion'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
