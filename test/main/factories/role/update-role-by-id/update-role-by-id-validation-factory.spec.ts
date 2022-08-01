import { ValidationComposite, RequiredFieldsValidation } from '@/adapters/controllers/util/validations';
import { makeUpdateRoleByIdValidationFactory } from '@/main/factories/role';

jest.mock('@/adapters/controllers/util/validations/validation-composite');

describe('UpdateRoleById validation Factory', () => {
  it('Should call ValidationComposite with all validations', () => {
    makeUpdateRoleByIdValidationFactory();
    expect(ValidationComposite).toHaveBeenCalledWith([
      new RequiredFieldsValidation(['role']),
    ]);
  });
});
