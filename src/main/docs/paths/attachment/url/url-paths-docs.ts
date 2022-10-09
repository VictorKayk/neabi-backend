import {
  createUrlPath,
  urlByIdPath,
} from '@/main/docs/paths/attachment/url';

export const urlPathsDocs = {
  '/attachment/url': createUrlPath,
  '/attachment/url/{urlId}': urlByIdPath,
};
