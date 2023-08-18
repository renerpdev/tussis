import { ApiProperty } from '@nestjs/swagger';

export class CreateIssueDto {
  @ApiProperty()
  symptomId: string;

  @ApiProperty()
  date: string;

  @ApiProperty()
  notes?: string;
}
