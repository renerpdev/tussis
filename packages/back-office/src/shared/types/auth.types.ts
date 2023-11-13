import firebase from 'firebase/compat'
import FirebaseIdToken = firebase.FirebaseIdToken

export type AuthUser = Pick<FirebaseIdToken, 'uid' | 'picture' | 'name' | 'email'>
