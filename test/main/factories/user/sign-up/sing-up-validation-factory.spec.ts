import { makeSignUpValidationFactory } from '@/main/factories/user';
import { ValidationComposite, RequiredFieldsValidation, CompareFieldsValidation } from '@/adapters/controllers/util/validations';

jest.mock('@/adapters/controllers/util/validations/validation-composite');

describe('SignUp validation Factory', () => {
  it('Should call ValidationComposite with all validations', () => {
    makeSignUpValidationFactory();
    expect(ValidationComposite).toHaveBeenCalledWith([
      new RequiredFieldsValidation(['name', 'email', 'password', 'passwordConfirmation']),
      new CompareFieldsValidation('password', 'passwordConfirmation'),
    ]);
  });
});
