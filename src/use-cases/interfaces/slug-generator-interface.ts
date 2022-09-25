export interface ISlugGenerator {
    generate(value: string): Promise<string>;
}
