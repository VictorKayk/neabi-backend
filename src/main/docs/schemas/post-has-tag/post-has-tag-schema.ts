export const postHasTagSchema = {
  type: 'object',
  properties: {
    postId: {
      type: 'string',
    },
    tagId: {
      type: 'string',
    },
    createdAt: {
      type: 'string',
    },
    updatedAt: {
      type: 'string',
    },
  },
  required: ['postId', 'tagId', 'createdAt', 'updatedAt'],
};
