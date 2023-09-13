import axios, { AxiosResponse, Method } from 'axios'

class AxiosWrapper {
  private apiUrl: string

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl

    if (!this.apiUrl) {
      console.error('Warning: VITE_API_URL is not set! Requests might fail.')
    }
  }

  private async makeRequest<P, T>(
    method: Method,
    path: string,
    params?: P,
    data?: P,
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

  async getPdf<P>(path: string, params?: P, accessToken?: string) {
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
    return this.makeRequest<P, T>('GET', path, params, undefined, accessToken)
  }

  async post<P, T>(path: string, data?: P, accessToken?: string): Promise<T> {
    return this.makeRequest<P, T>('POST', path, undefined, data, accessToken)
  }

  async put<P, T>(path: string, data?: P, accessToken?: string): Promise<T> {
    return this.makeRequest<P, T>('PUT', path, undefined, data, accessToken)
  }

  async delete<P, T>(path: string, accessToken?: string): Promise<T> {
    return this.makeRequest<P, T>('DELETE', path, undefined, undefined, accessToken)
  }
}

export default AxiosWrapper
