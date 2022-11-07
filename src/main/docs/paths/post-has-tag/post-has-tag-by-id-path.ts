export const postHasTagByIdPath = {
  post: {
    security: [{
      apiKeyAuth: [],
    }],
    tags: ['PostHasTag'],
    summary: 'API para adicionar uma tag a uma publicação',
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
        in: 'path',
        name: 'tagId',
        description: 'ID da tag',
        required: true,
        schema: {
          type: 'string',
        },
      },
    ],
    responses: {
      201: {
        description: 'Sucesso',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/postHasTag',
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
      404: {
        $ref: '#/components/notFound',
      },
      500: {
        $ref: '#/components/serverError',
      },
    },
  },
};
