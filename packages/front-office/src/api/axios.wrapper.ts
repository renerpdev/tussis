import { getAuth } from '@firebase/auth'
import axios, { AxiosResponse, Method } from 'axios'
import { toast } from 'react-toastify'
import { HttpCodes } from '../shared/types'

export type Headers = unknown

class AxiosWrapper {
  private readonly apiUrl: string

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl

    if (!this.apiUrl) {
      console.error('Warning: VITE_API_URL is not set! Requests might fail.')
    }

    // intercepts axios response
    axios.interceptors.response.use(
      response => response,
      async error => {
        const config = error?.config
        const message = error?.response?.data.message
        if (error?.response?.status === HttpCodes.Unauthorized && !config?.sent) {
          config.sent = true
          toast.error(message, {
            toastId: error.response.status,
          })
          await getAuth().signOut()
          return axios(config)
        }
        toast.error(message, {
          toastId: error.response.status,
        })
        return Promise.reject(error)
      },
    )

    // intercepts axios request
    axios.interceptors.request.use(
      async request => {
        // TODO: handle here the auth token insertion
        const token = JSON.parse(localStorage.getItem('tussis-store') || '{}').state?.currentUser
          ?.stsTokenManager?.accessToken
        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`)
        }

        return request
      },
      onRejected => {
        console.log('onRejected', onRejected)
        return Promise.reject(onRejected)
      },
    )
  }

  private async makeRequest<P, T, D>(
    method: Method,
    path: string,
    params?: P,
    data?: D,
    headers?: Headers,
  ): Promise<T> {
    return new Promise<T>((resolve, reject) =>
      axios
        .request({
          method,
          url: `${this.apiUrl}${path}`,
          params: method === 'GET' ? params : undefined,
          data: method !== 'GET' ? data : undefined,
          headers: headers || undefined,
        })
        .then(res => resolve(res.data))
        .catch(err => reject(err.response?.data)),
    )
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
