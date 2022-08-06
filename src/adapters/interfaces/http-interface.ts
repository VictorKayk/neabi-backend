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

export interface IHttpResponse<T = any> {
  statusCode: number
  body: T
}
