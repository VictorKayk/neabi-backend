import { Router } from 'express';
import { routerAdapter } from '@/main/adapters/express';
import { authentication } from '@/main/middlewares/authentication';
import { authorization } from '@/main/middlewares/authorization';
import {
  makeReadAllUserExternalFilesController,
  makeCreateExternalFileController,
  makeReadAllExternalFilesController,
  makeReadExternalFileByIdController,
  makeDeleteExternalFileByIdController,
} from '@/main/factories/attachment/external-file';

export function externalFiles(router: Router) {
  router.get('/attachment/external/file/all', authentication, authorization(['user', 'moderator', 'admin']), routerAdapter(makeReadAllExternalFilesController()));
  router.get('/attachment/external/file/:fileId', authentication, authorization(['user', 'moderator', 'admin']), routerAdapter(makeReadExternalFileByIdController()));
  router.post('/attachment/external/user/file/all', authentication, authorization(['moderator', 'admin']), routerAdapter(makeReadAllUserExternalFilesController()));
  router.post('/attachment/external/file', authentication, authorization(['moderator', 'admin']), routerAdapter(makeCreateExternalFileController()));
  router.delete('/attachment/external/file/:fileId', authentication, authorization(['moderator', 'admin']), routerAdapter(makeDeleteExternalFileByIdController()));
}
