export const createUrlParamsSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      default: 'any_name',
    },
    url: {
      type: 'string',
      default: 'https://www.any_url.com',
    },
  },
  required: ['name', 'url'],
};
