export const uploadFileParamsSchema = {
  type: 'object',
  properties: {
    file: {
      description: 'Arquivos para fazer o upload',
      type: 'array',
      items: {
        type: 'string',
        format: 'binary',
      },
    },
  },
  required: ['file'],
};
