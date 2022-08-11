import { ValidationComposite, RequiredFieldsValidation } from '@/adapters/controllers/utils/validations';

export const makeUpdateRoleByIdValidationFactory = (): ValidationComposite => new ValidationComposite([new RequiredFieldsValidation(['role', 'id'])]);
