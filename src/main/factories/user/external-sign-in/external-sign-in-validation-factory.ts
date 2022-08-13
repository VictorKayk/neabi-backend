import { ValidationComposite, RequiredFieldsValidation } from '@/adapters/controllers/utils/validations';

export const makeExternalSignInValidationFactory = (): ValidationComposite => new ValidationComposite([new RequiredFieldsValidation(['name', 'email', 'email_verified'])]);
