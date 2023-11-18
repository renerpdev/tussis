import { SortDescriptor } from '@nextui-org/react'
import React from 'react'
import { CrudScreen } from '../../../shared/components'
import { DEFAULT_ITEMS_PER_PAGE } from '../../../shared/constants'
import { CrudModel } from '../../../shared/models'
import { User } from '../../../shared/models/user.model'
import { Column } from '../../../shared/types'
import { useStore } from '../../useStore'

const INITIAL_VISIBLE_COLUMNS = ['photoUrl', 'displayName', 'email', 'role', 'actions']

const columns: Column[] = [
  { name: 'UID', uid: 'uid', type: 'string', sortable: true },
  { name: 'AVATAR', uid: 'photoUrl', type: 'picture' },
  { name: 'NAME', uid: 'displayName', type: 'string', sortable: true },
  { name: 'EMAIL', uid: 'email', type: 'string', sortable: true },
  { name: 'ROLE', uid: 'role', type: 'string' },
  { name: 'DISABLED', uid: 'disabled', type: 'boolean' },
  { name: 'LAST LOGIN', uid: 'lastLoginAt', type: 'string' },
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

  return (
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
    />
  )
}
