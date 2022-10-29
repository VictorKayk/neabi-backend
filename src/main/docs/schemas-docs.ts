import {
  errorSchema,
  userSchemasDocs,
  roleSchemasDocs,
  userHasRoleSchemasDocs,
  postSchemasDocs,
  fileSchemasDocs,
  externalFileSchemasDocs,
  createExternalFileParamsSchema,
  externalFileSchema,
  urlSchemasDocs,
  postHasAttachmentSchemasDocs,
  postHasAttachmentSchema,
} from '@/main/docs/schemas';

export default {
  error: errorSchema,
  ...userSchemasDocs,
  ...roleSchemasDocs,
  ...userHasRoleSchemasDocs,
  ...postSchemasDocs,
  ...fileSchemasDocs,
  ...externalFileSchemasDocs,
  createExternalFileParams: createExternalFileParamsSchema,
  externalFile: externalFileSchema,
  ...urlSchemasDocs,
  ...postHasAttachmentSchemasDocs,
  postHasAttachment: postHasAttachmentSchema,
};
