import { CollectionReference } from '@google-cloud/firestore'
import { Inject, Injectable, Scope } from '@nestjs/common'

import dayjs from 'dayjs'
import { DocumentNotFoundError } from '../../shared/errors/document-not-found-error'
import { generatePdfTable, getPaginatedIssuesList, getValidDto } from '../../shared/utils'
import { Med } from '../meds/entities/med.entity'
import { MedsService } from '../meds/meds.service'
import { Symptom } from '../symptoms/entities/symptom.entity'
import { SymptomsService } from '../symptoms/symptoms.service'
import { IssueDocument } from './documents/issues.document'
import { IssueMedDocument } from './documents/issues_meds.document'
import { IssueSymptomDocument } from './documents/issues_symptoms.document'
import { CreateIssueDto } from './dto/create-issue.dto'
import { IssuesList, IssuesListInput } from './dto/get-all-issues.dto'
import { UpdateIssueDto } from './dto/update-issue.dto'
import { Issue } from './entities/issue.entity'

@Injectable({ scope: Scope.DEFAULT })
export class IssuesService {
  constructor(
    @Inject(IssueDocument.collectionName)
    private issuesCollection: CollectionReference<IssueDocument>,
    @Inject(IssueMedDocument.collectionName)
    private issuesMedsCollection: CollectionReference<IssueMedDocument>,
    @Inject(IssueSymptomDocument.collectionName)
    private issuesSymptomsCollection: CollectionReference<IssueSymptomDocument>,
    private symptomsService: SymptomsService,
    private medsService: MedsService,
  ) {}

  async create(createIssueDto: CreateIssueDto): Promise<Issue> {
    const validInput = getValidDto(CreateIssueDto, createIssueDto)

    const symptoms = await Promise.all(
      (validInput.symptoms || []).map(symptomId => this.symptomsService.findOne(symptomId)),
    )
    const meds = await Promise.all(
      (validInput.meds || []).map(medId => this.medsService.findOne(medId)),
    )

    const newIssue = {
      notes: validInput.notes,
      date: dayjs(validInput.date).format('YYYY-MM-DD'),
    }
    const issuesRef = await this.issuesCollection.add(newIssue)
    const issueDoc = await issuesRef.get()

    await Promise.all(
      symptoms.map(({ id, name, desc }) =>
        this.issuesSymptomsCollection.add({
          issueId: issueDoc.id,
          symptomId: id,
          name,
          desc,
        }),
      ),
    )

    await Promise.all(
      meds.map(({ id, name, desc }) =>
        this.issuesMedsCollection.add({
          issueId: issueDoc.id,
          medId: id,
          name,
          desc,
        }),
      ),
    )

    return { ...issueDoc.data(), id: issueDoc.id, symptoms, meds }
  }

  async getList(input: IssuesListInput): Promise<IssuesList> {
    const validInput = getValidDto(IssuesListInput, input)

    return getPaginatedIssuesList<Issue, IssueDocument, IssueMedDocument, IssueSymptomDocument>({
      ...validInput,
      collection: this.issuesCollection,
      symptomsCollection: this.issuesSymptomsCollection,
      medsCollection: this.issuesMedsCollection,
    })
  }

  async findOne(id: string): Promise<Issue> {
    const docRef = this.issuesCollection.doc(id)
    const issueDoc = await docRef.get()

    if (!issueDoc.exists) {
      throw new DocumentNotFoundError(issueDoc.id, IssueDocument.collectionName)
    }

    const symptoms = (
      await this.issuesSymptomsCollection.where('issueId', '==', id).get()
    ).docs.map(doc => {
      const { symptomId, desc, name } = doc.data()
      return { name, desc, id: symptomId } as Symptom
    })

    const meds = (await this.issuesMedsCollection.where('issueId', '==', id).get()).docs.map(
      doc => {
        const { medId, desc, name } = doc.data()
        return { name, desc, id: medId } as Med
      },
    )

    return { ...issueDoc.data(), id: issueDoc.id, symptoms, meds }
  }

