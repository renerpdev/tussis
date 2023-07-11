import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Scope,
} from '@nestjs/common';
import { randomUUID } from 'crypto';

import { CreateSymptomDto } from './dto/create-symptom.dto';
import { UpdateSymptomDto } from './dto/update-symptom.dto';
import { SymptomDocument } from './documents/symptom.document';
import { CollectionReference } from 'firebase-admin/firestore';
import { Symptom } from './entities/symptom.entity';

@Injectable({ scope: Scope.DEFAULT })
export class SymptomsService {
  constructor(
    @Inject(SymptomDocument.collectionName)
    private symptomsCollection: CollectionReference<SymptomDocument>
  ) {}

  async create(createSymptomDto: CreateSymptomDto): Promise<Symptom> {
    const docRef = this.symptomsCollection.doc(randomUUID());

    await docRef.set({
      name: createSymptomDto.name,
      desc: createSymptomDto.desc,
    });

    const symptomDoc = await docRef.get();

    return { ...symptomDoc.data(), id: symptomDoc.id };
  }

  async findAll(): Promise<Symptom[]> {
    const snapshot = await this.symptomsCollection.get();
    const symptoms: Symptom[] = [];
    snapshot.forEach((doc) => symptoms.push({ ...doc.data(), id: doc.id }));
    return symptoms;
  }

  async findOne(id: string): Promise<Symptom> {
    const docRef = this.symptomsCollection.doc(id);
    const symptomDoc = await docRef.get();

    if (!symptomDoc.createTime) {
      throw new HttpException(
        `Symptom not found with ID: ${id}`,
        HttpStatus.NOT_FOUND
      );
    }

    return { ...symptomDoc.data(), id: symptomDoc.id };
  }

  async update(
    id: string,
    updateSymptomDto: UpdateSymptomDto
  ): Promise<Symptom> {
    const docRef = this.symptomsCollection.doc(id);

    let symptomDoc = await docRef.get();

    if (!symptomDoc.createTime) {
      throw new HttpException(
        `Symptom not found with ID: ${id}`,
        HttpStatus.NOT_FOUND
      );
    }

    await docRef.set({
      name: updateSymptomDto.name || symptomDoc.data().name,
      desc: updateSymptomDto.desc || symptomDoc.data().desc,
    });
    symptomDoc = await docRef.get();

    return { ...symptomDoc.data(), id: symptomDoc.id };
  }

  async remove(id: string): Promise<Symptom> {
    const docRef = this.symptomsCollection.doc(id);
    const symptomDoc = await docRef.get();

    if (!symptomDoc.createTime) {
      throw new HttpException(
        `Symptom not found with ID: ${id}`,
        HttpStatus.NOT_FOUND
      );
    }

    await docRef.delete();

    return { ...symptomDoc.data(), id: symptomDoc.id };
  }
}
