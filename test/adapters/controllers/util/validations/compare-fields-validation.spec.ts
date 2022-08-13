import { CompareFieldsValidation } from '@/adapters/controllers/utils/validations';
import { InvalidParamsError } from '@/adapters/controllers/errors';

interface SutTypes {
  sut: CompareFieldsValidation
}

const makeSut = (): SutTypes => {
  const requiredFieldsValidation = new CompareFieldsValidation('field', 'fieldToCompare');
  return {
    sut: requiredFieldsValidation,
  };
};

describe('Compare Fields validation', () => {
  test('Should return a InvalidParamsError if validation fails', () => {
    const { sut } = makeSut();
    const error = sut.validate({
      field: 'invalid_field',
      fieldToCompare: 'invalid_fieldToCompare',
    });
    expect(error).toEqual(new InvalidParamsError('\'field\' and \'fieldToCompare\' must be equal.'));
  });

  test('Should return null if validation succeeds', () => {
    const { sut } = makeSut();
    const isValid = sut.validate({
      field: 'field',
      fieldToCompare: 'field',
    });
    expect(isValid).toBe(null);
  });
});
