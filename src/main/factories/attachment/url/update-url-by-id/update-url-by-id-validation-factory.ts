import { ValidationComposite, RequiredFieldsValidation } from '@/adapters/controllers/utils/validations';

export const makeUpdateUrlByIdValidationFactory = (): ValidationComposite => new ValidationComposite([new RequiredFieldsValidation(['id', 'name', 'url'])]);
