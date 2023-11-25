import { ApiProperty } from '@nestjs/swagger'
import { IsIn, IsOptional, IsString, MinLength } from 'class-validator'

export class UpdateUserClaimsDto {
  @ApiProperty()
  @IsIn(['admin', 'editor', 'supervisor', null])
  role: string

  @ApiProperty()
  @IsOptional()
  @MinLength(3)
  @IsString()
  supervisedUid?: string
}
