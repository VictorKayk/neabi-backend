export const allUsersPath = {
  get: {
    security: [{
      apiKeyAuth: [],
    }],
    tags: ['User'],
    summary: 'API para ler os dados da conta de todos os usuário',
    description: 'Essa rota só pode ser executada por **usuários autenticados**',
    parameters: [
      {
        in: 'query',
        name: 'id',
        description: 'ID do usuario',
        schema: {
          type: 'string',
        },
      },
      {
        in: 'query',
        name: 'name',
        description: 'Nome do usuario',
        schema: {
          type: 'string',
        },
      },
      {
        in: 'query',
        name: 'email',
        description: 'Email do usuario',
        schema: {
          type: 'string',
        },
      },
      {
        in: 'query',
        name: 'role',
        description: 'Função do usuario',
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
              $ref: '#/schemas/user',
            },
          },
        },
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
