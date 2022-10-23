import { readUserExternalFileSchema, readAllUserExternalFilesParamsSchema } from '@/main/docs/schemas/attachment/external-file';

export const externalFileSchemasDocs = {
  readUserExternalFile: readUserExternalFileSchema,
  readAllUserExternalFilesParams: readAllUserExternalFilesParamsSchema,
};
