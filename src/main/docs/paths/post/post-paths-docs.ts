import {
  createPostPath,
  postBySlugPath,
  readAllPostsPath,
  postByIdPath,
} from '@/main/docs/paths/post';

export const postPathsDocs = {
  '/post': createPostPath,
  '/post/{slug}': postBySlugPath,
  '/post/all': readAllPostsPath,
  '/post/{postId}': postByIdPath,
};
