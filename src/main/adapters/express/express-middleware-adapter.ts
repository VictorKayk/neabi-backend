import { Request, Response, NextFunction } from 'express';
import { IMiddleware } from '@/adapters/middleware/interfaces';

export function middlewareAdapter(middleware: IMiddleware) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const request = {
      accessToken: req.headers['x-access-token'],
      userId: req.id,
    };
    const httpResponse = await middleware.handle(request);
    if (httpResponse.statusCode === 200) {
      Object.assign(req, httpResponse.body);
      next();
    } else {
      res.status(httpResponse.statusCode).json(httpResponse.body);
    }
  };
}
