import { Injectable, Scope } from '@nestjs/common';
import { CreateSymptomDto } from './dto/create-symptom.dto';
import { UpdateSymptomDto } from './dto/update-symptom.dto';
// TODO: remove this import later
import { randomUUID } from 'crypto';
import { Symptom } from './entities/symptom.entity';

@Injectable({ scope: Scope.DEFAULT })
export class SymptomsService {
  private readonly symptoms: Symptom[] = [];

  create(createSymptomDto: CreateSymptomDto): Symptom {
    const newSymptom: Symptom = {
      id: randomUUID(),
      ...createSymptomDto,
    };
    this.symptoms.push(newSymptom);

    return newSymptom;
  }

  findAll(): Symptom[] {
    return this.symptoms;
  }

  findOne(id: string): Symptom {
    const existingSymptom = this.symptoms.find((s) => s.id === id);
    if (!existingSymptom) {
      throw new Error();
    }
    return existingSymptom;
  }

  update(id: string, updateSymptomDto: UpdateSymptomDto): Symptom {
    const symptomIndex = this.symptoms.findIndex((s) => s.id === id);
    const existingSymptom = this.symptoms[symptomIndex];
    if (!existingSymptom) {
      throw new Error();
    }

    const updatedSymptom: Symptom = {
      ...existingSymptom,
      ...updateSymptomDto,
    };

    this.symptoms.splice(symptomIndex, 1, updatedSymptom);

    return updatedSymptom;
  }

  remove(id: string): Symptom {
    const symptomIndex = this.symptoms.findIndex((s) => s.id === id);
    const existingSymptom = this.symptoms[symptomIndex];

    this.symptoms.splice(symptomIndex, 1);

    return existingSymptom;
  }
}
