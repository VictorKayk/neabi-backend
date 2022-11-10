export const readAllPostsFromTagPath = {
  get: {
    security: [{
      apiKeyAuth: [],
    }],
    tags: ['PostHasTag'],
    summary: 'API para ler todas as publicações relacionadas a uma tag',
    description: 'Essa rota só pode ser executada por **usuários autenticados**',
    parameters: [
      {
        in: 'path',
        name: 'tagId',
        description: 'ID da tag',
        required: true,
        schema: {
          type: 'string',
        },
      },
      {
        in: 'query',
        name: 'id',
        description: 'ID da publicação',
        schema: {
          type: 'string',
        },
      },
      {
        in: 'query',
        name: 'title',
        description: 'Titulo da publicação',
        schema: {
          type: 'string',
        },
      },
      {
        in: 'query',
        name: 'slug',
        description: 'Slug da publicação',
        schema: {
          type: 'string',
        },
      },
      {
        in: 'query',
        name: 'description',
        description: 'Descrição da publicação',
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
              $ref: '#/schemas/post',
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
