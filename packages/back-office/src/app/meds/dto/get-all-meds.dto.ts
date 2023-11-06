import { PaginatedList, PaginatedListInput } from '../../../shared/types'
import { Med } from '../entities/med.entity'

export class MedsListInput extends PaginatedListInput {}

export class MedsList extends PaginatedList<Med> {}
