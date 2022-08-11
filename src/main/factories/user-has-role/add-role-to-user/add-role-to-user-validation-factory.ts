import { ValidationComposite, RequiredFieldsValidation } from '@/adapters/controllers/utils/validations';

export const makeAddRoleToUserValidationFactory = ():
  ValidationComposite => new ValidationComposite([new RequiredFieldsValidation(['userId', 'roleId'])]);
