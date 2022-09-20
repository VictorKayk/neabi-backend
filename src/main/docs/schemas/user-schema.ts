export const userSchema = {
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
  },
  required: ['id', 'name', 'email', 'accessToken', 'isVerified', 'createdAt', 'updatedAt'],
};
