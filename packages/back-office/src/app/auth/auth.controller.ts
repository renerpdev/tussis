import { Body, Controller, NotFoundException, Patch, Req, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Request } from 'express'
import { getAuth } from 'firebase-admin/auth'
import { AuthUser } from '../../shared/types/auth.types'
import { UpdateUserClaimsDto } from './dto/update-user-claims.dto'
import { FirebaseAuthGuard } from './firebase-auth.guard'

@ApiTags(AuthController.path)
@Controller(AuthController.path)
export class AuthController {
  static path = 'auth'

  @UseGuards(FirebaseAuthGuard)
  @Patch('user-role')
  async updateClaims(@Body() dto: UpdateUserClaimsDto, @Req() req: Request) {
    const user = req.user as AuthUser

    if (!user || !user.sub) throw new NotFoundException('User not found')

    return getAuth()
      .setCustomUserClaims(dto.uid, { role: dto.role })
      .catch(error => {
        throw new Error(error)
      })
  }
}
