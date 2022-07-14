import { ValidationComposite, RequiredFieldsValidation } from '@/adapters/util/validations';
import { makeSignInValidationFactory } from '@/main/factories/sign-in';

jest.mock('@/adapters/util/validations/validation-composite');

describe('SignIn validation Factory', () => {
  it('Should call ValidationComposite with all validations', () => {
    makeSignInValidationFactory();
    expect(ValidationComposite).toHaveBeenCalledWith([
      new RequiredFieldsValidation(['email', 'password']),
    ]);
  });
});
