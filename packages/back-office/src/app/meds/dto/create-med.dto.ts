import { ApiProperty } from '@nestjs/swagger';

export class CreateMedDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  desc?: string;
}
