export const createPostParamsSchema = {
  type: 'object',
  properties: {
    title: {
      type: 'string',
      default: 'any_title',
    },
    description: {
      type: 'string',
      default: '<p>any_description</p>',
    },
  },
  required: ['title', 'description'],
};
