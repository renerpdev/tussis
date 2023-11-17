import { UIType } from '../types'

interface BaseRequest {
  endpoint: string
}

export interface AsyncData<T> {
  isLoading: boolean
  data: T
  error: Error
}

export type ModelKey = {
  type: UIType
  isLoading?: boolean
  error?: unknown | Error
  data?: unknown
}

interface CreateRequestModel<T> extends BaseRequest {
  model: Partial<Record<keyof Omit<T, 'id'>, ModelKey>>
}
type UpdateRequestModel<T> = Partial<CreateRequestModel<T>>
type DeleteRequestModel = BaseRequest
type ViewRequestModel<T> = BaseRequest & {
  onSearch?: (search: string) => T[]
}
type ReportRequestModel = BaseRequest

export interface CrudModel<T> {
  create: CreateRequestModel<T>
  update: UpdateRequestModel<T>
  delete: DeleteRequestModel
  view: ViewRequestModel<T>
  report?: ReportRequestModel
}
