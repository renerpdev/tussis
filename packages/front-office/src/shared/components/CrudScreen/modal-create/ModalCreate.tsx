import {
  Button,
  Chip,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  SelectedItems,
  Spinner,
  Textarea,
} from '@nextui-org/react'
import dayjs from 'dayjs'
import { useCallback, useMemo, useState } from 'react'
import { useMutation } from 'react-query'
import { toast } from 'react-toastify'
import { v4 as uuid } from 'uuid'
import { TussisApi } from '../../../../api'
import { AsyncData, BaseModel, CrudModel } from '../../../models'
import {
  UIDatePicker,
  UIField,
  UIInputText,
  UISelect,
  UISelectOption,
  UIType,
} from '../../../types'

const EMPTY_FIELD: UIField = {
  id: '',
  name: '',
  placeholder: '',
  label: '',
  type: 'input',
  value: '',
}

interface ModalCreateProps<T> {
  isOpen: boolean
  model: CrudModel<T>
  onClose: (submitted?: boolean) => void
  editData?: Record<keyof T, unknown>
  editMode?: boolean
}

export default function ModalCreate<T>({
  isOpen,
  model,
  editData,
  onClose,
  editMode,
}: ModalCreateProps<T>) {
  const [fieldValues, setFieldValues] = useState<Map<string, unknown>>(
    new Map(Object.entries(editData || {})),
  )
  const createMutation = useMutation({
    mutationFn: async (data: T) => {
      try {
        const res = await TussisApi.add<T>(model.create.endpoint, data)
        setFieldValues(new Map(Object.entries({})))
        onClose?.(true)
        return res
      } catch (e: any) {
        toast.error(e.message, {
          toastId: 'modal-create-error',
        })
      }
    },
  })
  const updateMutation = useMutation({
    mutationFn: async (data: T) => {
      try {
        const res = await TussisApi.update<T>(
          `${model.update.endpoint}/${(editData as BaseModel)?.id}`,
          data,
        )
        setFieldValues(new Map(Object.entries(editData || {})))
        onClose?.(true)
        return res
      } catch (e: any) {
        toast.error(e.message, {
          toastId: 'modal-update-error',
        })
      }
    },
  })

  const fields: UIField[] = useMemo(() => {
    if (model.create.model) {
      return Object.entries(model.create.model).map(([key, value]) => {
        if (dayjs(value as string).isValid()) {
          const field: UIDatePicker = {
            id: uuid(),
            value: (fieldValues.get(key) || '') as string,
            name: key,
            placeholder: `Enter the ${key} here`,
            label: key.toUpperCase(),
            type: 'datepicker',
          }
          return field
        }

        if (typeof value === 'object') {
          const field: UISelect = {
            id: uuid(),
            items: (value as AsyncData<T>).data as UISelectOption[],
            value: (fieldValues.get(key) || []) as string[],
            name: key,
            loading: (value as AsyncData<T>).isLoading,
            errorMessage: (value as AsyncData<T>).error?.message,
            placeholder: `Select the ${key} from the list`,
            label: key.toUpperCase(),
            type: 'select',
          }
          return field
        }

        if (typeof value === 'string') {
          const type: UIType = (value as string).length <= 8 ? 'input' : 'textarea'
          const field: UIInputText = {
            id: uuid(),
            value: (fieldValues.get(key) || '') as string,
            name: key,
            placeholder: `Enter the ${key} here`,
            label: key.toUpperCase(),
            type,
          }
          return field
        }

        return EMPTY_FIELD
      })
    }

    return [EMPTY_FIELD]
  }, [fieldValues, model.create.model])

  const handleOnSubmit = useCallback(() => {
    // TODO: improve this, since it's just a workaround
    const data: Record<string, unknown> = {}
    for (const [key, value] of fieldValues.entries()) {
      data[key] = typeof value === 'object' ? Array.from((value as Set<T>).values()) : value
    }

    if (editMode) {
      updateMutation.mutate(data as T)
    } else {
      createMutation.mutate(data as T)
    }
  }, [createMutation, editMode, fieldValues, updateMutation])

  const renderField = useCallback(
    (field: UIField) => {
      switch (field.type) {
        case 'select':
          return (
            <Select
              key={field.id}
              items={(field as UISelect).items as UISelectOption[]}
              label={field.label}
              selectedKeys={field.value as string[]}
              onSelectionChange={entries => setFieldValues(fieldValues.set(field.name, entries))}
              variant="flat"
              isMultiline={true}
              isLoading={field.loading}
              selectionMode="multiple"
              disabled={(field as UISelect).items.length === 0}
              placeholder={field.placeholder}
              errorMessage={field.errorMessage}
              isInvalid={!!field.errorMessage}
              color={field.errorMessage ? 'danger' : 'default'}
              labelPlacement="outside"
              classNames={{
                base: (field as UISelect).items.length === 0 ? 'opacity-30' : '',
                trigger: 'min-h-unit-12 py-2',
              }}
              renderValue={(items: SelectedItems<UISelectOption>) => {
                return (
                  <div className="flex flex-wrap gap-2">
                    {items.map(item => (
                      <Chip key={item.key}>{item.data?.name}</Chip>
                    ))}
                  </div>
                )
              }}
            >
              {(item: UISelectOption) => (
                <SelectItem
                  key={item.id}
                  textValue={item.name}
                >
                  <div className="flex gap-2 items-center">
                    <div className="flex flex-col">
                      <span className="text-small">{item.name}</span>
                      <span className="text-tiny text-default-400">{item.desc}</span>
                    </div>
                  </div>
                </SelectItem>
              )}
            </Select>
          )
        case 'input':
          return (
            <Input
              key={field.id}
              autoFocus={field.autofocus}
              type="text"
              defaultValue={field.value as string}
              onValueChange={value => setFieldValues(fieldValues.set(field.name, value))}
              placeholder={field.placeholder}
              variant="flat"
              label={field.label}
            />
          )
        case 'textarea':
          return (
            <Textarea
              key={field.id}
              label={field.label}
              defaultValue={field.value as string}
              onValueChange={value => setFieldValues(fieldValues.set(field.name, value))}
              labelPlacement="outside"
              placeholder={field.placeholder}
            />
          )
        case 'datepicker':
          return (
            <Input
              key={field.id}
              type="date"
              label={field.label}
              placeholder={field.placeholder}
              defaultValue={field.value as string}
              onValueChange={value => setFieldValues(fieldValues.set(field.name, value))}
            />
          )
        default:
          return <span key={field.id}>{`Uknown field <${field.name}>`}</span>
      }
    },
    [fieldValues],
  )

  return (
    <Modal
      backdrop={'blur'}
      isOpen={isOpen}
      onClose={onClose}
      isDismissable={false}
    >
      <ModalContent>
        {onClose => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {editMode ? 'Edit' : 'Add New'}
            </ModalHeader>
            <ModalBody>
              {(fields.length > 0 && (
                <div className="w-full flex flex-col gap-4">
                  <div className="flex w-full flex-wrap mb-6 gap-4">
                    {fields.map(field => renderField(field))}
                  </div>
                </div>
              )) || <h2 className="text-large text-primary">There are no fields to display!</h2>}
            </ModalBody>
            {fields.length > 0 && (
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
                  onPress={handleOnSubmit}
                  disabled={fields.length === 0}
                >
                  {editMode ? 'Edit' : 'Add'}{' '}
                  {(createMutation.isLoading || updateMutation.isLoading) && (
                    <Spinner
                      color="default"
                      size="sm"
                    />
                  )}
                </Button>
              </ModalFooter>
            )}
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
