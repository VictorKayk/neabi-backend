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
    }
  }
}
