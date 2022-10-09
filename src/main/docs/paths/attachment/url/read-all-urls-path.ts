export const readAllUrlsPath = {
  get: {
    security: [{
      apiKeyAuth: [],
    }],
    tags: ['Url'],
    summary: 'API para ler os dados de todos as urls de anexo',
    description: 'Essa rota só pode ser executada por **usuários autenticados**',
    parameters: [
      {
        in: 'query',
        name: 'urlId',
        description: 'ID da url',
        schema: {
          type: 'string',
        },
      },
      {
        in: 'query',
        name: 'name',
        description: 'Nome da url',
        schema: {
          type: 'string',
        },
      },
      {
        in: 'query',
        name: 'url',
        description: 'Url',
        schema: {
          type: 'string',
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
                $ref: '#/schemas/url',
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
