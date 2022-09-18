export const verifyResetUserPasswordTokenParamsSchema = {
  type: 'object',
  properties: {
    password: {
      type: 'string',
      default: 'any_password_1',
    },
  },
  required: ['password'],
};
