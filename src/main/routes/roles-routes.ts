import { Router } from 'express';
import { routerAdapter } from '@/main/adapters/express';
import { makeCreateRoleController } from '@/main/factories/roles';
import { authentication } from '@/main/middlewares/authentication';

export function roles(router: Router) {
  router.post('/roles', authentication, routerAdapter(makeCreateRoleController()));
}
