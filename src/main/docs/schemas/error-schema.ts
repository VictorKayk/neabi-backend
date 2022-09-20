export const errorSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
    },
    message: {
      type: 'string',
    },
  },
  required: ['name', 'message'],
};
