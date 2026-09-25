import { 
  collection, 
  getDocs, 
  setDoc, 
  doc, 
  onSnapshot 
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { SEED_EVENTS, SeedEvent } from '../data/seedData';
import { DANISH_KOMMUNER } from '../data/danishMunicipalities';

export interface EventItem extends SeedEvent {
  isLocalOnly?: boolean;
}

const EVENTS_PATH = 'events';

export class EventService {
  /**
   * Listen to real-time events with fallback to seed data
   */
  static subscribeToEvents(
    kommuneFilter: string | null,
    sunflowerOnly: boolean,
    callback: (events: EventItem[]) => void
  ): () => void {
    const q = collection(db, EVENTS_PATH);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const loaded: EventItem[] = [];
        if (!snapshot.empty) {
          snapshot.forEach((docSnap) => {
            loaded.push({ id: docSnap.id, ...docSnap.data() } as EventItem);
          });
        }

        const existingIds = new Set(loaded.map(e => e.id));
        const combined = [
          ...loaded,
          ...SEED_EVENTS.filter(se => !existingIds.has(se.id))
        ];

        let filtered = combined;
        if (kommuneFilter && kommuneFilter !== 'all') {
          filtered = filtered.filter(e => e.kommune.toLowerCase() === kommuneFilter.toLowerCase());
        }
        if (sunflowerOnly) {
          filtered = filtered.filter(e => e.isSunflowerLanyardFriendly);
        }

        callback(filtered);
      },
      (error) => {
        console.warn('Events firestore error (using seed data):', error);
        let filtered = [...SEED_EVENTS];
        if (kommuneFilter && kommuneFilter !== 'all') {
          filtered = filtered.filter(e => e.kommune.toLowerCase() === kommuneFilter.toLowerCase());
        }
        if (sunflowerOnly) {
          filtered = filtered.filter(e => e.isSunflowerLanyardFriendly);
        }
        callback(filtered);
      }
    );

    return unsubscribe;
  }

  /**
   * Create an event with coordinates
   */
  static async createEvent(
    data: Omit<EventItem, 'id' | 'createdAt'>
  ): Promise<EventItem> {
    const newId = `event-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    
    // Resolve coordinates if missing or defaulted: pick from Kommune reference
    let lat = data.latitude;
    let lng = data.longitude;
    if (!lat || !lng || (lat === 0 && lng === 0)) {
      const matchKommune = DANISH_KOMMUNER.find(k => k.name.toLowerCase() === data.kommune.toLowerCase());
      if (matchKommune) {
        // Add tiny jitter so multiple pins in same kommune don't stack exactly on top of each other
        lat = matchKommune.lat + (Math.random() - 0.5) * 0.02;
        lng = matchKommune.lng + (Math.random() - 0.5) * 0.02;
      } else {
        lat = 55.6761; // Default Copenhagen
        lng = 12.5683;
      }
    }

    const newEvent: EventItem = {
      ...data,
      id: newId,
      latitude: lat,
      longitude: lng,
      createdAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, EVENTS_PATH, newId), newEvent);
      return newEvent;
    } catch (error) {
      console.warn('Firestore event write failed, persisting locally:', error);
      return { ...newEvent, isLocalOnly: true };
    }
  }
}
