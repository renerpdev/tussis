import { BaseQueryParams, PaginatedQueryResponse } from 'shared/types'
import AxiosWrapper from './axios.wrapper'

const axiosWrapper = new AxiosWrapper(import.meta.env.VITE_API_URL)

class TussisApi {
  private axiosWrapper: AxiosWrapper

  constructor(axiosWrapper: AxiosWrapper) {
    this.axiosWrapper = axiosWrapper
  }

  async get<T>(
    endpoint: string,
    params?: BaseQueryParams,
    accessToken?: string,
  ): Promise<PaginatedQueryResponse<T>> {
    const response = await this.axiosWrapper.get<BaseQueryParams, PaginatedQueryResponse<T>>(
      `/${endpoint}`,
      params ? params : undefined,
      accessToken,
    )

    return response
  }

  async add<T, D = Omit<T, 'id'>>(endpoint: string, data: D, accessToken?: string): Promise<T> {
    const response = await this.axiosWrapper.post<T, D>(`/${endpoint}`, data, accessToken)

    return response
  }

  async update<T, D = Partial<Omit<T, 'id'>>>(
    endpoint: string,
    data: D,
    accessToken?: string,
  ): Promise<T> {
    const response = await this.axiosWrapper.patch<T, D>(`/${endpoint}`, data, accessToken)

    return response
  }

  async delete<T>(endpoint: string, accessToken?: string): Promise<T> {
    const response = await this.axiosWrapper.delete<T>(`/${endpoint}`, accessToken)

    return response
  }

  async getPDF<T = Blob>(
    endpoint: string,
    params?: BaseQueryParams,
    accessToken?: string,
  ): Promise<T> {
    const response = await this.axiosWrapper.getPdf<BaseQueryParams, T>(
      `/${endpoint}`,
      params ? params : undefined,
      accessToken,
    )

    return response.data
  }
}

export default new TussisApi(axiosWrapper)
