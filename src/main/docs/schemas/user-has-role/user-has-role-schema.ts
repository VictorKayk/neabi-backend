export const userHasRoleSchema = {
  type: 'object',
  properties: {
    userId: {
      type: 'string',
    },
    roleId: {
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
  required: ['userId', 'roleId', 'email', 'isDeleted', 'createdAt', 'updatedAt'],
};
