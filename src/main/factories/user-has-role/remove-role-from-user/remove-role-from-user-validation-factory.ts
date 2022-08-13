import { ValidationComposite, RequiredFieldsValidation } from '@/adapters/controllers/utils/validations';

export const makeRemoveRoleFromUserValidationFactory = ():
  ValidationComposite => new ValidationComposite([new RequiredFieldsValidation(['userId', 'roleId'])]);
