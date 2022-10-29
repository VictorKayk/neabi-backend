import { ValidationComposite, RequiredFieldsValidation } from '@/adapters/controllers/utils/validations';

export const makeDeleteExternalFileByIdValidationFactory = ():
  ValidationComposite => new ValidationComposite([new RequiredFieldsValidation(['fileId'])]);
