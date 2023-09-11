import { OmitType } from '@nestjs/mapped-types';
import { Med } from '../entities/med.entity';

export class MedDocument extends OmitType(Med, ['id'] as const) {
  static collectionName = 'meds';
}
