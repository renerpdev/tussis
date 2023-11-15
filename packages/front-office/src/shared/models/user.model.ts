import { BaseModel } from './index'

export interface User extends BaseModel {
  uid: string
  displayName: string
  email: string
  password: string
  disabled?: boolean
  emailVerified?: boolean
  photoURL?: string
  role?: 'admin' | 'editor'
}
