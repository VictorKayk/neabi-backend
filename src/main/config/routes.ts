import { Express, Router } from 'express';
import {
  user, role, userHasRole, sendVerificationTokenToUser,
} from '@/main/routes';

export default (app: Express): void => {
  const router = Router();
  app.use('/api', router);
  sendVerificationTokenToUser(router);
  userHasRole(router);
  role(router);
  user(router);
};
