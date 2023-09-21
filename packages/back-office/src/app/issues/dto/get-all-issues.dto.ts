import { PaginatedList, PaginatedListInput } from '../../../shared/types'
import { IssueDocument } from '../documents/issues.document'

export class IssuesListInput extends PaginatedListInput {}

export class IssuesList extends PaginatedList<IssueDocument> {}
