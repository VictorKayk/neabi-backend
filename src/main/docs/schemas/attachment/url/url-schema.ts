export const urlSchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
    },
    attachmentId: {
      type: 'string',
    },
    name: {
      type: 'string',
    },
    url: {
      type: 'string',
    },
    createdAt: {
      type: 'string',
    },
    updatedAt: {
      type: 'string',
    },
  },
  required: ['id', 'attachmentId', 'name', 'url', 'createdAt', 'updatedAt'],
};
