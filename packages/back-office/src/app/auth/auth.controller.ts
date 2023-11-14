import {
  Body,
  Controller,
  NotFoundException,
  Patch,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Request } from 'express'
import { getAuth } from 'firebase-admin/auth'
import process from 'process'
import { AuthUser } from '../../shared/types/auth.types'
import { UpdateUserClaimsDto } from './dto/update-user-claims.dto'
import { FirebaseAuthGuard } from './firebase-auth.guard'

const masterEmail = process.env.MASTER_EMAIL

@ApiTags(AuthController.path)
@Controller(AuthController.path)
export class AuthController {
  static path = 'auth'

  @UseGuards(FirebaseAuthGuard)
  @Patch('user-claims')
  async updateClaims(@Body() dto: UpdateUserClaimsDto, @Req() req: Request) {
    const user = req.user as AuthUser

    if (!user || !user.sub) throw new NotFoundException('User not found')

    if (user?.email !== masterEmail)
      throw new UnauthorizedException('Only the master can update user claims')

    return getAuth()
      .getUserByEmail(user.email)
      .then(user => {
        // Confirm user is admin.
        if (user.customClaims) {
          // Add custom claims for additional privileges.
          // This will be picked up by the user on token refresh or next sign in on new device.
          return getAuth().setCustomUserClaims(dto.uid, { role: dto.role })
        }
      })
      .catch(error => {
        throw new Error(error)
      })
  }
}
