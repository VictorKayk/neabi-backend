import { ValidationComposite, RequiredFieldsValidation } from '@/adapters/controllers/utils/validations';
import { makeExternalSignInValidationFactory } from '@/main/factories/user';

jest.mock('@/adapters/controllers/utils/validations/validation-composite');

describe('ExternalSignIn validation Factory', () => {
  it('Should call ValidationComposite with all validations', () => {
    makeExternalSignInValidationFactory();
    expect(ValidationComposite).toHaveBeenCalledWith([
      new RequiredFieldsValidation(['name', 'email', 'email_verified']),
    ]);
  });
});
