import {
  Button,
  Chip,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Radio,
  RadioGroup,
  Select,
  SelectItem,
  SelectedItems,
  Switch,
  Textarea,
} from '@nextui-org/react'
import dayjs from 'dayjs'
import { Datepicker } from 'flowbite-react'
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import { HiPencil, HiPlus } from 'react-icons/hi'
import { useMutation } from 'react-query'
import { v4 as uuid } from 'uuid'
import { TussisApi } from '../../../../api'
import { BaseModel, CrudModel, ModelKey } from '../../../models'
import {
  UIField,
  UIRadioGroup,
  UIRadioGroupOption,
  UISelect,
  UISelectOption,
  UIToggle,
  UIType,
} from '../../../types'

const EMPTY_FIELD: UIField = {
  id: '',
  name: '',
  placeholder: '',
  label: '',
  type: 'text',
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
  const [formValues, setFormValues] = useState<Map<string, unknown>>(new Map(Object.entries({})))
  const [validationErrors, setValidationErrors] = useState<Map<string, string[]>>(
    new Map(Object.entries({})),
  )
  const [, setTimestamp] = useState(0) // this is just a workaround to force a re-render

  const createMutation = useMutation({
    mutationFn: async (data: T) => {
      const res = await TussisApi.add<T>(model.create.endpoint, data)
      setFormValues(new Map(Object.entries({})))
      onClose?.(true)
      return res
    },
  })
  const updateMutation = useMutation({
    mutationFn: async (data: T) => {
      const id = (editData as BaseModel)?.id || (editData as BaseModel).uid
      const res = await TussisApi.update<T>(`${model.update.endpoint}/${id}`, data)
      setFormValues(new Map(Object.entries({})))
      onClose?.(true)
      return res
    },
  })

  const removeCamelCase = useCallback((value: string) => {
    return value.replace(/([a-zA-Z])(?=[A-Z])/g, '$1 ').toUpperCase()
  }, [])

  const fields: UIField[] = useMemo(() => {
    if (model.create.model) {
      return Object.entries(model.create.model).map(([key, value]) => {
        const fieldType = (value as ModelKey).type
        const fieldData = (value as ModelKey).data
        const currentValue = formValues.get(key)

        const fieldValue =
          currentValue !== undefined ? currentValue : editData?.[key as keyof typeof editData]

        const errorMessage = validationErrors.get(key)?.join(', ')
        const normalizedKey = removeCamelCase(key)
        const placeholder = `Enter the ${normalizedKey} here`
        const label = removeCamelCase(key)

        const descriptionMap: Record<typeof fieldType, string | undefined> = {
          text: 'Must contain at least 3 characters',
          password:
            'Must contain at least 8 characters, 1 uppercase, 1 lowercase, 1 number and 1 special character',
          email: 'Must be a valid email address',
          url: 'Must be a valid URL',
          textarea: undefined,
          datepicker: undefined,
          select: undefined,
          multiselect: undefined,
          radiogroup: undefined,
          toggle: undefined,
        }

        let field = null
        switch (fieldType) {
          case 'text':
          case 'password':
          case 'email':
          case 'textarea':
          case 'url':
            /**
             * RETURNS A MODEL TO RENDER A TEXT INPUT
             */
            field = {
              id: uuid(),
              value: (fieldValue || '') as string,
              errorMessage,
              name: key,
              placeholder:
                editMode && fieldType === 'password'
                  ? 'Leave empty to keep the same password'
                  : placeholder,
              label,
              title: label,
              type: fieldType,
            }
            break
          case 'datepicker':
            /**
             * RETURNS A MODEL TO RENDER A DATEPICKER
             */
            field = {
              id: uuid(),
              value: (fieldValue || dayjs(Date.now()).format('YYYY-MM-DD')) as string,
              errorMessage,
              name: key,
              placeholder,
              label,
              type: fieldType,
            }
            setFormValues(formValues.set(key, field.value))
            break
          case 'multiselect':
          case 'select':
            /**
             * RETURNS A MODEL TO RENDER A SELECT WITH OPTIONS LOADED ASYNC
             */
            field = {
              id: uuid(),
              items: fieldData as UISelectOption[],
              value: (fieldValue?.map(({ id }: keyof T) => id) || []) as string[],
              name: key,
              loading: (value as ModelKey).isLoading,
              errorMessage: [(value as ModelKey).error?.message as string, errorMessage]
                .filter(msg => msg)
                .join(', '),
              placeholder: `Select the ${removeCamelCase(key)} from the list`,
              label,
              type: fieldType,
            } as UISelect
            break
          case 'radiogroup':
            /**
             * RETURNS A MODEL TO RENDER A RADIO_GROUP
             */
            field = {
              id: uuid(),
              value: fieldValue,
              label,
              errorMessage,
              items: fieldData as UIRadioGroupOption[],
              name: key,
              type: fieldType,
            } as UIRadioGroup
            break
          case 'toggle':
            /**
             * RETURNS A MODEL TO RENDER AN ON/OFF TOGGLE
             */
            field = {
              id: uuid(),
              value: fieldValue,
              label,
              errorMessage,
              items: fieldData as UIRadioGroupOption[],
              name: key,
              type: fieldType,
            } as UIToggle
            break
          default:
            field = EMPTY_FIELD
            break
        }

        field.description = descriptionMap[field.type as UIType]
        setFieldValues(fieldValues.set(key, field.value))
        return field
      })
    }

    return [EMPTY_FIELD]
  }, [
    model.create.model,
    formValues,
    editData,
    validationErrors,
    removeCamelCase,
    fieldValues,
    editMode,
  ])

  useEffect(() => {
    const errorMessage = editMode ? updateMutation.error?.message : createMutation.error?.message
    if (errorMessage) {
      try {
        const activeErrors = JSON.parse(errorMessage.replace('Validation error: ', ''))
        if (Array.isArray(activeErrors)) {
          const errors = new Map<string, string[]>(Object.entries({}))
          activeErrors.forEach(error => {
            errors.set(error.field, error.errors)
          })
          setValidationErrors(errors)
        }
      } catch (e) {
        // do something here
      }
    }
  }, [createMutation.error, editMode, updateMutation.error])

  const resetModalState = useCallback(() => {
    setFieldValues(new Map(Object.entries({})))
    setFormValues(new Map(Object.entries({})))
    setValidationErrors(new Map(Object.entries({})))
  }, [])

  const handleOnSubmit = useCallback(() => {
    if (formValues.size > 0 && !createMutation.isLoading && !updateMutation.isLoading) {
      // TODO: improve this, since it's just a workaround
      const rawData: Record<string, unknown> = {}
      for (const [key, value] of formValues.entries()) {
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
  }, [createMutation, editMode, formValues, updateMutation])

  const updateFieldValue = useCallback(
    (key: string) => (value: unknown) => {
      setFormValues(formValues.set(key, value))
      setFieldValues(fieldValues.set(key, value))
      setTimestamp(Date.now())
    },
    [fieldValues, formValues],
  )

  const renderField = useCallback(
    (field: UIField) => {
      switch (field.type) {
        case 'toggle':
          return (
            <Switch
              key={field.id}
              isSelected={fieldValues.get(field.name) as boolean}
              onValueChange={updateFieldValue(field.name)}
              size="sm"
            >
              {field.label}
            </Switch>
          )
        case 'radiogroup':
          return (
            <RadioGroup
              key={field.id}
              label={field.label}
              orientation="horizontal"
              errorMessage={field.errorMessage}
              isInvalid={!!field.errorMessage}
              value={fieldValues.get(field.name) as string}
              onValueChange={updateFieldValue(field.name)}
              className="w-full"
            >
              {Object.entries((field as UIRadioGroup).items).map(([key, value]) => (
                <Radio
                  value={key}
                  key={key}
                >
                  {value as ReactNode}
                </Radio>
              ))}
            </RadioGroup>
          )
        case 'multiselect':
        case 'select':
          return (
            <Select
              key={field.id}
              id={field.id}
              items={(field as UISelect).items as UISelectOption[]}
              label={field.label}
              selectedKeys={(fieldValues.get(field.name) as string[]) || []}
              onSelectionChange={entries => updateFieldValue(field.name)(Array.from(entries))}
              variant="flat"
              isMultiline={true}
              isLoading={field.loading}
              selectionMode={field.type === 'multiselect' ? 'multiple' : 'single'}
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
        case 'text':
        case 'url':
        case 'password':
        case 'email':
          return (
            <Input
              id={field.id}
              key={field.id}
              autoFocus={field.autofocus}
              type={field.type}
              value={fieldValues.get(field.name) as string}
              onValueChange={updateFieldValue(field.name)}
              errorMessage={field.errorMessage}
              isInvalid={!!field.errorMessage}
              placeholder={field.placeholder}
              title={field.title}
              description={field.description}
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
              value={fieldValues.get(field.name) as string}
              onValueChange={updateFieldValue(field.name)}
              errorMessage={field.errorMessage}
              isInvalid={!!field.errorMessage}
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
                updateFieldValue(field.name)(dayjs(value).format('YYYY-MM-DD'))
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
    [fieldValues, updateFieldValue],
  )

  useEffect(() => {
    if (isOpen) {
      resetModalState()
    }
  }, [isOpen, resetModalState])

  return (
    <Modal
      backdrop={'blur'}
      isOpen={isOpen}
      onClose={onClose}
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
                  disabled={formValues.size === 0}
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
