import UserModel from '../src/models/userModel';

const mongoose = require('mongoose');

const userData = {
  login: 'login',
  name: 'name',
  familyName: 'familyName',
  password: 'password',
  email: 'email',
  isVerified: true,
  passwordResetToken: 'passwordResetToken',
  passwordResetExpires: new Date(),
  roles: ['role'],
};

expect.extend({
  toContainObject(received, argument) {
    const pass = this.equals(received,
      expect.arrayContaining([
        expect.objectContaining(argument),
      ]));

    if (pass) {
      return {
        message: () => (`expected ${this.utils.printReceived(received)} not to contain object ${this.utils.printExpected(argument)}`),
        pass: true,
      };
    }
    return {
      message: () => (`expected ${this.utils.printReceived(received)} to contain object ${this.utils.printExpected(argument)}`),
      pass: false,
    };
  },
});

describe('User Model Tests', () => {
  // It's just so easy to connect to the MongoDB Memory Server
  // By using mongoose.connect
  beforeAll(async () => {
    await mongoose.connect(global.__MONGO_URI__,
      { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }, (err) => {
        if (err) {
          console.error(err);
          process.exit(1);
        }
      });
  });

  it('create & save user successfully', async () => {
    const validUser = new UserModel(userData);
    const savedUser = await validUser.save();
    // Object Id should be defined when successfully saved to MongoDB.
    expect(savedUser._id).toBeDefined();
    expect(savedUser.login).toBe(userData.login);
    expect(savedUser.name).toBe(userData.name);
    expect(savedUser.familyName).toBe(userData.familyName);
    expect(savedUser.password).toBe(userData.password);
    expect(savedUser.email).toBe(userData.email);
    expect(savedUser.isVerified).toBe(userData.isVerified);
    expect(savedUser.passwordResetToken).toBe(userData.passwordResetToken);
    expect(savedUser.passwordResetExpires).toBe(userData.passwordResetExpires);
    expect(savedUser.preview).toBe(userData.preview);
    expect(savedUser.roles).toContain(userData.roles[0]);
  });

  // Test Schema is working!!!
  // You shouldn't be able to add in any field that isn't defined in the schema
  it('insert user successfully, but the field not defined in schema should be undefined', async () => {
    const userWithInvalidField = new UserModel({
      login: 'login',
      name: 'name',
      familyName: 'familyName',
      password: 'password',
      email: 'userEmail', // email field must be unique, can't check that way
      isVerified: true,
      passwordResetToken: 'passwordResetToken',
      passwordResetExpires: new Date(),
      roles: ['role'],
      undefinedField: 'undefinedField',
    });
    const savedUserWithInvalidField = await userWithInvalidField.save();
    expect(savedUserWithInvalidField._id).toBeDefined();
    expect(savedUserWithInvalidField.undefinedField).toBeUndefined();
  });

  // Test Validation is working!!!
  // It should us told us the errors in on gender field.
  it('create user without required field should failed', async () => {
    const userWithoutLoginField = new UserModel({
      name: 'name',
      familyName: 'familyName',
      password: 'password',
      email: 'userEmail',
      isVerified: true,
      passwordResetToken: 'passwordResetToken',
      passwordResetExpires: new Date(),
      roles: ['role'],
    });
    let err;
    try {
      await userWithoutLoginField.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.login).toBeDefined();
  });
});
