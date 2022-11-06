export const tagSchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
    },
    tag: {
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
  required: ['id', 'tag', 'isDeleted', 'createdAt', 'updatedAt'],
};
