import {
  GoogleAuthProvider,
  IdTokenResult,
  User,
  getIdTokenResult,
  signInWithEmailAndPassword,
  signInWithPopup,
} from '@firebase/auth'
import { Button, Input, Spinner } from '@nextui-org/react'
import { useCallback, useState } from 'react'
import { useCookies } from 'react-cookie'
import { FaGoogle } from 'react-icons/fa'
import { HiEye, HiEyeOff } from 'react-icons/hi'
import { toast } from 'react-toastify'
import { AUTH_COOKIE_NAME } from '../../../shared/utils/cookies'
import auth from '../../auth/auth'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [, setCookie] = useCookies([AUTH_COOKIE_NAME])

  const updateCookie = useCallback(
    (user: User, tokenResult: IdTokenResult) => {
      const cookieValue = {
        user: {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          role: tokenResult?.claims.role,
        },
        accessToken: tokenResult?.token,
      }
      setCookie(AUTH_COOKIE_NAME, cookieValue, { path: '/' })
    },
    [setCookie],
  )

  const handleUserPassLogin = useCallback(async () => {
    setIsLoading(true)

    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password)
      const tokenResult = await getIdTokenResult(userCred.user)
      updateCookie(userCred.user, tokenResult)
    } catch (error: any) {
      const errorMessage = error.message
      toast.error(errorMessage, {
        toastId: 'error-login',
      })
    }
    setIsLoading(false)
  }, [email, password, updateCookie])

  const handleGoogleLogin = useCallback(async () => {
    setIsLoading(true)

    const provider = new GoogleAuthProvider()
    provider.setDefaultLanguage('es-ES')
    provider.addScope('https://www.googleapis.com/auth/userinfo.email')
    provider.addScope('https://www.googleapis.com/auth/userinfo.profile')

    try {
      const userCred = await signInWithPopup(auth, provider)
      const tokenResult = await getIdTokenResult(userCred.user)
      updateCookie(userCred.user, tokenResult)
    } catch (error: any) {
      const errorMessage = error.message
      toast.error(errorMessage, {
        toastId: 'error-google-login',
      })
    }
    setIsLoading(false)
  }, [updateCookie])

  return (
    <div
      className="flex flex-col items-center gap-2 bg-cyan-50 dark:bg-gray-800 pt-[10vh]"
      style={{ minHeight: '100vh' }}
    >
      <h1 className="mb-4 text-3xl md:text-4xl lg:text-5xl font-bold text-cyan-600 dark:text-white pb-2 text-center">
        Welcome to <span className="text-cyan-800 dark:text-cyan-600">TUSSIS</span>
      </h1>
      <div className="py-8 px-6 border-cyan-600 border-1 shadow-lg shadow-cyan-200 bg-white dark:bg-transparent w-full max-w-[20rem] flex flex-col items-center justify-center">
        <h2 className="mb-4 text-xl md:text-2xl lg:text-3xl font-bold text-cyan-600 dark:text-white pb-2 text-center">
          Login Page
        </h2>
        <div className="w-full flex flex-col gap-3">
          <Input
            id="email"
            autoFocus
            type="email"
            onValueChange={setEmail}
            label="Email"
            classNames={{
              inputWrapper: 'dark:bg-gray-500',
              input: 'focus:ring-transparent dark:focus:ring-transparent',
            }}
          />
          <Input
            id="pass"
            onValueChange={setPassword}
            label="Password"
            classNames={{
              inputWrapper: 'dark:bg-gray-500',
              input: 'focus:ring-transparent dark:focus:ring-transparent',
            }}
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
              >
                {isPasswordVisible ? (
                  <HiEyeOff className="text-2xl text-default-400 pointer-events-none" />
                ) : (
                  <HiEye className="text-2xl text-default-400 pointer-events-none" />
                )}
              </button>
            }
            type={isPasswordVisible ? 'text' : 'password'}
          />
          <Button
            className="bg-cyan-600 border-1 hover:bg-cyan-500 text-white hover:text-white w-full"
            type="submit"
            onClick={handleUserPassLogin}
          >
            Iniciar
          </Button>
        </div>
        <div className="h-2 border-b-1 border-b-cyan-800 border-dashed opacity-40 w-full my-5 d-block" />
        <Button
          className="bg-transparent dark:bg-cyan-600 border-1 border-cyan-600 hover:bg-cyan-500 dark:hover:bg-cyan-400 text-cyan-600 dark:text-white hover:text-white mx-auto"
          type="button"
          onClick={handleGoogleLogin}
        >
          <FaGoogle className="inline-block" /> Google
        </Button>

        {isLoading && (
          <div className="text-center h-full z-50 fixed left-0 top-0 flex flex-col justify-center items-center w-full bg-gray-400 bg-opacity-50 overflow-hidden">
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
