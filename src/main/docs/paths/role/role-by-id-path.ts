export const roleByIdPath = {
  get: {
    security: [{
      apiKeyAuth: [],
    }],
    tags: ['Role'],
    summary: 'API para ler todos os dados de uma função pelo id',
    description: 'Essa rota só pode ser executada por **usuários autenticados**',
    parameters: [{
      in: 'path',
      name: 'roleId',
      description: 'ID da função',
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
              $ref: '#/schemas/role',
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
    tags: ['Role'],
    summary: 'API para editar os dados de uma função pelo id',
    description: 'Essa rota só pode ser executada por **usuários autenticados**',
    parameters: [{
      in: 'path',
      name: 'roleId',
      description: 'ID da função',
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
            $ref: '#/schemas/createRoleParams',
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
              $ref: '#/schemas/role',
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
    tags: ['Role'],
    summary: 'API para apagar os dados de uma função pelo id',
    description: 'Essa rota só pode ser executada por **usuários autenticados**',
    parameters: [{
      in: 'path',
      name: 'roleId',
      description: 'ID da função',
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
              $ref: '#/schemas/role',
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
