import { ValidationComposite, RequiredFieldsValidation } from '@/adapters/controllers/utils/validations';

export const makeReadPostBySlugValidationFactory = (): ValidationComposite => new ValidationComposite([new RequiredFieldsValidation(['slug'])]);
