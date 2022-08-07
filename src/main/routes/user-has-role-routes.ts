import { Router } from 'express';
import { routerAdapter } from '@/main/adapters/express';
import { makeAddRoleToUserController, makeRemoveRoleFromUserController } from '@/main/factories/user-has-role';
import { authentication } from '@/main/middlewares/authentication';

export function userHasRole(router: Router) {
  router.post('/user/:userId/role/:roleId', authentication, routerAdapter(makeAddRoleToUserController()));
  router.delete('/user/:userId/role/:roleId', authentication, routerAdapter(makeRemoveRoleFromUserController()));
}
