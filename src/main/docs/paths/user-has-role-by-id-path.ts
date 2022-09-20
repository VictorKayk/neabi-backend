export const userHasRoleByIdPath = {
  post: {
    security: [{
      apiKeyAuth: [],
    }],
    tags: ['UserHasRole'],
    summary: 'API para adicionar função a um usuario',
    description: 'Essa rota só pode ser executada por **usuários autenticados**',
    parameters: [
      {
        in: 'path',
        name: 'userId',
        description: 'ID do usuario',
        required: true,
        schema: {
          type: 'string',
        },
      },
      {
        in: 'path',
        name: 'roleId',
        description: 'ID da função',
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
              $ref: '#/schemas/userHasRole',
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
  delete: {
    security: [{
      apiKeyAuth: [],
    }],
    tags: ['UserHasRole'],
    summary: 'API para apagar função a um usuario',
    description: 'Essa rota só pode ser executada por **usuários autenticados**',
    parameters: [
      {
        in: 'path',
        name: 'userId',
        description: 'ID do usuario',
        required: true,
        schema: {
          type: 'string',
        },
      },
      {
        in: 'path',
        name: 'roleId',
        description: 'ID da função',
        required: true,
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
              $ref: '#/schemas/userHasRole',
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
