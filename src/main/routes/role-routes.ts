import { Router } from 'express';
import { routerAdapter } from '@/main/adapters/express';
import { makeCreateRoleController, makeReadRoleByIdController } from '@/main/factories/role';
import { authentication } from '@/main/middlewares/authentication';

export function role(router: Router) {
  router.post('/role', authentication, routerAdapter(makeCreateRoleController()));
  router.get('/role/:id', authentication, routerAdapter(makeReadRoleByIdController()));
}
