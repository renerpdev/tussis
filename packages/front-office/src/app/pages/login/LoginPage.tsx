import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from '@firebase/auth'
import { Button, Input, Spinner } from '@nextui-org/react'
import { useCallback, useState } from 'react'
import { FaGoogle } from 'react-icons/fa'
import { toast } from 'react-toastify'
import auth from '../../auth/auth'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleUserPassLogin = useCallback(() => {
    setIsLoading(true)

    signInWithEmailAndPassword(auth, email, password)
      .catch(error => {
        const errorMessage = error.message
        toast.error(errorMessage, {
          toastId: 'error-login',
        })
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [email, password])

  const handleGoogleLogin = useCallback(async () => {
    setIsLoading(true)

    const provider = new GoogleAuthProvider()

    signInWithPopup(auth, provider)
      .catch(error => {
        const errorMessage = error.message
        toast.error(errorMessage, {
          toastId: 'error-google-login',
        })
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

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
            type="password"
            onValueChange={setPassword}
            label="Password"
            classNames={{
              inputWrapper: 'dark:bg-gray-500',
              input: 'focus:ring-transparent dark:focus:ring-transparent',
            }}
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
