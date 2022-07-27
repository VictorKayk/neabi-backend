import { ValidationComposite, RequiredFieldsValidation } from '@/adapters/util/validations';

export const makeExternalSignInValidationFactory = (): ValidationComposite => new ValidationComposite([new RequiredFieldsValidation(['name', 'email'])]);
