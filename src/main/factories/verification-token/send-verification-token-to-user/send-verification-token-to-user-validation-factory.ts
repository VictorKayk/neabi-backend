import { ValidationComposite, RequiredFieldsValidation } from '@/adapters/controllers/utils/validations';

export const makeSendVerificationTokenToUserValidationFactory = ():
  ValidationComposite => new ValidationComposite([new RequiredFieldsValidation(['id'])]);
