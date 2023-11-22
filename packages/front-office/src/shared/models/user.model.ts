import { UserRole } from '../types/auth.types'
import { BaseModel } from './index'

export interface User extends BaseModel {
  uid: string
  displayName: string
  email: string
  password: string
  disabled?: boolean
  emailVerified?: boolean
  photoUrl?: string
  role?: UserRole
}
