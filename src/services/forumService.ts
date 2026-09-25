import { 
  collection, 
  getDocs, 
  setDoc, 
  doc, 
  query, 
  orderBy, 
  onSnapshot, 
  updateDoc, 
  increment 
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { handleFirestoreError, OperationType } from '../firebase/errors';
import { SEED_POSTS, SeedPost } from '../data/seedData';

export interface ForumPostItem extends SeedPost {
  isLocalOnly?: boolean;
}

export interface ForumCommentItem {
  id: string;
  postId: string;
  content: string;
  authorId: string;
  authorName: string;
  authorKommune: string;
  createdAt: string;
}

const POSTS_PATH = 'posts';

export class ForumService {
  /**
   * Listen to real-time posts or fallback to seed data
   */
  static subscribeToPosts(
    categoryFilter: string | null,
    kommuneFilter: string | null,
    callback: (posts: ForumPostItem[]) => void
  ): () => void {
    const q = query(collection(db, POSTS_PATH));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        let loaded: ForumPostItem[] = [];
        if (!snapshot.empty) {
          snapshot.forEach((docSnap) => {
            loaded.push({ id: docSnap.id, ...docSnap.data() } as ForumPostItem);
          });
        }

        // Merge with seed posts if remote is empty or partial
        const existingIds = new Set(loaded.map(p => p.id));
        const combined = [
          ...loaded,
          ...SEED_POSTS.filter(sp => !existingIds.has(sp.id))
        ];

        // Apply filters
        let filtered = combined;
        if (categoryFilter && categoryFilter !== 'all') {
          filtered = filtered.filter(p => p.category === categoryFilter);
        }
        if (kommuneFilter && kommuneFilter !== 'all') {
          filtered = filtered.filter(p => p.authorKommune.toLowerCase() === kommuneFilter.toLowerCase());
        }

        // Sort by newest
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        callback(filtered);
      },
      (error) => {
        console.warn('Firestore subscription error (using local seed data):', error);
        // Fallback to seed data filtered
        let filtered = [...SEED_POSTS];
        if (categoryFilter && categoryFilter !== 'all') {
          filtered = filtered.filter(p => p.category === categoryFilter);
        }
        if (kommuneFilter && kommuneFilter !== 'all') {
          filtered = filtered.filter(p => p.authorKommune.toLowerCase() === kommuneFilter.toLowerCase());
        }
        callback(filtered);
      }
    );

    return unsubscribe;
  }

  /**
   * Create a new forum post
   */
  static async createPost(post: Omit<ForumPostItem, 'id' | 'likesCount' | 'commentsCount'>): Promise<ForumPostItem> {
    const newId = `post-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newPost: ForumPostItem = {
      ...post,
      id: newId,
      likesCount: 0,
      commentsCount: 0,
      createdAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, POSTS_PATH, newId), newPost);
      return newPost;
    } catch (error) {
      console.warn('Firestore write failed, falling back to local creation:', error);
      // Return local post so UI still functions seamlessly
      return { ...newPost, isLocalOnly: true };
    }
  }

  /**
   * Add a comment to a post
   */
  static async addComment(
    postId: string, 
    comment: Omit<ForumCommentItem, 'id' | 'postId' | 'createdAt'>
  ): Promise<ForumCommentItem> {
    const commentId = `comment-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const fullComment: ForumCommentItem = {
      ...comment,
      id: commentId,
      postId,
      createdAt: new Date().toISOString()
    };

    const commentPath = `posts/${postId}/comments/${commentId}`;
    try {
      await setDoc(doc(db, `posts/${postId}/comments`, commentId), fullComment);
      // Increment commentsCount on parent post
      await updateDoc(doc(db, POSTS_PATH, postId), {
        commentsCount: increment(1)
      });
    } catch (error) {
      console.warn('Comment write error:', error);
    }

    return fullComment;
  }

  /**
   * Load comments for a post
   */
  static async getComments(postId: string): Promise<ForumCommentItem[]> {
    const path = `posts/${postId}/comments`;
    try {
      const snap = await getDocs(collection(db, path));
      if (!snap.empty) {
        const comments: ForumCommentItem[] = [];
        snap.forEach(d => comments.push({ id: d.id, ...d.data() } as ForumCommentItem));
        return comments;
      }
    } catch (error) {
      console.warn('Could not fetch comments from firestore:', error);
    }

    // Check seed posts
    const seed = SEED_POSTS.find(p => p.id === postId);
    if (seed?.comments) {
      return seed.comments.map(c => ({
        id: c.id,
        postId,
        content: c.content,
        authorId: 'seed-author',
        authorName: c.authorName,
        authorKommune: c.authorKommune,
        createdAt: c.createdAt
      }));
    }

    return [];
  }

  /**
   * Like a post
   */
  static async toggleLike(postId: string): Promise<void> {
    try {
      await updateDoc(doc(db, POSTS_PATH, postId), {
        likesCount: increment(1)
      });
    } catch (error) {
      console.warn('Like update error:', error);
    }
  }
}
