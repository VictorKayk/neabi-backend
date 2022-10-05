import { Router } from 'express';
import { adaptMulter } from '@/main/adapters/multer';
import { routerAdapter } from '@/main/adapters/express';
import { authentication } from '@/main/middlewares/authentication';
import { authorization } from '@/main/middlewares/authorization';
import { makeUploadFileController, makeDeleteFileByIdController } from '@/main/factories/file';

export function file(router: Router) {
  router.post('/file/upload', authentication, authorization(['moderator', 'admin']), adaptMulter, routerAdapter(makeUploadFileController()));
  router.delete('/file/:fileId', authentication, authorization(['moderator', 'admin']), routerAdapter(makeDeleteFileByIdController()));
}
