export const readAllUserExternalFilesParamsSchema = {
  type: 'object',
  properties: {
    access_token: {
      type: 'string',
      default: 'any_access_token',
    },
  },
  required: ['access_token'],
};
