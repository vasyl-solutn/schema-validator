interface ValidationError {
  key: string;
  expectedType: string;
  actualType: string;
  message: string;
}

interface ValidationResult {
  valid: boolean;
  errors?: ValidationError[];
}

class Schema {
  private schema: Record<string, string>;

  constructor(schema: Record<string, string>) {
      this.schema = schema;
  }

  validate(object: Record<string, any>): ValidationResult {
      const errors: ValidationError[] = [];

      for (const key in this.schema) {
          const expectedType = this.schema[key];
          const actualType = typeof object[key];

          if (actualType !== expectedType) {
              errors.push({
                  key,
                  expectedType,
                  actualType,
                  message: `Expected type '${expectedType}' but found type '${actualType}' for key '${key}'.`
              });
          }
      }

      return errors.length ? { valid: false, errors } : { valid: true };
  }
}

export { Schema, ValidationResult, ValidationError };
