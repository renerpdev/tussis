import { SymptomsService } from './../symptoms/symptoms.service';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Scope,
} from '@nestjs/common';
import { CollectionReference } from '@google-cloud/firestore';
import dayjs from 'dayjs';

import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';
import { IssueDocument } from './documents/issues.document';
import { Issue } from './entities/issue.entity';
import { IssuesList, IssuesListInput } from './dto/get-all-issues.dto';
import { getPaginatedList, getValidDto } from '../../shared/utils';
import { DEFAULT_DATE_FORMAT } from '../../shared/types';
import { MedsService } from './../meds/meds.service';

@Injectable({ scope: Scope.DEFAULT })
export class IssuesService {
  constructor(
    @Inject(IssueDocument.collectionName)
    private issuesCollection: CollectionReference<IssueDocument>,
    private symptomsService: SymptomsService,
    private medsService: MedsService
  ) {}

  async create(createIssueDto: CreateIssueDto): Promise<Issue> {
    await Promise.all(
      (createIssueDto.symptoms || []).map((symptomId) =>
        this.symptomsService.findOne(symptomId)
      )
    );

    await Promise.all(
      (createIssueDto.meds || []).map((medId) =>
        this.medsService.findOne(medId)
      )
    );

    const newIssue = {
      symptoms: createIssueDto.symptoms,
      meds: createIssueDto.meds,
      notes: createIssueDto.notes,
      date: dayjs(new Date(createIssueDto.date)).format(DEFAULT_DATE_FORMAT),
    };
    const docRef = await this.issuesCollection.add(newIssue);

    const issueDoc = await docRef.get();

    return { ...issueDoc.data(), id: issueDoc.id };
  }

  getList(input: IssuesListInput): Promise<IssuesList> {
    const validInput = getValidDto(IssuesListInput, input);

    return getPaginatedList<IssueDocument>({
      ...validInput,
      collection: this.issuesCollection,
    });
  }

  async findOne(id: string): Promise<Issue> {
    const docRef = this.issuesCollection.doc(id);
    const issueDoc = await docRef.get();

    if (!issueDoc.exists) {
      throw new HttpException(
        `Issue not found with ID: ${id}`,
        HttpStatus.NOT_FOUND
      );
    }

    return { ...issueDoc.data(), id: issueDoc.id };
  }

  async update(id: string, updateIssueDto: UpdateIssueDto): Promise<Issue> {
    const docRef = this.issuesCollection.doc(id);

    if (updateIssueDto.symptoms) {
      await Promise.all(
        (updateIssueDto.symptoms || []).map((symptomId) =>
          this.symptomsService.findOne(symptomId)
        )
      );
    }

    let issueDoc = await docRef.get();

    // TODO: maybe not needed since docRef.update() throws an error on failure
    if (!issueDoc.exists) {
      throw new HttpException(
        `Issue not found with ID: ${id}`,
        HttpStatus.NOT_FOUND
      );
    }

    await docRef.update({
      ...updateIssueDto,
      date: updateIssueDto.date
        ? dayjs(updateIssueDto.date).format(DEFAULT_DATE_FORMAT)
        : issueDoc.data().date,
    });
    issueDoc = await docRef.get();

    return { ...issueDoc.data(), id: issueDoc.id };
  }

  async remove(id: string): Promise<Issue> {
    const docRef = this.issuesCollection.doc(id);
    const issueDoc = await docRef.get();

    if (!issueDoc.exists) {
      throw new HttpException(
        `Issue not found with ID: ${id}`,
        HttpStatus.NOT_FOUND
      );
    }

    await docRef.delete();

    return { ...issueDoc.data(), id: issueDoc.id };
  }
}
