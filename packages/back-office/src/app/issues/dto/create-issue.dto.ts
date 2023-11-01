import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsArray, IsDate, IsOptional, IsString } from 'class-validator'

export class CreateIssueDto {
  @ApiProperty()
  @IsArray()
  symptoms: string[]

  @IsOptional()
  @ApiProperty()
  @IsArray()
  meds?: string[]

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  date: string

  @IsOptional()
  @IsString()
  @ApiProperty()
  notes?: string
}
