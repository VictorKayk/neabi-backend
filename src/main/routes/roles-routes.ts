import { Router } from 'express';
import { routerAdapter } from '@/main/adapters/express';
import { makeCreateRoleController, makeReadRoleController } from '@/main/factories/roles';
import { authentication } from '@/main/middlewares/authentication';

export function roles(router: Router) {
  router.post('/roles', authentication, routerAdapter(makeCreateRoleController()));
  router.get('/roles/:id', authentication, routerAdapter(makeReadRoleController()));
}
