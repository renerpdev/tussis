import { SetMetadata } from '@nestjs/common'
import { UserRole } from '../../shared/types/auth.types'

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles)
