export const readAllUserExternalFilesParamsSchema = {
  type: 'object',
  properties: {
    access_token: {
      type: 'string',
      default: 'any_access_token',
    },
    refresh_token: {
      type: 'string',
      default: 'any_refresh_token',
    },
    expires_in: {
      type: 'number',
      default: 123456789,
    },
    scope: {
      type: 'string',
      default: 'any_scope',
    },
    token_type: {
      type: 'string',
      default: 'any_token_type',
    },
    id_token: {
      type: 'string',
      default: 'any_id_token',
    },
  },
  required: ['access_token', 'expires_in', 'scope', 'token_type', 'id_token'],
};
