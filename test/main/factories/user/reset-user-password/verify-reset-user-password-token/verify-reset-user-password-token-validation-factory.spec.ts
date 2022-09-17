import { makeVerifyResetUserPasswordTokenValidationFactory } from '@/main/factories/user/reset-user-password/verify-reset-user-password-token';
import { ValidationComposite, RequiredFieldsValidation } from '@/adapters/controllers/utils/validations';

jest.mock('@/adapters/controllers/utils/validations/validation-composite');

describe('VerifyResetUserPasswordToken validation Factory', () => {
  it('Should call ValidationComposite with all validations', () => {
    makeVerifyResetUserPasswordTokenValidationFactory();
    expect(ValidationComposite).toHaveBeenCalledWith([
      new RequiredFieldsValidation(['userId', 'token', 'password']),
    ]);
  });
});
