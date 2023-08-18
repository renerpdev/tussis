import { ApiProperty } from '@nestjs/swagger';

export class CreateIssueDto {
  @ApiProperty()
  symptoms: string[];

  @ApiProperty()
  date: string;

  @ApiProperty()
  notes?: string;
}
