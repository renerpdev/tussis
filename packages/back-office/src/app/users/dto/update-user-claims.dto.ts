import { ApiProperty } from '@nestjs/swagger'
import { IsIn, IsString } from 'class-validator'
import { AuthUser } from '../../../shared/types/auth.types'

export class UpdateUserClaimsDto {
  @ApiProperty()
  @IsString()
  uid: string

  @ApiProperty()
  @IsIn(['admin', 'editor'])
  role: AuthUser['role']
}
