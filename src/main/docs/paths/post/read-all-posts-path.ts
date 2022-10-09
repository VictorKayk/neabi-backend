export const readAllPostsPath = {
  get: {
    security: [{
      apiKeyAuth: [],
    }],
    tags: ['Post'],
    summary: 'API para ler todas as publicações',
    description: 'Essa rota só pode ser executada por **usuários autenticados**',
    parameters: [
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
    ],
    responses: {
      200: {
        description: 'Sucesso',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: {
                $ref: '#/schemas/post',
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
