# NeuroConnect DK - Firestore Security Specification

## 1. Data Invariants
1. **UserProfile Invariant**: A user profile document `/users/{userId}` can only be created and updated by the authenticated user whose `request.auth.uid == userId`. Email must match the authenticated token.
2. **ForumPost Invariant**: A post can be read by any signed-in user or guest community member. Creation requires `request.auth.uid == incoming().authorId`. Deletion requires the author. Updates are restricted to author or atomic counter increments (`commentsCount`, `likesCount`).
3. **ForumComment Invariant**: Comments in `/posts/{postId}/comments/{commentId}` require `request.auth.uid == incoming().authorId` and valid parent post.
4. **CommunityEvent Invariant**: Events can be read publicly. Creation requires authenticated user with `incoming().createdBy == request.auth.uid`. Event coordinators or original creator can update details.
5. **No Blind Admin Rights**: User cannot spoof roles. Non-PII publicly shared details (Kommune, preferred language, display name) are scoped.

## 2. The Dirty Dozen Payloads (Target Rejections)
1. **Attacker writes to someone else's UserProfile**: `request.auth.uid = "user_abc"` writing to `/users/user_xyz` -> REJECTED (Permission Denied).
2. **Impersonate author in post**: `request.auth.uid = "attacker"` sending `authorId: "innocent_parent"` -> REJECTED.
3. **Excessive payload size / Wallet exhaustion**: `content: "a".repeat(20000)` in post -> REJECTED (Max length 5000).
4. **Altering immutable fields**: Changing `createdAt` or `authorId` on an existing post -> REJECTED.
5. **ID Poisoning**: Document ID with path traversal or illegal characters `../admin` -> REJECTED.
6. **Unauthenticated Event Creation**: Guest user posting an event -> REJECTED.
7. **Ghost Field Injection in User Profile**: Adding `isAdmin: true` or `systemBypass: true` -> REJECTED by strict keys validation.
8. **Comment with mismatched author**: `authorId != request.auth.uid` -> REJECTED.
9. **Event coordinate injection**: Coordinates out of realistic bounds or non-numbers -> REJECTED.
10. **Altering another user's event**: Non-creator editing an event's address -> REJECTED.
11. **Negative counters**: Attempting to set `likesCount: -999` -> REJECTED.
12. **Comment on nonexistent post**: Adding comment to an invalid path -> REJECTED.
