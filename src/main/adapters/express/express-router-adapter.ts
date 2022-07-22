import { Request, Response } from 'express';
import { IController, IHttpRequestAuthenticated } from '@/adapters/interfaces';

export function routerAdapter(controller: IController) {
  return async (req: Request, res: Response) => {
    const httpRequest: IHttpRequestAuthenticated = {
      body: req.body,
      id: req.id,
      accessToken: req.accessToken,
    };
    const httpResponse = await controller.handle(httpRequest);
    res.status(httpResponse.statusCode).json(httpResponse.body);
  };
}
