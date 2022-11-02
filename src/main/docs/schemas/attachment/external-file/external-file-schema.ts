export const externalFileSchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
    },
    externalId: {
      type: 'string',
    },
    name: {
      type: 'string',
    },
    originalFileName: {
      type: 'string',
    },
    attachmentId: {
      type: 'string',
    },
    url: {
      type: 'string',
    },
    downloadUrl: {
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
  required: ['id', 'externalId', 'name', 'attachmentId', 'url', 'createdAt', 'updatedAt', 'fileFormat', 'fileType'],
};
