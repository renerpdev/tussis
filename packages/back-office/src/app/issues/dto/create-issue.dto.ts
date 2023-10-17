import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsArray, IsDate, IsOptional, IsString } from 'class-validator'

export class CreateIssueDto {
  @ApiProperty()
  @IsArray()
  symptoms: string[]

  @ApiProperty()
  @IsArray()
  meds: string[]

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  date: Date

  @IsOptional()
  @IsString()
  @ApiProperty()
  notes?: string
}
