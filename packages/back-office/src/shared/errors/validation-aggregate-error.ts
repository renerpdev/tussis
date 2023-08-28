import { CustomError } from './custom-error';
import { FieldValidationError } from './field-validation-error';

export class ValidationAggregateError extends CustomError {
  readonly name = 'ValidationAggregateError';
  data: FieldValidationError[];

  constructor(message: string, errors: FieldValidationError[]) {
    super(message);
    this.data = errors;
  }
}
