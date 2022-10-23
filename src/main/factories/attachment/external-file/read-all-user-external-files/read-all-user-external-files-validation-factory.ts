import { ValidationComposite, RequiredFieldsValidation } from '@/adapters/controllers/utils/validations';

export const makeReadAllUserExternalFilesValidationFactory = ():
  ValidationComposite => new ValidationComposite([new RequiredFieldsValidation(['access_token'])]);
