import { FieldValidationError } from './field-validation-error'
import { UserError } from './user-error'

export class ValidationAggregateError extends UserError {
  readonly name = 'ValidationAggregateError'
  data: FieldValidationError[]

  constructor(message: string, errors: FieldValidationError[]) {
    super(`${message}: ${JSON.stringify(errors)}`)
    this.data = errors
  }
}
