import { Module } from '@nestjs/common'
import { IssuesModule } from '../issues/issues.module'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'

@Module({
  imports: [IssuesModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
