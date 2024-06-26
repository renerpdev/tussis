import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { HiTrash } from 'react-icons/hi'
import { useMutation } from 'react-query'
import { TussisApi } from '../../../../api'
import { BaseModel, CrudModel } from '../../../models'

interface ModalDeleteProps<T> {
  isOpen: boolean
  deleteData: Record<keyof T, unknown>
  model: CrudModel<T>
  onClose: () => void
  onDeleteDone?: () => void
}

export default function ModalDelete<T>({
  isOpen,
  onClose,
  deleteData,
  model,
  onDeleteDone,
}: ModalDeleteProps<T>) {
  const { t } = useTranslation('translation', {
    keyPrefix: 'pages.crud',
  })

  const deleteMutation = useMutation({
    mutationFn: async T => {
      const id = (deleteData as BaseModel)?.id || (deleteData as BaseModel).uid
      const res = await TussisApi.delete<T>(`${model.update.endpoint}/${id}`)
      onClose?.()
      onDeleteDone?.()
      return res
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
            <ModalHeader className="flex flex-col gap-1">
              {t('delete-confirmation-title')}
            </ModalHeader>
            <ModalBody>
              <h2 className="text-large text-default dark:text-white">
                {t('delete-confirmation')}
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
                {t('close')}
              </Button>
              <Button
                color="danger"
                onPress={handleOnSubmit}
                isLoading={deleteMutation.isLoading}
              >
                <span>
                  <HiTrash />
                </span>
                {t('delete')}{' '}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
