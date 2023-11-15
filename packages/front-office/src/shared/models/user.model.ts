import { BaseModel } from './index'

export interface User extends BaseModel {
  uid: string
  displayName: string
  email: string
  disabled: boolean
  emailVerified: boolean
  photoUrl: string
  password: string
  role?: 'admin' | 'editor'
}
