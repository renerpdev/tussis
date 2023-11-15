export class UserError extends Error {
  name = 'UserError'
  statusCode = 400
  data: unknown

  constructor(message: string) {
    super(message)
  }
}
