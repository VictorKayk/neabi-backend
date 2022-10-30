export const attachmentsSchema = {
  type: 'object',
  properties: {
    url: {
      type: 'array',
      items: {
        $ref: '#/schemas/url',
      },
    },
    file: {
      type: 'array',
      items: {
        $ref: '#/schemas/file',
      },
    },
    externalFile: {
      type: 'array',
      items: {
        $ref: '#/schemas/externalFile',
      },
    },
  },
  required: ['url', 'file', 'externalFile'],
};
