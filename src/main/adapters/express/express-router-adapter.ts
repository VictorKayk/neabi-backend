/* eslint-disable no-underscore-dangle */
import { Request, Response } from 'express';
import { IHttpRequestAuthenticated } from '@/adapters/interfaces';
import { IController } from '@/adapters/controllers/interfaces';

export function routerAdapter(controller: IController) {
  return async (req: Request, res: Response) => {
    const httpRequest: IHttpRequestAuthenticated = {
      body: {
        ...req.body,
        ...req.user?._json,
      },
      id: req.id,
      accessToken: req.accessToken,
      params: req.params,
    };
    const httpResponse = await controller.handle(httpRequest);
    res.status(httpResponse.statusCode).json(httpResponse.body);
  };
}
