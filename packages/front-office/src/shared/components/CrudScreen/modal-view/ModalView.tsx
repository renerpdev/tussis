import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react'

interface ModalViewProps<T> {
  isOpen: boolean
  viewData: Record<keyof T, unknown>
  onClose: () => void
}

export default function ModalView<T>({ isOpen, onClose, viewData }: ModalViewProps<T>) {
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
            <ModalHeader className="flex flex-col gap-1">View</ModalHeader>
            <ModalBody>
              <h2 className="text-large text-default dark:text-white">
                These are the item details:
              </h2>
              <h6>
                <code
                  className="text-small text-primary"
                  style={{ overflowWrap: 'anywhere' }}
                >
                  {JSON.stringify(viewData)}
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
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
