import { Router } from 'express';
import { routerAdapter } from '@/main/adapters/express';
import { makeAddAttachmentToPostController, makeRemoveAttachmentFromPostController } from '@/main/factories/post-has-attachment';
import { authentication } from '@/main/middlewares/authentication';
import { authorization } from '@/main/middlewares/authorization';

export function postHasAttachment(router: Router) {
  router.post('/post/:postId/attachment/:attachmentId', authentication, authorization(['moderator', 'admin']), routerAdapter(makeAddAttachmentToPostController()));
  router.delete('/post/:postId/attachment/:attachmentId', authentication, authorization(['moderator', 'admin']), routerAdapter(makeRemoveAttachmentFromPostController()));
}
