import { ValidationComposite, RequiredFieldsValidation } from '@/adapters/controllers/utils/validations';

export const makeReadAllRolesFromUserValidationFactory = ():
  ValidationComposite => new ValidationComposite([new RequiredFieldsValidation(['userId'])]);
