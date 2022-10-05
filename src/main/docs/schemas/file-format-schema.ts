export const fileFormatSchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
    },
    format: {
      type: 'string',
    },
    createdAt: {
      type: 'string',
    },
    updatedAt: {
      type: 'string',
    },
  },
  required: ['id', 'format', 'isDeleted', 'createdAt', 'updatedAt'],
};
