import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Scope,
} from '@nestjs/common';
import { CollectionReference } from 'firebase-admin/firestore';

import { CreateMedDto } from './dto/create-med.dto';
import { UpdateMedDto } from './dto/update-med.dto';
import { MedDocument } from './documents/med.document';
import { Med } from './entities/med.entity';
import { getPaginatedList, getValidDto } from '../../shared/utils';
import { MedsList, MedsListInput } from './dto/get-all-meds.dto';
import { DocumentNotFoundError } from '../../shared/errors/document-not-found-error';

@Injectable({ scope: Scope.DEFAULT })
export class MedsService {
  constructor(
    @Inject(MedDocument.collectionName)
    private medsCollection: CollectionReference<MedDocument>
  ) {}

  async create(createMedDto: CreateMedDto): Promise<Med> {
    const newMed = {
      name: createMedDto.name,
      desc: createMedDto.desc,
    };

    const docRef = await this.medsCollection.add(newMed);

    const medDoc = await docRef.get();

    return { ...medDoc.data(), id: medDoc.id };
  }

  getList(input: MedsListInput): Promise<MedsList> {
    const validInput = getValidDto(MedsListInput, input);

    return getPaginatedList<MedDocument>({
      ...validInput,
      collection: this.medsCollection,
    });
  }

  async findOne(id: string): Promise<Med> {
    const docRef = this.medsCollection.doc(id);
    const medDoc = await docRef.get();

    if (!medDoc.exists) {
      throw new DocumentNotFoundError(medDoc.id, MedDocument.collectionName);
    }

    return { ...medDoc.data(), id: medDoc.id };
  }

  async update(id: string, updateMedDto: UpdateMedDto): Promise<Med> {
    const docRef = this.medsCollection.doc(id);

    let medDoc = await docRef.get();

    // TODO: maybe not needed since docRef.update() throws an error on failure
    if (!medDoc.exists) {
      throw new DocumentNotFoundError(medDoc.id, MedDocument.collectionName);
    }

    await docRef.update({
      ...updateMedDto,
    });
    medDoc = await docRef.get();

    return { ...medDoc.data(), id: medDoc.id };
  }

  async remove(id: string): Promise<Med> {
    const docRef = this.medsCollection.doc(id);
    const medDoc = await docRef.get();

    if (!medDoc.exists) {
      throw new DocumentNotFoundError(medDoc.id, MedDocument.collectionName);
    }

    await docRef.delete();

    return { ...medDoc.data(), id: medDoc.id };
  }
}
