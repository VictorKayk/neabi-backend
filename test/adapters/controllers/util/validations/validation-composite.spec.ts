import { IValidation } from '@/adapters/controllers/interfaces';
import { InvalidParamsError, MissingParamsError } from '@/adapters/controllers/errors';
import { makeValidation } from '@/test/stubs';
import { ValidationComposite } from '@/adapters/controllers/util/validations';

interface SutTypes {
  sut: ValidationComposite,
  validations: IValidation[]
}

const makeSut = (): SutTypes => {
  const validations = [makeValidation(), makeValidation()];
  const sut = new ValidationComposite(validations);

  return {
    sut,
    validations,
  };
};

describe('Validation Composite', () => {
  it('Should return an error if any validation fails', () => {
    const { sut, validations } = makeSut();
    jest.spyOn(validations[1], 'validate').mockReturnValueOnce(new InvalidParamsError('field'));
    const isValid = sut.validate({ field: 'any_field' });
    expect(isValid).toEqual(new InvalidParamsError('field'));
  });

  it('Should return the first error if more then one validation fails', () => {
    const { sut, validations } = makeSut();

    jest.spyOn(validations[0], 'validate').mockReturnValueOnce(new InvalidParamsError('field'));
    jest.spyOn(validations[1], 'validate').mockReturnValueOnce(new MissingParamsError('field'));

    const isValid = sut.validate({ field: 'any_field' });
    expect(isValid).toEqual(new InvalidParamsError('field'));
  });

  it('Should return null if validation succeed', () => {
    const { sut } = makeSut();
    const isValid = sut.validate({ field: 'any_field' });
    expect(isValid).toBe(null);
  });
});
