import axios, { AxiosResponse, Method } from 'axios'

class AxiosWrapper {
  private apiUrl: string

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl

    if (!this.apiUrl) {
      console.error('Warning: VITE_API_URL is not set! Requests might fail.')
    }
  }

  private async makeRequest<P, T, D>(
    method: Method,
    path: string,
    params?: P,
    data?: D,
    accessToken?: string,
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await axios.request({
        method,
        url: `${this.apiUrl}${path}`,
        params: method === 'GET' ? params : undefined,
        data: method !== 'GET' ? data : undefined,
        headers: accessToken
          ? {
              Authorization: `Bearer ${accessToken}`,
            }
          : undefined,
      })

      return response.data
    } catch (error) {
      console.error(`Error performing ${method} request to ${path}:`, error)
      throw error
    }
  }

  async getPdf<P, T = Blob>(
    path: string,
    params?: P,
    accessToken?: string,
  ): Promise<AxiosResponse<T>> {
    return axios.get(`${this.apiUrl}${path}`, {
      params: {
        cacheBustTimestamp: Date.now(), // prevents IE cache problems on re-download
        ...(params ? { ...params } : {}),
      },
      responseType: 'blob',
      timeout: 120,
      headers: {
        Accept: 'application/octet-stream',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
    })
  }

  async get<P, T>(path: string, params?: P, accessToken?: string): Promise<T> {
    return this.makeRequest<P, T, undefined>('GET', path, params, undefined, accessToken)
  }

  async post<T, D>(path: string, data?: D, accessToken?: string): Promise<T> {
    return this.makeRequest<undefined, T, D>('POST', path, undefined, data, accessToken)
  }

  async patch<T, D>(path: string, data?: D, accessToken?: string): Promise<T> {
    return this.makeRequest<undefined, T, D>('PATCH', path, undefined, data, accessToken)
  }

  async delete<T>(path: string, accessToken?: string): Promise<T> {
    return this.makeRequest<undefined, T, undefined>(
      'DELETE',
      path,
      undefined,
      undefined,
      accessToken,
    )
  }
}

export default AxiosWrapper
