export const fileSchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
    },
    name: {
      type: 'string',
    },
    originalFileName: {
      type: 'string',
    },
    url: {
      type: 'string',
    },
    size: {
      type: 'number',
    },
    createdAt: {
      type: 'string',
    },
    updatedAt: {
      type: 'string',
    },
    fileFormat: {
      type: 'object',
      items: {
        $ref: '#/schemas/fileFormat',
      },
    },
    fileType: {
      type: 'object',
      items: {
        $ref: '#/schemas/fileType',
      },
    },
  },
  required: ['id', 'name', 'originalFileName', 'url', 'size', 'createdAt', 'updatedAt', 'fileFormat', 'fileType'],
};
