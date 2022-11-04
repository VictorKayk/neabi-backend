export const downloadFileByFileNamePath = {
  get: {
    tags: ['File'],
    summary: 'API para fazer download do arquivo pelo nome',
    parameters: [{
      in: 'path',
      name: 'fileName',
      description: 'Nome do arquivo',
      required: true,
      schema: {
        type: 'string',
      },
    }],
    responses: {
      200: {
      },
      400: {
        $ref: '#/components/badRequest',
      },
      404: {
        $ref: '#/components/notFound',
      },
      500: {
        $ref: '#/components/serverError',
      },
    },
  },
};
