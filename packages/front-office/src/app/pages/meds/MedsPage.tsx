import { SortDescriptor } from '@nextui-org/react'
import React from 'react'
import CrudScreen from '../../../shared/components/CrudScreen/CrudScreen'
import { DEFAULT_ITEMS_PER_PAGE } from '../../../shared/constants'
import { CrudModel, Med } from '../../../shared/models'
import { Column } from '../../../shared/types'

const INITIAL_VISIBLE_COLUMNS = ['name', 'desc', 'actions']

const columns: Column[] = [
  { name: 'ID', uid: 'id', type: 'string', sortable: true },
  { name: 'NAME', uid: 'name', type: 'string', sortable: true },
  { name: 'DESC', uid: 'desc', type: 'string', sortable: true },
  { name: 'ACTIONS', uid: 'actions', type: 'action' },
]

export default function MedsPage() {
  const [rowsPerPage, setRowsPerPage] = React.useState(DEFAULT_ITEMS_PER_PAGE)
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: 'name',
    direction: 'ascending',
  })
  const [page, setPage] = React.useState(1)

  const model: CrudModel<Med> = {
    create: {
      endpoint: 'meds',
      model: {
        name: '',
        desc: '',
      },
    },
    update: {
      endpoint: 'meds',
    },
    delete: {
      endpoint: 'meds',
    },
    view: {
      endpoint: 'meds',
    },
  }

  return (
    <CrudScreen<Med>
      model={model}
      defaultColumns={INITIAL_VISIBLE_COLUMNS}
      page={page}
      setPage={setPage}
      rowsPerPage={rowsPerPage}
      setRowsPerPage={setRowsPerPage}
      sortDescriptor={sortDescriptor}
      setSortDescriptor={setSortDescriptor}
      columns={columns}
    />
  )
}
