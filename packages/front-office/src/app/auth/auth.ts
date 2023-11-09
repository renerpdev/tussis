import { connectAuthEmulator, getAuth } from 'firebase/auth'
import firebaseApp from './firebase' // This is the Firebase object from the previous tutorial

const auth = getAuth(firebaseApp)

const emulatorHost = import.meta.env.VITE_FIREBASE_AUTH_EMULATOR_HOST
if (emulatorHost) {
  connectAuthEmulator(auth, emulatorHost)
}

export default auth
