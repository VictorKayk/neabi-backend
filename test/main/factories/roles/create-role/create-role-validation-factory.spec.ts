import { ValidationComposite, RequiredFieldsValidation } from '@/adapters/controllers/util/validations';
import { makeCreateRoleValidationFactory } from '@/main/factories/roles';

jest.mock('@/adapters/controllers/util/validations/validation-composite');

describe('CreateRole validation Factory', () => {
  it('Should call ValidationComposite with all validations', () => {
    makeCreateRoleValidationFactory();
    expect(ValidationComposite).toHaveBeenCalledWith([
      new RequiredFieldsValidation(['role']),
    ]);
  });
});
