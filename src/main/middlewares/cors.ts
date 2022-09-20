import { Request, Response, NextFunction } from 'express';

export function cors(req: Request, res: Response, next: NextFunction): void {
  res.set('access-control-allow-origin', '*')
    .set('access-control-allow-methods', '*')
    .set('access-control-allow-headers', '*');
  next();
}
