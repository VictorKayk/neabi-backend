export const signUpParamsSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      default: 'any_name',
    },
    email: {
      type: 'string',
      default: 'any_email@email.com',
    },
    password: {
      type: 'string',
      default: 'any_password_1',
    },
    passwordConfirmation: {
      type: 'string',
      default: 'any_password_1',
    },
  },
  required: ['name', 'email', 'password', 'passwordConfirmation'],
};
