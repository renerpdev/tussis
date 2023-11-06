import { IssueDocument } from '../app/issues/documents/issues.document'
import { IssueMedDocument } from '../app/issues/documents/issues_meds.document'
import { IssueSymptomDocument } from '../app/issues/documents/issues_symptoms.document'
import { MedDocument } from '../app/meds/documents/med.document'
import { SymptomDocument } from '../app/symptoms/documents/symptom.document'

export const FirestoreDatabaseProvider = 'firestoredb'
export const FirestoreOptionsProvider = 'firestoreOptions'
export const FirestoreCollectionProviders: string[] = [
  IssueDocument.collectionName,
  SymptomDocument.collectionName,
  MedDocument.collectionName,
  IssueMedDocument.collectionName,
  IssueSymptomDocument.collectionName,
]
