import { ValidationComposite, RequiredFieldsValidation } from '@/adapters/controllers/util/validations';

export const makeUpdateRoleByIdValidationFactory = (): ValidationComposite => new ValidationComposite([new RequiredFieldsValidation(['role', 'id'])]);
