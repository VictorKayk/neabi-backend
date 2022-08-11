import { ValidationComposite, RequiredFieldsValidation } from '@/adapters/controllers/utils/validations';
import { makeCreateRoleValidationFactory } from '@/main/factories/role';

jest.mock('@/adapters/controllers/utils/validations/validation-composite');

describe('CreateRole validation Factory', () => {
  it('Should call ValidationComposite with all validations', () => {
    makeCreateRoleValidationFactory();
    expect(ValidationComposite).toHaveBeenCalledWith([
      new RequiredFieldsValidation(['role']),
    ]);
  });
});
