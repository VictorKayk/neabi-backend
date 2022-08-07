import { ValidationComposite, RequiredFieldsValidation } from '@/adapters/controllers/util/validations';

export const makeReadAllRolesFromUserValidationFactory = ():
  ValidationComposite => new ValidationComposite([new RequiredFieldsValidation(['userId'])]);
