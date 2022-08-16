import { makeVerifyTokenValidationFactory } from '@/main/factories/verification-token';
import { ValidationComposite, RequiredFieldsValidation } from '@/adapters/controllers/utils/validations';

jest.mock('@/adapters/controllers/utils/validations/validation-composite');

describe('VerifyToken validation Factory', () => {
  it('Should call ValidationComposite with all validations', () => {
    makeVerifyTokenValidationFactory();
    expect(ValidationComposite).toHaveBeenCalledWith([
      new RequiredFieldsValidation(['userId', 'token']),
    ]);
  });
});
