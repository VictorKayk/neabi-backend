import { Express, Router } from 'express';
import {
  user, role, userHasRole, post, file, url,
} from '@/main/routes';

export default (app: Express): void => {
  const router = Router();
  app.use('/api', router);
  userHasRole(router);
  role(router);
  user(router);
  post(router);
  file(router);
  url(router);
};
