export type UIType = 'input' | 'textarea' | 'select' | 'datepicker'

interface UIComponent {
  id: string
  type: UIType
}

export interface UIField extends UIComponent {
  name: string
  label: string
  placeholder?: string
  errorMessage?: string
  autofocus?: boolean
  value: unknown[] | unknown
  loading?: boolean
}

export interface UIInputText extends UIField {
  value: string
}

export interface UIDatePicker extends UIField {
  value: string
}

export interface UISelect extends UIField {
  value: string[]
  items: UISelectOption[]
}

export interface UISelectOption {
  id: string
  name: string
  desc: string
}

export interface Column {
  uid: string
  name: string
  type: 'date' | 'string' | 'array' | 'action'
  sortable?: boolean
}
