export type UIType = 'input' | 'textarea' | 'password' | 'select' | 'datepicker' | 'toggle'

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
  type: 'input' | 'textarea' | 'password'
  value: string
}

export interface UIDatePicker extends UIField {
  type: 'datepicker'
  value: string
}

export interface UISelect extends UIField {
  value: string[]
  items: UISelectOption[]
  type: 'select'
}

export interface UISelectOption {
  id: string
  name: string
  desc: string
  type: 'select'
}

export interface Column {
  uid: string
  name: string
  type: 'date' | 'string' | 'array' | 'action' | 'boolean' | 'picture'
  sortable?: boolean
}

export interface UIToggle extends UIField {
  type: 'toggle'
  value: boolean
}
