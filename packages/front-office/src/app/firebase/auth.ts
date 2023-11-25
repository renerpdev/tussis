import { connectAuthEmulator, getAuth } from 'firebase/auth'
import firebaseApp from './firebase'

const auth = getAuth(firebaseApp)
auth.languageCode = 'es'

const emulatorHost = import.meta.env.VITE_FIREBASE_AUTH_EMULATOR_HOST
if (emulatorHost) {
  connectAuthEmulator(auth, emulatorHost)
}

export default auth
