import express, { Express } from 'express';
import { bodyParser, cors, contentType } from '@/main/middlewares';
import path from 'path';

export default (app: Express): void => {
  app.use(bodyParser)
    .use(cors)
    .use(contentType)
    .use('/static', express.static(path.join(__dirname, '..', '..', '..', 'public/')));
};
