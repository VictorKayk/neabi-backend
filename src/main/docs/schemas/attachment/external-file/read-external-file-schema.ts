export const readExternalFileSchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
    },
    name: {
      type: 'string',
    },
    mimeType: {
      type: 'string',
    },
    size: {
      type: 'number',
    },
    iconLink: {
      type: 'string',
    },
    thumbnailLink: {
      type: 'string',
    },
  },
};
