import {
  userPathsDocs,
  rolePathsDocs,
  userHasRolePathsDocs,
  postPathsDocs,
  filePathsDocs,
  externalFilePathsDocs,
  urlPathsDocs,
  createExternalFilePath,
} from '@/main/docs/paths';

export default {
  ...userPathsDocs,
  ...rolePathsDocs,
  ...userHasRolePathsDocs,
  ...postPathsDocs,
  ...filePathsDocs,
  ...externalFilePathsDocs,
  '/attachment/external/file': createExternalFilePath,
  ...urlPathsDocs,
};
