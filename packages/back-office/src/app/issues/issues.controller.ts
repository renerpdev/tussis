import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Request } from 'express'
import { Response } from 'firebase-functions/v1'
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard'
import { CreateIssueDto } from './dto/create-issue.dto'
import { IssuesListInput } from './dto/get-all-issues.dto'
import { UpdateIssueDto } from './dto/update-issue.dto'
import { IssuesService } from './issues.service'

@UseGuards(FirebaseAuthGuard)
@ApiTags(IssuesController.path)
@Controller(IssuesController.path)
export class IssuesController {
  static path = 'issues'

  constructor(private readonly issuesService: IssuesService) {}

  @Post()
  create(@Body() createIssueDto: CreateIssueDto) {
    return this.issuesService.create(createIssueDto)
  }

  @Get()
  getList(@Query() input: IssuesListInput, @Req() req: Request) {
    return this.issuesService.getList(input, req.user!)
  }

  @Get('export/pdf')
  async exportPdf(@Res() res: Response, @Query() input: IssuesListInput) {
    const buffer = await this.issuesService.exportPdf(input)
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; tussis-report.pdf',
      'Content-Length': buffer.length,
    })

    res.end(buffer)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.issuesService.findOne(id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateIssueDto: UpdateIssueDto) {
    return this.issuesService.update(id, updateIssueDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.issuesService.remove(id)
  }
}
