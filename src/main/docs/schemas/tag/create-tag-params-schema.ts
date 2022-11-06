export const createTagParamsSchema = {
  type: 'object',
  properties: {
    tag: {
      type: 'string',
      default: 'any_tag',
    },
  },
  required: ['tag'],
};
