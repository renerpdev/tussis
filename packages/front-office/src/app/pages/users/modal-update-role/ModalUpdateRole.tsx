import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  Selection,
  SelectItem,
} from '@nextui-org/react'
import { useCallback, useState } from 'react'
import { useMutation } from 'react-query'
import { TussisApi } from '../../../../api'
import { CrudModel } from '../../../../shared/models'
import { User } from '../../../../shared/models/user.model'
import { useStore } from '../../../useStore'

type Role = 'admin' | 'editor' | null

const roles = [
  { label: 'Admin', value: 'admin' },
  { label: 'Editor', value: 'editor' },
  { label: 'N/A', value: '' },
]

interface ModalViewProps {
  model: CrudModel<User>
  isOpen: boolean
  user?: User
  onClose: () => void
}

export default function ModalUpdateRole({ isOpen, onClose, user, model }: ModalViewProps) {
  const [value, setValue] = useState<Selection>(new Set([user?.role ?? '']))
  const { setUsersUpdatedAt } = useStore()

  const updateMutation = useMutation({
    mutationFn: async (role: Role) => {
      const res = await TussisApi.update(`${model.update.endpoint}/${user?.uid}/claims`, { role })
      setValue(new Set(['']))
      setUsersUpdatedAt(Date.now())
      onClose?.()
      return res
    },
  })

  const handleOnSubmit = useCallback(() => {
    updateMutation.mutate(value.currentKey ?? null)
  }, [updateMutation, value])

  const handleOnClose = useCallback(() => {
    setValue(new Set(['']))
    onClose?.()
  }, [onClose])

  return (
    <Modal
      backdrop={'blur'}
      isOpen={isOpen}
      onClose={handleOnClose}
      isDismissable
    >
      <ModalContent className="dark:bg-gray-800">
        {onClose => (
          <>
            <ModalHeader className="flex flex-col gap-1">Update User Role</ModalHeader>
            <ModalBody>
              <Select
                items={roles}
                disallowEmptySelection
                label="Favorite Animal"
                placeholder="Select an animal"
                className="w-full"
                selectedKeys={value}
                onSelectionChange={setValue}
              >
                {role => (
                  <SelectItem
                    key={role.value}
                    value={role.value}
                  >
                    {role.label}
                  </SelectItem>
                )}
              </Select>
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
                className="bg-cyan-600 hover:bg-cyan-500 text-white disabled:opacity-50"
                onPress={handleOnSubmit}
                isLoading={updateMutation.isLoading}
              >
                Update Role
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
