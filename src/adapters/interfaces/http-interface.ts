/* eslint-disable camelcase */
export interface IHttpRequest {
  body?: any,
  params?: any,
  query?: any,
  files?: any,
}

export interface IHttpRequestAuthenticated extends IHttpRequest {
  user: {
    id: string,
    accessToken: string,
    data?: {
      name: string,
      email: string,
      email_verified: boolean,
    },
    credentials?: {
      access_token: string,
      refresh_token?: string,
      expires_in: number,
      token_type: string,
      id_token: string,
    }
  }
}

export interface IHttpResponse<T = any> {
  statusCode: number
  body: T
}
