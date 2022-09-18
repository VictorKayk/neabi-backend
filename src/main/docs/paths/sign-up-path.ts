export const signUpPath = {
  post: {
    tags: ['Users'],
    summary: 'API para criar conta de um usuário',
    description: 'Essa rota pode ser executada por **qualquer usuário**',
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/signUpParams',
          },
        },
      },
    },
    responses: {
      201: {
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
