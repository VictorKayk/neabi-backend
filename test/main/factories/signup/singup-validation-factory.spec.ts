import { makeSignUpValidationFactory } from '@/main/factories/signup/signup-validation-factory';
import { ValidationComposite, RequiredFieldsValidation, CompareFieldsValidation } from '@/adapters/util/validations';

jest.mock('@/adapters/util/validations/validation-composite');

describe('SignUp validation Factory', () => {
  it('Should call ValidationComposite with all validations', () => {
    makeSignUpValidationFactory();
    expect(ValidationComposite).toHaveBeenCalledWith([
      new RequiredFieldsValidation(['name', 'email', 'password', 'passwordConfirmation']),
      new CompareFieldsValidation('password', 'passwordConfirmation'),
    ]);
  });
});
