import { Inject, Injectable, Scope } from '@nestjs/common'
import { CollectionReference } from 'firebase-admin/firestore'

import { DocumentNotFoundError } from '../../shared/errors/document-not-found-error'
import { getPaginatedList, getValidDto } from '../../shared/utils'
import { MedDocument } from './documents/med.document'
import { CreateMedDto } from './dto/create-med.dto'
import { MedsList, MedsListInput } from './dto/get-all-meds.dto'
import { UpdateMedDto } from './dto/update-med.dto'
import { Med } from './entities/med.entity'

@Injectable({ scope: Scope.DEFAULT })
export class MedsService {
  constructor(
    @Inject(MedDocument.collectionName)
    private medsCollection: CollectionReference<MedDocument>,
  ) {}

  async create(createMedDto: CreateMedDto): Promise<Med> {
    const validInput = getValidDto(CreateMedDto, createMedDto)

    const newMed = {
      name: validInput.name,
      desc: validInput.desc,
    }

    const docRef = await this.medsCollection.add(newMed)

    const medDoc = await docRef.get()

    return { ...medDoc.data(), id: medDoc.id }
  }

  getList(input: MedsListInput): Promise<MedsList> {
    const validInput = getValidDto(MedsListInput, input)

    return getPaginatedList<MedDocument>({
      ...validInput,
      collection: this.medsCollection,
    })
  }

  async findOne(id: string): Promise<Med> {
    const docRef = this.medsCollection.doc(id)
    const medDoc = await docRef.get()

    if (!medDoc.exists) {
      throw new DocumentNotFoundError(medDoc.id, MedDocument.collectionName)
    }

    return { ...medDoc.data(), id: medDoc.id }
  }

  async update(id: string, updateMedDto: UpdateMedDto): Promise<Med> {
    const validInput = getValidDto(UpdateMedDto, updateMedDto)
    const docRef = this.medsCollection.doc(id)

    let medDoc = await docRef.get()

    // TODO: maybe not needed since docRef.update() throws an error on failure
    if (!medDoc.exists) {
      throw new DocumentNotFoundError(medDoc.id, MedDocument.collectionName)
    }

    await docRef.update({
      ...validInput,
    })
    medDoc = await docRef.get()

    return { ...medDoc.data(), id: medDoc.id }
  }

  async remove(id: string): Promise<Med> {
    const docRef = this.medsCollection.doc(id)
    const medDoc = await docRef.get()

    if (!medDoc.exists) {
      throw new DocumentNotFoundError(medDoc.id, MedDocument.collectionName)
    }

    await docRef.delete()

    return { ...medDoc.data(), id: medDoc.id }
  }
}
