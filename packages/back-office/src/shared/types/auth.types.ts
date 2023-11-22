import firebase from 'firebase/compat'
import FirebaseIdToken = firebase.FirebaseIdToken

export type UserRole = 'admin' | 'editor' | 'supervisor'

export type AuthUser = Pick<FirebaseIdToken, 'sub' | 'picture' | 'name' | 'email'> & {
  role?: UserRole
}
