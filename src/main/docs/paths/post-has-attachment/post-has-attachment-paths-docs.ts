import { postHasAttachmentByIdPath, readAllAttachmentsFromPostPath } from '@/main/docs/paths/post-has-attachment';

export const postHasAttachmentPathsDocs = {
  '/post/{postId}/attachment/all': readAllAttachmentsFromPostPath,
  '/post/{postId}/attachment/{attachmentId}': postHasAttachmentByIdPath,
};
