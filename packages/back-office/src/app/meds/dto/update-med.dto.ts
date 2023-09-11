import { PartialType } from '@nestjs/swagger';
import { CreateMedDto } from './create-med.dto';

export class UpdateMedDto extends PartialType(CreateMedDto) {}
