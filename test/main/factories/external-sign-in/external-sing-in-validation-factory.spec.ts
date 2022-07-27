import { ValidationComposite, RequiredFieldsValidation } from '@/adapters/util/validations';
import { makeExternalSignInValidationFactory } from '@/main/factories/external-sign-in';

jest.mock('@/adapters/util/validations/validation-composite');

describe('ExternalSignIn validation Factory', () => {
  it('Should call ValidationComposite with all validations', () => {
    makeExternalSignInValidationFactory();
    expect(ValidationComposite).toHaveBeenCalledWith([
      new RequiredFieldsValidation(['name', 'email']),
    ]);
  });
});
