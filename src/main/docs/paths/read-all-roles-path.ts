export const readAllRolesPath = {
  get: {
    security: [{
      apiKeyAuth: [],
    }],
    tags: ['Role'],
    summary: 'API para ler todas as funções',
    description: 'Essa rota só pode ser executada por **usuários autenticados**',
    parameters: [
      {
        in: 'query',
        name: 'id',
        description: 'ID da função',
        schema: {
          type: 'string',
        },
      },
      {
        in: 'query',
        name: 'role',
        description: 'Nome da função',
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
              $ref: '#/schemas/role',
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
