import { Selection, SortDescriptor, useDisclosure } from '@nextui-org/react'

import { MenuItemBaseProps } from '@nextui-org/menu/dist/base/menu-item-base'
import dayjs from 'dayjs'
import React, { Dispatch, SetStateAction, useMemo, useState } from 'react'
import { useCookies } from 'react-cookie'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery } from 'react-query'
import Datepicker, { DateValueType } from 'react-tailwindcss-datepicker'
import { toast } from 'react-toastify'
import { TussisApi } from '../../../api'
import { CrudModel } from '../../models'
import { Column, PaginatedQueryResponse } from '../../types'
import { AUTH_COOKIE_NAME, DATE_FORMAT, downloadBlobFile } from '../../utils'
import DataTable from './datatable/DataTable'
import ModalCreate from './modal-create/ModalCreate'
import ModalDelete from './modal-delete/ModalDelete'
import ModalView from './modal-view/ModalView'

interface CrudScreenProps<T> {
  model: CrudModel<T>
  page: number
  setPage: Dispatch<SetStateAction<number>>
  rowsPerPage: number
  setRowsPerPage: Dispatch<SetStateAction<number>>
  sortDescriptor: SortDescriptor
  setSortDescriptor: Dispatch<SetStateAction<SortDescriptor>>
  defaultColumns: string[]
  columns: Column[]
  timestamp: number
  setTimestamp: (timestamp: number) => void
  additionalDropdownItems?: MenuItemBaseProps[]
  defaultRange?: DateValueType
}
export function CrudScreen<DataType>({
  model,
  page,
  setPage,
  rowsPerPage,
  setRowsPerPage,
  sortDescriptor,
  setSortDescriptor,
  defaultColumns,
  columns,
  timestamp,
  setTimestamp,
  additionalDropdownItems,
  defaultRange = {
    startDate: null,
    endDate: null,
  },
}: CrudScreenProps<DataType>) {
  const [filterValue, setFilterValue] = React.useState('')
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(new Set(defaultColumns))
  const [selectedItem, setSelectedItem] = React.useState<DataType | undefined>(undefined)
  const [cookies] = useCookies([AUTH_COOKIE_NAME])
  const currentUser = useMemo(() => cookies.auth.user, [cookies])
  const { t: tCrud, i18n } = useTranslation('translation', {
    keyPrefix: 'pages.crud',
  })
  const [dateRangeValue, setDateRangeValue] = useState<DateValueType>(defaultRange)
  const range = useMemo(() => {
    if (dateRangeValue?.startDate && dateRangeValue?.endDate) {
      return `${dayjs(dateRangeValue.startDate).format(DATE_FORMAT)}:${dayjs(
        dateRangeValue.endDate,
      ).format(DATE_FORMAT)}`
    }
    return undefined
  }, [dateRangeValue])

  const {
    isOpen: isModalCreateOpen,
    onOpen: onModalCreateOpen,
    onClose: onModalCreateClose,
  } = useDisclosure()

  const {
    isOpen: isModalDeleteOpen,
    onOpen: onModalDeleteOpen,
    onClose: onModalDeleteClose,
  } = useDisclosure()

  const {
    isOpen: isModalViewOpen,
    onOpen: onModalViewOpen,
    onClose: onModalViewClose,
  } = useDisclosure()

  const {
    isLoading,
    isFetching,
    data: response,
  } = useQuery<unknown, unknown, PaginatedQueryResponse<DataType>>(
    [model.view.endpoint, page, rowsPerPage, sortDescriptor, timestamp, currentUser?.uid, range],
    () =>
      TussisApi.get(model.view.endpoint, {
        limit: rowsPerPage,
        sort: `${sortDescriptor.column}:${
          sortDescriptor.direction === 'ascending' ? 'asc' : 'desc'
        }`,
        range,
        offset: rowsPerPage * (page - 1),
      }),
  )

  const pages = useMemo(() => {
    const pageCount = response?.total ? Math.ceil(response?.total / rowsPerPage) : 0
    return pageCount > 1 ? pageCount : 0
  }, [response?.total, rowsPerPage])

  const loadingState = useMemo(
    () => (isLoading ? 'loading' : isFetching ? 'loadingMore' : 'idle'),
    [isFetching, isLoading],
  )

  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      setPage(page + 1)
    }
  }, [page, pages, setPage])

  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setPage(page - 1)
    }
  }, [page, setPage])

  const onRowsPerPageChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number((e.target as any).value))
      setPage(1)
    },
    [setPage, setRowsPerPage],
  )

  const onSearchChange = React.useCallback(
    (value?: string) => {
      if (value) {
        setFilterValue(value)
        setPage(1)
      } else {
        setFilterValue('')
      }
    },
    [setPage],
  )

  const onClear = React.useCallback(() => {
    setFilterValue('')
    setPage(1)
  }, [setPage])

  const { mutateAsync: requestDownloadPdf, isLoading: isDownloadPdfLoading } = useMutation(() =>
    TussisApi.getPDF(model?.report?.endpoint || '', {
      limit: response?.total,
      sort: `${sortDescriptor.column}:${sortDescriptor.direction === 'ascending' ? 'asc' : 'desc'}`,
      range,
      offset: 0,
    }),
  )

  const onExportTableData = React.useCallback(async () => {
    if (model.report) {
      try {
        const blob = await requestDownloadPdf()
        const filename = `tussis-report-${Date.now()}.pdf`
        downloadBlobFile(blob.data, filename)
      } catch (e: any) {
        toast.error(e.message, {
          toastId: e.status,
        })
      }
    }
  }, [model.report, requestDownloadPdf])

  const handleOnEditItem = React.useCallback(
    (item: DataType) => {
      setSelectedItem(item)
      onModalCreateOpen()
    },
    [onModalCreateOpen],
  )
  const handleOnViewItem = React.useCallback(
    (item: DataType) => {
      setSelectedItem(item)
      onModalViewOpen()
    },
    [onModalViewOpen],
  )

  const handleOnDeleteItem = React.useCallback(
    (item: DataType) => {
      setSelectedItem(item)
      onModalDeleteOpen()
    },
    [onModalDeleteOpen],
  )

  const handleOnModalCreateOpen = React.useCallback(() => {
    setSelectedItem(undefined)
    onModalCreateOpen()
  }, [onModalCreateOpen])

  const handleOnModalCreateClose = React.useCallback(
    (submitted?: boolean) => {
      if (submitted) {
        setTimestamp(Date.now())
        toast.success(tCrud(`${selectedItem ? 'update' : 'create'}-success`))
      }
      onModalCreateClose()
      setSelectedItem(undefined)
    },
    [onModalCreateClose, selectedItem, setTimestamp, tCrud],
  )

  const handleOnModalDeleteDone = React.useCallback(() => {
    setTimestamp(Date.now())
    toast.success(tCrud('delete-success'))
    setPage(1)
  }, [setPage, setTimestamp, tCrud])

  const handleDateRangeValueChange = (newDateRangeValue: DateValueType) => {
    console.log('newValue:', newDateRangeValue)
    setDateRangeValue(newDateRangeValue)
  }

  return (
    <>
      <Datepicker
        i18n={i18n.language}
        value={dateRangeValue}
        onChange={handleDateRangeValueChange}
      />
      <DataTable<DataType>
        columns={columns}
        currentPage={page}
        data={Array.isArray(response) ? response : response?.data || []}
        filterValue={filterValue}
        loadingState={loadingState}
        onClear={onClear}
        additionalDropdownItems={additionalDropdownItems}
        onExportTableData={
          ((response?.total || 0) > 0 && model.report && onExportTableData) || undefined
        }
        isExportPdfLoading={isDownloadPdfLoading}
        onModalCreateOpen={handleOnModalCreateOpen}
        onNextPage={onNextPage}
        onPreviousPage={onPreviousPage}
        onPageChange={setPage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={onRowsPerPageChange}
        onSearchChange={model.view.onSearch && onSearchChange}
        setSortDescriptor={setSortDescriptor}
        setVisibleColumns={setVisibleColumns}
        sortDescriptor={sortDescriptor}
        totalItems={response?.total || 0}
        totalPages={pages}
        visibleColumns={visibleColumns}
        onDelete={handleOnDeleteItem}
        onEdit={handleOnEditItem}
        onView={handleOnViewItem}
      />
      <ModalCreate<DataType>
        isOpen={isModalCreateOpen}
        editMode={!!selectedItem}
        model={model}
        editData={selectedItem}
        onClose={handleOnModalCreateClose}
      />

      <ModalDelete<DataType>
        isOpen={isModalDeleteOpen}
        deleteData={selectedItem || ({} as Record<keyof DataType, unknown>)}
        model={model}
        onClose={onModalDeleteClose}
        onDeleteDone={handleOnModalDeleteDone}
      />

      <ModalView<DataType>
        isOpen={isModalViewOpen}
        viewData={selectedItem || ({} as Record<keyof DataType, unknown>)}
        onClose={onModalViewClose}
      />
    </>
  )
}
