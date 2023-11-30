import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Selection,
  SortDescriptor,
} from '@nextui-org/react'
import { useFilter } from '@react-aria/i18n'
import { Key, useCallback, useMemo, useState } from 'react'
import { useCookies } from 'react-cookie'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery } from 'react-query'
import { toast } from 'react-toastify'
import { TussisApi } from '../../../../api'
import { CrudModel } from '../../../../shared/models'
import { User } from '../../../../shared/models/user.model'
import { PaginatedQueryResponse } from '../../../../shared/types'
import { UserRole } from '../../../../shared/types/auth.types'
import { AUTH_COOKIE_NAME } from '../../../../shared/utils'
import { useStore } from '../../../useStore'

type UserClaims = {
  role: UserRole
  supervisedUid?: string
}

const roles = [
  { label: 'Admin', value: 'admin' },
  { label: 'Editor', value: 'editor' },
  { label: 'Supervisor', value: 'supervisor' },
  { label: 'N/A', value: '' },
]

type FieldState = {
  selectedKey: Key | null
  inputValue: string
  items: { label: string; value: string }[]
}

interface ModalViewProps {
  model: CrudModel<User>
  isOpen: boolean
  user?: User
  onClose: () => void
  sortDescriptor: SortDescriptor
}

const rowsPerPage = 100
const page = 1
export default function ModalUpdateRole({
  isOpen,
  onClose,
  user,
  model,
  sortDescriptor,
}: ModalViewProps) {
  const { usersUpdatedAt, setUsersUpdatedAt } = useStore()
  const [cookies] = useCookies([AUTH_COOKIE_NAME])
  const currentUser = useMemo(() => cookies.auth.user, [cookies])
  const [selectorValue, setSelectorValue] = useState<Selection>(new Set([user?.role ?? '']))
  const { t: tCrud } = useTranslation('translation', {
    keyPrefix: 'pages.crud',
  })
  const { t: tTable } = useTranslation('translation', {
    keyPrefix: 'components.data-table',
  })

  const isSupervisor = useMemo(
    () => selectorValue.currentKey === 'supervisor',
    [selectorValue.currentKey],
  )

  const { isFetching: isFetchingUsers, data: usersResponse } = useQuery<
    unknown,
    unknown,
    PaginatedQueryResponse<User>
  >(
    [model.view.endpoint, page, rowsPerPage, sortDescriptor, usersUpdatedAt, currentUser?.uid],
    () =>
      TussisApi.get(model.view.endpoint, {
        limit: rowsPerPage,
        sort: `${sortDescriptor.column}:${
          sortDescriptor.direction === 'ascending' ? 'asc' : 'desc'
        }`,
        offset: rowsPerPage * (page - 1),
      }),
  )

  const users = useMemo(
    () => usersResponse?.data.map(user => ({ label: user.email, value: user.uid })) ?? [],
    [usersResponse],
  )

  const [fieldState, setFieldState] = useState<FieldState>({
    selectedKey: '',
    inputValue: '',
    items: users,
  })

  const isCtaEnabled = useMemo(() => {
    if (isSupervisor && !isFetchingUsers) return fieldState.selectedKey !== ''

    return selectorValue.currentKey !== user?.role
  }, [fieldState.selectedKey, isFetchingUsers, isSupervisor, selectorValue.currentKey, user?.role])

  const resetFieldState = useCallback(() => {
    setSelectorValue(new Set(['']))
    setFieldState({ selectedKey: '', inputValue: '', items: users })
  }, [users])

  const updateClaimsMutation = useMutation({
    mutationFn: async (claims: UserClaims) => {
      const res = await TussisApi.update(`${model.update.endpoint}/${user?.uid}/claims`, claims)
      resetFieldState()
      setUsersUpdatedAt(Date.now())
      toast.success('User role updated successfully')
      onClose?.()
      return res
    },
  })

  const handleOnSubmit = useCallback(() => {
    if (isCtaEnabled) {
      updateClaimsMutation.mutate({
        role: selectorValue.currentKey ?? null,
        supervisedUid: isSupervisor ? (fieldState.selectedKey as string) ?? undefined : undefined,
      })
    }
  }, [
    isCtaEnabled,
    updateClaimsMutation,
    selectorValue.currentKey,
    isSupervisor,
    fieldState.selectedKey,
  ])

  const { startsWith } = useFilter({ sensitivity: 'base' })

  // Specify how each of the Autocomplete values should change when an
  // option is selected from the list box
  const onSelectionChange = (key: Key) => {
    setFieldState(prevState => {
      const selectedItem = prevState.items.find(option => option.value === key)

      return {
        inputValue: selectedItem?.label || '',
        selectedKey: key,
        items: users.filter(item => startsWith(item.label, selectedItem?.label || '')),
      }
    })
  }

  // Specify how each of the Autocomplete values should change when the input
  // field is altered by the user
  const onInputChange = (value: string) => {
    setFieldState(prevState => ({
      inputValue: value,
      selectedKey: value === '' ? null : prevState.selectedKey,
      items: users.filter(item => startsWith(item.label, value)),
    }))
  }

  const handleOnClose = useCallback(() => {
    resetFieldState()
    onClose?.()
  }, [onClose, resetFieldState])

  return (
    <Modal
      backdrop={'blur'}
      isOpen={isOpen}
      onClose={handleOnClose}
      isDismissable
    >
      <ModalContent className="dark:bg-gray-800">
        {onClose => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {tCrud('update-role-modal-title')}
            </ModalHeader>
            <ModalBody>
              <Select
                items={roles}
                disallowEmptySelection
                label={tTable('columns.USER ROLE')}
                className="w-full"
                selectedKeys={selectorValue}
                onSelectionChange={setSelectorValue}
                classNames={{
                  trigger:
                    'bg-gray-100 dark:bg-gray-700 dark:placeholder-gray-300 dark:focus:ring-cyan-500',
                  popoverContent: 'dark:bg-gray-600',
                }}
              >
                {role => (
                  <SelectItem
                    key={role.value}
                    value={role.value}
                  >
                    {role.label}
                  </SelectItem>
                )}
              </Select>
              {isSupervisor && (
                <Autocomplete
                  items={fieldState.items}
                  onInputChange={onInputChange}
                  inputValue={fieldState.inputValue}
                  selectedKey={fieldState.selectedKey}
                  onSelectionChange={onSelectionChange}
                  label={tTable('columns.SUPERVISED USER UID')}
                  placeholder={tCrud(`forms.input.placeholder.generic`, {
                    value: tTable('columns.SUPERVISED USER UID'),
                  })}
                  labelPlacement="outside"
                  isLoading={isFetchingUsers}
                  variant="flat"
                  classNames={{
                    base: 'bg-transparent',
                    popoverContent: 'dark:bg-gray-600',
                  }}
                  inputProps={{
                    classNames: {
                      input: 'bg-transparent focus:ring-transparent',
                      inputWrapper: 'dark:bg-gray-700 dark:placeholder-gray-300',
                    },
                  }}
                >
                  {item => (
                    <AutocompleteItem
                      key={item.value}
                      placeholder={tCrud('forms.input.description.no-results-found')}
                    >
                      {item.label}
                    </AutocompleteItem>
                  )}
                </Autocomplete>
              )}
            </ModalBody>
            <ModalFooter>
              <Button
                color="default"
                variant="light"
                onPress={onClose}
              >
                Close
              </Button>
              <Button
                className="bg-cyan-600 hover:bg-cyan-500 text-white disabled:opacity-50"
                onPress={handleOnSubmit}
                isLoading={updateClaimsMutation.isLoading}
                disabled={!isCtaEnabled}
              >
                {tCrud('update')}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
