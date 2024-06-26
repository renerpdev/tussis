import { OmitType } from '@nestjs/mapped-types'
import { Issue } from '../entities/issue.entity'

export class IssueDocument extends OmitType(Issue, ['id', 'symptoms', 'meds'] as const) {
  static collectionName = 'issues'
}
