import { Inject, Injectable, Scope } from '@nestjs/common'
import { CollectionReference } from 'firebase-admin/firestore'

import { DocumentNotFoundError } from '../../shared/errors/document-not-found-error'
import { getPaginatedList, getValidDto } from '../../shared/utils'
import { IssueMedDocument } from '../issues/documents/issues_meds.document'
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
    @Inject(IssueMedDocument.collectionName)
    private issuesMedsCollection: CollectionReference<IssueMedDocument>,
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

    return getPaginatedList<Med, MedDocument>({
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

    // here we update IssuesMeds collection, so we keep track of this relationship
    const issuesMedsRef = await this.issuesMedsCollection.where('medId', '==', id).get()
    await Promise.all(
      issuesMedsRef.docs.map(doc => {
        return doc.ref.update({
          name: validInput.name,
          desc: validInput.desc,
        })
      }),
    )

    return { ...medDoc.data(), id: medDoc.id }
  }

  async remove(id: string): Promise<Med> {
    const docRef = this.medsCollection.doc(id)
    const medDoc = await docRef.get()

    if (!medDoc.exists) {
      throw new DocumentNotFoundError(medDoc.id, MedDocument.collectionName)
    }

    await docRef.delete()

    // here we delete all IssuesMeds registries related to this document
    const issuesMedsRef = await this.issuesMedsCollection.where('medId', '==', id).get()
    await Promise.all(
      issuesMedsRef.docs.map(doc => {
        return doc.ref.delete()
      }),
    )

    return { ...medDoc.data(), id: medDoc.id }
  }
}
