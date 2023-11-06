import { OmitType } from '@nestjs/mapped-types'
import { Symptom } from '../../symptoms/entities/symptom.entity'

export class IssueSymptomDocument extends OmitType(Symptom, ['id'] as const) {
  static collectionName = 'issues_symptoms'

  issueId: string
  symptomId: string
}
