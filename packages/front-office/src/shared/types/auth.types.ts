import { User } from '@firebase/auth'

export type UserRole = 'admin' | 'user' | 'supervisor' | null

export type AuthUser = Pick<User, 'displayName' | 'email' | 'photoURL' | 'uid'> & { role: UserRole }

export interface AuthCookie {
  user?: AuthUser
  accessToken?: string
  refreshToken?: string
}
