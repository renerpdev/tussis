import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsOptional, IsString } from 'class-validator'

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  displayName: string

  @ApiProperty()
  @IsString()
  email: string

  @ApiProperty()
  @IsString()
  password: string

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  emailVerified?: boolean

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  disabled?: boolean

  @ApiProperty()
  @IsString()
  @IsOptional()
  photoUrl?: string
}
