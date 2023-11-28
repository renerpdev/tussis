import { BaseEntity } from '../../../shared/types'
import { Med } from '../../meds/entities/med.entity'
import { Symptom } from '../../symptoms/entities/symptom.entity'

export class Issue extends BaseEntity {
  symptoms: Symptom[]
  meds: Med[]
  date: string
  uid: string
  notes?: string
}
