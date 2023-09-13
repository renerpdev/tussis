import { CollectionReference } from '@google-cloud/firestore'
import { Inject, Injectable, Scope } from '@nestjs/common'
import dayjs from 'dayjs'

import { DocumentNotFoundError } from '../../shared/errors/document-not-found-error'
import { DEFAULT_DATE_FORMAT } from '../../shared/types'
import { generatePdfTable, getPaginatedList, getValidDto } from '../../shared/utils'
import { Med } from '../meds/entities/med.entity'
import { Symptom } from '../symptoms/entities/symptom.entity'
import { MedsService } from './../meds/meds.service'
import { SymptomsService } from './../symptoms/symptoms.service'
import { IssueDocument } from './documents/issues.document'
import { CreateIssueDto } from './dto/create-issue.dto'
import { IssuesList, IssuesListInput } from './dto/get-all-issues.dto'
import { UpdateIssueDto } from './dto/update-issue.dto'
import { Issue } from './entities/issue.entity'

@Injectable({ scope: Scope.DEFAULT })
export class IssuesService {
  constructor(
    @Inject(IssueDocument.collectionName)
    private issuesCollection: CollectionReference<IssueDocument>,
    private symptomsService: SymptomsService,
    private medsService: MedsService,
  ) {}

  async create(createIssueDto: CreateIssueDto): Promise<Issue> {
    await Promise.all(
      (createIssueDto.symptoms || []).map(symptomId => this.symptomsService.findOne(symptomId)),
    )

    await Promise.all((createIssueDto.meds || []).map(medId => this.medsService.findOne(medId)))

    const newIssue = {
      symptoms: createIssueDto.symptoms,
      meds: createIssueDto.meds,
      notes: createIssueDto.notes,
      date: dayjs(new Date(createIssueDto.date)).format(DEFAULT_DATE_FORMAT),
    }
    const docRef = await this.issuesCollection.add(newIssue)

    const issueDoc = await docRef.get()

    return { ...issueDoc.data(), id: issueDoc.id }
  }

  getList(input: IssuesListInput): Promise<IssuesList> {
    const validInput = getValidDto(IssuesListInput, input)

    return getPaginatedList<IssueDocument>({
      ...validInput,
      collection: this.issuesCollection,
    })
  }

  async findOne(id: string): Promise<Issue> {
    const docRef = this.issuesCollection.doc(id)
    const issueDoc = await docRef.get()

    if (!issueDoc.exists) {
      throw new DocumentNotFoundError(issueDoc.id, IssueDocument.collectionName)
    }

    return { ...issueDoc.data(), id: issueDoc.id }
  }

  async update(id: string, updateIssueDto: UpdateIssueDto): Promise<Issue> {
    const docRef = this.issuesCollection.doc(id)

    if (updateIssueDto.symptoms) {
      await Promise.all(
        (updateIssueDto.symptoms || []).map(symptomId => this.symptomsService.findOne(symptomId)),
      )
    }

    let issueDoc = await docRef.get()

    // TODO: maybe not needed since docRef.update() throws an error on failure
    if (!issueDoc.exists) {
      throw new DocumentNotFoundError(issueDoc.id, IssueDocument.collectionName)
    }

    await docRef.update({
      ...updateIssueDto,
      date: updateIssueDto.date
        ? dayjs(updateIssueDto.date).format(DEFAULT_DATE_FORMAT)
        : issueDoc.data().date,
    })
    issueDoc = await docRef.get()

    return { ...issueDoc.data(), id: issueDoc.id }
  }

  async remove(id: string): Promise<Issue> {
    const docRef = this.issuesCollection.doc(id)
    const issueDoc = await docRef.get()

    if (!issueDoc.exists) {
      throw new DocumentNotFoundError(issueDoc.id, IssueDocument.collectionName)
    }

    await docRef.delete()

    return { ...issueDoc.data(), id: issueDoc.id }
  }

  async exportPdf(input: IssuesListInput): Promise<Buffer> {
    const paginatedIssuesList = await this.getList(input)
    const medsArray = (await this.medsService.getList({})).data as Med[]
    const symptomsArray = (await this.symptomsService.getList({})).data as Symptom[]

    const headers = ['Fecha', 'Sintomas', 'Medicamentos', 'Notas']
    const rows = paginatedIssuesList.data.map(issue => {
      const issueSymptoms = issue.symptoms.map(
        symptomId => symptomsArray.find(symptom => symptom.id === symptomId).name,
      )
      const issueMeds = issue.meds.map(medId => medsArray.find(med => med.id === medId).name)

      return [issue.date, issueSymptoms.join(', '), issueMeds.join(', '), issue.notes]
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
