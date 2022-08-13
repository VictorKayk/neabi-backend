import { ValidationComposite, RequiredFieldsValidation } from '@/adapters/controllers/utils/validations';
import { makeAddRoleToUserValidationFactory } from '@/main/factories/user-has-role';

jest.mock('@/adapters/controllers/utils/validations/validation-composite');

describe('AddRoleToUser validation Factory', () => {
  it('Should call ValidationComposite with all validations', () => {
    makeAddRoleToUserValidationFactory();
    expect(ValidationComposite).toHaveBeenCalledWith([
      new RequiredFieldsValidation(['userId', 'roleId']),
    ]);
  });
});
