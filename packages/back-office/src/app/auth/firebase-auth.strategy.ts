import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import * as firebase from 'firebase-admin'
import { ExtractJwt, Strategy } from 'passport-firebase-jwt'
import { FirebaseAuthProvider } from './auth.providers'

const MODE = process.env.ENV

@Injectable()
export class FirebaseAuthStrategy extends PassportStrategy(Strategy, 'firebase-auth') {
  private defaultApp: any

  constructor(@Inject(FirebaseAuthProvider) auth: any) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    })
    if (MODE === 'development') {
      if (auth.keyFilename) {
        import(auth.keyFilename).then(serviceAccount => {
          this.defaultApp = firebase.initializeApp({
            credential: firebase.credential.cert(serviceAccount),
          })
        })
      }
    } else {
      this.defaultApp = firebase.initializeApp()
    }
  }

  async validate(token: string) {
    const firebaseUser: any = await this.defaultApp
      .auth()
      .verifyIdToken(token, true)
      .catch(err => {
        console.log(err)
        throw new UnauthorizedException(err.message)
      })
    if (!firebaseUser) {
      throw new UnauthorizedException()
    }
    return firebaseUser
  }
}
