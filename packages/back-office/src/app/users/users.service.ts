import { Injectable, Scope } from '@nestjs/common'
import { getAuth } from 'firebase-admin/auth'
import { ServerError } from '../../shared/errors/server-error'
import { UserError } from '../../shared/errors/user-error'
import { AuthUser } from '../../shared/types/auth.types'
import { getValidDto } from '../../shared/utils'
import { IssuesService } from '../issues/issues.service'
import { MedsService } from '../meds/meds.service'
import { SymptomsService } from '../symptoms/symptoms.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserClaimsDto } from './dto/update-user-claims.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { User } from './entities/User'

@Injectable({ scope: Scope.DEFAULT })
export class UsersService {
  constructor(
    private issuesService: IssuesService,
    private symptomsService: SymptomsService,
    private medsService: MedsService,
  ) {}

  async getUserList(): Promise<User[]> {
    return getAuth()
      .listUsers()
      .then(listUsersResult => {
        return listUsersResult.users.map(
          ({ uid, displayName, email, emailVerified, disabled, customClaims, photoURL }) => ({
            uid,
            displayName,
            email,
            emailVerified,
            disabled,
            customClaims,
            photoURL,
          }),
        )
      })
      .catch(error => {
        throw new ServerError(error.message)
      })
  }

  async createUser(userDto: CreateUserDto): Promise<User> {
    const validDto = getValidDto(CreateUserDto, userDto)

    return getAuth()
      .createUser({
        email: validDto.email,
        emailVerified: validDto.emailVerified,
        password: validDto.password,
        displayName: validDto.displayName,
        photoURL: validDto.photoUrl,
        disabled: validDto.disabled,
      })
      .then(userRecord => {
        return {
          uid: userRecord.uid,
          displayName: userRecord.displayName,
          email: userRecord.email,
          emailVerified: userRecord.emailVerified,
          disabled: userRecord.disabled,
          customClaims: userRecord.customClaims,
          photoUrl: userRecord.photoURL,
        } as User
      })
      .catch(error => {
        throw new ServerError(error.message)
      })
  }

  async updateUser(uid: string, userDto: UpdateUserDto): Promise<User> {
    const validDto = getValidDto(UpdateUserDto, userDto)

    return getAuth()
      .updateUser(uid, {
        email: validDto.email,
        emailVerified: validDto.emailVerified,
        password: validDto.password,
        displayName: validDto.displayName,
        photoURL: validDto.photoUrl,
        disabled: validDto.disabled,
      })
      .then(userRecord => {
        return {
          uid: userRecord.uid,
          displayName: userRecord.displayName,
          email: userRecord.email,
          emailVerified: userRecord.emailVerified,
          disabled: userRecord.disabled,
          customClaims: userRecord.customClaims,
          photoUrl: userRecord.photoURL,
        } as User
      })
      .catch(error => {
        throw new ServerError(error.message)
      })
  }

  async deleteUser(uid: string, user: AuthUser): Promise<void> {
    if (user.sub === uid) return Promise.reject(new UserError('You cannot delete yourself'))

    return getAuth()
      .deleteUser(uid)
      .then(() => {
        // here we clean up all the data related to this user
        this.issuesService.deleteAllIssuesFromUser(uid)
        this.symptomsService.deleteAllSymptomsFromUser(uid)
        this.medsService.deleteAllMedsFromUser(uid)
      })
      .catch(error => {
        throw new ServerError(error.message)
      })
  }

  async updateUserRole(userDto: UpdateUserClaimsDto): Promise<void> {
    const validDto = getValidDto(UpdateUserClaimsDto, userDto)

    return getAuth()
      .setCustomUserClaims(validDto.uid, { role: validDto.role })
      .catch(error => {
        throw new ServerError(error)
      })
  }
}
