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
  UseGuards,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { Request } from 'express'
import { AuthUser } from '../../shared/types/auth.types'
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard'
import { Roles } from '../auth/roles.decorator'
import { RolesGuard } from '../auth/roles.guard'
import { CreateSymptomDto } from './dto/create-symptom.dto'
import { SymptomsListInput } from './dto/get-all-symptoms.dto'
import { UpdateSymptomDto } from './dto/update-symptom.dto'
import { SymptomsService } from './symptoms.service'

@UseGuards(FirebaseAuthGuard, RolesGuard)
@ApiTags(SymptomsController.path)
@Controller(SymptomsController.path)
export class SymptomsController {
  static path = 'symptoms'

  constructor(private readonly symptomsService: SymptomsService) {}

  @Roles('admin')
  @Post()
  create(@Body() createSymptomDto: CreateSymptomDto, @Req() req: Request) {
    return this.symptomsService.create(createSymptomDto, req.user as AuthUser)
  }

  @Get()
  getList(@Query() input: SymptomsListInput, @Req() req: Request) {
    return this.symptomsService.getList(input, req.user as AuthUser)
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: Request) {
    return this.symptomsService.findOne(id, req.user as AuthUser)
  }

  @Roles('admin')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSymptomDto: UpdateSymptomDto, @Req() req: Request) {
    return this.symptomsService.update(id, updateSymptomDto, req.user as AuthUser)
  }

  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    return this.symptomsService.remove(id, req.user as AuthUser)
  }
}
