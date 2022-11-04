import {
  uploadFilePath,
  readAllFilesPath,
  fileByIdPath,
  downloadFileByFileNamePath,
} from '@/main/docs/paths/attachment/file';

export const filePathsDocs = {
  '/attachment/file/upload': uploadFilePath,
  '/attachment/file/all': readAllFilesPath,
  '/attachment/file/{fileId}': fileByIdPath,
  '/attachment/file/{fileName}/download': downloadFileByFileNamePath,
};
