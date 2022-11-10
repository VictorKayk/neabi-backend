import { postHasTagByIdPath, readAllTagsFromPostPath } from '@/main/docs/paths/post-has-tag';

export const postHasTagPathsDocs = {
  '/post/{postId}/tag/all': readAllTagsFromPostPath,
  '/post/{postId}/tag/{tagId}': postHasTagByIdPath,
};
