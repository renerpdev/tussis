import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  SortDescriptor,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import React, { Dispatch, ReactElement, useCallback, useMemo } from 'react'
import { VerticalDotsIcon } from '../../index'
import BottomContent, { BottomContentProps } from '../bottom-content/BottomContent'
import TopContent, { TopContentProps } from '../top-content/TopContent'

interface DataTableProps<T> extends BottomContentProps, TopContentProps {
  sortDescriptor: SortDescriptor
  setSortDescriptor: Dispatch<React.SetStateAction<SortDescriptor>>
  data: T[]
  loadingState: 'idle' | 'loading' | 'loadingMore'
  onDelete?: (item: T) => void
  onEdit?: (item: T) => void
  onView?: (item: T) => void
}

export default function DataTable<T>({
  sortDescriptor,
  setSortDescriptor,
  visibleColumns,
  columns,
  data,
  rowsPerPage,
  onRowsPerPageChange,
  currentPage,
  onNextPage,
  onPageChange,
  onPreviousPage,
  totalPages,
  filterValue,
  onClear,
  onExportTableData,
  onModalCreateOpen,
  onSearchChange,
  setVisibleColumns,
  totalItems,
  loadingState,
  onView,
  onEdit,
  onDelete,
}: DataTableProps<T>) {
  const headerColumns = useMemo(() => {
    if (visibleColumns === 'all') return columns

    return columns.filter(column => Array.from(visibleColumns).includes(column.uid))
  }, [columns, visibleColumns])

  const handleOnDelete = useCallback(
    (item: T) => () => {
      onDelete?.(item)
    },
    [onDelete],
  )
  const handleOnEdit = useCallback(
    (item: T) => () => {
      onEdit?.(item)
    },
    [onEdit],
  )
  const handleOnView = useCallback(
    (item: T) => () => {
      onView?.(item)
    },
    [onView],
  )
  const parseDateValue = useCallback((value: string) => {
    const date = dayjs(value)
    if (dayjs(Date.now()).diff(date, 'day') < 2) {
      dayjs.extend(relativeTime)
      return date.fromNow()
    }
    return date.format('dddd, MMMM D, YYYY')
  }, [])

  const renderCell = useCallback(
    (item: T, columnKey: keyof T) => {
      const cellValue = item[columnKey]
      const columnType = columns.find(column => column.uid === columnKey)?.type

      switch (columnType) {
        case 'array':
          return (cellValue as T[keyof T][]).map((subItem: T[keyof T]) => (
            <Chip
              className="mx-1 my-1"
              key={subItem.id}
              color="default"
            >
              {subItem.name}
            </Chip>
          ))
        case 'date':
          return parseDateValue(cellValue as string)
        case 'action':
          return (
            <div className="relative flex justify-end items-center gap-2">
              <Dropdown>
                <DropdownTrigger>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                  >
                    <VerticalDotsIcon className="text-default-300" />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="ACTIONS dropdown menu">
                  <DropdownItem onPress={handleOnView(item)}>View</DropdownItem>
                  <DropdownItem onPress={handleOnEdit(item)}>Edit</DropdownItem>
                  <DropdownItem onPress={handleOnDelete(item)}>Delete</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          )
        default:
          return cellValue
      }
    },
    [columns, handleOnDelete, handleOnEdit, handleOnView],
  )

  return (
    <Table
      aria-label="Example table with custom cells, pagination and sorting"
      isHeaderSticky
      bottomContent={
        <BottomContent
          currentPage={currentPage}
          onNextPage={onNextPage}
          onPageChange={onPageChange}
          onPreviousPage={onPreviousPage}
          totalPages={totalPages}
        />
      }
      bottomContentPlacement="outside"
      classNames={{
        wrapper: 'max-h-[64]',
      }}
      sortDescriptor={sortDescriptor}
      topContent={
        <TopContent
          columns={columns}
          filterValue={filterValue}
          onClear={onClear}
          onExportTableData={onExportTableData}
          onModalCreateOpen={onModalCreateOpen}
          onRowsPerPageChange={onRowsPerPageChange}
          onSearchChange={onSearchChange}
          setVisibleColumns={setVisibleColumns}
          totalItems={totalItems}
          rowsPerPage={rowsPerPage}
          visibleColumns={visibleColumns}
        />
      }
      topContentPlacement="outside"
      onSortChange={setSortDescriptor}
    >
      <TableHeader columns={headerColumns}>
        {column => (
          <TableColumn
            key={column.uid}
            align={column.uid === 'actions' ? 'center' : 'start'}
            allowsSorting={column.sortable}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        emptyContent={'No data found'}
        items={data ?? []}
        loadingContent={<Spinner />}
        loadingState={loadingState}
      >
        {item => (
          <TableRow key={item?.id}>
            {columnKey => (
              <TableCell>{renderCell(item, columnKey as keyof T) as ReactElement}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
