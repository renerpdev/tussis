import { Timestamp } from '@google-cloud/firestore';

export class IssueDocument {
  static collectionName = 'issues';

  symptomId: string;
  date: Timestamp;
  notes?: string;
}
