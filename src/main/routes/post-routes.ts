import { Router } from 'express';
import { routerAdapter } from '@/main/adapters/express';
import {
  makeCreatePostController,
  makeReadPostBySlugController,
  makeReadAllPostsController,
  makeUpdatePostByIdController,
} from '@/main/factories/post';
import { authentication } from '@/main/middlewares/authentication';
import { authorization } from '@/main/middlewares/authorization';

export function post(router: Router) {
  router.post('/post', authentication, authorization(['moderator', 'admin']), routerAdapter(makeCreatePostController()));
  router.get('/post/all', authentication, authorization(['user', 'moderator', 'admin']), routerAdapter(makeReadAllPostsController()));
  router.get('/post/:slug', authentication, authorization(['user', 'moderator', 'admin']), routerAdapter(makeReadPostBySlugController()));
  router.patch('/post/:postId', authentication, authorization(['moderator', 'admin']), routerAdapter(makeUpdatePostByIdController()));
}
