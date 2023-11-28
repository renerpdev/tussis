import { ApiProperty } from '@nestjs/swagger'
import { IsIn, IsOptional, IsString, Matches } from 'class-validator'
import { DEFAULT_DATE_FORMAT, TimeFrequency } from '../../../shared/types'
import { IssueReport } from '../entities/issue-report.entity'

export class IssuesReportInput {
  @ApiProperty({
    description: `Allows for ranging by date using ${DEFAULT_DATE_FORMAT}:${DEFAULT_DATE_FORMAT}`,
    required: false,
  })
  @Matches(RegExp('(\\d{4}-\\d{1,2}-\\d{1,2}):\\d{4}-\\d{1,2}-\\d{1,2}'), {
    message: `Date Range must be in the format of ${DEFAULT_DATE_FORMAT}:${DEFAULT_DATE_FORMAT}`,
  })
  @IsString()
  @IsOptional()
  range?: string

  @ApiProperty({
    description: `Describes the frequency of the report`,
    required: false,
  })
  @IsIn(Object.values(TimeFrequency), {
    message: `The frequency must be one of ${Object.values(TimeFrequency).join(', ')}`,
  })
  @IsString()
  @IsOptional()
  frequency?: string
}

export class IssuesReportList {
  total: number
  data: IssueReport
}
