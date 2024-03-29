import { Router } from 'express';
import { routerAdapter } from '@/main/adapters/express';
import {
  makeAddTagToPostController,
  makeRemoveTagFromPostController,
  makeReadAllTagsFromPostController,
  makeReadAllPostsFromTagController,
} from '@/main/factories/post-has-tag';
import { authentication } from '@/main/middlewares/authentication';
import { authorization } from '@/main/middlewares/authorization';

export function postHasTag(router: Router) {
  router.get('/post/:postId/tag/all', authentication, authorization(['moderator', 'admin']), routerAdapter(makeReadAllTagsFromPostController()));
  router.get('/tag/:tagId/post/all', authentication, authorization(['moderator', 'admin']), routerAdapter(makeReadAllPostsFromTagController()));
  router.post('/post/:postId/tag/:tagId', authentication, authorization(['moderator', 'admin']), routerAdapter(makeAddTagToPostController()));
  router.delete('/post/:postId/tag/:tagId', authentication, authorization(['moderator', 'admin']), routerAdapter(makeRemoveTagFromPostController()));
}
