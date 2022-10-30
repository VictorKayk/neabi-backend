export const readAllAttachmentsFromPostPath = {
  get: {
    security: [{
      apiKeyAuth: [],
    }],
    tags: ['PostHasAttachment'],
    summary: 'API para ler todas os anexos de uma publicação',
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
        in: 'query',
        name: 'id',
        description: 'ID do anexo',
        schema: {
          type: 'string',
        },
      },
      {
        in: 'query',
        name: 'name',
        description: 'Name do anexo',
        schema: {
          type: 'string',
        },
      },
      {
        in: 'query',
        name: 'url',
        description: 'Url do anexo',
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
              $ref: '#/schemas/attachments',
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
