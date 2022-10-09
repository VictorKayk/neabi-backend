import {
  fileSchema,
  fileFormatSchema,
  fileTypeSchema,
  uploadFileParamsSchema,
} from '@/main/docs/schemas/attachment/file';

export const fileSchemasDocs = {
  file: fileSchema,
  fileFormat: fileFormatSchema,
  fileType: fileTypeSchema,
  uploadFileParams: uploadFileParamsSchema,
};
