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
import { CreateUserDto } from './dto/create-user.dto'
import { UsersListInput } from './dto/get-all-users.dto'
import { UpdateUserClaimsDto } from './dto/update-user-claims.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UsersService } from './users.service'

@ApiTags(UsersController.path)
@UseGuards(FirebaseAuthGuard, RolesGuard)
@Controller(UsersController.path)
export class UsersController {
  static path = 'users'

  constructor(private readonly usersService: UsersService) {}

  @Roles('admin')
  @Get()
  async getUsersList(@Query() input: UsersListInput) {
    return this.usersService.getUserList(input)
  }

  @Roles('admin')
  @Post()
  async createUser(@Body() userDto: CreateUserDto) {
    return this.usersService.createUser(userDto)
  }

  @Roles('admin')
  @Patch(':uid')
  async updateUser(@Param('uid') uid: string, @Body() userDto: UpdateUserDto) {
    return this.usersService.updateUser(uid, userDto)
  }

  @Roles('admin')
  @Delete(':uid')
  async deleteUser(@Param('uid') uid: string, @Req() req: Request) {
    return this.usersService.deleteUser(uid, req.user as AuthUser)
  }

  @Delete('remove-account')
  async deleteAccount(@Req() req: Request) {
    return this.usersService.deleteAccount(req.user as AuthUser)
  }

  @Roles('admin')
  @Patch(':uid/claims')
  async updateClaims(@Param('uid') uid: string, @Body() dto: UpdateUserClaimsDto) {
    return this.usersService.updateUserRole(uid, dto)
  }
}
