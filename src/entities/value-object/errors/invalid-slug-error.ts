export class InvalidSlugError extends Error {
  constructor(name: string) {
    super(`Invalid Slug: ${name}`);
    this.name = 'InvalidSlugError';
  }
}
