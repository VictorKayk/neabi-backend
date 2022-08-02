import { Router } from 'express';
import { routerAdapter } from '@/main/adapters/express';
import { makeAddRoleToUserController } from '@/main/factories/user-has-role';
import { authentication } from '@/main/middlewares/authentication';

export function userHasRole(router: Router) {
  router.post('/user/:userId/role/:roleId', authentication, routerAdapter(makeAddRoleToUserController()));
}
