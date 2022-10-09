export const readAllRolesFromUserPath = {
  get: {
    security: [{
      apiKeyAuth: [],
    }],
    tags: ['UserHasRole'],
    summary: 'API para ler todas as funções de um usuario',
    description: 'Essa rota só pode ser executada por **usuários autenticados**',
    parameters: [
      {
        in: 'path',
        name: 'userId',
        description: 'ID do usuario',
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
                $ref: '#/schemas/roles',
              },
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
