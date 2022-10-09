export const userCritialDataSchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
    },
    name: {
      type: 'string',
    },
    email: {
      type: 'string',
    },
    accessToken: {
      type: 'string',
    },
    isVerified: {
      type: 'boolean',
    },
    createdAt: {
      type: 'string',
    },
    updatedAt: {
      type: 'string',
    },
    roles: {
      type: 'array',
      items: {
        $ref: '#/schemas/role',
      },
    },
  },
  required: ['id', 'name', 'email', 'accessToken', 'isVerified', 'createdAt', 'updatedAt', 'roles'],
};
