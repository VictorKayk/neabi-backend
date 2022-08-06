import { makeUpdateUserByIdValidationFactory } from '@/main/factories/user';
import { ValidationComposite, RequiredFieldsValidation } from '@/adapters/controllers/util/validations';

jest.mock('@/adapters/controllers/util/validations/validation-composite');

describe('UpdateUserById validation Factory', () => {
  it('Should call ValidationComposite with all validations', () => {
    makeUpdateUserByIdValidationFactory();
    expect(ValidationComposite).toHaveBeenCalledWith([
      new RequiredFieldsValidation(['id']),
    ]);
  });
});
