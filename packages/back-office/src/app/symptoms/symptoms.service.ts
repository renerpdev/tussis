import { Inject, Injectable, Scope } from '@nestjs/common'

import { CollectionReference } from 'firebase-admin/firestore'
import { DocumentNotFoundError } from '../../shared/errors/document-not-found-error'
import { UnauthorizedResourceError } from '../../shared/errors/unauthorized-resource-error'
import { AuthUser } from '../../shared/types/auth.types'
import { getPaginatedList, getValidDto } from '../../shared/utils'
import { IssueSymptomDocument } from '../issues/documents/issues_symptoms.document'
import { SymptomDocument } from './documents/symptom.document'
import { CreateSymptomDto } from './dto/create-symptom.dto'
import { SymptomsList, SymptomsListInput } from './dto/get-all-symptoms.dto'
import { UpdateSymptomDto } from './dto/update-symptom.dto'
import { Symptom } from './entities/symptom.entity'

@Injectable({ scope: Scope.DEFAULT })
export class SymptomsService {
  constructor(
    @Inject(SymptomDocument.collectionName)
    private symptomsCollection: CollectionReference<SymptomDocument>,
    @Inject(IssueSymptomDocument.collectionName)
    private issuesSymptomsCollection: CollectionReference<IssueSymptomDocument>,
  ) {}

  async create(createSymptomDto: CreateSymptomDto, user: AuthUser): Promise<Symptom> {
    const validInput = getValidDto(CreateSymptomDto, createSymptomDto)

    const newSymptom = {
      ...validInput,
      uid: user.sub,
    }

    const docRef = await this.symptomsCollection.add(newSymptom)

    const symptomDoc = await docRef.get()

    return { ...symptomDoc.data(), id: symptomDoc.id }
  }

  getList(input: SymptomsListInput, user: AuthUser): Promise<SymptomsList> {
    const validInput = getValidDto(SymptomsListInput, input)

    return getPaginatedList<Symptom, SymptomDocument>({
      ...validInput,
      collection: this.symptomsCollection,
      uid: user.sub,
    })
  }

  async findOne(id: string, user: AuthUser): Promise<Symptom> {
    const docRef = this.symptomsCollection.doc(id)
    const symptomDoc = await docRef.get()

    if (!symptomDoc.exists) {
      throw new DocumentNotFoundError(symptomDoc.id, SymptomDocument.collectionName)
    }

    if (symptomDoc.data().uid !== user.sub) {
      throw new UnauthorizedResourceError(user.sub)
    }

    return { ...symptomDoc.data(), id: symptomDoc.id }
  }

  async update(id: string, updateSymptomDto: UpdateSymptomDto, user: AuthUser): Promise<Symptom> {
    const validInput = getValidDto(UpdateSymptomDto, updateSymptomDto)
    const docRef = this.symptomsCollection.doc(id)

    let symptomDoc = await docRef.get()

    // TODO: maybe not needed since docRef.update() throws an error on failure
    if (!symptomDoc.exists) {
      throw new DocumentNotFoundError(symptomDoc.id, SymptomDocument.collectionName)
    }

    if (symptomDoc.data().uid !== user.sub) {
      throw new UnauthorizedResourceError(user.sub)
    }

    await docRef.update({
      ...validInput,
    })
    symptomDoc = await docRef.get()

    // here we update IssuesSymptoms collection, so we keep track of this relationship
    const issuesSymptomsRef = await this.issuesSymptomsCollection.where('symptomId', '==', id).get()
    await Promise.all(
      issuesSymptomsRef.docs.map(doc => {
        return doc.ref.update({
          name: validInput.name,
          desc: validInput.desc,
        })
      }),
    )

    return { ...symptomDoc.data(), id: symptomDoc.id }
  }

  async remove(id: string, user: AuthUser): Promise<Symptom> {
    const docRef = this.symptomsCollection.doc(id)
    const symptomDoc = await docRef.get()

    if (!symptomDoc.exists) {
      throw new DocumentNotFoundError(symptomDoc.id, SymptomDocument.collectionName)
    }

    if (symptomDoc.data().uid !== user.sub) {
      throw new UnauthorizedResourceError(user.sub)
    }

    await docRef.delete()

    // here we delete all IssuesSymptoms registries related to this document
    const issuesSymptomsRef = await this.issuesSymptomsCollection.where('symptomId', '==', id).get()
    await Promise.all(
      issuesSymptomsRef.docs.map(doc => {
        return doc.ref.delete()
      }),
    )

    return { ...symptomDoc.data(), id: symptomDoc.id }
  }
}
