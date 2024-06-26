import { UserRecord } from 'firebase-admin/auth'
import { UserRole } from '../../../shared/types/auth.types'

export type User = Partial<
  Pick<UserRecord, 'uid' | 'displayName' | 'email' | 'emailVerified' | 'disabled' | 'metadata'> & {
    role?: UserRole
    photoUrl?: string
  }
>
