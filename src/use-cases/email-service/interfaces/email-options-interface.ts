export interface IEmailOptions {
  to: string,
  subject: string,
  text: string,
  html: string,
  attachments?: Array<any>
}
