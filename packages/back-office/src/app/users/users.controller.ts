import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Request } from 'express'
import { AuthUser } from '../../shared/types/auth.types'
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard'
import { Roles } from '../auth/roles.decorator'
import { RolesGuard } from '../auth/roles.guard'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserClaimsDto } from './dto/update-user-claims.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UsersService } from './users.service'

@ApiTags(UsersController.path)
@Controller(UsersController.path)
export class UsersController {
  static path = 'users'

  constructor(private readonly usersService: UsersService) {}

  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  async getUsersList() {
    return this.usersService.getUserList()
  }

  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  async createUser(@Body() userDto: CreateUserDto) {
    return this.usersService.createUser(userDto)
  }

  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles('admin', 'editor')
  @Patch(':uid')
  async updateUser(@Param('uid') uid: string, @Body() userDto: UpdateUserDto) {
    return this.usersService.updateUser(uid, userDto)
  }

  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':uid')
  async deleteUser(@Param('uid') uid: string, @Req() req: Request) {
    return this.usersService.deleteUser(uid, req.user as AuthUser)
  }

  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch('claims')
  async updateClaims(@Body() dto: UpdateUserClaimsDto) {
    return this.usersService.updateUserRole(dto)
  }
}
