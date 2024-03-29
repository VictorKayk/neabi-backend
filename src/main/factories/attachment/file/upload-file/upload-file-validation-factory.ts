import { ValidationComposite, RequiredFieldsValidation } from '@/adapters/controllers/utils/validations';

export const makeUploadFileValidationFactory = (): ValidationComposite => new ValidationComposite([
  new RequiredFieldsValidation(['originalname', 'filename', 'size', 'mimetype']),
]);
