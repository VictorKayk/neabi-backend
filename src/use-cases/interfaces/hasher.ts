export interface IHasher {
  hash(str: string): Promise<string>
}
