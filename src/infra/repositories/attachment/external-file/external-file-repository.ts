import { IExternalUserCredentials, IExternalFileRepository, IReadExternalFileData } from '@/use-cases/attachment/external-file/interfaces';
import driveConfig from '@/main/config/google-drive';

export class ExternalFileRepository implements IExternalFileRepository {
  private drive: any;

  setCredentialToDrive(credentials: IExternalUserCredentials) {
    const { drive } = driveConfig(credentials);
    this.drive = drive;
  }

  async readAllUserExternalFiles(): Promise<IReadExternalFileData[] | []> {
    const files = await this.drive.files.list({
      corpora: 'allDrives',
      includeItemsFromAllDrives: true,
      supportsAllDrives: true,
      fields: 'files(id, name, mimeType, size, iconLink, thumbnailLink)',
    });

    const filesWithCorrectMimeTypeFormat = files.data.files?.map((file: any) => ({ ...file, mimeType: file.mimeType?.replace('vnd.google-apps.', '') }));
    const filesWithoutFolderMimeType = filesWithCorrectMimeTypeFormat?.filter((file: any) => file.mimeType?.split('/')[1] !== 'folder');
    return filesWithoutFolderMimeType || [];
  }
}
