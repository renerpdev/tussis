import { UserRecord } from 'firebase-admin/auth'

export type User = Partial<
  Pick<
    UserRecord,
    'uid' | 'displayName' | 'email' | 'emailVerified' | 'disabled' | 'photoURL' | 'customClaims'
  >
>
