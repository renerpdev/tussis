import { UnauthorizedException } from '@nestjs/common'

export class InvalidRoleError extends UnauthorizedException {
  roles: string[]
  constructor(validRoles: string[]) {
    super(
      `You are not allowed to access this resource. Valid roles are: <${validRoles.join(', ')}>`,
    )
    this.roles = validRoles
  }
}
