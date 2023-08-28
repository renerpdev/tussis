import { PaginatedList, PaginatedListInput } from '../../../shared/types';
import { SymptomDocument } from '../documents/symptom.document';

export class SymptomsListInput extends PaginatedListInput {}

export class SymptomsList extends PaginatedList<SymptomDocument> {}
