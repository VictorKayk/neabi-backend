import {
  createUrlPath,
  urlByIdPath,
  readAllUrlsPath,
} from '@/main/docs/paths/attachment/url';

export const urlPathsDocs = {
  '/attachment/url': createUrlPath,
  '/attachment/url/all': readAllUrlsPath,
  '/attachment/url/{urlId}': urlByIdPath,
};
