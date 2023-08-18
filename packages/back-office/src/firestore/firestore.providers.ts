import { IssueDocument } from '../app/issues/documents/issues.document';
import { SymptomDocument } from '../app/symptoms/documents/symptom.document';

export const FirestoreDatabaseProvider = 'firestoredb';
export const FirestoreOptionsProvider = 'firestoreOptions';
export const FirestoreCollectionProviders: string[] = [
  IssueDocument.collectionName,
  SymptomDocument.collectionName,
];
