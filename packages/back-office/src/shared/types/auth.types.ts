import firebase from 'firebase/compat'
import FirebaseIdToken = firebase.FirebaseIdToken

export type AuthUser = Pick<FirebaseIdToken, 'sub' | 'picture' | 'name' | 'email'>
