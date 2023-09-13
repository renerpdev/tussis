import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import AxiosWrapper from './axios.wrapper'

describe('AxiosWrapper', () => {
  let mockAxios: MockAdapter
  const baseURL = 'http://api.example.com'
  const originalConsoleError = console.error

  beforeEach(() => {
    mockAxios = new MockAdapter(axios)
    console.error = vi.fn()
  })

  afterEach(() => {
    mockAxios.restore()
    console.error = originalConsoleError
  })

  it('should make a GET request', async () => {
    const expectedData = { data: 'sample data' }
    mockAxios.onGet(`${baseURL}/test`).reply(200, expectedData)

    const wrapper = new AxiosWrapper(baseURL)
    const result = await wrapper.get('/test')

    expect(result).toEqual(expectedData)
  })

  it('should make a GET request with parameters', async () => {
    const expectedData = { data: 'sample data' }
    const queryParams = { key: 'value' }

    mockAxios.onGet(`${baseURL}/test`, { params: queryParams }).reply(200, expectedData)

    const wrapper = new AxiosWrapper(baseURL)
    const result = await wrapper.get('/test', queryParams)

    expect(result).toEqual(expectedData)
  })

  it('should make a POST request', async () => {
    const expectedData = { data: 'sample data' }
    const postData = { key: 'value' }

    mockAxios.onPost(`${baseURL}/test`).reply(200, expectedData)

    const wrapper = new AxiosWrapper(baseURL)
    const result = await wrapper.post('/test', postData)

    expect(result).toEqual(expectedData)
  })

  it('should make a POST request with correct data', async () => {
    const expectedData = { data: 'sample data' }
    const postData = { key: 'value' }

    mockAxios.onPost(`${baseURL}/test`, postData).reply(200, expectedData)

    const wrapper = new AxiosWrapper(baseURL)
    const result = await wrapper.post('/test', postData)

    expect(result).toEqual(expectedData)
  })

  it('should handle errors', async () => {
    mockAxios.onGet(`${baseURL}/test`).reply(500, { error: 'Internal Server Error' })

    const wrapper = new AxiosWrapper(baseURL)

    await expect(wrapper.get('/test')).rejects.toThrow('Request failed with status code 500')
  })

  it('should log a warning when apiUrl is not set', () => {
    const consoleSpy = vi.spyOn(console, 'error')

    new AxiosWrapper('')

    expect(consoleSpy).toHaveBeenCalledWith(
      'Warning: VITE_API_URL is not set! Requests might fail.',
    )
  })

  it('should handle request timeouts', async () => {
    mockAxios.onGet(`${baseURL}/test`).timeout()

    const wrapper = new AxiosWrapper(baseURL)

    await expect(wrapper.get('/test')).rejects.toThrow()
  })
})
