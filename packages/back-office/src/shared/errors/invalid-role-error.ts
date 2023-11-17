import { ForbiddenError } from './forbidden-error'

export class InvalidRoleError extends ForbiddenError {
  roles: string[]
  constructor(validRoles: string[]) {
    super(
      `You are not allowed to access this resource. Valid roles are: <${validRoles.join(', ')}>`,
    )
    this.roles = validRoles
  }
}
