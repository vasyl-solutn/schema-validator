import { Schema, ValidationResult } from './schemaValidator';

describe('Schema Validator', () => {
    it('should validate object with correct schema', () => {
        const userSchema = new Schema({
            name: 'string',
            age: 'number',
            email: 'string'
        });

        const result: ValidationResult = userSchema.validate({
            name: 'Alice',
            age: 25,
            email: 'alice@example.com'
        });

        expect(result.valid).toBe(true);
        expect(result.errors).toBeUndefined();
    });

    it('should return errors for incorrect schema', () => {
        const userSchema = new Schema({
            name: 'string',
            age: 'number',
            email: 'string'
        });

        const result: ValidationResult = userSchema.validate({
            name: 'Alice',
            age: 'twenty-five', // This should cause an error
            email: 123 // This should also cause an error
        });

        expect(result.valid).toBe(false);
        expect(result.errors).toBeDefined();
        expect(result.errors?.length).toBe(2);
        expect(result.errors?.[0].key).toBe('age');
        expect(result.errors?.[1].key).toBe('email');
    });
});
