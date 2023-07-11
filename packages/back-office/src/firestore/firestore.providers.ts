import { IssueDocument } from '../issues/documents/issues.document';
import { SymptomDocument } from '../symptoms/documents/symptom.document';

export const FirestoreDatabaseProvider = 'firestoredb';
export const FirestoreOptionsProvider = 'firestoreOptions';
export const FirestoreCollectionProviders: string[] = [
  IssueDocument.collectionName,
  SymptomDocument.collectionName,
];
