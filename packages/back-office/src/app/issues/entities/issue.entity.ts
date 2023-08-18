import { Timestamp } from 'firebase-admin/firestore';

export class Issue {
  id: string;
  symptomId: string;
  date: Timestamp;
  notes?: string;
}
