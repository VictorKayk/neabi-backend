import { ValidationComposite, RequiredFieldsValidation } from '@/adapters/controllers/utils/validations';

export const makeDeletePostByIdValidationFactory = (): ValidationComposite => new ValidationComposite([new RequiredFieldsValidation(['postId'])]);
