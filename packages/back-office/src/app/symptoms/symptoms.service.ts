import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Scope,
} from '@nestjs/common';

import { CreateSymptomDto } from './dto/create-symptom.dto';
import { UpdateSymptomDto } from './dto/update-symptom.dto';
import { SymptomDocument } from './documents/symptom.document';
import { CollectionReference } from 'firebase-admin/firestore';
import { Symptom } from './entities/symptom.entity';
import { getPaginatedList, getValidDto } from '../../shared/utils';
import { SymptomsList, SymptomsListInput } from './dto/get-all-symptoms.dto';
import { DocumentNotFoundError } from '../../shared/errors/document-not-found-error';

@Injectable({ scope: Scope.DEFAULT })
export class SymptomsService {
  constructor(
    @Inject(SymptomDocument.collectionName)
    private symptomsCollection: CollectionReference<SymptomDocument>
  ) {}

  async create(createSymptomDto: CreateSymptomDto): Promise<Symptom> {
    const newSymptom = {
      name: createSymptomDto.name,
      desc: createSymptomDto.desc,
    };

    const docRef = await this.symptomsCollection.add(newSymptom);

    const symptomDoc = await docRef.get();

    return { ...symptomDoc.data(), id: symptomDoc.id };
  }

  getList(input: SymptomsListInput): Promise<SymptomsList> {
    const validInput = getValidDto(SymptomsListInput, input);

    return getPaginatedList<SymptomDocument>({
      ...validInput,
      collection: this.symptomsCollection,
    });
  }

  async findOne(id: string): Promise<Symptom> {
    const docRef = this.symptomsCollection.doc(id);
    const symptomDoc = await docRef.get();

    if (!symptomDoc.exists) {
      throw new DocumentNotFoundError(
        symptomDoc.id,
        SymptomDocument.collectionName
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

    // TODO: maybe not needed since docRef.update() throws an error on failure
    if (!symptomDoc.exists) {
      throw new DocumentNotFoundError(
        symptomDoc.id,
        SymptomDocument.collectionName
      );
    }

    await docRef.update({
      ...updateSymptomDto,
    });
    symptomDoc = await docRef.get();

    return { ...symptomDoc.data(), id: symptomDoc.id };
  }

  async remove(id: string): Promise<Symptom> {
    const docRef = this.symptomsCollection.doc(id);
    const symptomDoc = await docRef.get();

    if (!symptomDoc.exists) {
      throw new DocumentNotFoundError(
        symptomDoc.id,
        SymptomDocument.collectionName
      );
    }

    await docRef.delete();

    return { ...symptomDoc.data(), id: symptomDoc.id };
  }
}
