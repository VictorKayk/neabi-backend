export class Error<L, A> {
  readonly value: L;

  constructor(value: L) {
    this.value = value;
  }

  isError(): this is Error<L, A> {
    return true;
  }

  isSuccess(): this is Success<L, A> {
    return true;
  }
}

export class Success<L, A> {
  readonly value: A;

  constructor(value: A) {
    this.value = value;
  }

  isSuccess(): this is Success<L, A> {
    return true;
  }

  isError(): this is Error<L, A> {
    return false;
  }
}

export type Either<L, A> = Error<L, A> | Success<L, A>;

export const error = <L, A>(l: L): Either<L, A> => new Error<L, A>(l);

export const success = <L, A>(a: A): Either<L, A> => new Success<L, A>(a);
