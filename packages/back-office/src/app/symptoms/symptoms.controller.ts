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

import { SymptomsService } from './symptoms.service';
import { CreateSymptomDto } from './dto/create-symptom.dto';
import { UpdateSymptomDto } from './dto/update-symptom.dto';
import { SymptomsListInput } from './dto/get-all-symptoms.dto';

@ApiTags(SymptomsController.path)
@Controller(SymptomsController.path)
export class SymptomsController {
  static path = 'symptoms';

  constructor(private readonly symptomsService: SymptomsService) {}

  @Post()
  create(@Body() createSymptomDto: CreateSymptomDto) {
    return this.symptomsService.create(createSymptomDto);
  }

  @Get()
  getList(@Query() input: SymptomsListInput) {
    return this.symptomsService.getList(input);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.symptomsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSymptomDto: UpdateSymptomDto) {
    return this.symptomsService.update(id, updateSymptomDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.symptomsService.remove(id);
  }
}
