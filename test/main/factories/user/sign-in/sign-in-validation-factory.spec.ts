import { ValidationComposite, RequiredFieldsValidation } from '@/adapters/controllers/utils/validations';
import { makeSignInValidationFactory } from '@/main/factories/user';

jest.mock('@/adapters/controllers/utils/validations/validation-composite');

describe('SignIn validation Factory', () => {
  it('Should call ValidationComposite with all validations', () => {
    makeSignInValidationFactory();
    expect(ValidationComposite).toHaveBeenCalledWith([
      new RequiredFieldsValidation(['email', 'password']),
    ]);
  });
});
