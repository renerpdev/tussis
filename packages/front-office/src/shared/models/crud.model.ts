interface BaseRequest {
  endpoint: string
}

interface CreateRequestModel<T> extends BaseRequest {
  model: Partial<Record<keyof Omit<T, 'id'>, unknown>>
}
type UpdateRequestModel<T> = BaseRequest
type DeleteRequestModel<T> = BaseRequest
type ViewRequestModel<T> = BaseRequest & {
  onSearch?: (search: string) => T[]
}
type ReportRequestModel = BaseRequest

export interface CrudModel<T> {
  create: CreateRequestModel<T>
  update: UpdateRequestModel<T>
  delete: DeleteRequestModel<T>
  view: ViewRequestModel<T>
  report?: ReportRequestModel
}

export interface AsyncData<T> {
  isLoading: boolean
  data: T
  error: Error
}
