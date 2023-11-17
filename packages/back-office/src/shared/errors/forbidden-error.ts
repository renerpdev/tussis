export class ForbiddenError extends Error {
  readonly statusCode = 403
  constructor(message?: string) {
    super(message ?? 'You are not allowed to access this resource.')
  }
}
