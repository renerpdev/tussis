import { SortDescriptor } from '@nextui-org/react'
import React from 'react'
import { useQuery } from 'react-query'
import { TussisApi } from '../../../api'
import CrudScreen from '../../../shared/components/CrudScreen/CrudScreen'
import { DEFAULT_ITEMS_PER_PAGE } from '../../../shared/constants'
import { CrudModel, Issue } from '../../../shared/models'
import { Column } from '../../../shared/types'

const INITIAL_VISIBLE_COLUMNS = ['date', 'symptoms', 'meds', 'actions']

const columns: Column[] = [
  { name: 'ID', uid: 'id', type: 'string', sortable: true },
  { name: 'DATE', uid: 'date', type: 'date', sortable: true },
  { name: 'SYMPTOMS', uid: 'symptoms', type: 'array' },
  { name: 'MEDS', uid: 'meds', type: 'array' },
  { name: 'NOTES', uid: 'notes', type: 'string', sortable: true },
  { name: 'ACTIONS', uid: 'actions', type: 'action' },
]

export default function IssuesPage() {
  const [rowsPerPage, setRowsPerPage] = React.useState(DEFAULT_ITEMS_PER_PAGE)
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: 'date',
    direction: 'ascending',
  })
  const [page, setPage] = React.useState(1)
  const [timestamp] = React.useState(Date.now())

  const {
    isFetching: isFetchingMeds,
    error: errMeds,
    data: responseMeds,
  } = useQuery(['get-meds', page, rowsPerPage, sortDescriptor, timestamp], () =>
    TussisApi.get('meds', {
      limit: 100,
      sort: 'name:asc',
      offset: 0,
    }),
  )

  const {
    isFetching: isFetchingSymptoms,
    error: errSymptoms,
    data: responseSymptoms,
  } = useQuery(['get-symptoms', page, rowsPerPage, sortDescriptor, timestamp], () =>
    TussisApi.get('symptoms', {
      limit: 100,
      sort: 'name:asc',
      offset: 0,
    }),
  )

  const model: CrudModel<Issue> = {
    create: {
      endpoint: 'issues',
      model: {
        date: new Date(),
        meds: {
          isLoading: isFetchingMeds,
          data: responseMeds?.data || [],
          error: errMeds,
        },
        symptoms: {
          isLoading: isFetchingSymptoms,
          data: responseSymptoms?.data || [],
          error: errSymptoms,
        },
        notes: 'here goes a long string',
      },
    },
    update: {
      endpoint: 'issues',
    },
    delete: {
      endpoint: 'issues',
    },
    view: {
      endpoint: 'issues',
    },
    report: {
      endpoint: 'issues/report',
    },
  }

  return (
    <CrudScreen<Issue>
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
