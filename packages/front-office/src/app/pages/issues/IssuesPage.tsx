import { SortDescriptor } from '@nextui-org/react'
import React, { useMemo } from 'react'
import { useCookies } from 'react-cookie'
import { useQuery } from 'react-query'
import { TussisApi } from '../../../api'
import i18next from '../../../i18n'
import { CrudScreen } from '../../../shared/components'
import { DEFAULT_ITEMS_PER_PAGE } from '../../../shared/constants'
import { CrudModel, Issue } from '../../../shared/models'
import { Column } from '../../../shared/types'
import { AUTH_COOKIE_NAME } from '../../../shared/utils'
import { useStore } from '../../useStore'

const INITIAL_VISIBLE_COLUMNS = ['date', 'symptoms', 'meds', 'actions']

const columns: Column[] = [
  {
    name: i18next.t('components.data-table.columns.ID'),
    uid: 'id',
    type: 'string',
    sortable: true,
  },
  {
    name: i18next.t('components.data-table.columns.DATE'),
    uid: 'date',
    type: 'date',
    sortable: true,
  },
  { name: i18next.t('components.data-table.columns.SYMPTOMS'), uid: 'symptoms', type: 'array' },
  { name: i18next.t('components.data-table.columns.MEDS'), uid: 'meds', type: 'array' },
  {
    name: i18next.t('components.data-table.columns.NOTES'),
    uid: 'notes',
    type: 'string',
    sortable: true,
  },
  { name: i18next.t('components.data-table.columns.ACTIONS'), uid: 'actions', type: 'action' },
]

export default function IssuesPage() {
  const [rowsPerPage, setRowsPerPage] = React.useState(DEFAULT_ITEMS_PER_PAGE)
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: 'date',
    direction: 'descending',
  })
  const [page, setPage] = React.useState(1)
  const { symptomsUpdatedAt, medsUpdatedAt, issuesUpdatedAt, setIssuesUpdatedAt } = useStore()
  const [cookies] = useCookies([AUTH_COOKIE_NAME])
  const currentUser = useMemo(() => cookies.auth.user, [cookies])

  const {
    isFetching: isFetchingMeds,
    error: errMeds,
    data: responseMeds,
  } = useQuery(
    [
      'meds',
      page,
      rowsPerPage,
      {
        column: 'name',
        direction: 'ascending',
      },
      medsUpdatedAt,
      currentUser?.uid,
    ],
    () =>
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
  } = useQuery(
    [
      'symptoms',
      page,
      rowsPerPage,
      {
        column: 'name',
        direction: 'ascending',
      },
      symptomsUpdatedAt,
      currentUser?.uid,
    ],
    () =>
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
        date: {
          type: 'datepicker',
        },
        meds: {
          type: 'multiselect',
          isLoading: isFetchingMeds,
          data: responseMeds?.data || [],
          error: errMeds,
        },
        symptoms: {
          type: 'multiselect',
          isLoading: isFetchingSymptoms,
          data: responseSymptoms?.data || [],
          error: errSymptoms,
        },
        notes: {
          type: 'textarea',
        },
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
      endpoint: 'issues/export/pdf',
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
      timestamp={issuesUpdatedAt + symptomsUpdatedAt + medsUpdatedAt}
      setTimestamp={setIssuesUpdatedAt}
    />
  )
}
