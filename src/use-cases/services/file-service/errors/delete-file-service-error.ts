export class DeleteFileServiceError extends Error {
  constructor() {
    super('Delete File Service Error');
    this.name = 'DeleteFileServiceError';
  }
}
