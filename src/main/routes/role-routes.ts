import { Router } from 'express';
import { routerAdapter } from '@/main/adapters/express';
import {
  makeCreateRoleController,
  makeReadRoleByIdController,
  makeReadAllRolesController,
  makeUpdateRoleByIdController,
  makeDeleteRoleByIdController,
} from '@/main/factories/role';
import { authentication } from '@/main/middlewares/authentication';
import { authorization } from '@/main/middlewares/authorization';

export function role(router: Router) {
  router.post('/role', authentication, authorization(['moderator', 'admin']), routerAdapter(makeCreateRoleController()));
  router.get('/role/all', authentication, authorization(['moderator', 'admin']), routerAdapter(makeReadAllRolesController()));
  router.get('/role/:id', authentication, authorization(['moderator', 'admin']), routerAdapter(makeReadRoleByIdController()));
  router.patch('/role/:id', authentication, authorization(['moderator', 'admin']), routerAdapter(makeUpdateRoleByIdController()));
  router.delete('/role/:id', authentication, authorization(['moderator', 'admin']), routerAdapter(makeDeleteRoleByIdController()));
}
