import { ValidationComposite, RequiredFieldsValidation } from '@/adapters/controllers/utils/validations';

export const makeReadExternalFileByIdValidationFactory = ():
  ValidationComposite => new ValidationComposite([new RequiredFieldsValidation(['fileId'])]);
