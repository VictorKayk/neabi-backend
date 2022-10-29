export const createExternalFileParamsSchema = {
  type: 'object',
  properties: {
    access_token: {
      type: 'string',
      default: 'any_access_token',
    },
    filesIds: {
      type: 'array',
      items: {
        type: 'string',
        default: 'any_fileId',
      },
    },
  },
  required: ['access_token', 'filesIds'],
};
