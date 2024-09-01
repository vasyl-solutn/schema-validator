# schema-validator

## Usage
```import { Schema, ValidationResult } from './schemaValidator';```

### Define a Schema
Create a schema using the Schema class. The schema defines the expected types, whether fields are required, and any custom validation rules.

```
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
```

3. Validate an Object
Use the validate method to check if an object matches the schema. The method returns an object with a valid property indicating if the validation was successful, and an errors property containing any validation errors.

```
const validUser = {
  name: 'Alice',
  age: 25,
  email: 'alice@example.com'
};

const invalidUser = {
  name: 'Bob',
  age: -5,  // Invalid age
  email: 'bob-at-example.com'  // Invalid email format
};

const validResult = userSchema.validate(validUser);
const invalidResult = userSchema.validate(invalidUser);

console.log(validResult);
// Output: { valid: true }

console.log(invalidResult);
/*
Output:
{
  valid: false,
  errors: [
    { key: 'age', expectedType: 'number', actualType: 'number', message: 'Age must be a positive number.' },
    { key: 'email', expectedType: 'string', actualType: 'string', message: 'Invalid email format.' }
  ]
}
*/
```

### Custom Validation Rules
```
const userSchemaWithCustomValidation = new Schema({
  username: {
    type: 'string',
    required: true,
    custom: (value) => /^[a-zA-Z0-9_]+$/.test(value) || "Username must only contain alphanumeric characters and underscores."
  }
});

const result = userSchemaWithCustomValidation.validate({ username: 'invalid username!' });

console.log(result);
/*
Output:
{
  valid: false,
  errors: [
    { key: 'username', expectedType: 'string', actualType: 'string', message: 'Username must only contain alphanumeric characters and underscores.' }
  ]
}
*/
```

## Build the Module
npm run build

## Test the Module
npm test
