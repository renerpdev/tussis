import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import { Request } from 'express'
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard'
import { CreateMedDto } from './dto/create-med.dto'
import { MedsListInput } from './dto/get-all-meds.dto'
import { UpdateMedDto } from './dto/update-med.dto'
import { MedsService } from './meds.service'

@UseGuards(FirebaseAuthGuard)
@ApiTags(MedsController.path)
@Controller(MedsController.path)
export class MedsController {
  static path = 'meds'

  constructor(private readonly medsService: MedsService) {}

  @Post()
  create(@Body() createMedDto: CreateMedDto) {
    return this.medsService.create(createMedDto)
  }

  @Get()
  getList(@Query() input: MedsListInput, @Req() req: Request) {
    Logger.log(req.authInfo)
    return this.medsService.getList(input)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.medsService.findOne(id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMedDto: UpdateMedDto) {
    return this.medsService.update(id, updateMedDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.medsService.remove(id)
  }
}
