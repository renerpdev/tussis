import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class CreateSymptomDto {
  @ApiProperty()
  @IsString()
  name: string

  @ApiProperty()
  @IsOptional()
  desc?: string
}
