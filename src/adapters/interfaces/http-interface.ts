export interface IHttpRequest {
  body: any,
}

export interface IHttpRequestAuthenticated extends IHttpRequest {
  id: string,
  accessToken: string,
}

export interface IHttpResponse {
  statusCode: number
  body: any
}
