import { BaseEntity } from '../../../shared/types/base-entity';

export class Symptom extends BaseEntity {
  name: string;
  desc?: string;
}
