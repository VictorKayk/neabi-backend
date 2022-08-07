import { Router } from 'express';
import { routerAdapter } from '@/main/adapters/express';
import { makeReadAllRolesFromUserController, makeAddRoleToUserController, makeRemoveRoleFromUserController } from '@/main/factories/user-has-role';
import { authentication } from '@/main/middlewares/authentication';

export function userHasRole(router: Router) {
  router.get('/user/:userId/role/all', authentication, routerAdapter(makeReadAllRolesFromUserController()));
  router.post('/user/:userId/role/:roleId', authentication, routerAdapter(makeAddRoleToUserController()));
  router.delete('/user/:userId/role/:roleId', authentication, routerAdapter(makeRemoveRoleFromUserController()));
}
