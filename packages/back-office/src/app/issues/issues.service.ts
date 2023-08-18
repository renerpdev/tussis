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

    await Promise.all(
      (createIssueDto.symptoms || []).map((symptomId) =>
        this.symptomsService.findOne(symptomId)
      )
    );

    await docRef.set({
      symptoms: createIssueDto.symptoms,
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

    const symptoms = await Promise.all(
      (updateIssueDto.symptoms || []).map((symptomId) =>
        this.symptomsService.findOne(symptomId)
      )
    );

    const symptomsIds = symptoms.map(({ id }) => id);

    let issueDoc = await docRef.get();

    if (!issueDoc.createTime) {
      throw new HttpException(
        `Issue not found with ID: ${id}`,
        HttpStatus.NOT_FOUND
      );
    }

    await docRef.set({
      symptoms: symptomsIds || issueDoc.data().symptoms,
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
