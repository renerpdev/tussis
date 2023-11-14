import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Observable } from 'rxjs'
import { InvalidRoleError } from '../../shared/errors/invalid-role-error'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler())

    if (!roles) {
      return true
    }

    const request = context.switchToHttp().getRequest()
    const user = request.user

    const rolesMatched = this.matchRoles(roles, user?.role)

    if (!rolesMatched) {
      throw new InvalidRoleError(roles)
    }

    return true
  }

  private matchRoles(roles: string[], userRole: string): boolean {
    return roles.includes(userRole)
  }
}
