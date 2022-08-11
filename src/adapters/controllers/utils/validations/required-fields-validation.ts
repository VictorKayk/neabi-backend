import { IValidation } from '@/adapters/controllers/interfaces';
import { MissingParamsError } from '@/adapters/controllers/errors';

export class RequiredFieldsValidation implements IValidation {
  constructor(private readonly fieldsName: string[]) { }

  validate(input: any): Error | null {
    const missingParamsOrNull = this.fieldsName.reduce<string[] | null>((prev, current) => {
      if (!input[current]) return prev ? [...prev, current] : [current];
      return prev;
    }, null);
    return missingParamsOrNull ? new MissingParamsError(missingParamsOrNull.join(', ')) : null;
  }
}
