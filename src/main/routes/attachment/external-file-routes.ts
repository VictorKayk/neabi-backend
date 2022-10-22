import { Router } from 'express';
import { routerAdapter } from '@/main/adapters/express';
import { authentication } from '@/main/middlewares/authentication';
import { authorization } from '@/main/middlewares/authorization';
import { makeReadAllExternalFilesController } from '@/main/factories/attachment/external-file';

export function externalFiles(router: Router) {
  router.post('/attachment/external/user/file/all', authentication, authorization(['moderator', 'admin']), routerAdapter(makeReadAllExternalFilesController()));
}
