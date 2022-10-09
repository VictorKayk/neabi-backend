import {
  uploadFilePath,
  readAllFilesPath,
  fileByIdPath,
} from '@/main/docs/paths/attachment/file';

export const filePathsDocs = {
  '/attachment/file/upload': uploadFilePath,
  '/attachment/file/all': readAllFilesPath,
  '/attachment/file/{fileId}': fileByIdPath,
};