  async update(id: string, updateIssueDto: UpdateIssueDto): Promise<Issue> {
    const validInput = getValidDto(UpdateIssueDto, updateIssueDto)

    const docRef = this.issuesCollection.doc(id)

    let issueDoc = await docRef.get()

    // TODO: maybe not needed since docRef.update() throws an error on failure
    if (!issueDoc.exists) {
      throw new DocumentNotFoundError(issueDoc.id, IssueDocument.collectionName)
    }

    await docRef.update({
      ...validInput,
      date: validInput.date ? dayjs(validInput.date).format('YYYY-MM-DD') : undefined,
    })

    const symptoms = await Promise.all(
      (validInput.symptoms || []).map(symptomId => this.symptomsService.findOne(symptomId)),
    )
    const meds = await Promise.all(
      (validInput.meds || []).map(medId => this.medsService.findOne(medId)),
    )

    if (validInput.meds) {
      const issuesMedsRef = await this.issuesMedsCollection.where('issueId', '==', id).get()
      // TODO: refactor this to do less reads
      // First: delete current meds from IssuesMeds collection
      await Promise.all(issuesMedsRef.docs.map(doc => doc.ref.delete()))
      // Then: add new ones to IssuesMeds collection
      await Promise.all(
        meds.map(({ id, name, desc }) =>
          this.issuesMedsCollection.add({
            issueId: issueDoc.id,
            medId: id,
            name,
            desc,
          }),
        ),
      )
    }

    if (validInput.symptoms) {
      const issuesSymptomsRef = await this.issuesSymptomsCollection.where('issueId', '==', id).get()
      // TODO: refactor this to do less reads
      // First: delete current symptoms from IssuesSymptoms collection
      await Promise.all(issuesSymptomsRef.docs.map(doc => doc.ref.delete()))
      // Then: add new ones to IssuesSymptoms collection
      await Promise.all(
        symptoms.map(({ id, name, desc }) =>
          this.issuesSymptomsCollection.add({
            issueId: issueDoc.id,
            symptomId: id,
            name,
            desc,
          }),
        ),
      )
    }

    issueDoc = await docRef.get() // this is in order to return updated doc data

    return { ...issueDoc.data(), id: issueDoc.id, symptoms, meds }
  }

  async remove(id: string): Promise<Issue> {
    const docRef = this.issuesCollection.doc(id)
    const issueDoc = await docRef.get()

    if (!issueDoc.exists) {
      throw new DocumentNotFoundError(issueDoc.id, IssueDocument.collectionName)
    }

    await docRef.delete()

    const issuesMedsRef = await this.issuesMedsCollection.where('issueId', '==', id).get()
    const issuesSymptomsRef = await this.issuesSymptomsCollection.where('issueId', '==', id).get()

    await Promise.all(issuesMedsRef.docs.map(doc => doc.ref.delete()))
    await Promise.all(issuesSymptomsRef.docs.map(doc => doc.ref.delete()))

    return { ...issueDoc.data(), id, symptoms: [], meds: [] }
  }

  async exportPdf(input: IssuesListInput): Promise<Buffer> {
    const paginatedIssuesList = await this.getList(input)

    const headers = ['Fecha', 'Sintomas', 'Medicamentos', 'Notas']
    const meds = (
      await Promise.all(
        paginatedIssuesList.data.map(({ id }) =>
          this.issuesMedsCollection.where('issueId', '==', id).get(),
        ),
      )
    ).map(({ docs }) => docs.map(doc => doc.data()))

    const symptoms = (
      await Promise.all(
        paginatedIssuesList.data.map(({ id }) =>
          this.issuesSymptomsCollection.where('issueId', '==', id).get(),
        ),
      )
    ).map(({ docs }) => docs.map(doc => doc.data()))

    const rows = paginatedIssuesList.data.map((issue, index) => {
      const issueSymptoms = symptoms[index].map(({ name }) => name)
      const issueMeds = meds[index].map(({ name }) => name)

      return [
        `${dayjs(issue.date).format('MMMM D, YYYY')}`,
        issueSymptoms.join(', '),
        issueMeds.join(', '),
        issue.notes,
      ]
    })

    const table = {
      title: 'TUSSIS',
      subtitle: 'Reporte de afecciones para el periodo',
      headers,
      rows,
    }

    return generatePdfTable(table)
  }
}
