export const readAllTagsPath = {
  get: {
    security: [{
      apiKeyAuth: [],
    }],
    tags: ['Tag'],
    summary: 'API para ler todas as tags',
    description: 'Essa rota só pode ser executada por **usuários autenticados**',
    parameters: [
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
        name: 'tag',
        description: 'Nome da tag',
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
                $ref: '#/schemas/tag',
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
