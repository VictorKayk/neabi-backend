export const verifyResetUserPasswordTokenPath = {
  get: {
    security: [{
      apiKeyAuth: [],
    }],
    tags: ['User'],
    summary: 'API para verificar o token necessario para resetar a senha de um usuario',
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
        name: 'token',
        description: 'Token para resetar a senha',
        required: true,
        schema: {
          type: 'string',
        },
      },
    ],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/verifyResetUserPasswordTokenParams',
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
