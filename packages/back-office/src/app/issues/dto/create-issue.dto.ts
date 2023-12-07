import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { ArrayMinSize, IsArray, IsDate, IsOptional, IsString } from 'class-validator'

export class CreateIssueDto {
  @ApiProperty()
  @IsArray()
  @ArrayMinSize(1)
  symptoms: string[]

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
