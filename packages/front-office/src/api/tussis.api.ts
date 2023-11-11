import { getAuth } from '@firebase/auth'
import { AxiosResponse } from 'axios'
import { toast } from 'react-toastify'
import { BaseQueryParams, HttpCodes, PaginatedQueryResponse } from '../shared/types'
import AxiosWrapper, { Headers } from './axios.wrapper'

const axiosWrapper = new AxiosWrapper(import.meta.env.VITE_API_URL)

class TussisApi {
  private axiosWrapper: AxiosWrapper

  constructor(axiosWrapper: AxiosWrapper) {
    this.axiosWrapper = axiosWrapper

    // intercepts axios response
    this.axiosWrapper.core.interceptors.response.use(
      response => response,
      async error => {
        const config = error?.config
        if (error?.response?.status === HttpCodes.Unauthorized && !config?.sent) {
          config.sent = true
          toast.error(error.message, {
            toastId: error.status,
          })
          await getAuth().signOut()
          return this.axiosWrapper.core(config)
        }
        return Promise.reject(error)
      },
    )

    // intercepts axios request
    this.axiosWrapper.core.interceptors.request.use(async request => {
      // TODO: handle here the auth token insertion
      const token = JSON.parse(localStorage.getItem('tussis-store') || '{}').state?.currentUser
        ?.stsTokenManager?.accessToken
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
