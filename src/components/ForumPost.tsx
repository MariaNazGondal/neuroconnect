import React, { useState } from 'react';
import { Globe, Heart, MessageSquare, MapPin, Sparkles, Loader2, ArrowRightLeft } from 'lucide-react';

export interface ForumPostData {
  id: string;
  authorId: string;
  authorName?: string;
  authorKommune?: string;
  title?: string;
  content: string;
  createdAt: any;
  translations?: Record<string, string>;
  likesCount?: number;
  commentsCount?: number;
  category?: string;
}

interface ForumPostProps {
  post: ForumPostData;
  currentUserLanguage: string; // 2-letter code, e.g. 'en', 'ar', 'ur', 'so', 'da'
  onLike?: (postId: string) => void;
  onCommentClick?: (postId: string) => void;
}

export const ForumPost: React.FC<ForumPostProps> = ({
  post,
  currentUserLanguage = 'en',
  onLike,
  onCommentClick,
}) => {
  // If translation for user's language exists in post.translations, show translated by default
  const hasTranslation = Boolean(post.translations && post.translations[currentUserLanguage]);
  const [showOriginal, setShowOriginal] = useState(false);

  // Formatted date
  const dateDisplay = post.createdAt?.toDate 
    ? post.createdAt.toDate().toLocaleDateString('da-DK', { month: 'short', day: 'numeric', year: 'numeric' })
    : typeof post.createdAt === 'string'
      ? new Date(post.createdAt).toLocaleDateString('da-DK', { month: 'short', day: 'numeric', year: 'numeric' })
      : 'Just now';

  // Determine which text to display
  const translatedContent = post.translations?.[currentUserLanguage];
  const displayedContent = (!showOriginal && hasTranslation && translatedContent) 
    ? translatedContent 
    : post.content;

  // Language display name helper
  const getLanguageLabel = (code: string) => {
    const map: Record<string, string> = {
      en: 'English',
      da: 'Dansk',
      ar: 'العربية (Arabic)',
      ur: 'اردو (Urdu)',
      so: 'Soomaali (Somali)',
      uk: 'Українська (Ukrainian)',
      tr: 'Türkçe (Turkish)',
      pl: 'Polski (Polish)',
      fa: 'فارسی (Persian)'
    };
    return map[code] || code.toUpperCase();
  };

  return (
    <article className="bg-white rounded-2xl border border-[#d6e2dc] p-5 sm:p-6 shadow-xs hover:border-[#b8cfc5] transition-all">
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#dbeae3] text-[#305349] font-bold text-xs flex items-center justify-center">
            {(post.authorName || 'P').charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[#1f312c]">{post.authorName || 'Parent'}</span>
              {post.authorKommune && (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#4b665f] bg-[#eef4f0] px-2 py-0.5 rounded-md">
                  <MapPin className="w-3 h-3 text-[#587e73]" />
                  {post.authorKommune}
                </span>
              )}
            </div>
            <span className="text-[11px] text-[#78918a]">{dateDisplay}</span>
          </div>
        </div>

        {/* Translation Status Pill */}
        <div className="flex items-center gap-1.5">
          {hasTranslation ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#e7f3ec] text-[#2c5246] border border-[#c6e2d3]">
              <Globe className="w-3 h-3 text-[#396558]" />
              <span>{getLanguageLabel(currentUserLanguage)}</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#f0f4f2] text-[#55716a] border border-[#d8e4de]">
              <Loader2 className="w-3 h-3 animate-spin text-[#64827a]" />
              <span>Translating...</span>
            </span>
          )}
        </div>
      </div>

      {/* Post Title if present */}
      {post.title && (
        <h3 className="text-base sm:text-lg font-bold text-[#1e2f2a] mb-2 leading-snug">
          {post.title}
        </h3>
      )}

      {/* Main Content Body */}
      <div className="text-sm text-[#3b524c] whitespace-pre-line leading-relaxed mb-4">
        {displayedContent}
      </div>

      {/* Footer / Toggle & Interactions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#e2ece7] text-xs">
        {/* Toggle between translation and original */}
        <div>
          {hasTranslation ? (
            <button
              onClick={() => setShowOriginal(!showOriginal)}
              className="inline-flex items-center gap-1.5 py-1 text-xs font-semibold text-[#3b5d53] hover:text-[#1b302a] hover:underline transition-colors"
            >
              <ArrowRightLeft className="w-3 h-3 text-[#567a70]" />
              <span>{showOriginal ? 'See translation' : 'See original'}</span>
            </button>
          ) : (
            <span className="text-[11px] text-[#78918a] italic flex items-center gap-1">
              <span>Automatic translation will appear shortly</span>
            </span>
          )}
        </div>

        {/* Like and comment counters */}
        <div className="flex items-center gap-2">
          {onLike && (
            <button
              onClick={() => onLike(post.id)}
              className="flex items-center gap-1 px-3 py-1 rounded-xl bg-[#f0f4f2] hover:bg-[#faeded] text-[#4d6760] hover:text-[#7f3939] font-medium transition-colors"
            >
              <Heart className="w-3.5 h-3.5 text-[#728f87]" />
              <span>{post.likesCount || 0}</span>
            </button>
          )}

          {onCommentClick && (
            <button
              onClick={() => onCommentClick(post.id)}
              className="flex items-center gap-1 px-3 py-1 rounded-xl bg-[#f0f4f2] hover:bg-[#e2ebe6] text-[#365149] font-medium transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#517369]" />
              <span>{post.commentsCount || 0} Replies</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
};
