import { ValidationComposite, RequiredFieldsValidation } from '@/adapters/controllers/utils/validations';
import { makeRemoveRoleFromUserValidationFactory } from '@/main/factories/user-has-role';

jest.mock('@/adapters/controllers/utils/validations/validation-composite');

describe('RemoveRoleFromUser validation Factory', () => {
  it('Should call ValidationComposite with all validations', () => {
    makeRemoveRoleFromUserValidationFactory();
    expect(ValidationComposite).toHaveBeenCalledWith([
      new RequiredFieldsValidation(['userId', 'roleId']),
    ]);
  });
});
