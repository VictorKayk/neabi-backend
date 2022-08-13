import { makeDeleteUserByIdValidationFactory } from '@/main/factories/user';
import { ValidationComposite, RequiredFieldsValidation } from '@/adapters/controllers/utils/validations';

jest.mock('@/adapters/controllers/utils/validations/validation-composite');

describe('DeleteUserById validation Factory', () => {
  it('Should call ValidationComposite with all validations', () => {
    makeDeleteUserByIdValidationFactory();
    expect(ValidationComposite).toHaveBeenCalledWith([
      new RequiredFieldsValidation(['id']),
    ]);
  });
});
