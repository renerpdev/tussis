import { BaseEntity } from '../../../shared/types/base-entity'

export class Issue extends BaseEntity {
  symptoms: string[]
  meds: string[]
  date: string
  notes?: string
}
