import { ValidationComposite, RequiredFieldsValidation } from '@/adapters/controllers/util/validations';

export const makeDeleteRoleByIdValidationFactory = ():
  ValidationComposite => new ValidationComposite([new RequiredFieldsValidation(['id'])]);
