import express, { Express } from 'express';
import middlewares from '@/main/config/middlewares';
import routes from '@/main/config/routes';
import setupSwagger from '@/main/config/swagger';

export default async function setupApp(): Promise<Express> {
  const app = express();
  setupSwagger(app);
  middlewares(app);
  routes(app);
  return app;
}
