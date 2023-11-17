export type UIType =
  | 'url'
  | 'text'
  | 'textarea'
  | 'password'
  | 'email'
  | 'select'
  | 'multiselect'
  | 'datepicker'
  | 'radiogroup'
  | 'toggle'

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
  description?: string
  title?: string
  value: unknown[] | unknown
  loading?: boolean
}

export interface UIInputText extends UIField {
  type: 'text' | 'textarea' | 'password' | 'email' | 'url'
  value: string
}

export interface UIDatePicker extends UIField {
  type: 'datepicker'
  value: string
}

export interface UISelect extends UIField {
  value: string[]
  items: UISelectOption[]
  type: 'select' | 'multiselect'
}

export interface UISelectOption {
  id: string
  name: string
  desc: string
}

export interface Column {
  uid: string
  name: string
  type: 'date' | 'string' | 'array' | 'action' | 'boolean' | 'picture'
  sortable?: boolean
}

export type UIRadioGroupOption<V = any> = Record<string, V>

export interface UIRadioGroup<V = any> extends UIField {
  type: 'radiogroup'
  value: V
  items: UIRadioGroupOption<V>[]
}

export interface UIToggle extends UIField {
  type: 'toggle'
  value: boolean
}
