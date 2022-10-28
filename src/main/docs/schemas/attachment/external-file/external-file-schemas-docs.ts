import {
  readUserExternalFileSchema,
  externalUserCredentialsParamsSchema,
  createExternalFileParamsSchema,
  externalFileSchema,
} from '@/main/docs/schemas/attachment/external-file';

export const externalFileSchemasDocs = {
  readUserExternalFile: readUserExternalFileSchema,
  externalUserCredentialsParams: externalUserCredentialsParamsSchema,
  createExternalFileParams: createExternalFileParamsSchema,
  externalFile: externalFileSchema,
};
