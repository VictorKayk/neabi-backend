import { RequestHandler } from 'express';
import multer from 'multer';
import { storage, fileFilter, limits } from '@/main/config/multer';
import { ServerError } from '@/adapters/errors';

export const adaptMulter: RequestHandler = (req, res, next) => {
  const upload = multer({ storage, fileFilter, limits }).array('file');

  upload(req, res, (error) => {
    if (error !== undefined) {
      return res.status(500).json({ error: new ServerError(error.stack).message });
    }
    return next();
  });
};
