/* eslint-disable camelcase */
import { IHttpResponse, IHttpRequestAuthenticated } from '@/adapters/interfaces';
import { AddPublicVisibilityPermissitionToUserExternalFileUseCase } from '@/use-cases/attachment/external-file/add-public-visibility-permission-to-user-external-file';
import { CopyUserExternalFileUseCase } from '@/use-cases/attachment/external-file/copy-user-external-file';
import { ReadPublicUserExternalFileDataByIdUseCase } from '@/use-cases/attachment/external-file/read-public-user-external-file-data-by-id';
import { IFileRepository } from '@/use-cases/attachment/file/interfaces';
import { CreateFileTypeUseCase } from '@/use-cases/attachment/file/create-file-type';
import { CreateFileFormatUseCase } from '@/use-cases/attachment/file/create-file-format';
import { CreateExternalFileUseCase } from '@/use-cases/attachment/external-file/create-external-file';
import { IController, IValidation } from '@/adapters/controllers/interfaces';
import { serverError, ok } from '@/adapters/utils/http';

export class CreateExternalFileController implements IController {
  constructor(
    private readonly validation: IValidation,
    private readonly addPublicVisibilityPermissitionToUserExternalFileUseCase:
      AddPublicVisibilityPermissitionToUserExternalFileUseCase,
    private readonly copyUserExternalFileUseCase: CopyUserExternalFileUseCase,
    private readonly readPublicUserExternalFileDataByIdUseCase:
      ReadPublicUserExternalFileDataByIdUseCase,
      private readonly fileRepository: IFileRepository,
      private readonly createFileType: CreateFileTypeUseCase,
      private readonly createFileFormat: CreateFileFormatUseCase,
    private readonly createExternalFileUseCase: CreateExternalFileUseCase,
  ) { }

  async handle({ body: { filesIds, access_token } }: IHttpRequestAuthenticated):
    Promise<IHttpResponse> {
    try {
      const externalFiles = filesIds.map(async (externalId: string) => {
        const validationError = this.validation.validate({ externalId, access_token });
        if (validationError) {
          return {
            externalId,
            error: {
              name: validationError.name,
              message: validationError.message,
            },
          };
        }

        let newFileId = externalId;
        let permissionOrError = await
        this.addPublicVisibilityPermissitionToUserExternalFileUseCase
          .execute({ credentials: { access_token }, externalId });
        if (permissionOrError.isError()) {
          const copyExternalFileOrError = await this.copyUserExternalFileUseCase.execute({
            credentials: { access_token }, externalId,
          });
          if (copyExternalFileOrError.isError()) {
            return {
              externalId,
              error: copyExternalFileOrError.value,
            };
          }
          newFileId = copyExternalFileOrError.value.externalId;

          permissionOrError = await
          this.addPublicVisibilityPermissitionToUserExternalFileUseCase
            .execute({ credentials: { access_token }, externalId });
          if (permissionOrError.isError()) {
            return {
              externalId,
              error: permissionOrError.value,
            };
          }
        }

        const publicUserExternalFileDataOrError = await
        this.readPublicUserExternalFileDataByIdUseCase
          .execute({ credentials: { access_token }, externalId: newFileId });
        if (publicUserExternalFileDataOrError.isError()) {
          return {
            externalId,
            error: publicUserExternalFileDataOrError.value,
          };
        }
        const publicUserExternalFileData = publicUserExternalFileDataOrError.value;

        const [fileType, fileFormat] = publicUserExternalFileData.mimeType.split('/');

        let fileTypeOrNull = await this.fileRepository.findFileTypeByType(fileType);
        if (!fileTypeOrNull || fileTypeOrNull.isDeleted) {
          const fileTypeOrError = await this.createFileType.execute(fileType);

          if (fileTypeOrError.isError()) {
            return {
              externalId,
              error: fileTypeOrError.value,
            };
          }
          fileTypeOrNull = fileTypeOrError.value;
        }

        let fileFormatOrNull = await this.fileRepository.findFileFormatByFormat(fileFormat);
        if (!fileFormatOrNull || fileFormatOrNull.isDeleted) {
          const fileFormatOrError = await this.createFileFormat
            .execute({ format: fileFormat, fileTypeId: fileTypeOrNull.id });

          if (fileFormatOrError.isError()) {
            return {
              externalId,
              error: fileFormatOrError.value,
            };
          }
          fileFormatOrNull = fileFormatOrError.value;
        }

        const externalFile = await this.createExternalFileUseCase
          .execute({ ...publicUserExternalFileData, fileFormatId: fileFormatOrNull.id });
        return externalFile.value;
      });

      return ok(await Promise.all(externalFiles));
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
