import { OmitType } from '@nestjs/mapped-types'
import { Med } from '../../meds/entities/med.entity'

export class IssueMedDocument extends OmitType(Med, ['id'] as const) {
  static collectionName = 'issues_meds'

  issueId: string
  medId: string
}
