import { SymptomsService } from './../symptoms/symptoms.service';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Scope,
} from '@nestjs/common';
import { CollectionReference, Timestamp } from '@google-cloud/firestore';
import dayjs from 'dayjs';
import { randomUUID } from 'crypto';

import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';
import { IssueDocument } from './documents/issues.document';
import { Issue } from './entities/issue.entity';

@Injectable({ scope: Scope.DEFAULT })
export class IssuesService {
  constructor(
    @Inject(IssueDocument.collectionName)
    private issuesCollection: CollectionReference<IssueDocument>,
    private symptomsService: SymptomsService
  ) {}

  async create(createIssueDto: CreateIssueDto): Promise<Issue> {
    const docRef = this.issuesCollection.doc(randomUUID());
    const dateMillis = dayjs(createIssueDto.date).valueOf();

    const symptom = await this.symptomsService.findOne(
      createIssueDto.symptomId
    );

    await docRef.set({
      symptomId: symptom.id,
      notes: createIssueDto.notes,
      date: Timestamp.fromMillis(dateMillis),
    });

    const issueDoc = await docRef.get();

    return { ...issueDoc.data(), id: issueDoc.id };
  }

  async findAll(): Promise<Issue[]> {
    const snapshot = await this.issuesCollection.get();
    const issues: Issue[] = [];
    snapshot.forEach((doc) => issues.push({ ...doc.data(), id: doc.id }));

    return issues;
  }

  async findOne(id: string): Promise<Issue> {
    const docRef = this.issuesCollection.doc(id);
    const issueDoc = await docRef.get();

    if (!issueDoc.createTime) {
      throw new HttpException(
        `Issue not found with ID: ${id}`,
        HttpStatus.NOT_FOUND
      );
    }

    return { ...issueDoc.data(), id: issueDoc.id };
  }

  async update(id: string, updateIssueDto: UpdateIssueDto): Promise<Issue> {
    const docRef = this.issuesCollection.doc(id);
    const dateMillis =
      updateIssueDto.date && dayjs(updateIssueDto.date).valueOf();

    const symptom =
      updateIssueDto.symptomId &&
      (await this.symptomsService.findOne(updateIssueDto.symptomId));

    let issueDoc = await docRef.get();

    if (!issueDoc.createTime) {
      throw new HttpException(
        `Issue not found with ID: ${id}`,
        HttpStatus.NOT_FOUND
      );
    }

    await docRef.set({
      symptomId: symptom?.id || issueDoc.data().symptomId,
      notes: updateIssueDto.notes || issueDoc.data().notes,
      date: dateMillis
        ? Timestamp.fromMillis(dateMillis)
        : issueDoc.data().date,
    });
    issueDoc = await docRef.get();

    return { ...issueDoc.data(), id: issueDoc.id };
  }

  async remove(id: string): Promise<Issue> {
    const docRef = this.issuesCollection.doc(id);
    const issueDoc = await docRef.get();

    if (!issueDoc.createTime) {
      throw new HttpException(
        `Issue not found with ID: ${id}`,
        HttpStatus.NOT_FOUND
      );
    }

    await docRef.delete();

    return { ...issueDoc.data(), id: issueDoc.id };
  }
}
