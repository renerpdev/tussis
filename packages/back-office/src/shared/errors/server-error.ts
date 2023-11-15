export class ServerError extends Error {
  name = 'ServerError'
  statusCode = 500
  data: unknown

  constructor(message: string) {
    super(message)
  }
}
