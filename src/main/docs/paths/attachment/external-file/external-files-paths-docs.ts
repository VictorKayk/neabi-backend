import { readAllUserExternalFilesPath, createExternalFilePath } from '@/main/docs/paths/attachment/external-file';

export const externalFilePathsDocs = {
  '/attachment/external/file': createExternalFilePath,
  '/attachment/external/user/file/all': readAllUserExternalFilesPath,
};
