import { getAuth, sendEmailVerification } from '@firebase/auth'
import { Avatar, Button, Chip, Divider, Spinner } from '@nextui-org/react'
import { useCallback, useMemo, useState } from 'react'
import { useCookies } from 'react-cookie'
import { useTranslation } from 'react-i18next'
import { HiTrash } from 'react-icons/hi'
import { useMutation } from 'react-query'
import { toast } from 'react-toastify'
import { TussisApi } from '../../../api'
import { User } from '../../../shared/models/user.model'
import { AUTH_COOKIE_NAME } from '../../../shared/utils'

function MyAccount() {
  const [cookies, setCookie] = useCookies([AUTH_COOKIE_NAME])
  const currentUser = useMemo(() => cookies.auth?.user as User, [cookies])
  const { t } = useTranslation('translation', {
    keyPrefix: 'pages.my-account',
  })
  const { t: tProfile } = useTranslation('translation', {
    keyPrefix: 'profile',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isDirty, setIsDirty] = useState(false)

  const { mutateAsync: deleteUserAccount, isLoading: isLoadingDeleteUserAccount } = useMutation({
    mutationFn: async () => await TussisApi.delete(`users/remove-account`),
  })

  const { mutateAsync: updateUserAccount, isLoading: isLoadingUpdateUserAccount } = useMutation({
    mutationFn: async data => await TussisApi.update(`users/update-account`, data),
  })

  const handleRemoveAccount = useCallback(async () => {
    const confirmedDeletion = window.confirm(t('delete-account-confirmation'))
    if (confirmedDeletion) {
      await deleteUserAccount()
      toast.success(t('account-deleted'))
      // clear cookies and redirect to login page after account deletion
      setCookie(AUTH_COOKIE_NAME, null, { path: '/' })
    }
  }, [t, deleteUserAccount, setCookie])

  const handleUpdateAccount = useCallback(async () => {
    if (isDirty) {
      await updateUserAccount({} as any)
      toast.success(t('account-updated'))
    }
  }, [isDirty, updateUserAccount, t])

  const handleSendVerificationEmail = useCallback(async () => {
    setIsLoading(true)
    try {
      const user = getAuth().currentUser
      await sendEmailVerification(user || ({} as any))
      toast.success(t('verify-email-sent'))
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setIsLoading(false)
    }
  }, [t])

  return (
    <div className="flex flex-col">
      {/*<div className="flex items-center justify-end">*/}
      {/*  <Button*/}
      {/*    className={`bg-cyan-600 text-white ${!isDirty ? 'bg-opacity-50' : ''}`}*/}
      {/*    disabled={!isDirty}*/}
      {/*    onClick={handleUpdateAccount}*/}
      {/*  >*/}
      {/*    {t('save')}*/}
      {/*  </Button>*/}
      {/*</div>*/}
      {/*<Divider className="my-4" />*/}
      <div className="text-center my-2 rounded-3xl py-2 px-8 bg-blue-200 text-blue-800 border-1 border-blue-800 font-medium w-fit mx-auto">
        Próximamente podrás actualizar los datos de tu cuenta desde esta pantalla.
      </div>
      <div className="flex flex-col items-center justify-center py-4">
        <div className="relative h-20 w-20 overflow-hidden rounded-full">
          <Avatar
            src={currentUser.photoURL}
            className="h-20 w-20 z-1"
          />
        </div>
        <p className="mt-3 text-lg">{currentUser.displayName || '-'}</p>
        {currentUser?.role && (
          <Chip
            variant="faded"
            size="sm"
            className="text-xs capitalize"
          >
            {tProfile(`roles.${currentUser?.role.toLowerCase()}`)}
          </Chip>
        )}
        <p className="mt-2 text-sm">{currentUser.email}</p>
        {(currentUser?.emailVerified && (
          <p className="mt-2 text-sm text-green-600 font-bold">{t('verified-account')}</p>
        )) || (
          <p className="mt-2 text-sm">
            <span className="text-red-600 font-bold">{t('non-verified-account')}:</span>{' '}
            <button
              className="underline cursor-pointer"
              onClick={handleSendVerificationEmail}
            >
              {t('send-verification-email')}
            </button>
          </p>
        )}

        <div className=" mt-14 w-full flex flex-col items-center">
          <Divider className="my-4" />
          <div className="flex items-center">
            <Button
              className={`bg-red-100 text-red-800 font-bold border-1 border-red-800 hover:bg-red-600 hover:text-white hover:border-red-600`}
              onClick={handleRemoveAccount}
            >
              <HiTrash /> {t('delete-account')}
            </Button>
          </div>
        </div>
      </div>
      {(isLoading || isLoadingDeleteUserAccount || isLoadingUpdateUserAccount) && (
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
  )
}

export default MyAccount
