import { Timestamp } from 'firebase-admin/firestore';

export interface Issue {
  id: string;
  symptomId: string;
  date: Timestamp;
  notes?: string;
}
