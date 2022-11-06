import { ValidationComposite, RequiredFieldsValidation } from '@/adapters/controllers/utils/validations';

export const makeCreateTagValidationFactory = (): ValidationComposite => new ValidationComposite([
  new RequiredFieldsValidation(['tag']),
]);
