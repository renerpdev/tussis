import { SortDescriptor, useDisclosure } from '@nextui-org/react'
import React, { useCallback } from 'react'
import { CrudScreen } from '../../../shared/components'
import { DEFAULT_ITEMS_PER_PAGE } from '../../../shared/constants'
import { CrudModel } from '../../../shared/models'
import { User } from '../../../shared/models/user.model'
import { Column } from '../../../shared/types'
import { useStore } from '../../useStore'
import ModalUpdateRole from './modal-update-role/ModalUpdateRole'

const INITIAL_VISIBLE_COLUMNS = ['photoUrl', 'displayName', 'email', 'role', 'actions']

const columns: Column[] = [
  { name: 'UID', uid: 'uid', type: 'string', sortable: true },
  { name: 'AVATAR', uid: 'photoUrl', type: 'picture' },
  { name: 'NAME', uid: 'displayName', type: 'string', sortable: true },
  { name: 'EMAIL', uid: 'email', type: 'string', sortable: true },
  { name: 'ROLE', uid: 'role', type: 'string' },
  { name: 'DISABLED', uid: 'disabled', type: 'boolean' },
  { name: 'LAST LOGIN', uid: 'lastLoginAt', type: 'datetime' },
  { name: 'EMAIL VERIFIED', uid: 'emailVerified', type: 'boolean' },
  { name: 'ACTIONS', uid: 'actions', type: 'action' },
]

export default function UsersPage() {
  const [rowsPerPage, setRowsPerPage] = React.useState(DEFAULT_ITEMS_PER_PAGE)
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: 'displayName',
    direction: 'ascending',
  })
  const [page, setPage] = React.useState(1)
  const { usersUpdatedAt, setUsersUpdatedAt } = useStore()
  const [selectedUser, setSelectedUser] = React.useState<User | undefined>(undefined)

  const model: CrudModel<User> = {
    create: {
      endpoint: 'users',
      model: {
        displayName: {
          type: 'text',
        },
        email: {
          type: 'email',
        },
        password: {
          type: 'password',
        },
        emailVerified: {
          type: 'toggle',
        },
        disabled: {
          type: 'toggle',
        },
        photoUrl: {
          type: 'url',
        },
      },
    },
    update: {
      endpoint: 'users',
    },
    delete: {
      endpoint: 'users',
    },
    view: {
      endpoint: 'users',
    },
  }

  const { isOpen: isModalOpen, onClose: onModalClose, onOpen: onModalOpen } = useDisclosure()

  const handleOnUpdateRole = useCallback(
    (user: User) => {
      setSelectedUser(user)
      onModalOpen()
    },
    [onModalOpen],
  )

  const additionalDropdownItems = [
    {
      key: 'update-role',
      onPress: handleOnUpdateRole,
      className: 'dark:hover:bg-cyan-600',
      children: 'Update role',
    },
  ]

  return (
    <>
      <CrudScreen<User>
        model={model}
        defaultColumns={INITIAL_VISIBLE_COLUMNS}
        page={page}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        sortDescriptor={sortDescriptor}
        setSortDescriptor={setSortDescriptor}
        columns={columns}
        timestamp={usersUpdatedAt}
        setTimestamp={setUsersUpdatedAt}
        additionalDropdownItems={additionalDropdownItems}
      />
      <ModalUpdateRole
        model={model}
        isOpen={isModalOpen}
        user={selectedUser}
        onClose={onModalClose}
        sortDescriptor={sortDescriptor}
      />
    </>
  )
}
