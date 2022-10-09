export const createUrlParamsSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      default: 'any_name',
    },
    url: {
      type: 'string',
      default: 'any_url',
    },
  },
  required: ['name', 'url'],
};
