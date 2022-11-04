import { Router } from 'express';
import { adaptMulter } from '@/main/adapters/multer';
import { routerAdapter } from '@/main/adapters/express';
import { authentication } from '@/main/middlewares/authentication';
import { authorization } from '@/main/middlewares/authorization';
import {
  makeUploadFileController,
  makeDeleteFileByIdController,
  makeReadFileByIdController,
  makeReadAllFilesController,
} from '@/main/factories/attachment/file';
import { DownloadFileByFileNameController } from '@/main/adapters/controllers/download-file-by-file-name';

export function file(router: Router) {
  router.get('/attachment/file/all', authentication, authorization(['user', 'moderator', 'admin']), routerAdapter(makeReadAllFilesController()));
  router.get('/attachment/file/:fileId', authentication, authorization(['user', 'moderator', 'admin']), routerAdapter(makeReadFileByIdController()));
  router.post('/attachment/file/upload', authentication, authorization(['moderator', 'admin']), adaptMulter, routerAdapter(makeUploadFileController()));
  router.delete('/attachment/file/:fileId', authentication, authorization(['moderator', 'admin']), routerAdapter(makeDeleteFileByIdController()));
  router.get('/attachment/file/:fileName/download', DownloadFileByFileNameController());
}
