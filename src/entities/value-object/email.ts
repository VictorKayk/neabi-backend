import { Either, success, error } from '@/shared';
import { InvalidEmailError } from '@/entities/value-object/errors';

function nonConformant(email: string): boolean {
  const emailRegex = /^[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

  return !emailRegex.test(email);
}

const isEmpty = (str: string): boolean => !str;
const isTooLarge = (str: string, max: number): boolean => str.length > max;

export class Email {
  readonly value: string;

  private constructor(email: string) {
    this.value = email;
    Object.freeze(this);
  }

  public static isValid(email: string): boolean {
    if (isEmpty(email)) return false;
    if (nonConformant(email)) return false;

    const maxSize = 320;
    if (isTooLarge(email, maxSize)) return false;

    const [local, domain] = email.split('@');

    const maxLocalSize = 64;
    if (isTooLarge(local, maxLocalSize)) return false;
    const maxDomainSize = 255;
    if (isTooLarge(domain, maxDomainSize)) return false;

    const domainParts = domain.split('.');

    const maxDomainPartsSize = 63;
    const isDomainPartsTooLarge = domainParts
      .reduce<boolean>((prev, current) => prev || isTooLarge(current, maxDomainPartsSize), false);
    if (isDomainPartsTooLarge) return false;

    return true;
  }

  public static create(email: string): Either<InvalidEmailError, Email> {
    if (this.isValid(email)) return success(new Email(email));
    return error(new InvalidEmailError(email));
  }
}
