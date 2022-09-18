export const createRoleParamsSchema = {
  type: 'object',
  properties: {
    role: {
      type: 'string',
      default: 'any_role',
    },
  },
  required: ['role'],
};
