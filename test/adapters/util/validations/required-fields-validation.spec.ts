import { RequiredFieldsValidation } from '@/adapters/util/validations';
import { MissingParamsError } from '@/adapters/errors';

interface SutTypes {
  sut: RequiredFieldsValidation
}

const makeSut = (): SutTypes => {
  const requiredFieldsValidation = new RequiredFieldsValidation(['field', 'field1']);
  return {
    sut: requiredFieldsValidation,
  };
};

describe('Required Fields validation', () => {
  test('Should return a MissingParamsError if validation fails', () => {
    const { sut } = makeSut();
    const error = sut.validate({
      invalid_field: 'invalid_field',
    });
    expect(error).toEqual(new MissingParamsError('field, field1'));
  });

  test('Should return null if validation succeeds', () => {
    const { sut } = makeSut();
    const isValid = sut.validate({
      field: 'field',
      field1: 'field1',
    });
    expect(isValid).toBe(null);
  });
});
