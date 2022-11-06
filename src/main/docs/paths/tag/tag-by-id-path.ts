export const tagByIdPath = {
  get: {
    security: [{
      apiKeyAuth: [],
    }],
    tags: ['Tag'],
    summary: 'API para ler todos os dados de uma tag pelo id',
    description: 'Essa rota só pode ser executada por **usuários autenticados**',
    parameters: [{
      in: 'path',
      name: 'id',
      description: 'ID da tag',
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
              $ref: '#/schemas/tag',
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
    tags: ['Tag'],
    summary: 'API para editar os dados de uma tag pelo id',
    description: 'Essa rota só pode ser executada por **usuários autenticados**',
    parameters: [{
      in: 'path',
      name: 'id',
      description: 'ID da tag',
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
            $ref: '#/schemas/createTagParams',
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
              $ref: '#/schemas/tag',
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
