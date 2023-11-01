import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
} from '@nextui-org/react'
import { useCallback } from 'react'
import { HiTrash } from 'react-icons/hi'
import { useMutation } from 'react-query'
import { toast } from 'react-toastify'
import { TussisApi } from '../../../../api'
import { BaseModel, CrudModel } from '../../../models'

interface ModalDeleteProps<T> {
  isOpen: boolean
  deleteData: Record<keyof T, unknown>
  model: CrudModel<T>
  onClose: (submitted?: boolean) => void
}

export default function ModalDelete<T>({
  isOpen,
  onClose,
  deleteData,
  model,
}: ModalDeleteProps<T>) {
  const deleteMutation = useMutation({
    mutationFn: async T => {
      try {
        const res = await TussisApi.delete<T>(
          `${model.update.endpoint}/${(deleteData as BaseModel).id}`,
        )
        onClose?.(true)
        return res
      } catch (e: any) {
        toast.error(e.message, {
          toastId: 'modal-delete-error',
        })
      }
    },
  })

  const handleOnSubmit = useCallback(() => {
    if (!deleteMutation.isLoading) {
      deleteMutation.mutate()
    }
  }, [deleteMutation])

  return (
    <Modal
      backdrop={'blur'}
      isOpen={isOpen}
      onClose={onClose}
      isDismissable
    >
      <ModalContent className="dark:bg-gray-800">
        {onClose => (
          <>
            <ModalHeader className="flex flex-col gap-1">Delete</ModalHeader>
            <ModalBody>
              <h2 className="text-large text-default dark:text-white">
                Are you sure you want to this item?
              </h2>
              <h6>
                <code
                  className="text-small text-primary"
                  style={{ overflowWrap: 'anywhere' }}
                >
                  {JSON.stringify(deleteData)}
                </code>
              </h6>
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
                color="danger"
                onPress={handleOnSubmit}
                disabled={deleteMutation.isLoading}
                className="disabled:opacity-50"
              >
                <span>
                  <HiTrash />
                </span>
                Delete{' '}
                {deleteMutation.isLoading && (
                  <Spinner
                    color="default"
                    size="sm"
                  />
                )}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
