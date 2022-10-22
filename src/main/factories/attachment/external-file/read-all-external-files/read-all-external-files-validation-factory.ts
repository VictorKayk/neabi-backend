import { ValidationComposite, RequiredFieldsValidation } from '@/adapters/controllers/utils/validations';

export const makeReadAllExternalFilesValidationFactory = ():
  ValidationComposite => new ValidationComposite([new RequiredFieldsValidation(['access_token', 'expires_in', 'scope', 'token_type', 'id_token'])]);
