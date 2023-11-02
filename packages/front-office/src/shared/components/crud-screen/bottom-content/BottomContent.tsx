import { Button, Pagination } from '@nextui-org/react'
import { Dispatch, SetStateAction } from 'react'

export interface BottomContentProps {
  totalPages: number
  currentPage: number
  onPageChange: Dispatch<SetStateAction<number>>
  onPreviousPage: () => void
  onNextPage: () => void
}

const BottomContent = ({
  currentPage,
  onPageChange,
  totalPages,
  onPreviousPage,
  onNextPage,
}: BottomContentProps) => {
  return totalPages > 0 ? (
    <div className="py-2 px-2 flex justify-between items-center">
      <Pagination
        isCompact
        showControls
        showShadow
        page={currentPage}
        total={totalPages}
        onChange={onPageChange}
        classNames={{
          cursor: 'bg-cyan-600 dark:active:bg-cyan-600',
          item: 'dark:bg-gray-700 dark:hover:bg-gray-600',
          prev: 'dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white data-[disabled=true]:opacity-50',
          next: 'dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white data-[disabled=true]:opacity-50',
          wrapper: 'dark:bg-gray-700',
        }}
      />
      <div className="hidden sm:flex w-[30%] justify-end gap-2">
        <Button
          isDisabled={currentPage === 1}
          size="sm"
          variant="flat"
          onPress={onPreviousPage}
        >
          Previous
        </Button>
        <Button
          isDisabled={totalPages === currentPage}
          size="sm"
          variant="flat"
          onPress={onNextPage}
        >
          Next
        </Button>
      </div>
    </div>
  ) : null
}

export default BottomContent
