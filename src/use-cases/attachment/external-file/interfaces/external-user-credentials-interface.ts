/* eslint-disable camelcase */
export interface IExternalUserCredentials {
  access_token: string,
  refresh_token?: string,
  expires_in?: number,
  scope?: string,
  token_type?: string,
  id_token?: string,
}
