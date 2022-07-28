import { ValidationComposite, RequiredFieldsValidation } from '@/adapters/controllers/util/validations';

export const makeExternalSignInValidationFactory = (): ValidationComposite => new ValidationComposite([new RequiredFieldsValidation(['name', 'email'])]);
