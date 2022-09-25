import paths from '@/main/docs/paths-docs';
import components from '@/main/docs/components-docs';
import schemas from '@/main/docs/schemas-docs';

export default {
  openapi: '3.0.0',
  info: {
    title: 'Neabi backend',
    description: 'Backend do Neabi',
    version: '0.0.0',
  },
  servers: [{
    url: '/api',
    description: 'Servidor Principal',
  }],
  tags: [
    {
      name: 'User',
      description: 'APIs relacionadas aos usuarios',
    },
    {
      name: 'Role',
      description: 'APIs relacionadas as funções',
    },
    {
      name: 'UserHasRole',
      description: 'APIs relacionadas aos usuarios tendo funções',
    },
    {
      name: 'Post',
      description: 'APIs relacionadas as publicações',
    },
  ],
  paths,
  schemas,
  components,
};
