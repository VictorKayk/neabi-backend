export const readAllTagsFromPostPath = {
  get: {
    security: [{
      apiKeyAuth: [],
    }],
    tags: ['PostHasTag'],
    summary: 'API para ler todas as tags de uma publicação',
    description: 'Essa rota só pode ser executada por **usuários autenticados**',
    parameters: [
      {
        in: 'path',
        name: 'postId',
        description: 'ID da publicação',
        required: true,
        schema: {
          type: 'string',
        },
      },
      {
        in: 'query',
        name: 'id',
        description: 'ID da tag',
        schema: {
          type: 'string',
        },
      },
      {
        in: 'query',
        name: 'name',
        description: 'Name da tag',
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
            type: 'array',
            items: {
              $ref: '#/schemas/tag',
            },
          },
        },
      },
      400: {
        $ref: '#/components/badRequest',
      },
      401: {
        $ref: '#/components/unauthorized',
      },
      403: {
        $ref: '#/components/forbidden',
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
