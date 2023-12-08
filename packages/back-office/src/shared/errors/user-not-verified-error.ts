import { ForbiddenError } from './forbidden-error'

export class UserNotVerifiedError extends ForbiddenError {
  constructor() {
    super(`You are not allowed to access this resource. You must verify your email first.`)
  }
}
