import { ForbiddenError } from './forbidden-error'

export class SupervisorNotAllowedError extends ForbiddenError {
  constructor() {
    super(`Supervisors are not allowed to access this resource. Please contact an administrator.`)
  }
}
