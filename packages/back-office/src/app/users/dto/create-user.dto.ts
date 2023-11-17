import { ApiProperty } from '@nestjs/swagger'
import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  IsStrongPassword,
  IsUrl,
  MinLength,
} from 'class-validator'

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @MinLength(3)
  displayName: string

  @ApiProperty()
  @IsEmail()
  email: string

  @ApiProperty()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
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
  @IsUrl()
  @IsOptional()
  photoUrl?: string
}
