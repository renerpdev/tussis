import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString, MinLength } from 'class-validator'

export class CreateMedDto {
  @ApiProperty()
  @IsString()
  @MinLength(3)
  name: string

  @ApiProperty()
  @IsOptional()
  desc?: string
}
