import { makeSendResetUserPasswordTokenToUserController } from '@/main/factories/user';
import { ValidationComposite, RequiredFieldsValidation } from '@/adapters/controllers/utils/validations';

jest.mock('@/adapters/controllers/utils/validations/validation-composite');

describe('SendResetUserPasswordTokenToUser validation Factory', () => {
  it('Should call ValidationComposite with all validations', () => {
    makeSendResetUserPasswordTokenToUserController();
    expect(ValidationComposite).toHaveBeenCalledWith([
      new RequiredFieldsValidation(['id']),
    ]);
  });
});
