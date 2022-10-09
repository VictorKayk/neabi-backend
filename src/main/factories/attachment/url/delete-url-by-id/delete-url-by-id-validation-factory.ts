import { ValidationComposite, RequiredFieldsValidation } from '@/adapters/controllers/utils/validations';

export const makeDeleteUrlByIdValidationFactory = ():
  ValidationComposite => new ValidationComposite([new RequiredFieldsValidation(['urlId'])]);
