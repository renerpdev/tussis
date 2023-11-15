import { SetMetadata } from '@nestjs/common'
import { AuthUser } from '../../shared/types/auth.types'

export const Roles = (...roles: AuthUser['role'][]) => SetMetadata('roles', roles)
