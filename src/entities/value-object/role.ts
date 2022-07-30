import { Either, success, error } from '@/shared';
import { InvalidRoleError } from '@/entities/value-object/errors';

const isEmpty = (str: string): boolean => !str;
const isTooSmall = (str: string, min: number): boolean => str.length < min;

export class Role {
  readonly value: string;

  private constructor(role: string) {
    this.value = role;
    Object.freeze(this);
  }

  public static isValid(role: string): boolean {
    if (isEmpty(role)) return false;

    const minSize = 3;
    if (isTooSmall(role, minSize)) return false;

    return true;
  }

  public static create(role: string): Either<InvalidRoleError, Role> {
    if (this.isValid(role)) return success(new Role(role));
    return error(new InvalidRoleError(role));
  }
}
