/* eslint-disable no-underscore-dangle */
import { Request, Response } from 'express';
import { IHttpRequestAuthenticated } from '@/adapters/interfaces';
import { IController } from '@/adapters/controllers/interfaces';

export function routerAdapter(controller: IController) {
  return async (req: Request, res: Response) => {
    const httpRequest: IHttpRequestAuthenticated = {
      body: {
        ...req.body,
      },
      user: {
        id: req.id,
        accessToken: req.accessToken,
        data: req.user?._json,
        credentials: req.user?.credentials,
      },
      params: req.params,
      query: req.query,
      files: req.files,
      download: res.download,
    };
    const httpResponse = await controller.handle(httpRequest);
    res.status(httpResponse.statusCode).json(httpResponse.body);
  };
}
