import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Observable } from 'rxjs'
import { UserNotVerifiedError } from '../../shared/errors/user-not-verified-error'

@Injectable()
export class VerifiedUserGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest()
    const user = request.user

    const userVerified = user?.email_verified

    if (!userVerified) {
      throw new UserNotVerifiedError()
    }

    return true
  }
}
