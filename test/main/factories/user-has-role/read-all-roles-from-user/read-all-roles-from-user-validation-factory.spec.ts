import { ValidationComposite, RequiredFieldsValidation } from '@/adapters/controllers/util/validations';
import { makeReadAllRolesFromUserValidationFactory } from '@/main/factories/user-has-role';

jest.mock('@/adapters/controllers/util/validations/validation-composite');

describe('ReadAllRolesFromUser validation Factory', () => {
  it('Should call ValidationComposite with all validations', () => {
    makeReadAllRolesFromUserValidationFactory();
    expect(ValidationComposite).toHaveBeenCalledWith([
      new RequiredFieldsValidation(['userId']),
    ]);
  });
});
