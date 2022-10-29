import {
  userPathsDocs,
  rolePathsDocs,
  userHasRolePathsDocs,
  postPathsDocs,
  filePathsDocs,
  externalFilePathsDocs,
  urlPathsDocs,
  readAllExternalFilesPath,
  externalFileByIdPath,
  createExternalFilePath,
} from '@/main/docs/paths';

export default {
  ...userPathsDocs,
  ...rolePathsDocs,
  ...userHasRolePathsDocs,
  ...postPathsDocs,
  ...filePathsDocs,
  ...externalFilePathsDocs,
  '/attachment/external/file/all': readAllExternalFilesPath,
  '/attachment/external/file/{fileId}': externalFileByIdPath,
  '/attachment/external/file': createExternalFilePath,
  ...urlPathsDocs,
};
