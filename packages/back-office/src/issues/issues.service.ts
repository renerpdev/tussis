import { Injectable, Scope } from '@nestjs/common';
import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';
import { randomUUID } from 'crypto';
import { Issue } from './entities/issue.entity';

@Injectable({ scope: Scope.DEFAULT })
export class IssuesService {
  private readonly issues: Issue[] = [];

  create(createIssueDto: CreateIssueDto): Issue {
    const newIssue: Issue = {
      id: randomUUID(),
      symptomId: createIssueDto.symptomId,
      date: new Date(createIssueDto.date),
      notes: createIssueDto.notes,
    };
    this.issues.push(newIssue);

    return newIssue;
  }

  findAll() {
    return this.issues;
  }

  findOne(id: string): Issue {
    const existingIssue = this.issues.find((s) => s.id === id);
    if (!existingIssue) {
      throw new Error();
    }
    return existingIssue;
  }

  update(id: string, updateIssueDto: UpdateIssueDto): Issue {
    const issueIndex = this.issues.findIndex((s) => s.id === id);
    const existingIssue = this.issues[issueIndex];
    if (!existingIssue) {
      throw new Error();
    }

    const updatedIssue: Issue = {
      ...existingIssue,
      ...updateIssueDto,
      date: new Date(updateIssueDto.date),
    };

    this.issues.splice(issueIndex, 1, updatedIssue);

    return updatedIssue;
  }

  remove(id: string): Issue {
    const issueIndex = this.issues.findIndex((s) => s.id === id);
    const existingIssue = this.issues[issueIndex];

    this.issues.splice(issueIndex, 1);

    return existingIssue;
  }
}
