import { ValidationComposite, RequiredFieldsValidation } from '@/adapters/controllers/utils/validations';

export const makeDownloadFileByFileNameValidationFactory = ():
  ValidationComposite => new ValidationComposite([new RequiredFieldsValidation(['fileName'])]);
