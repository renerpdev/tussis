import { SortDescriptor } from '@nextui-org/react'
import React from 'react'
import { CrudScreen } from '../../../shared/components'
import { DEFAULT_ITEMS_PER_PAGE } from '../../../shared/constants'
import { CrudModel, Symptom } from '../../../shared/models'
import { Column } from '../../../shared/types'
import { useStore } from '../../useStore'

const INITIAL_VISIBLE_COLUMNS = ['name', 'desc', 'actions']

const columns: Column[] = [
  { name: 'ID', uid: 'id', type: 'string', sortable: true },
  { name: 'NAME', uid: 'name', type: 'string', sortable: true },
  { name: 'DESC', uid: 'desc', type: 'string', sortable: true },
  { name: 'ACTIONS', uid: 'actions', type: 'action' },
]

export default function SymptomsPage() {
  const [rowsPerPage, setRowsPerPage] = React.useState(DEFAULT_ITEMS_PER_PAGE)
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: 'name',
    direction: 'ascending',
  })
  const [page, setPage] = React.useState(1)
  const { symptomsUpdatedAt, setSymptomsUpdatedAt } = useStore()

  const model: CrudModel<Symptom> = {
    create: {
      endpoint: 'symptoms',
      model: {
        name: {
          type: 'text',
        },
        desc: {
          type: 'textarea',
        },
      },
    },
    update: {
      endpoint: 'symptoms',
    },
    delete: {
      endpoint: 'symptoms',
    },
    view: {
      endpoint: 'symptoms',
    },
  }

  return (
    <CrudScreen<Symptom>
      model={model}
      defaultColumns={INITIAL_VISIBLE_COLUMNS}
      page={page}
      setPage={setPage}
      rowsPerPage={rowsPerPage}
      setRowsPerPage={setRowsPerPage}
      sortDescriptor={sortDescriptor}
      setSortDescriptor={setSortDescriptor}
      columns={columns}
      timestamp={symptomsUpdatedAt}
      setTimestamp={setSymptomsUpdatedAt}
    />
  )
}
