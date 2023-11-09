import { AxiosResponse } from 'axios'
import auth from '../app/auth/auth'
import { BaseQueryParams, PaginatedQueryResponse } from '../shared/types'
import AxiosWrapper, { Headers } from './axios.wrapper'

const axiosWrapper = new AxiosWrapper(import.meta.env.VITE_API_URL)

class TussisApi {
  private axiosWrapper: AxiosWrapper

  constructor(axiosWrapper: AxiosWrapper) {
    this.axiosWrapper = axiosWrapper

    // intercepts axios response
    // this.axiosWrapper.core.interceptors.response.use(
    //   response => response,
    //   async error => {
    //     return Promise.reject(error)
    //   },
    // )

    // intercepts axios request
    this.axiosWrapper.core.interceptors.request.use(async request => {
      // TODO: handle here the auth token insertion
      const token = await auth.currentUser?.getIdToken()
      if (token) {
        request.headers.set('Authorization', `Bearer ${token}`)
      }

      return request
    })
  }

  async get<T>(
    endpoint: string,
    params?: BaseQueryParams,
    headers?: Headers,
  ): Promise<PaginatedQueryResponse<T>> {
    return this.axiosWrapper.get<BaseQueryParams, PaginatedQueryResponse<T>>(
      `/${endpoint}`,
      params ? params : undefined,
      headers,
    )
  }

  async add<T, D = Omit<T, 'id'>>(endpoint: string, data: D, headers?: Headers): Promise<T> {
    return this.axiosWrapper.post<T, D>(`/${endpoint}`, data, headers)
  }

  async update<T, D = Partial<Omit<T, 'id'>>>(
    endpoint: string,
    data: D,
    headers?: Headers,
  ): Promise<T> {
    return this.axiosWrapper.patch<T, D>(`/${endpoint}`, data, headers)
  }

  async delete<T>(endpoint: string, headers?: Headers): Promise<T> {
    return this.axiosWrapper.delete<T>(`/${endpoint}`, headers)
  }

  async getPDF<T = Blob>(
    endpoint: string,
    params?: BaseQueryParams,
    headers?: Headers,
  ): Promise<AxiosResponse<T>> {
    return this.axiosWrapper.getPdf<BaseQueryParams, T>(
      `/${endpoint}`,
      params ? params : undefined,
      headers,
    )
  }
}

export default new TussisApi(axiosWrapper)
