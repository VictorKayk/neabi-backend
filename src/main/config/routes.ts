import { Express, Router } from 'express';
import { user, role, userHasRole } from '@/main/routes';

export default (app: Express): void => {
  const router = Router();
  app.use('/api', router);
  user(router);
  role(router);
  userHasRole(router);
};
