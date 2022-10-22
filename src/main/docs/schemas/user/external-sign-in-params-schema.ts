export const externalSignInParamsSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      default: 'name_1',
    },
    email: {
      type: 'string',
      default: 'any_email@email.com',
    },
    email_verified: {
      type: 'boolean',
      default: true,
    },
  },
  required: ['email', 'name', 'email_verified'],
};
