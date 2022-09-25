export interface ISanitizeHtml {
    sanitize(html: string): Promise<string>;
}
