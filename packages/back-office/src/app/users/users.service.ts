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
import { UsersList, UsersListInput } from './dto/get-all-users.dto'
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

  async getUserList(input: UsersListInput): Promise<UsersList> {
    const { offset, limit } = getValidDto(UsersListInput, input)

    return getAuth()
      .listUsers()
      .then(listUsersResult => {
        const data = listUsersResult.users
          .slice(offset, offset + limit)
          .map(
            ({
              uid,
              displayName,
              email,
              emailVerified,
              disabled,
              customClaims,
              photoURL,
              metadata,
            }) => ({
              uid,
              displayName,
              email,
              emailVerified,
              disabled,
              role: customClaims?.role,
              photoUrl: photoURL,
              lastLoginAt: metadata.lastSignInTime,
            }),
          )

        return {
          data,
          offset,
          limit,
          total: listUsersResult.users.length,
          hasMore: listUsersResult.pageToken !== null,
        }
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
          role: userRecord.customClaims?.role,
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
          role: userRecord.customClaims?.role,
        } as User
      })
      .catch(error => {
        throw new ServerError(error.message)
      })
  }

  async deleteUser(uid: string, user: AuthUser): Promise<void> {
    if (user.sub === uid) {
      throw new UserError('You cannot delete yourself')
    }

    let userRecord = null
    try {
      // validate the user to be deleted isn't an admin
      userRecord = await getAuth().getUser(uid)
    } catch (error: any) {
      throw new ServerError(error.message)
    }

    if (userRecord?.customClaims?.role === 'admin') {
      throw new UserError('You cannot delete an admin')
    }

    try {
      await getAuth().deleteUser(uid)
      // here we clean up all the data related to this user
      await this.issuesService.deleteAllIssuesFromUser(uid)
      await this.symptomsService.deleteAllSymptomsFromUser(uid)
      await this.medsService.deleteAllMedsFromUser(uid)
    } catch (error: any) {
      throw new ServerError(error.message)
    }
  }

  async updateUserRole(uid: string, userDto: UpdateUserClaimsDto): Promise<void> {
    const validDto = getValidDto(UpdateUserClaimsDto, userDto)

    return getAuth()
      .setCustomUserClaims(uid, { role: validDto.role })
      .catch(error => {
        throw new ServerError(error.message)
      })
  }
}
