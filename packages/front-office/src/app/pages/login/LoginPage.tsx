import {
  GoogleAuthProvider,
  User,
  getAuth,
  signInAnonymously,
  signInWithRedirect,
} from '@firebase/auth'
import { Button, Spinner } from '@nextui-org/react'
import firebase from 'firebase/compat/app'
import * as firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import auth from '../../auth/auth'
import { usePersistedStore } from '../../useStore'

const MODE = import.meta.env.MODE
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

export default function LoginPage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const { setCurrentUser, currentUser } = usePersistedStore()

  const onLoginSuccess = useCallback(
    (user: User) => {
      setCurrentUser(user)
      navigate('/')
    },
    [navigate, setCurrentUser],
  )

  // TODO: only for testing
  const handleAnonymousLogin = useCallback(async () => {
    setIsLoading(true)
    signInAnonymously(auth)
      .then(userCredential => {
        onLoginSuccess(userCredential.user)
      })
      .catch(error => {
        console.log('error', error)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [onLoginSuccess])

  const handleLoginPopup = useCallback(async () => {
    setIsLoading(true)

    const provider = new GoogleAuthProvider()

    signInWithRedirect(auth, provider)
      .then(result => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        // const credential = GoogleAuthProvider.credentialFromResult(result)
        // const token = credential?.accessToken
      })
      .catch(error => {
        const errorMessage = error.message
        toast.error(errorMessage, {
          toastId: 'error-login',
        })
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  useEffect(() => {
    const auth = getAuth()
    const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth)

    const uiConfig = {
      callbacks: {
        signInSuccessWithAuthResult: function (authResult: any) {
          onLoginSuccess(authResult?.user)
          return false
        },
        uiShown: function () {
          setIsLoading(false)
        },
        signInFailure: function (error: any) {
          window.location.assign('/error')
        },
        onLoginSuccess: function (user: any) {
          console.log('onLoginSuccess', user)
        },
      },
      signInOptions: [
        {
          provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          // Required to enable ID token credentials for this provider.
          clientId: CLIENT_ID,
          signInMethod: firebase.auth.GoogleAuthProvider.GOOGLE_SIGN_IN_METHOD,
        },
        {
          provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
          signInMethod: firebase.auth.EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD,
          requireDisplayName: true,
          buttonColor: '#0991B1',
          disableSignUp: {
            status: true,
          },
        },
      ],
      // Terms of service url.
      tosUrl: 'https://www.google.com',
      // Privacy policy url.
      privacyPolicyUrl: 'https://www.google.com',
      credentialHelper:
        CLIENT_ID && CLIENT_ID !== 'YOUR_OAUTH_CLIENT_ID'
          ? firebaseui.auth.CredentialHelper.GOOGLE_YOLO
          : firebaseui.auth.CredentialHelper.NONE,
    }
    ui.start('#firebaseui-auth-container', uiConfig)
  }, [currentUser, navigate, onLoginSuccess])

  return (
    <div
      className="flex flex-col items-center gap-2 bg-cyan-50 dark:bg-gray-800 pt-[10vh]"
      style={{ minHeight: '100vh' }}
    >
      <h1 className="mb-4 text-3xl md:text-4xl lg:text-5xl font-bold text-cyan-600 dark:text-white pb-2 text-center">
        Welcome to <span className="text-cyan-800">TUSSIS</span>
      </h1>
      <div className="py-10 px-6 border-cyan-600 border-1 shadow-lg shadow-cyan-200 bg-white dark:bg-gray-100">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-cyan-600 dark:text-cyan-800 pb-2 text-center">
          Login Page
        </h2>
        <div id="firebaseui-auth-container"></div>
        {MODE === 'development' && (
          <div className="flex flex-col items-center justify-center mt-4">
            {/*TODO: remove this anonymous login method once testing is done*/}
            <Button
              className="bg-transparent hover:bg-transparent text-cyan-800 hover:text-cyan-600 underline"
              onClick={handleAnonymousLogin}
            >
              Ingreso Anonimo
            </Button>
            <Button
              className="bg-transparent hover:bg-transparent text-cyan-800 hover:text-cyan-600 underline"
              onClick={handleLoginPopup}
            >
              Login Popup
            </Button>
          </div>
        )}
        {isLoading && (
          <div className="text-center h-full z-50 fixed left-0 top-0 flex flex-col justify-center items-center w-full bg-white bg-opacity-50 overflow-hidden">
            <Spinner
              size="md"
              classNames={{
                wrapper: 'h-16 w-16',
                circle1: 'border-b-cyan-600',
                circle2: 'border-b-cyan-600',
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
