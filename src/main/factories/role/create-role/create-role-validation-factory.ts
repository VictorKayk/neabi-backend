import { ValidationComposite, RequiredFieldsValidation } from '@/adapters/controllers/utils/validations';

export const makeCreateRoleValidationFactory = (): ValidationComposite => new ValidationComposite([
  new RequiredFieldsValidation(['role']),
]);
