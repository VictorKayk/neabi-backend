import { Request, Response, NextFunction } from 'express';
import { IMiddleware } from '@/adapters/interfaces';

export function middlewareAdapter(middleware: IMiddleware) {
  return async function (req: Request, res: Response, next: NextFunction) {
    const httpRequest = {
      body: req.body,
    };

    const httpResponse = await middleware.handle(httpRequest);

    if (httpResponse.statusCode === 200) {
      Object.assign(req, httpResponse.body);
      next();
    }
    res.status(httpResponse.statusCode).json(httpResponse.body);
  };
}
