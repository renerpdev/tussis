import { BaseModel } from './index'
import { Med } from './med.model'
import { Symptom } from './symptom.model'

export interface Issue extends BaseModel {
  symptoms: Symptom[]
  meds: Med[]
  date: string
  notes?: string
}
