import { makeSendVerificationTokenToUserController } from '@/main/factories/verification-token';
import { ValidationComposite, RequiredFieldsValidation } from '@/adapters/controllers/utils/validations';

jest.mock('@/adapters/controllers/utils/validations/validation-composite');

describe('SendVerificationTokenToUser validation Factory', () => {
  it('Should call ValidationComposite with all validations', () => {
    makeSendVerificationTokenToUserController();
    expect(ValidationComposite).toHaveBeenCalledWith([
      new RequiredFieldsValidation(['id']),
    ]);
  });
});
