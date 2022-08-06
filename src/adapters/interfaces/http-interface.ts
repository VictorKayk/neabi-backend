export interface IHttpRequest {
  body?: any,
  params?: any,
  query?: any,
}

export interface IHttpRequestAuthenticated extends IHttpRequest {
  user: {
    id: string,
    accessToken: string,
  }
}

export interface IHttpResponse {
  statusCode: number
  body: any
}
