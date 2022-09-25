import { Express, Router } from 'express';
import {
  user, role, userHasRole, post,
} from '@/main/routes';

export default (app: Express): void => {
  const router = Router();
  app.use('/api', router);
  userHasRole(router);
  role(router);
  user(router);
  post(router);
};
