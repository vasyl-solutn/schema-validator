interface ValidationError {
  key: string;
  expectedType: string;
  actualType: string | null;
  message: string;
}

interface ValidationResult {
  valid: boolean;
  errors?: ValidationError[];
}

interface FieldSchema {
  type: string;
  required?: boolean;
  custom?: (value: any) => boolean | string;
}

class Schema {
  private schema: Record<string, FieldSchema>;

  constructor(schema: Record<string, FieldSchema>) {
    this.schema = schema;
  }

  validate(object: Record<string, any>): ValidationResult {
    const errors: ValidationError[] = [];

    for (const key in this.schema) {
      const fieldSchema = this.schema[key];
      const actualValue = object[key];

      const fieldErrors = this.validateField(key, fieldSchema, actualValue);
      if (fieldErrors) {
        errors.push(...fieldErrors);
      }
    }

    return errors.length ? { valid: false, errors } : { valid: true };
  }

  private validateField(key: string, fieldSchema: FieldSchema, actualValue: any): ValidationError[] | null {
    const { type: expectedType, required, custom } = fieldSchema;
    const errors: ValidationError[] = [];

    if (this.isMissingRequiredField(required, actualValue)) {
      errors.push(this.createMissingFieldError(key, expectedType));
    } else if (actualValue !== undefined) {
      if (!this.isCorrectType(expectedType, actualValue)) {
        errors.push(this.createTypeError(key, expectedType, typeof actualValue));
      }
      if (custom && !this.passesCustomValidation(custom, actualValue)) {
        errors.push(this.createCustomValidationError(key, expectedType, actualValue, custom));
      }
    }

    return errors.length ? errors : null;
  }

  private isMissingRequiredField(required: boolean | undefined, actualValue: any): boolean {
    return !!required && (actualValue === undefined || actualValue === null);
  }

  private isCorrectType(expectedType: string, actualValue: any): boolean {
    return typeof actualValue === expectedType;
  }

  private passesCustomValidation(custom: (value: any) => boolean | string, actualValue: any): boolean {
    return custom(actualValue) === true;
  }

  private createMissingFieldError(key: string, expectedType: string): ValidationError {
    return {
      key,
      expectedType,
      actualType: null,
      message: `The field '${key}' is required but was not provided.`
    };
  }

  private createTypeError(key: string, expectedType: string, actualType: string): ValidationError {
    return {
      key,
      expectedType,
      actualType,
      message: `Expected type '${expectedType}' but found type '${actualType}' for key '${key}'.`
    };
  }

  private createCustomValidationError(key: string, expectedType: string, actualValue: any, custom: (value: any) => boolean | string): ValidationError {
    const customMessage = custom(actualValue);
    return {
      key,
      expectedType,
      actualType: typeof actualValue,
      message: typeof customMessage === 'string' ? customMessage : `Custom validation failed for key '${key}'.`
    };
  }
}

export { Schema, ValidationResult, ValidationError, FieldSchema };
