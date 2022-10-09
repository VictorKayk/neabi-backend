export const signInParamsSchema = {
  type: 'object',
  properties: {
    email: {
      type: 'string',
      default: 'any_email@email.com',
    },
    password: {
      type: 'string',
      default: 'any_password_1',
    },
  },
  required: ['email', 'password'],
};
