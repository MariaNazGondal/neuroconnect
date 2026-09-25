import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase/config';
import { Send, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';

/**
 * CreatePost Component
 * Submits a new post to the 'posts' collection in Firestore.
 * 
 * IMPORTANT: It ONLY writes the raw `content`, `authorId`, and `createdAt` fields
 * so the Firebase Extension (firestore-translate-text) cleanly intercepts the document
 * create event and appends the `translations` map field automatically in the cloud.
 *
 * @param {Object} props
 * @param {string} [props.authorId] - Optional current user ID override
 * @param {Function} [props.onPostCreated] - Callback invoked with the new document ID
 */
export function CreatePost({ authorId, onPostCreated }) {
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    // Use passed authorId or current logged-in user
    const currentUid = authorId || auth.currentUser?.uid || 'user_anonymous';

    setSubmitting(true);
    setErrorMsg(null);

    try {
      /**
       * CRITICAL: We ONLY write the raw `content`, `authorId`, and serverTimestamp.
       * Do NOT write any client-generated `translations` object so the extension
       * triggers properly without schema conflicts.
       */
      const docRef = await addDoc(collection(db, 'posts'), {
        content: content.trim(),
        authorId: currentUid,
        createdAt: serverTimestamp(),
      });

      setContent('');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);

      if (onPostCreated) {
        onPostCreated(docRef.id);
      }
    } catch (err) {
      console.error('Error submitting forum post:', err);
      setErrorMsg('Failed to post. Please verify your connection and try again.');
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
            Write in your comfortable language. Cloud auto-translation will translate your post for other families.
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
          <span>Post published! Cloud translations are processing automatically.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <textarea
            required
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your experience (e.g. Mit barn fik tildelt en plads i specialskole i dag)..."
            className="w-full px-4 py-3 text-sm bg-white border border-[#d2ded8] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#52776c] placeholder:text-[#8ba29a] resize-none transition-all leading-relaxed text-[#233530]"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-1.5 text-xs text-[#638077]">
            <Sparkles className="w-3.5 h-3.5 text-[#517b6f]" />
            <span>Automatic multilingual translation via Firebase Extension</span>
          </div>

          <button
            type="submit"
            disabled={submitting || !content.trim()}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#3e6057] hover:bg-[#314e46] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{submitting ? 'Sharing...' : 'Publish Post'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreatePost;
