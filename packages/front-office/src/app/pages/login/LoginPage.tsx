import { signInAnonymously, User } from '@firebase/auth'
import { Button, Spinner } from '@nextui-org/react'
import firebase from 'firebase/compat/app'
import * as firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import auth from '../../auth/auth'
import { usePersistedStore } from '../../useStore'

export default function LoginPage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const { setCurrentUser, currentUser } = usePersistedStore()

  const onLoginSuccess = useCallback(
    (user: User) => {
      console.log('userCredential', user)
      setCurrentUser(user)
      navigate('/')
    },
    [navigate, setCurrentUser],
  )

  const handleAnonymousLogin = useCallback(async () => {
    signInAnonymously(auth)
      .then(userCredential => {
        onLoginSuccess(userCredential.user)
      })
      .catch(error => {
        console.log('error', error)
      })
  }, [onLoginSuccess])

  useEffect(() => {
    const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth)

    const uiConfig = {
      callbacks: {
        signInSuccessWithAuthResult: function (authResult: any) {
          console.log('authResult', authResult)
          onLoginSuccess(authResult?.user)
          return false
        },
        uiShown: function () {
          setIsLoading(false)
        },
        signInFailure: function (error: any) {
          window.location.assign('/error')
        },
      },
      signInSuccessUrl: '/',
      autoUpgradeAnonymousUsers: true,
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        {
          provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
          signInMethod: firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD,
          requireDisplayName: true,
          buttonColor: '#0991B1',
          disableSignUp: {
            status: true,
          },
        },
      ],
    }
    if (ui.isPendingRedirect()) {
      ui.start('#firebaseui-auth-container', uiConfig)
    }
    ui.start('#firebaseui-auth-container', uiConfig)
  }, [currentUser, navigate, onLoginSuccess])

  return (
    <div
      className="flex flex-col items-center gap-2 bg-cyan-50 pt-[10vh]"
      style={{ minHeight: '100vh' }}
    >
      <h1 className="mb-4 text-3xl md:text-4xl lg:text-5xl font-bold text-cyan-600 dark:text-white pb-2 text-center">
        Welcome to <span className="text-cyan-800">TUSSIS</span>
      </h1>
      <div className="py-10 px-6 border-cyan-600 border-1 shadow-lg shadow-cyan-200 bg-white">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-cyan-600 dark:text-white pb-2 text-center">
          Login Page
        </h2>
        <div id="firebaseui-auth-container"></div>
        <div className="flex justify-center mt-4">
          {/*TODO: remove this anonymous login method once testing is done*/}
          <Button
            className="bg-transparent hover:bg-transparent text-cyan-800 hover:text-cyan-600 underline"
            onClick={handleAnonymousLogin}
          >
            Ingreso Anonimo
          </Button>
        </div>
        {isLoading && (
          <div
            id="loader"
            className="text-center my-4"
          >
            <Spinner />
          </div>
        )}
      </div>
    </div>
  )
}
