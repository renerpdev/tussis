import { Selection, SortDescriptor, useDisclosure } from '@nextui-org/react'

import React, { Dispatch, SetStateAction, useEffect, useMemo } from 'react'
import { useQuery } from 'react-query'
import { toast } from 'react-toastify'
import { TussisApi } from '../../../api'
import { CrudModel } from '../../models'
import { Column, PaginatedQueryResponse } from '../../types'
import { downloadBlobFile } from '../../utils'
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
}: CrudScreenProps<DataType>) {
  const [filterValue, setFilterValue] = React.useState('')
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(new Set(defaultColumns))
  const [selectedItem, setSelectedItem] = React.useState<DataType | undefined>(undefined)
  const [timestamp, setTimestamp] = React.useState(Date.now())

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
    error,
    data: response,
  } = useQuery<unknown, unknown, PaginatedQueryResponse<DataType>>(
    [`view-${model.view.endpoint}`, page, rowsPerPage, sortDescriptor, timestamp],
    () =>
      TussisApi.get(model.view.endpoint, {
        limit: rowsPerPage,
        sort: `${sortDescriptor.column}:${
          sortDescriptor.direction === 'ascending' ? 'asc' : 'desc'
        }`,
        offset: rowsPerPage * (page - 1),
      }),
  )

  useEffect(() => {
    if (error) {
      toast.error((error as any).message, {
        toastId: 'fetch-table-data-error',
      })
    }
  }, [error])

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

  const onExportTableData = React.useCallback(async () => {
    if (model.report) {
      try {
        const blob = await TussisApi.getPDF(model.report.endpoint, {
          limit: response?.total,
          sort: `${sortDescriptor.column}:${
            sortDescriptor.direction === 'ascending' ? 'asc' : 'desc'
          }`,
          offset: 0,
        })

        downloadBlobFile(blob.data)
      } catch (e: any) {
        toast.error(e.message, {
          toastId: 'export-report-error',
        })
      }
    }
  }, [model.report, response?.total, sortDescriptor.column, sortDescriptor.direction])

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
        toast.success('Request Successful!')
      }
      onModalCreateClose()
      setSelectedItem(undefined)
    },
    [onModalCreateClose],
  )

  const handleOnModalDeleteClose = React.useCallback(
    (submitted?: boolean) => {
      if (submitted) {
        setTimestamp(Date.now())
        toast.success('Request Successful!')
      }
      onModalDeleteClose()
    },
    [onModalDeleteClose],
  )

  return (
    <>
      <DataTable<DataType>
        columns={columns}
        currentPage={page}
        data={response?.data || []}
        filterValue={filterValue}
        loadingState={loadingState}
        onClear={onClear}
        onExportTableData={model.report && onExportTableData}
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
        onClose={handleOnModalDeleteClose}
      />

      <ModalView<DataType>
        isOpen={isModalViewOpen}
        viewData={selectedItem || ({} as Record<keyof DataType, unknown>)}
        onClose={onModalViewClose}
      />
    </>
  )
}
