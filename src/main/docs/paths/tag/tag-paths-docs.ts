import {
  createTagPath, readAllTagsPath,
} from '@/main/docs/paths/tag';

export const tagPathsDocs = {
  '/tag': createTagPath,
  '/tag/all': readAllTagsPath,
};
