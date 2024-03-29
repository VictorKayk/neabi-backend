import {
  userPathsDocs,
  rolePathsDocs,
  userHasRolePathsDocs,
  postPathsDocs,
  tagPathsDocs,
  createTagPath,
  readAllTagsPath,
  tagByIdPath,
  postHasTagPathsDocs,
  readAllTagsFromPostPath,
  readAllPostsFromTagPath,
  postHasTagByIdPath,
  filePathsDocs,
  externalFilePathsDocs,
  urlPathsDocs,
  readAllExternalFilesPath,
  externalFileByIdPath,
  createExternalFilePath,
  postHasAttachmentPathsDocs,
  postHasAttachmentByIdPath,
  readAllAttachmentsFromPostPath,
} from '@/main/docs/paths';

export default {
  ...userPathsDocs,
  ...rolePathsDocs,
  ...userHasRolePathsDocs,
  ...postPathsDocs,
  ...tagPathsDocs,
  '/tag': createTagPath,
  '/tag/all': readAllTagsPath,
  '/tag/{tagId}': tagByIdPath,
  ...postHasTagPathsDocs,
  '/post/{postId}/tag/all': readAllTagsFromPostPath,
  '/tag/{tagId}/post/all': readAllPostsFromTagPath,
  '/post/{postId}/tag/{tagId}': postHasTagByIdPath,
  ...filePathsDocs,
  ...externalFilePathsDocs,
  '/attachment/external/file/all': readAllExternalFilesPath,
  '/attachment/external/file/{fileId}': externalFileByIdPath,
  '/attachment/external/file': createExternalFilePath,
  ...urlPathsDocs,
  ...postHasAttachmentPathsDocs,
  '/post/{postId}/attachment/all': readAllAttachmentsFromPostPath,
  '/post/{postId}/attachment/{attachmentId}': postHasAttachmentByIdPath,
};
