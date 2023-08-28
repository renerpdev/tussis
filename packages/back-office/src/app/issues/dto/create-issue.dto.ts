import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDate, IsOptional, IsString } from 'class-validator';

export class CreateIssueDto {
  @ApiProperty()
  @IsArray()
  symptoms: string[];

  @ApiProperty()
  @IsDate()
  date: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  notes?: string;
}
