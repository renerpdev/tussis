import {
  Button,
  Chip,
  ChipProps,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Pagination,
  Select,
  SelectItem,
  SelectedItems,
  Selection,
  SortDescriptor,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Textarea,
  useDisclosure,
} from '@nextui-org/react'

import { TussisApi } from 'api'
import React, { useMemo } from 'react'
import { useQuery } from 'react-query'
import { downloadBlobFile } from 'shared/utils'
import { ChevronDownIcon } from './ChevronDownIcon'
import { ExportIcon } from './ExportIcon'
import { PlusIcon } from './PlusIcon'
import { SearchIcon } from './SearchIcon'
import { VerticalDotsIcon } from './VerticalDotsIcon'
import { columns, users } from './data'
import { Issue } from './issues/issues.model'
import { capitalize } from './utils'

const statusColorMap: Record<string, ChipProps['color']> = {
  active: 'success',
  paused: 'danger',
  vacation: 'warning',
}

type User = {
  id: number
  name: string
  role: string
  team: string
  status: string
  age: string
  avatar: string
  email: string
}

const INITIAL_VISIBLE_COLUMNS = ['date', 'symptoms', 'meds', 'actions']

export default function App() {
  const [filterValue, setFilterValue] = React.useState('')
  // const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set([]))
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS),
  )
  const [statusFilter, setStatusFilter] = React.useState<Selection>('all')
  const [rowsPerPage, setRowsPerPage] = React.useState(5)
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: 'date',
    direction: 'ascending',
  })
  const { isOpen, onOpen, onClose } = useDisclosure()

  const [page, setPage] = React.useState(1)

  // const hasSearchFilter = Boolean(filterValue)

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === 'all') return columns

    return columns.filter(column => Array.from(visibleColumns).includes(column.uid))
  }, [visibleColumns])

  // const filteredItems = React.useMemo(() => {
  //   let filteredUsers = [...users]

  //   if (hasSearchFilter) {
  //     filteredUsers = filteredUsers.filter(user =>
  //       user.name.toLowerCase().includes(filterValue.toLowerCase()),
  //     )
  //   }
  //   if (statusFilter !== 'all' && Array.from(statusFilter).length !== statusOptions.length) {
  //     filteredUsers = filteredUsers.filter(user => Array.from(statusFilter).includes(user.status))
  //   }

  //   return filteredUsers
  // }, [hasSearchFilter, statusFilter, filterValue])

  const {
    isLoading,
    isFetching,
    error,
    data: response,
  } = useQuery(['repoData', page, rowsPerPage, sortDescriptor], () =>
    TussisApi.get('issues', {
      // TODO: unify this with the onExportTableData method
      limit: rowsPerPage,
      sort: `${sortDescriptor.column}:${sortDescriptor.direction === 'ascending' ? 'asc' : 'desc'}`,
      offset: rowsPerPage * (page - 1),
    }).then(res => res.data),
  )

  const pages = useMemo(() => {
    const pageCount = response?.total ? Math.ceil(response?.total / rowsPerPage) : 0
    return pageCount > 1 ? pageCount : 0
  }, [response?.total, rowsPerPage])

  const loadingState = isLoading ? 'loading' : isFetching ? 'loadingMore' : 'idle'

  // const items = React.useMemo(() => {
  //   const start = (page - 1) * rowsPerPage
  //   const end = start + rowsPerPage

  //   return filteredItems.slice(start, end)
  // }, [page, filteredItems, rowsPerPage])

  // const sortedItems = React.useMemo(() => {
  //   return [...items].sort((a: User, b: User) => {
  //     const first = a[sortDescriptor.column as keyof User] as number
  //     const second = b[sortDescriptor.column as keyof User] as number
  //     const cmp = first < second ? -1 : first > second ? 1 : 0

  //     return sortDescriptor.direction === 'descending' ? -cmp : cmp
  //   })
  // }, [sortDescriptor, items])

  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      setPage(page + 1)
    }
  }, [page, pages])

  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setPage(page - 1)
    }
  }, [page])

  const onRowsPerPageChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value))
    setPage(1)
  }, [])

  const onSearchChange = React.useCallback((value?: string) => {
    if (value) {
      setFilterValue(value)
      setPage(1)
    } else {
      setFilterValue('')
    }
  }, [])

  const onClear = React.useCallback(() => {
    setFilterValue('')
    setPage(1)
  }, [])

  const onExportTableData = React.useCallback(async () => {
    const blob = await TussisApi.getPDF('issues/report', {
      limit: response?.total,
      sort: `${sortDescriptor.column}:${sortDescriptor.direction === 'ascending' ? 'asc' : 'desc'}`,
      offset: 0,
    })
    downloadBlobFile(blob)
  }, [response?.total, sortDescriptor.column, sortDescriptor.direction])

  const renderCell = React.useCallback(
    (issue: Issue, columnKey: React.Key) => {
      const cellValue = issue[columnKey]

      switch (columnKey) {
        case 'symptoms':
        case 'meds':
          return (
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              {cellValue.map(item => (
                <option
                  value={item.name}
                  key={item.id}
                >
                  {item.name}
                </option>
              ))}
            </select>
          )
        case 'actions':
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
                  <DropdownItem>View</DropdownItem>
                  <DropdownItem>Edit</DropdownItem>
                  <DropdownItem>Delete</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          )
        default:
          return cellValue
      }
    },
    [onRowsPerPageChange],
  )

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by name..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat"
                >
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map(column => (
                  <DropdownItem
                    key={column.uid}
                    className="capitalize"
                  >
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button
              color="primary"
              endContent={<PlusIcon />}
              onPress={onOpen}
            >
              Add New
            </Button>
            <Button
              color="secondary"
              className="color-white"
              endContent={<ExportIcon onClick={onExportTableData} />}
            />
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">Total {response?.total} users</span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    )
  }, [
    filterValue,
    onSearchChange,
    visibleColumns,
    onOpen,
    onExportTableData,
    response?.total,
    onRowsPerPageChange,
    onClear,
  ])

  const bottomContent = React.useMemo(() => {
    return pages > 0 ? (
      <div className="py-2 px-2 flex justify-between items-center">
        {/* TODO: uncomment this once multi-selection is needed */}
        {/* <span className="w-[30%] text-small text-default-400">
          {selectedKeys === 'all'
            ? 'All items selected'
            : `${selectedKeys.size} of ${filteredItems.length} selected`}
        </span> */}
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onPreviousPage}
          >
            Previous
          </Button>
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onNextPage}
          >
            Next
          </Button>
        </div>
      </div>
    ) : null
  }, [page, pages, onPreviousPage, onNextPage])

  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]))

  const selectedValue = React.useMemo(
    () => Array.from(selectedKeys).join(', ').replaceAll('_', ' '),
    [selectedKeys],
  )

  return (
    <>
      <div className="p-5">
        <Table
          aria-label="Example table with custom cells, pagination and sorting"
          isHeaderSticky
          bottomContent={bottomContent}
          bottomContentPlacement="outside"
          classNames={{
            wrapper: 'max-h-[382px]',
          }}
          // selectedKeys={selectedKeys}
          // selectionMode="multiple" //TODO: uncomment this once we multi-selection is needed
          sortDescriptor={sortDescriptor}
          topContent={topContent}
          topContentPlacement="outside"
          // onSelectionChange={setSelectedKeys}
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
            {/* <TableColumn key="name">Name</TableColumn>
            <TableColumn key="height">Height</TableColumn>
            <TableColumn key="mass">Mass</TableColumn>
            <TableColumn key="birth_year">Birth year</TableColumn> */}
          </TableHeader>
          <TableBody
            emptyContent={'No data found'}
            items={response?.data ?? []}
            loadingContent={<Spinner />}
            loadingState={loadingState}
          >
            {item => (
              <TableRow key={item?.id}>
                {columnKey => <TableCell>{renderCell(item, columnKey)}</TableCell>}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <Modal
        backdrop={'blur'}
        isOpen={isOpen}
        onClose={onClose}
        isDismissable={false}
      >
        <ModalContent>
          {onClose => (
            <>
              <ModalHeader className="flex flex-col gap-1">Add New</ModalHeader>
              <ModalBody>
                <div className="w-full flex flex-col gap-4">
                  <div className="flex w-full flex-wrap mb-6 gap-4">
                    <Input
                      autoFocus
                      type="text"
                      placeholder="Type your name"
                      variant="flat"
                      label="Name"
                    />
                    <Input
                      type="text"
                      placeholder="Type your email"
                      variant="flat"
                      label="Email"
                      isInvalid={true}
                      errorMessage="Please enter a valid email"
                    />
                    <Select
                      items={users}
                      label="Assigned to"
                      variant="flat"
                      isMultiline={true}
                      selectionMode="multiple"
                      placeholder="Select a user"
                      labelPlacement="outside"
                      classNames={{
                        trigger: 'min-h-unit-12 py-2',
                      }}
                      renderValue={(items: SelectedItems<User>) => {
                        return (
                          <div className="flex flex-wrap gap-2">
                            {items.map(item => (
                              <Chip key={item.key}>{item.data.name}</Chip>
                            ))}
                          </div>
                        )
                      }}
                    >
                      {user => (
                        <SelectItem
                          key={user.id}
                          textValue={user.name}
                        >
                          <div className="flex gap-2 items-center">
                            <div className="flex flex-col">
                              <span className="text-small">{user.name}</span>
                              <span className="text-tiny text-default-400">{user.email}</span>
                            </div>
                          </div>
                        </SelectItem>
                      )}
                    </Select>
                    <Textarea
                      label="Description"
                      labelPlacement="outside"
                      placeholder="Enter your description"
                    />
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="default"
                  variant="light"
                  onPress={onClose}
                >
                  Close
                </Button>
                <Button
                  color="primary"
                  onPress={onClose}
                >
                  Action{' '}
                  <Spinner
                    color="default"
                    size="sm"
                  />
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      {error && <div>ERROR: {JSON.stringify(error)}</div>}
    </>
  )
}
