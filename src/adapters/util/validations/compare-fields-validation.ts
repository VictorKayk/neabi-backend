import { IValidation } from '@/adapters/interfaces';
import { InvalidParamsError } from '@/adapters/errors';

export class CompareFieldsValidation implements IValidation {
  constructor(
    private readonly fieldName: string,
    private readonly fieldNameToBeCompared: string,
  ) { }

  validate(input: any): Error | null {
    if (input[this.fieldName] !== input[this.fieldNameToBeCompared]) {
      return new InvalidParamsError(`'${this.fieldName}' and '${this.fieldNameToBeCompared}' must be equal.`);
    }
    return null;
  }
}
