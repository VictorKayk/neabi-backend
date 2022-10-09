import {
  errorSchema,
  userSchemasDocs,
  roleSchemasDocs,
  userHasRoleSchemasDocs,
  postSchemasDocs,
  fileSchemasDocs,
  urlSchemasDocs,
} from '@/main/docs/schemas';

export default {
  error: errorSchema,
  ...userSchemasDocs,
  ...roleSchemasDocs,
  ...userHasRoleSchemasDocs,
  ...postSchemasDocs,
  ...fileSchemasDocs,
  ...urlSchemasDocs,
};
