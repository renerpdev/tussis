import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Observable } from 'rxjs'
import { SupervisorNotAllowedError } from '../../shared/errors/supervisor-not-allowed-error'

@Injectable()
export class BlacklistSupervisorGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest()
    const user = request.user

    const isSupervisor = user?.role === 'supervisor'

    if (isSupervisor) {
      throw new SupervisorNotAllowedError()
    }

    return true
  }
}
