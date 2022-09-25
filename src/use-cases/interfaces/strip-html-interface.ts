export interface IStripHtml {
    strip(html: string): Promise<string>;
}
