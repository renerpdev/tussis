import { ApiProperty } from '@nestjs/swagger';

export class CreateSymptomDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  desc?: string;
}
