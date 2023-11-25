import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import * as firebase from 'firebase-admin'
import { ExtractJwt, Strategy } from 'passport-firebase-jwt'

@Injectable()
export class FirebaseAuthStrategy extends PassportStrategy(Strategy, 'firebase-auth') {
  private defaultApp: any

  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    })
    this.defaultApp = firebase.initializeApp({
      credential: firebase.credential.applicationDefault(),
    })
  }

  async validate(token: string) {
    const firebaseUser: any = await this.defaultApp
      .auth()
      .verifyIdToken(token, true)
      .catch(err => {
        throw new UnauthorizedException(err.message)
      })
    if (!firebaseUser) {
      throw new UnauthorizedException()
    }
    return firebaseUser
  }
}
