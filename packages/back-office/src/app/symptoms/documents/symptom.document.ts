import { OmitType } from '@nestjs/mapped-types';
import { Symptom } from '../entities/symptom.entity';

export class SymptomDocument extends OmitType(Symptom, ['id'] as const) {
  static collectionName = 'symptoms';
}
