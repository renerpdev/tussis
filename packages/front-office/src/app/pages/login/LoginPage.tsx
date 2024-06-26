import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithRedirect,
} from '@firebase/auth'
import { Button, Input, Spinner } from '@nextui-org/react'
import { fetchAndActivate, getValue } from 'firebase/remote-config'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FaGoogle } from 'react-icons/fa'
import { HiEye, HiEyeOff } from 'react-icons/hi'
import { toast } from 'react-toastify'
import auth from '../../firebase/auth'
import remoteConfig from '../../firebase/remote-config'
import usePersistStore from '../../usePersistStore'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingTemplate, setIsLoadingTemplate] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const { isSigningIn, setIsSigningIn } = usePersistStore()
  const { t, i18n } = useTranslation('translation', {
    keyPrefix: 'pages.login',
  })
  const { t: tAccount } = useTranslation('translation', {
    keyPrefix: 'pages.my-account',
  })
  const [isGoogleLoginActive, setIsGoogleLoginActive] = useState(false)
  const [isUserPassLoginActive, setIsUserPassLoginActive] = useState(false)
  const [isNonVerifiedUserSignUpActive, setIsNonVerifiedUserSignUpActive] = useState(false)
  const [isDisplayForgotPasswordActive, setIsDisplayForgotPasswordActive] = useState(false)

  const handleUserPassLogin = useCallback(async () => {
    setIsLoading(true)

    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error: any) {
      const errorMessage = error.message
      toast.error(errorMessage, {
        toastId: 'error-login',
      })
    }
    setIsLoading(false)
  }, [email, password])

  const handleGoogleLogin = useCallback(async () => {
    setIsSigningIn(true)

    const provider = new GoogleAuthProvider()
    provider.setDefaultLanguage(i18n.language)
    provider.addScope('https://www.googleapis.com/auth/userinfo.email')
    provider.addScope('https://www.googleapis.com/auth/userinfo.profile')

    try {
      await signInWithRedirect(auth, provider)
    } catch (error: any) {
      const errorMessage = error.message
      toast.error(errorMessage, {
        toastId: 'error-google-login',
      })
    } finally {
      setIsSigningIn(false)
    }
  }, [i18n.language, setIsSigningIn])

  const handleUserPassSignUp = useCallback(async () => {
    setIsLoading(true)

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password)
      await sendEmailVerification(userCred.user)
      toast.success(tAccount('verify-email-sent'))
    } catch (error: any) {
      const errorMessage = error.message
      toast.error(errorMessage, {
        toastId: 'error-login',
      })
    }
    setIsLoading(false)
  }, [email, password, tAccount])

  const handleResetPassword = useCallback(async () => {
    setIsLoading(true)
    try {
      await sendPasswordResetEmail(auth, email)
      toast.success(t('reset-password-email-sent'))
    } catch (error: any) {
      toast.error(error.message, {
        toastId: 'error-reset-password',
      })
    } finally {
      setIsLoading(false)
    }
  }, [email, t])

  useEffect(() => {
    setIsLoadingTemplate(true)
    fetchAndActivate(remoteConfig)
      .then(() => {
        const nonVerifiedUserSignUpActiveValue = getValue(remoteConfig, 'create_non_verified_users')
        const googleLoginActiveValue = getValue(remoteConfig, 'login_with_google')
        const userPassLoginActiveValue = getValue(remoteConfig, 'login_with_password')
        const displayForgotPasswordActiveValue = getValue(remoteConfig, 'display_reset_password')

        setIsNonVerifiedUserSignUpActive(nonVerifiedUserSignUpActiveValue.asBoolean())
        setIsDisplayForgotPasswordActive(displayForgotPasswordActiveValue.asBoolean())
        setIsGoogleLoginActive(googleLoginActiveValue.asBoolean())
        setIsUserPassLoginActive(userPassLoginActiveValue.asBoolean())
      })
      .catch(error => {
        toast.error(error.message)
      })
      .finally(() => {
        setIsLoadingTemplate(false)
      })
  }, [])

  return (
    <div className="h-[100dvh] flex flex-col items-center gap-2 bg-cyan-50 dark:bg-gray-800 pt-[10vh] relative px-4">
      <h1 className="mb-4 text-3xl md:text-4xl lg:text-5xl font-bold text-cyan-600 dark:text-white pb-2 text-center">
        {/* this is just to load Tailwind classnames */}
        <span className="text-cyan-800 dark:text-cyan-600 d-none" />
        {/* end */}
        <div dangerouslySetInnerHTML={{ __html: t('welcome') }} />
      </h1>
      <div className="py-8 px-6 border-cyan-600 border-1 shadow-lg shadow-cyan-200 bg-white dark:bg-transparent w-full max-w-[25rem] flex flex-col items-center justify-center">
        <h2 className="mb-4 text-xl md:text-2xl lg:text-3xl font-bold text-cyan-600 dark:text-white pb-2 text-center">
          {t('title')}
        </h2>
        <div className="w-full flex flex-col gap-3">
          {isUserPassLoginActive && (
            <>
              <Input
                id="email"
                type="email"
                onValueChange={setEmail}
                label={t('email')}
                classNames={{
                  inputWrapper: 'dark:bg-gray-500',
                  input: 'focus:ring-transparent dark:focus:ring-transparent',
                }}
              />
              <Input
                id="pass"
                onValueChange={setPassword}
                label={t('password')}
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
                className="bg-cyan-600 py-6 border-1 hover:bg-cyan-500 text-white hover:text-white w-full"
                type="submit"
                onClick={handleUserPassLogin}
              >
                {t('login-button')}
              </Button>
            </>
          )}
          {isDisplayForgotPasswordActive && (
            <button
              className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-400 cursor-pointer"
              onClick={handleResetPassword}
            >
              {t('forgot-password')}
            </button>
          )}
          {isNonVerifiedUserSignUpActive && (
            <Button
              className="bg-transparent py-6 border-2 border-cyan-600 hover:bg-cyan-500 text-cyan-600 hover:text-white w-full"
              type="submit"
              onClick={handleUserPassSignUp}
            >
              {t('register-button')}
            </Button>
          )}
        </div>
        <div className="h-2 border-b-1 border-b-cyan-800 border-dashed opacity-40 w-full my-5 d-block" />
        {isGoogleLoginActive && (
          <Button
            className="w-full py-6 bg-white dark:bg-cyan-600 hover:bg-cyan-500 dark:hover:bg-cyan-400 border-2 border-green-500 shadow-lg text-green-500 dark:text-white hover:text-white mx-auto"
            type="button"
            onClick={handleGoogleLogin}
          >
            <FaGoogle className="inline-block" /> {t('google-login-button')}
          </Button>
        )}

        {(isLoading || isSigningIn || isLoadingTemplate) && (
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
