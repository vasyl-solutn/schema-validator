import { Schema, ValidationResult } from './schemaValidator';

describe('Schema Validator', () => {
  it('should validate object with correct schema and all required fields', () => {
    const userSchema = new Schema({
      name: { type: 'string', required: true },
      age: { type: 'number', required: true },
      email: { type: 'string' }
    });

    const result: ValidationResult = userSchema.validate({
      name: 'Alice',
      age: 25,
      email: 'alice@example.com'
    });

    expect(result.valid).toBe(true);
    expect(result.errors).toBeUndefined();
  });

  it('should return errors for missing required fields', () => {
    const userSchema = new Schema({
      name: { type: 'string', required: true },
      age: { type: 'number', required: true },
      email: { type: 'string' }
    });

    const result: ValidationResult = userSchema.validate({
      age: 25 // Missing the required 'name' field
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toBeDefined();
    expect(result.errors?.length).toBe(1);
    expect(result.errors?.[0].key).toBe('name');
    expect(result.errors?.[0].message).toBe("The field 'name' is required but was not provided.");
  });

  it('should return errors for incorrect types and missing required fields', () => {
    const userSchema = new Schema({
      name: { type: 'string', required: true },
      age: { type: 'number', required: true },
      email: { type: 'string' }
    });

    const result: ValidationResult = userSchema.validate({
      name: 'Alice',
      age: 'twenty-five', // Incorrect type
      // Missing 'email' is okay because it's not required
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toBeDefined();
    expect(result.errors?.length).toBe(1);
    expect(result.errors?.[0].key).toBe('age');
    expect(result.errors?.[0].message).toBe("Expected type 'number' but found type 'string' for key 'age'.");
  });

  it('should validate object with optional fields correctly', () => {
    const userSchema = new Schema({
      name: { type: 'string', required: true },
      age: { type: 'number' } // Not required
    });

    const result: ValidationResult = userSchema.validate({
      name: 'Bob'
    });

    expect(result.valid).toBe(true);
    expect(result.errors).toBeUndefined();
  });
});
