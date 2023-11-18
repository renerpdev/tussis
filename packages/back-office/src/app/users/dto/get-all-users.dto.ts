import { PaginatedList, PaginatedListInput } from '../../../shared/types'
import { User } from '../entities/User'

export class UsersListInput extends PaginatedListInput {}

export class UsersList extends PaginatedList<User> {}
