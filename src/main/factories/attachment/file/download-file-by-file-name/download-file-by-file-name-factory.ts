import { IController } from '@/adapters/controllers/interfaces';
import { makeDownloadFileByFileNameValidationFactory } from '@/main/factories/attachment/file';
import { DownloadFileByFileNameController } from '@/adapters/controllers/attachment/file/download-file-by-file-name';
import env from '@/main/config/env';

export function makeDownloadFileByFileNameController(): IController {
  const downloadFileByFileName = new DownloadFileByFileNameController(
    makeDownloadFileByFileNameValidationFactory(),
    env.uploadFolder,
  );
  return downloadFileByFileName;
}
