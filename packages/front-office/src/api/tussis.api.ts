import { BaseQueryParams, HttpCodes, PaginatedQueryResponse } from 'shared/types'
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
          // TODO: handle here the auth token refreshing
          // TODO: Do request for getting the auth cookie with the refreshed token
          // if (cookie?.accessToken) {
          //   config.headers = {
          //     ...config.headers,
          //     authorization: `Bearer ${cookie.accessToken}`,
          //   }
          // }

          return this.axiosWrapper.core(config)
        }
        return Promise.reject(error)
      },
    )

    // intercepts axios request
    this.axiosWrapper.core.interceptors.request.use(request => {
      // TODO: handle here the auth token insertion
      request.headers.set('authorization', '<auth_token_here>')

      return request
    })
  }

  async get<T>(
    endpoint: string,
    params?: BaseQueryParams,
    headers?: Headers,
  ): Promise<PaginatedQueryResponse<T>> {
    const response = await this.axiosWrapper.get<BaseQueryParams, PaginatedQueryResponse<T>>(
      `/${endpoint}`,
      params ? params : undefined,
      headers,
    )

    return response
  }

  async add<T, D = Omit<T, 'id'>>(endpoint: string, data: D, headers?: Headers): Promise<T> {
    const response = await this.axiosWrapper.post<T, D>(`/${endpoint}`, data, headers)

    return response
  }

  async update<T, D = Partial<Omit<T, 'id'>>>(
    endpoint: string,
    data: D,
    headers?: Headers,
  ): Promise<T> {
    const response = await this.axiosWrapper.patch<T, D>(`/${endpoint}`, data, headers)

    return response
  }

  async delete<T>(endpoint: string, headers?: Headers): Promise<T> {
    const response = await this.axiosWrapper.delete<T>(`/${endpoint}`, headers)

    return response
  }

  async getPDF<T = Blob>(
    endpoint: string,
    params?: BaseQueryParams,
    headers?: Headers,
  ): Promise<T> {
    const response = await this.axiosWrapper.getPdf<BaseQueryParams, T>(
      `/${endpoint}`,
      params ? params : undefined,
      headers,
    )

    return response.data
  }
}

export default new TussisApi(axiosWrapper)
