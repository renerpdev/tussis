import { Body, Controller, NotFoundException, Patch, Req, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Request } from 'express'
import { getAuth } from 'firebase-admin/auth'
import { CustomError } from '../../shared/errors/custom-error'
import { AuthUser } from '../../shared/types/auth.types'
import { UpdateUserClaimsDto } from './dto/update-user-claims.dto'
import { FirebaseAuthGuard } from './firebase-auth.guard'
import { Roles } from './roles.decorator'
import { RolesGuard } from './roles.guard'

@UseGuards(RolesGuard)
@ApiTags(AuthController.path)
@Controller(AuthController.path)
export class AuthController {
  static path = 'auth'

  @UseGuards(FirebaseAuthGuard)
  @Roles('admin')
  @Patch('user-claims')
  async updateClaims(@Body() dto: UpdateUserClaimsDto, @Req() req: Request) {
    const user = req.user as AuthUser

    if (!user || !user.sub) throw new NotFoundException('User not found')

    if (user.sub === dto.uid) throw new CustomError('Cannot update your own role')

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
