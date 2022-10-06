export const readAllFilesPath = {
  get: {
    security: [{
      apiKeyAuth: [],
    }],
    tags: ['File'],
    summary: 'API para ler os dados de todos os arquivos',
    description: 'Essa rota só pode ser executada por **usuários autenticados**',
    parameters: [
      {
        in: 'query',
        name: 'fileId',
        description: 'ID do arquivo',
        schema: {
          type: 'string',
        },
      },
      {
        in: 'query',
        name: 'fileName',
        description: 'Nome do arquivo',
        schema: {
          type: 'string',
        },
      },
      {
        in: 'query',
        name: 'originalFileName',
        description: 'Nome original do arquivo',
        schema: {
          type: 'string',
        },
      },
      {
        in: 'query',
        name: 'format',
        description: 'Nome do formato do arquivo',
        schema: {
          type: 'string',
        },
      },
      {
        in: 'query',
        name: 'type',
        description: 'Nome do tipo do arquivo',
        schema: {
          type: 'string',
        },
      },
      {
        in: 'query',
        name: 'size',
        description: 'Tamanho do arquivo',
        schema: {
          type: 'integer',
        },
      },
      {
        in: 'query',
        name: 'page',
        description: 'Pagina',
        schema: {
          type: 'integer',
        },
      },
    ],
    responses: {
      200: {
        description: 'Sucesso',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: {
                $ref: '#/schemas/file',
              },
            },
          },
        },
      },
      401: {
        $ref: '#/components/unauthorized',
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
