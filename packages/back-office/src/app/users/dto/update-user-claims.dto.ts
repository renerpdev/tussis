import { ApiProperty } from '@nestjs/swagger'
import { IsIn, IsString } from 'class-validator'

export class UpdateUserClaimsDto {
  @ApiProperty()
  @IsString()
  @IsIn(['admin', 'editor'])
  role: string
}
