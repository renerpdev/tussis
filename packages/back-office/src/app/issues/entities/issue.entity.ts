import { Timestamp } from 'firebase-admin/firestore';

export class Issue {
  id: string;
  symptoms: string[];
  date: Timestamp;
  notes?: string;
}
