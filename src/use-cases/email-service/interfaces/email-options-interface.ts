export interface IEmailOptions {
  to: string | string[],
  subject: string,
  text: string,
  html: string,
  attachments?: any[]
}
