import {
  Avatar,
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
import { HiDotsVertical } from 'react-icons/hi'
import { v4 as uuid } from 'uuid'
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
    const date = dayjs(value as string)
      .toDate()
      .toLocaleDateString()

    dayjs.extend(relativeTime)
    return [date, dayjs(value).fromNow()].join(' - ')
  }, [])

  const renderCell = useCallback(
    (item: T, columnKey: keyof T) => {
      const cellValue = item[columnKey]
      const columnType = columns.find(column => column.uid === columnKey)?.type
      const cellId = uuid()

      switch (columnType) {
        case 'picture':
          return (
            <Avatar
              key={cellId}
              src={cellValue as string}
              size="sm"
            />
          )
        case 'array':
          return (cellValue as T[keyof T][]).map((subItem: T[keyof T]) => (
            <Chip
              className="mx-1 my-1 border-cyan-600 border-1 bg-transparent text-cyan-600 dark:text-white dark:bg-cyan-600"
              key={`${cellId}-${subItem.id}`}
            >
              {subItem.name}
            </Chip>
          ))
        case 'date':
          return <span key={cellId}>{parseDateValue(cellValue as string)}</span>
        case 'boolean':
          return <span key={cellId}>{cellValue ? 'SI' : 'NO'}</span>
        case 'action':
          return (
            <div
              className="relative flex justify-end items-center gap-2"
              key={cellId}
            >
              <Dropdown
                classNames={{
                  base: 'dark:bg-gray-800 dark:text-white',
                }}
              >
                <DropdownTrigger>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                  >
                    <HiDotsVertical className="text-default-300 dark:text-white" />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="ACTIONS dropdown menu">
                  <DropdownItem
                    onPress={handleOnView(item)}
                    className="dark:hover:bg-cyan-600"
                  >
                    View
                  </DropdownItem>
                  <DropdownItem
                    onPress={handleOnEdit(item)}
                    className="dark:hover:bg-cyan-600"
                  >
                    Edit
                  </DropdownItem>
                  <DropdownItem
                    onPress={handleOnDelete(item)}
                    className="dark:hover:bg-cyan-600"
                  >
                    Delete
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          )
        default:
          return cellValue
      }
    },
    [columns, handleOnDelete, handleOnEdit, handleOnView, parseDateValue],
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
        wrapper: 'max-h-[64] dark:bg-gray-700',
        th: 'bg-gray-100 dark:bg-gray-600 dark:text-white',
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
            align={column.uid === 'actions' ? 'end' : 'start'}
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
          <TableRow key={item?.id || item?.uid}>
            {columnKey => (
              <TableCell key={columnKey}>
                {renderCell(item, columnKey as keyof T) as ReactElement}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
