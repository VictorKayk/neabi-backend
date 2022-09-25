export const postSchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
    },
    title: {
      type: 'string',
    },
    slug: {
      type: 'string',
    },
    description: {
      type: 'string',
    },
    descriptionHtml: {
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
  required: ['id', 'title', 'slug', 'description', 'descriptionHtml', 'isDeleted', 'createdAt', 'updatedAt'],
};
