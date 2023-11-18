import { ApiProperty } from '@nestjs/swagger'
import { IsIn } from 'class-validator'

export class UpdateUserClaimsDto {
  @ApiProperty()
  @IsIn(['admin', 'editor', null])
  role: string
}
