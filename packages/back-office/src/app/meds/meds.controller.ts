import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { MedsService } from './meds.service';
import { CreateMedDto } from './dto/create-med.dto';
import { UpdateMedDto } from './dto/update-med.dto';
import { MedsListInput } from './dto/get-all-meds.dto';

@ApiTags(MedsController.path)
@Controller(MedsController.path)
export class MedsController {
  static path = 'meds';

  constructor(private readonly medsService: MedsService) {}

  @Post()
  create(@Body() createMedDto: CreateMedDto) {
    return this.medsService.create(createMedDto);
  }

  @Get()
  getList(@Query() input: MedsListInput) {
    return this.medsService.getList(input);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.medsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMedDto: UpdateMedDto) {
    return this.medsService.update(id, updateMedDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.medsService.remove(id);
  }
}
