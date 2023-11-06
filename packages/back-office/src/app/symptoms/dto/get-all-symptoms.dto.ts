import { PaginatedList, PaginatedListInput } from '../../../shared/types'
import { Symptom } from '../entities/symptom.entity'

export class SymptomsListInput extends PaginatedListInput {}

export class SymptomsList extends PaginatedList<Symptom> {}
