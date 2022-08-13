import { makeUpdateUserByIdValidationFactory } from '@/main/factories/user';
import { ValidationComposite, RequiredFieldsValidation } from '@/adapters/controllers/utils/validations';

jest.mock('@/adapters/controllers/utils/validations/validation-composite');

describe('UpdateUserById validation Factory', () => {
  it('Should call ValidationComposite with all validations', () => {
    makeUpdateUserByIdValidationFactory();
    expect(ValidationComposite).toHaveBeenCalledWith([
      new RequiredFieldsValidation(['id']),
    ]);
  });
});
