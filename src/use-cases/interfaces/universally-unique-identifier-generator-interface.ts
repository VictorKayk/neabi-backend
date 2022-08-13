export interface IUniversallyUniqueIdentifierGenerator {
  generate(): Promise<string>
}
