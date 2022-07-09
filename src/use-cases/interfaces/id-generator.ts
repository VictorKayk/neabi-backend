export interface IIdGenerator {
  generate(): Promise<string>
}
