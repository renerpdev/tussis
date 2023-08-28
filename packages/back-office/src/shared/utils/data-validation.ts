import { ClassConstructor, plainToInstance } from 'class-transformer';
import { ValidationError, validateSync } from 'class-validator';
import { FieldValidationError } from '../errors/field-validation-error';
import { ValidationAggregateError } from '../errors/validation-aggregate-error';

export function getAllConstraints(
  rootProperty: string,
  errors: ValidationError[]
): FieldValidationError[] {
  const constraints: FieldValidationError[] = [];

  for (const error of errors) {
    if (error.constraints) {
      const constraintValues = Object.values(error.constraints);
      constraints.push({
        field: rootProperty
          ? `${rootProperty}.${error.property}`
          : error.property,
        errors: constraintValues,
      });
    }

    if (error.children) {
      const childConstraints = getAllConstraints(
        error.property,
        error.children
      );
      constraints.push(...childConstraints);
    }
  }

  return constraints;
}

export function getValidDto<T, V extends object>(
  cls: ClassConstructor<T>,
  plain: V,
  errorMessage = 'Validation error'
): T {
  const cleanObject = plainToInstance(cls, plain) as object;
  const constraints = validateSync(cleanObject as object);
  const errors = getAllConstraints('', constraints);

  if (errors.length > 0) {
    throw new ValidationAggregateError(errorMessage, errors);
  }

  return cleanObject as T;
}
