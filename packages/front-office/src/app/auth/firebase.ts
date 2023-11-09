// Import the functions you need from the SDKs
import type { FirebaseOptions } from 'firebase/app'
import { initializeApp } from 'firebase/app'

const firebaseConfig: FirebaseOptions = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

export default app
