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
import { Column } from '../../../types'
import { ChevronDownIcon, ExportIcon, PlusIcon, SearchIcon } from '../../index'
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
      <div className="flex justify-between gap-3 items-end">
        {
          <Input
            isClearable
            className={`w-full sm:max-w-[44%] ${!onSearchChange && 'opacity-30'}`}
            placeholder="Search by name..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={onClear}
            disabled={!onSearchChange}
            onValueChange={onSearchChange}
          />
        }
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
                  {capitalize(column.name || '-')}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
          <Button
            color="primary"
            endContent={<PlusIcon />}
            onPress={onModalCreateOpen}
          >
            Add New
          </Button>
          {onExportTableData && (
            <Button
              color="secondary"
              className="color-white"
              endContent={<ExportIcon onClick={onExportTableData} />}
            />
          )}
        </div>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-default-400 text-small">Total {totalItems} items</span>
        <label className="flex items-center text-default-400 text-small">
          Rows per page:
          <select
            className="bg-transparent outline-none text-default-400 text-small"
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
