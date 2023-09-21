import axios, { AxiosResponse, Method } from 'axios'

export type Headers = unknown

class AxiosWrapper {
  private apiUrl: string

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl

    if (!this.apiUrl) {
      console.error('Warning: VITE_API_URL is not set! Requests might fail.')
    }
  }

  get core() {
    return axios
  }

  private async makeRequest<P, T, D>(
    method: Method,
    path: string,
    params?: P,
    data?: D,
    headers?: Headers,
  ): Promise<T> {
    return axios.request({
      method,
      url: `${this.apiUrl}${path}`,
      params: method === 'GET' ? params : undefined,
      data: method !== 'GET' ? data : undefined,
      headers: headers || undefined,
    })
  }

  async getPdf<P, T = Blob>(
    path: string,
    params?: P,
    headers?: Headers,
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
        ...(headers || {}),
      },
    })
  }

  async get<P, T>(path: string, params?: P, headers?: Headers): Promise<T> {
    return this.makeRequest<P, T, undefined>('GET', path, params, undefined, headers)
  }

  async post<T, D>(path: string, data?: D, headers?: Headers): Promise<T> {
    return this.makeRequest<undefined, T, D>('POST', path, undefined, data, headers)
  }

  async patch<T, D>(path: string, data?: D, headers?: Headers): Promise<T> {
    return this.makeRequest<undefined, T, D>('PATCH', path, undefined, data, headers)
  }

  async delete<T>(path: string, headers?: Headers): Promise<T> {
    return this.makeRequest<undefined, T, undefined>('DELETE', path, undefined, undefined, headers)
  }
}

export default AxiosWrapper
