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
      const { type: expectedType, required, custom } = fieldSchema;
      const actualValue = object[key];
      const actualType = typeof actualValue;

      // Check if the field is required and missing
      if (required && (actualValue === undefined || actualValue === null)) {
        errors.push({
          key,
          expectedType,
          actualType: null,
          message: `The field '${key}' is required but was not provided.`
        });
      }
      // Check if the field is present and has the correct type
      else if (actualValue !== undefined && actualType !== expectedType) {
        errors.push({
          key,
          expectedType,
          actualType,
          message: `Expected type '${expectedType}' but found type '${actualType}' for key '${key}'.`
        });
      }

      // Check custom validation if provided
      else if (custom && actualValue !== undefined) {
        const customValidationResult = custom(actualValue);
        if (customValidationResult !== true) {
          errors.push({
            key,
            expectedType,
            actualType,
            message: typeof customValidationResult === 'string' ? customValidationResult : `Custom validation failed for key '${key}'.`
          });
        }
      }
    }

    return errors.length ? { valid: false, errors } : { valid: true };
  }
}

export { Schema, ValidationResult, ValidationError, FieldSchema };
