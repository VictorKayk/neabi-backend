import { Request, Response } from 'express';
import { IController, IHttpRequest } from '@/adapters/interfaces';

export function routerAdapter(controller: IController) {
  return async (req: Request, res: Response) => {
    const httpRequest: IHttpRequest = {
      body: req.body,
    };
    const httpResponse = await controller.handle(httpRequest);
    res.status(httpResponse.statusCode).json(httpResponse.body);
  };
}
