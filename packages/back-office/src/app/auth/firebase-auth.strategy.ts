import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import * as firebase from 'firebase-admin'
import { ExtractJwt, Strategy } from 'passport-firebase-jwt'
import { FirebaseAuthProvider } from './auth.providers'

@Injectable()
export class FirebaseAuthStrategy extends PassportStrategy(Strategy, 'firebase-auth') {
  private defaultApp: any

  constructor(@Inject(FirebaseAuthProvider) auth: any) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    })
    if (auth.keyFilename) {
      const firebaseConfig: any = import(auth.keyFilename).then(() => {
        const params = {
          type: firebaseConfig.type,
          projectId: firebaseConfig.project_id,
          privateKeyId: firebaseConfig.private_key_id,
          privateKey: firebaseConfig.private_key,
          clientEmail: firebaseConfig.client_email,
          clientId: firebaseConfig.client_id,
          authUri: firebaseConfig.auth_uri,
          tokenUri: firebaseConfig.token_uri,
          authProviderX509CertUrl: firebaseConfig.auth_provider_x509_cert_url,
          clientC509CertUrl: firebaseConfig.client_x509_cert_url,
        }
        this.defaultApp = firebase.initializeApp(params)
      })
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
