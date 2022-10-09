export const fileTypeSchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
    },
    type: {
      type: 'string',
    },
    createdAt: {
      type: 'string',
    },
    updatedAt: {
      type: 'string',
    },
  },
  required: ['id', 'type', 'isDeleted', 'createdAt', 'updatedAt'],
};
