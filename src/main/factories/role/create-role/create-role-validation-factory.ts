import { ValidationComposite, RequiredFieldsValidation } from '@/adapters/controllers/util/validations';

export const makeCreateRoleValidationFactory = (): ValidationComposite => new ValidationComposite([
  new RequiredFieldsValidation(['role']),
]);
