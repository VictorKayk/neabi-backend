import { ValidationComposite, RequiredFieldsValidation } from '@/adapters/controllers/utils/validations';
import { makeCreatePostValidationFactory } from '@/main/factories/post';

jest.mock('@/adapters/controllers/utils/validations/validation-composite');

describe('CreatePost validation Factory', () => {
  it('Should call ValidationComposite with all validations', () => {
    makeCreatePostValidationFactory();
    expect(ValidationComposite).toHaveBeenCalledWith([
      new RequiredFieldsValidation(['title', 'description']),
    ]);
  });
});
