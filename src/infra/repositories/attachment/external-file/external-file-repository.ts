import { IExternalFileRepository, IReadExternalFileData } from '@/use-cases/attachment/external-file/interfaces';
import drive from '@/main/config/google-drive';

export class ExternalFileRepository implements IExternalFileRepository {
  async readAllExternalFiles(): Promise<IReadExternalFileData[] | []> {
    const files = await drive.files.list({
      corpora: 'allDrives',
      includeItemsFromAllDrives: true,
      supportsAllDrives: true,
      fields: 'files(id, name, mimeType, size, iconLink, thumbnailLink)',
    });

    const filesWithCorrectMimeTypeFormat = files.data.files?.map((file) => ({ ...file, mimeType: file.mimeType?.replace('vnd.google-apps.', '') }));
    const filesWithoutFolderMimeType = filesWithCorrectMimeTypeFormat?.filter((file) => file.mimeType?.split('/')[1] !== 'folder');
    return filesWithoutFolderMimeType || [];
  }
}
