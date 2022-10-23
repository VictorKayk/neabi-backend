import {
  userPathsDocs,
  rolePathsDocs,
  userHasRolePathsDocs,
  postPathsDocs,
  filePathsDocs,
  externalFilePathsDocs,
  urlPathsDocs,
} from '@/main/docs/paths';

export default {
  ...userPathsDocs,
  ...rolePathsDocs,
  ...userHasRolePathsDocs,
  ...postPathsDocs,
  ...filePathsDocs,
  ...externalFilePathsDocs,
  ...urlPathsDocs,
};
