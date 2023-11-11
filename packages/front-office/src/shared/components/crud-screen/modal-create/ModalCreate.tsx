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
  Textarea,
} from '@nextui-org/react'
import dayjs from 'dayjs'
import { Datepicker } from 'flowbite-react'
import { useCallback, useMemo, useState } from 'react'
import { HiPencil, HiPlus } from 'react-icons/hi'
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
  const [fieldValues, setFieldValues] = useState<Map<string, unknown>>(new Map(Object.entries({})))

  const createMutation = useMutation({
    mutationFn: async (data: T) => {
      try {
        const res = await TussisApi.add<T>(model.create.endpoint, data)
        setFieldValues(new Map(Object.entries({})))
        onClose?.(true)
        return res
      } catch (e: any) {
        toast.error(e.message, {
          toastId: e.status,
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
        setFieldValues(new Map(Object.entries({})))
        onClose?.(true)
        return res
      } catch (e: any) {
        toast.error(e.message, {
          toastId: e.status,
        })
      }
    },
  })

  const fields: UIField[] = useMemo(() => {
    if (model.create.model) {
      return Object.entries(model.create.model).map(([key, value]) => {
        const editValue = editData?.[key as keyof typeof editData]

        if (dayjs(value as string).isValid()) {
          const field: UIDatePicker = {
            id: uuid(),
            value: (editValue || dayjs(Date.now()).format('YYYY-MM-DD')) as string,
            name: key,
            placeholder: `Enter the ${key} here`,
            label: key.toUpperCase(),
            type: 'datepicker',
          }
          setFieldValues(fieldValues.set(field.name, field.value))
          return field
        }

        if (typeof value === 'object') {
          const field: UISelect = {
            id: uuid(),
            items: (value as AsyncData<T>).data as UISelectOption[],
            value: (editValue?.map(({ id }: keyof T) => id) || []) as string[],
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
            value: (editValue || '') as string,
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
  }, [model.create.model, editData, fieldValues])

  const handleOnSubmit = useCallback(() => {
    if (!createMutation.isLoading && !updateMutation.isLoading) {
      // TODO: improve this, since it's just a workaround
      const rawData: Record<string, unknown> = {}
      for (const [key, value] of fieldValues.entries()) {
        rawData[key] = typeof value === 'object' ? Array.from((value as Set<T>).values()) : value
      }

      const data: Partial<Omit<T, 'id'>> = Object.entries(rawData).reduce((acc, [key, value]) => {
        if (key === 'id') return acc

        if (typeof value === 'object' && Array.isArray(value) && value.length > 0) {
          return {
            ...acc,
            [key]: value.map((item: keyof T) => {
              if (typeof item === 'object') {
                return item.id
              }
              return item
            }),
          }
        }

        return {
          ...acc,
          [key]: value,
        }
      }, {})

      if (editMode) {
        updateMutation.mutate(data as T)
      } else {
        createMutation.mutate(data as T)
      }
    }
  }, [createMutation, editMode, fieldValues, updateMutation])

  const renderField = useCallback(
    (field: UIField) => {
      switch (field.type) {
        case 'select':
          return (
            <Select
              key={field.id}
              id={field.id}
              items={(field as UISelect).items as UISelectOption[]}
              label={field.label}
              defaultSelectedKeys={(field.value as string[]) || []}
              onSelectionChange={entries =>
                setFieldValues(fieldValues.set(field.name, Array.from(entries)))
              }
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
                trigger:
                  'min-h-unit-12 py-2 bg-gray-100 dark:bg-gray-700 dark:placeholder-gray-300 dark:focus:ring-cyan-500',
                popover: 'dark:bg-gray-800',
              }}
              renderValue={(items: SelectedItems<UISelectOption>) => {
                return (
                  <div className="flex flex-wrap gap-2">
                    {items.map(item => (
                      <Chip
                        key={item.key}
                        className="bg-white border-1 border-cyan-600 text-cyan-600 dark:text-white dark:bg-cyan-600 capitalize"
                      >
                        {item.data?.name}
                      </Chip>
                    ))}
                  </div>
                )
              }}
            >
              {(item: UISelectOption) => (
                <SelectItem
                  key={item.id}
                  textValue={item.name}
                  className={'dark:hover:bg-cyan-600 dark:focus:bg-cyan-600'}
                >
                  <div className="flex gap-2 items-center">
                    <div className="flex flex-col">
                      <span className="text-small uppercase">{item.name}</span>
                      <span className="text-tiny text-default-600">{item.desc}</span>
                    </div>
                  </div>
                </SelectItem>
              )}
            </Select>
          )
        case 'input':
          return (
            <Input
              id={field.id}
              key={field.id}
              autoFocus={field.autofocus}
              type="text"
              defaultValue={field.value as string}
              onValueChange={value => setFieldValues(fieldValues.set(field.name, value))}
              placeholder={field.placeholder}
              variant="flat"
              label={field.label}
              classNames={{
                inputWrapper:
                  'bg-gray-100 dark:bg-gray-700 dark:placeholder-gray-300 darK:focus:ring-cyan-500',
              }}
            />
          )
        case 'textarea':
          return (
            <Textarea
              id={field.id}
              key={field.id}
              label={field.label}
              defaultValue={field.value as string}
              onValueChange={value => setFieldValues(fieldValues.set(field.name, value))}
              labelPlacement="outside"
              placeholder={field.placeholder}
              classNames={{
                inputWrapper:
                  'bg-gray-100 dark:bg-gray-700 dark:placeholder-gray-300 dark:focus:ring-cyan-500',
              }}
            />
          )
        case 'datepicker':
          return (
            <Datepicker
              key={field.id}
              id={field.id}
              defaultDate={dayjs(field.value as string).toDate()}
              onSelectedDateChanged={value =>
                setFieldValues(fieldValues.set(field.name, dayjs(value).format('YYYY-MM-DD')))
              }
              name={field.name}
              language="es-ES"
              showClearButton={false}
              showTodayButton={false}
              className={'w-full'}
              maxDate={new Date(Date.now())}
              weekStart={2} // First day of week is Sunday
            />
          )
        default:
          return <span key={field.id}>{`Uknown field <${field.name}>`}</span>
      }
    },
    [fieldValues],
  )

  const onCloseModal = useCallback(() => {
    setFieldValues(new Map(Object.entries({})))
    onClose?.()
  }, [onClose])

  return (
    <Modal
      backdrop={'blur'}
      isOpen={isOpen}
      onClose={onCloseModal}
      isDismissable={false}
    >
      <ModalContent className="dark:bg-gray-800">
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
                  className="bg-cyan-600 hover:bg-cyan-500 text-white disabled:opacity-50"
                  onPress={handleOnSubmit}
                  disabled={fields.length === 0}
                  isLoading={createMutation.isLoading || updateMutation.isLoading}
                >
                  {editMode ? 'Edit' : 'Add'} {editMode ? <HiPencil /> : <HiPlus />}{' '}
                </Button>
              </ModalFooter>
            )}
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
