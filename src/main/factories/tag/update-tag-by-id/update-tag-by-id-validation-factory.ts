import { ValidationComposite, RequiredFieldsValidation } from '@/adapters/controllers/utils/validations';

export const makeUpdateTagByIdValidationFactory = (): ValidationComposite => new ValidationComposite([new RequiredFieldsValidation(['tag', 'tagId'])]);
