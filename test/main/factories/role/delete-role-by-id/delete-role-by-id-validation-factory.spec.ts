import { ValidationComposite, RequiredFieldsValidation } from '@/adapters/controllers/utils/validations';
import { makeDeleteRoleByIdValidationFactory } from '@/main/factories/role';

jest.mock('@/adapters/controllers/utils/validations/validation-composite');

describe('DeleteRoleById validation Factory', () => {
  it('Should call ValidationComposite with all validations', () => {
    makeDeleteRoleByIdValidationFactory();
    expect(ValidationComposite).toHaveBeenCalledWith([
      new RequiredFieldsValidation(['id']),
    ]);
  });
});
