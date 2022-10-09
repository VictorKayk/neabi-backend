export const roleSchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
    },
    role: {
      type: 'string',
    },
    isDeleted: {
      type: 'boolean',
    },
    createdAt: {
      type: 'string',
    },
    updatedAt: {
      type: 'string',
    },
  },
  required: ['id', 'role', 'email', 'isDeleted', 'createdAt', 'updatedAt'],
};
