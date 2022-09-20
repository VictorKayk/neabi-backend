export const sendVerificationTokenPath = {
  get: {
    security: [{
      apiKeyAuth: [],
    }],
    tags: ['User'],
    summary: 'API para enviar o token necessario para verificar um usuario',
    description: 'Essa rota só pode ser executada por **usuários autenticados**',
    responses: {
      200: {
        description: 'Sucesso',
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
