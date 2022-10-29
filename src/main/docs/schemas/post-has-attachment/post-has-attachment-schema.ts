export const postHasAttachmentSchema = {
  type: 'object',
  properties: {
    postId: {
      type: 'string',
    },
    attachmentId: {
      type: 'string',
    },
    createdAt: {
      type: 'string',
    },
    updatedAt: {
      type: 'string',
    },
  },
  required: ['postId', 'attachmentId', 'createdAt', 'updatedAt'],
};
