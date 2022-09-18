export const userByIdPath = {
  get: {
    security: [{
      apiKeyAuth: [],
    }],
    tags: ['Users'],
    summary: 'API para ler os dados da conta de um usuário pelo id',
    description: 'Essa rota só pode ser executada por **usuários autenticados**',
    parameters: [{
      in: 'path',
      name: 'userId',
      description: 'ID do usuario',
      required: true,
      schema: {
        type: 'string',
      },
    }],
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
  patch: {
    security: [{
      apiKeyAuth: [],
    }],
    tags: ['Users'],
    summary: 'API para editar os dados da conta de um usuário',
    description: 'Essa rota só pode ser executada por **usuários autenticados**',
    parameters: [{
      in: 'path',
      name: 'userId',
      description: 'ID do usuario',
      required: true,
      schema: {
        type: 'string',
      },
    }],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/userUpdadeParams',
          },
        },
      },
    },
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
    tags: ['Users'],
    summary: 'API para apagar a conta de um usuário',
    description: 'Essa rota só pode ser executada por **usuários autenticados**',
    parameters: [{
      in: 'path',
      name: 'userId',
      description: 'ID do usuario',
      required: true,
      schema: {
        type: 'string',
      },
    }],
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
