export interface IHashCompare {
  compare(hash: string, value: string): Promise<boolean>;
}
