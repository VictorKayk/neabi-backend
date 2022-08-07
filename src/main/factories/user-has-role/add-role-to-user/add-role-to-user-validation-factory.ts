import { ValidationComposite, RequiredFieldsValidation } from '@/adapters/controllers/util/validations';

export const makeAddRoleToUserValidationFactory = ():
  ValidationComposite => new ValidationComposite([new RequiredFieldsValidation(['userId', 'roleId'])]);
