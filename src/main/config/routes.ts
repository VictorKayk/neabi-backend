import { Express, Router } from 'express';
import {
  user, role, userHasRole, post, file, url, externalFiles, postHasAttachment,
} from '@/main/routes';

export default (app: Express): void => {
  const router = Router();
  app.use('/api', router);
  userHasRole(router);
  role(router);
  user(router);
  postHasAttachment(router);
  post(router);
  file(router);
  externalFiles(router);
  url(router);
};
