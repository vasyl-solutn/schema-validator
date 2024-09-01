import { Schema, ValidationResult } from './schemaValidator';

describe('Schema Validator with Custom Validation', () => {
  it('should validate object with correct schema and custom rules', () => {
    const userSchema = new Schema({
      name: { type: 'string', required: true },
      age: {
        type: 'number',
        required: true,
        custom: (value) => value > 0 || "Age must be a positive number."
      },
      email: {
        type: 'string',
        custom: (value) => /\S+@\S+\.\S+/.test(value) || "Invalid email format."
      }
    });

    const result: ValidationResult = userSchema.validate({
      name: 'Alice',
      age: 25,
      email: 'alice@example.com'
    });

    expect(result.valid).toBe(true);
    expect(result.errors).toBeUndefined();
  });

  it('should return errors for invalid custom rules', () => {
    const userSchema = new Schema({
      name: { type: 'string', required: true },
      age: {
        type: 'number',
        required: true,
        custom: (value) => value > 0 || "Age must be a positive number."
      },
      email: {
        type: 'string',
        custom: (value) => /\S+@\S+\.\S+/.test(value) || "Invalid email format."
      }
    });

    const result: ValidationResult = userSchema.validate({
      name: 'Alice',
      age: -5,  // Invalid age
      email: 'alice-at-example.com'  // Invalid email format
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toBeDefined();
    expect(result.errors?.length).toBe(2);
    expect(result.errors?.[0].key).toBe('age');
    expect(result.errors?.[0].message).toBe('Age must be a positive number.');
    expect(result.errors?.[1].key).toBe('email');
    expect(result.errors?.[1].message).toBe('Invalid email format.');
  });
});
