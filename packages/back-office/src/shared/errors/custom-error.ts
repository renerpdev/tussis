export class CustomError extends Error {
  name = 'CustomError'
  statusCode = 400
  data: unknown

  constructor(message: string) {
    super(message)
  }
}
