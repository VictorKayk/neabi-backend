import {
  createTagPath, readAllTagsPath, tagByIdPath,
} from '@/main/docs/paths/tag';

export const tagPathsDocs = {
  '/tag': createTagPath,
  '/tag/all': readAllTagsPath,
  '/tag/{tagId}': tagByIdPath,
};
