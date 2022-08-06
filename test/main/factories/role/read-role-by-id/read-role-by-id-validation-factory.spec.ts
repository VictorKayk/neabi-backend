import { ValidationComposite, RequiredFieldsValidation } from '@/adapters/controllers/util/validations';
import { makeReadRoleByIdValidationFactory } from '@/main/factories/role';

jest.mock('@/adapters/controllers/util/validations/validation-composite');

describe('ReadRoleById validation Factory', () => {
  it('Should call ValidationComposite with all validations', () => {
    makeReadRoleByIdValidationFactory();
    expect(ValidationComposite).toHaveBeenCalledWith([
      new RequiredFieldsValidation(['id']),
    ]);
  });
});
