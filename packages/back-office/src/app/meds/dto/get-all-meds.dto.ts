import { PaginatedList, PaginatedListInput } from '../../../shared/types';
import { MedDocument } from '../documents/med.document';

export class MedsListInput extends PaginatedListInput {}

export class MedsList extends PaginatedList<MedDocument> {}
