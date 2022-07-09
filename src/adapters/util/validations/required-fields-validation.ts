import { IValidation } from '@/adapters/interfaces';
import { MissingParamsError } from '@/adapters/errors';

export class RequiredFieldsValidation implements IValidation {
  constructor(private readonly fieldsName: string[]) { }

  validate(input: any): Error | null {
    const errorOrNull = this.fieldsName.reduce<Error | null>((prev, current) => {
      if (prev) return prev;
      return !input[current] ? new MissingParamsError(current) : null;
    }, null);
    return errorOrNull;
  }
}
