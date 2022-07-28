import { IValidation } from '@/adapters/controllers/interfaces';

export class ValidationComposite implements IValidation {
  constructor(private readonly validations: IValidation[]) { }

  validate(input: any): Error | null {
    const errorOrNull = this.validations.reduce<Error | null>((prev, current) => {
      if (prev) return prev;
      return current.validate(input);
    }, null);
    return errorOrNull;
  }
}
