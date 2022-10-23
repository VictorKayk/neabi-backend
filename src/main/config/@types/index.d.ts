/* eslint-disable camelcase */
declare namespace Express {
  export interface Request {
    id: string;
    accessToken: string;
    user?: {
      _json?: {
        name: string,
        email: string,
        email_verified: boolean,
      }
      credentials?: {
        access_token: string,
        refresh_token?: string,
        expires_in: number,
        token_type: string,
        id_token: string,
      }
    }
  }
}
