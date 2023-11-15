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
import { CreateMedDto } from './dto/create-med.dto'
import { MedsListInput } from './dto/get-all-meds.dto'
import { UpdateMedDto } from './dto/update-med.dto'
import { MedsService } from './meds.service'

@UseGuards(FirebaseAuthGuard, RolesGuard)
@ApiTags(MedsController.path)
@Controller(MedsController.path)
export class MedsController {
  static path = 'meds'

  constructor(private readonly medsService: MedsService) {}

  @Roles('admin', 'editor')
  @Post()
  create(@Body() createMedDto: CreateMedDto, @Req() req: Request) {
    return this.medsService.create(createMedDto, req.user as AuthUser)
  }

  @Get()
  getList(@Query() input: MedsListInput, @Req() req: Request) {
    return this.medsService.getList(input, req.user as AuthUser)
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: Request) {
    return this.medsService.findOne(id, req.user as AuthUser)
  }

  @Roles('admin', 'editor')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMedDto: UpdateMedDto, @Req() req: Request) {
    return this.medsService.update(id, updateMedDto, req.user as AuthUser)
  }

  @Roles('admin', 'editor')
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    return this.medsService.remove(id, req.user as AuthUser)
  }
}
