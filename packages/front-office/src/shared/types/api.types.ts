export interface BaseQueryParams {
  /**
   * The limit of items to return
   **/
  limit?: number
  /**
   * The offset of items to return
   **/
  offset?: number

  /**
   * The string containing the field to sort and the order (asc/desc) separated by ':'. (Ex: 'birthDate:asc')
   **/
  sort?: string

  /**
   * The string containing a date range in format of (yyyy-mm-dd) separated by ':'. (Ex: '2021-01-01:2024-12-31')
   **/
  range?: string
}

export interface ReportQueryParams {
  range?: string
  frequency?: 'daily' | 'monthly' | 'yearly'
}

export interface PaginatedQueryResponse<T> {
  data: T[]
  total?: number
  hasMore?: boolean
  limit?: number
  offset?: number
}

export enum HttpCodes {
  Unauthorized = 401,
  NotFound = 404,
  Success = 200,
  Created = 201,
  InternalError = 500,
}
