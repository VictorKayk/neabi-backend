const isEmpty = (str: string): boolean => !str;
const isTooLarge = (str: string, max: number): boolean => str.length > max;

export function isValid(email: string): boolean {
  const maxSize = 320;

  const [local, domain] = email.split('@');
  const maxLocalSize = 64;
  const maxDomainSize = 255;

  if (isEmpty(email)) return false;
  if (isTooLarge(email, maxSize)) return false;
  if (isTooLarge(local, maxLocalSize)) return false;
  if (isTooLarge(domain, maxDomainSize)) return false;

  return true;
}
