import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase/config';
import { handleFirestoreError, OperationType } from '../firebase/errors';
import { Send, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';

interface CreatePostProps {
  authorId?: string;
  authorName?: string;
  authorKommune?: string;
  onPostCreated?: (newPostId: string) => void;
}

export const CreatePost: React.FC<CreatePostProps> = ({
  authorId,
  authorName,
  authorKommune,
  onPostCreated,
}) => {
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const currentUid = authorId || auth.currentUser?.uid || 'anonymous_parent';

    setSubmitting(true);
    setErrorMsg(null);

    try {
      /**
       * CRITICAL: We only write the raw 'content' field and 'authorId' (plus serverTimestamp & metadata).
       * We DO NOT write a 'translations' field on the client so that the
       * official Firebase extension (firestore-translate-text) cleanly intercepts
       * the write event and generates the translations map in the cloud.
       */
      const docRef = await addDoc(collection(db, 'posts'), {
        content: content.trim(),
        authorId: currentUid,
        authorName: authorName || auth.currentUser?.displayName || 'Parent Member',
        authorKommune: authorKommune || 'København',
        createdAt: serverTimestamp(),
        likesCount: 0,
        commentsCount: 0,
      });

      setContent('');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);

      if (onPostCreated) {
        onPostCreated(docRef.id);
      }
    } catch (err: unknown) {
      console.error('Error submitting post:', err);
      setErrorMsg('Could not share post right now. Please check your connection and try again.');
      try {
        handleFirestoreError(err, OperationType.CREATE, 'posts');
      } catch {
        // error logged
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#fcfdfc] rounded-2xl border border-[#d6e2dc] p-5 sm:p-6 shadow-xs">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">🌻</span>
        <div>
          <h3 className="text-sm font-bold text-[#1f312c]">Share with the Parent Community</h3>
          <p className="text-xs text-[#59756e]">
            Write in any language. Our automated translation system will translate your post for other families.
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-3 p-3 text-xs text-[#703b3b] bg-[#fdf0f0] border border-[#f0d0d0] rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {success && (
        <div className="mb-3 p-3 text-xs text-[#2b5446] bg-[#eef7f2] border border-[#cbe5d7] rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Post published! Automated translations are processing in real-time.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <textarea
            required
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your experience with PPR, school visitation, or ask about sensory-friendly spots in Denmark..."
            className="w-full px-4 py-3 text-sm bg-white border border-[#d2ded8] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#52776c] placeholder:text-[#8ba29a] resize-none transition-all leading-relaxed text-[#233530]"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-1.5 text-xs text-[#638077]">
            <Sparkles className="w-3.5 h-3.5 text-[#517b6f]" />
            <span>Real-time multi-language translation enabled</span>
          </div>

          <button
            type="submit"
            disabled={submitting || !content.trim()}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#3e6057] hover:bg-[#314e46] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{submitting ? 'Sharing...' : 'Publish Post'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
