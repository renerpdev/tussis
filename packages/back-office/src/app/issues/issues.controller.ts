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
import { AuthUser } from '../../shared/types/auth.types'
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard'
import { Roles } from '../auth/roles.decorator'
import { RolesGuard } from '../auth/roles.guard'
import { CreateIssueDto } from './dto/create-issue.dto'
import { IssuesListInput } from './dto/get-all-issues.dto'
import { UpdateIssueDto } from './dto/update-issue.dto'
import { IssuesService } from './issues.service'

@UseGuards(FirebaseAuthGuard, RolesGuard)
@ApiTags(IssuesController.path)
@Controller(IssuesController.path)
export class IssuesController {
  static path = 'issues'

  constructor(private readonly issuesService: IssuesService) {}

  @Roles('admin', 'editor')
  @Post()
  create(@Body() createIssueDto: CreateIssueDto, @Req() req: Request) {
    return this.issuesService.create(createIssueDto, req.user as AuthUser)
  }

  @Get()
  getList(@Query() input: IssuesListInput, @Req() req: Request) {
    return this.issuesService.getList(input, req.user as AuthUser)
  }

  @Roles('admin', 'editor')
  @Get('export/pdf')
  async exportPdf(@Res() res: Response, @Query() input: IssuesListInput, @Req() req: Request) {
    const buffer = await this.issuesService.exportPdf(input, req.user as AuthUser)
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; tussis-report.pdf',
      'Content-Length': buffer.length,
    })

    res.end(buffer)
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: Request) {
    return this.issuesService.findOne(id, req.user as AuthUser)
  }

  @Roles('admin', 'editor')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateIssueDto: UpdateIssueDto, @Req() req: Request) {
    return this.issuesService.update(id, updateIssueDto, req.user as AuthUser)
  }

  @Roles('admin', 'editor')
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    return this.issuesService.remove(id, req.user as AuthUser)
  }
}
