import { UnauthorizedException } from '@nestjs/common'

export class UnauthorizedResourceError extends UnauthorizedException {
  constructor(userId: string) {
    super(`User <${userId}> is not authorized to access this resource`)
  }
}
