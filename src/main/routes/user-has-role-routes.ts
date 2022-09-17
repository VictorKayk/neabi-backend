import { Router } from 'express';
import { routerAdapter } from '@/main/adapters/express';
import { makeReadAllRolesFromUserController, makeAddRoleToUserController, makeRemoveRoleFromUserController } from '@/main/factories/user-has-role';
import { authentication } from '@/main/middlewares/authentication';
import { authorization } from '@/main/middlewares/authorization';

export function userHasRole(router: Router) {
  router.get('/user/:userId/role/all', authentication, authorization(['moderator', 'admin']), routerAdapter(makeReadAllRolesFromUserController()));
  router.post('/user/:userId/role/:roleId', authentication, authorization(['moderator', 'admin']), routerAdapter(makeAddRoleToUserController()));
  router.delete('/user/:userId/role/:roleId', authentication, authorization(['moderator', 'admin']), routerAdapter(makeRemoveRoleFromUserController()));
}
