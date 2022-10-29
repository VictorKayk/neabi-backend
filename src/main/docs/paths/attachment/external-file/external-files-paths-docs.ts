import {
  readAllUserExternalFilesPath,
  createExternalFilePath,
  readAllExternalFilesPath,
  externalFileByIdPath,
} from '@/main/docs/paths/attachment/external-file';

export const externalFilePathsDocs = {
  '/attachment/external/file/all': readAllExternalFilesPath,
  '/attachment/external/file/{fileId}': externalFileByIdPath,
  '/attachment/external/file': createExternalFilePath,
  '/attachment/external/user/file/all': readAllUserExternalFilesPath,
};
