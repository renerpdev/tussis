import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Selection,
} from '@nextui-org/react'
import { ChangeEvent, Dispatch, SetStateAction } from 'react'
import { HiChevronDown, HiPlus, HiSave, HiSearch } from 'react-icons/hi'
import { Column } from '../../../types'
import { capitalize } from '../utils'

export interface TopContentProps {
  filterValue: string
  totalItems: number
  columns: Column[]
  rowsPerPage: number
  visibleColumns: Selection
  onClear: () => void
  setVisibleColumns: Dispatch<SetStateAction<Selection>>
  onModalCreateOpen: () => void
  onRowsPerPageChange: (e: ChangeEvent<HTMLSelectElement>) => void
  onSearchChange?: () => void
  onExportTableData?: () => void
}

export default function TopContent({
  filterValue,
  visibleColumns,
  columns,
  totalItems,
  rowsPerPage,
  onClear,
  onSearchChange,
  setVisibleColumns,
  onExportTableData,
  onModalCreateOpen,
  onRowsPerPageChange,
}: TopContentProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between gap-3 items-end flex-col sm:flex-row">
        {
          <Input
            isClearable
            placeholder="Search by name..."
            startContent={<HiSearch className="h-4 w-4" />}
            value={filterValue}
            onClear={onClear}
            disabled={!onSearchChange}
            onValueChange={onSearchChange}
            classNames={{
              base: `w-full sm:max-w-[44%] ${!onSearchChange && 'opacity-30'}`,
              input: 'placeholder-default-300 dark:placeholder-white',
            }}
          />
        }
        <div className="flex gap-3 self-center">
          <Dropdown
            classNames={{
              base: 'dark:bg-gray-800 dark:text-white',
              trigger: 'bg-gray-200 dark:bg-gray-700',
            }}
          >
            <DropdownTrigger>
              <Button
                endContent={<HiChevronDown className="h-4 w-4" />}
                variant="flat"
                style={{ zIndex: 9 }}
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
                  className="capitalize dark:hover:bg-cyan-600 dark:focus:bg-cyan-600"
                >
                  {capitalize(column.name || '-')}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
          <Button
            endContent={<HiPlus className="h-4 w-4" />}
            onPress={onModalCreateOpen}
            className="bg-cyan-600 hover:bg-cyan-500 text-white"
          >
            <span className={'hidden md:flex'}>Add New</span>
          </Button>
          {onExportTableData && (
            <Button
              className="bg-transparent border-cyan-600 border-2 text-cyan-600 hover:bg-cyan-500 hover:text-white"
              endContent={
                <HiSave
                  className="h-6 w-6"
                  onClick={onExportTableData}
                />
              }
            />
          )}
        </div>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-default-400 text-small dark:text-white">
          Total {totalItems} items
        </span>
        <label className="flex items-center text-default-400 text-small dark:text-white">
          Rows per page:
          <select
            className="bg-transparent outline-none text-default-400 text-small dark:text-white"
            onChange={onRowsPerPageChange}
            defaultValue={rowsPerPage}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
          </select>
        </label>
      </div>
    </div>
  )
}
