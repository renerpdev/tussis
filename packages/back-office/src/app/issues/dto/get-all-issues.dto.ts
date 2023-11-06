import { PaginatedList, PaginatedListInput } from '../../../shared/types'
import { Issue } from '../entities/issue.entity'

export class IssuesListInput extends PaginatedListInput {}

export class IssuesList extends PaginatedList<Issue> {}
