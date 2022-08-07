import { makeReadUserByIdValidationFactory } from '@/main/factories/user';
import { ValidationComposite, RequiredFieldsValidation } from '@/adapters/controllers/util/validations';

jest.mock('@/adapters/controllers/util/validations/validation-composite');

describe('ReadUserById validation Factory', () => {
  it('Should call ValidationComposite with all validations', () => {
    makeReadUserByIdValidationFactory();
    expect(ValidationComposite).toHaveBeenCalledWith([
      new RequiredFieldsValidation(['id']),
    ]);
  });
});
