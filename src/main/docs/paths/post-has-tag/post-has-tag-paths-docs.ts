import { postHasTagByIdPath, readAllTagsFromPostPath, readAllPostsFromTagPath } from '@/main/docs/paths/post-has-tag';

export const postHasTagPathsDocs = {
  '/post/{postId}/tag/all': readAllTagsFromPostPath,
  '/tag/{tagId}/post/all': readAllPostsFromTagPath,
  '/post/{postId}/tag/{tagId}': postHasTagByIdPath,
};
