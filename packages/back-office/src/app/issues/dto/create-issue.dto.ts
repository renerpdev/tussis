import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsArray, IsDate, IsOptional, IsString } from 'class-validator'

export class CreateIssueDto {
  @ApiProperty()
  @IsOptional()
  @IsArray()
  symptoms?: string[]

  @ApiProperty()
  @IsOptional()
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
