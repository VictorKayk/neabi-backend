import { AddPublicVisibilityPermissitionToUserExternalFileUseCase } from '@/use-cases/attachment/external-file/add-public-visibility-permission-to-user-external-file';
import { CopyUserExternalFileUseCase } from '@/use-cases/attachment/external-file/copy-user-external-file';
import { ReadPublicUserExternalFileDataByIdUseCase } from '@/use-cases/attachment/external-file/read-public-user-external-file-data-by-id';
import { CreateExternalFileUseCase } from '@/use-cases/attachment/external-file/create-external-file';
import { IController } from '@/adapters/controllers/interfaces';
import { UuidAdapter } from '@/infra/universally-unique-identifier';
import { FileRepository, ExternalFileRepository } from '@/infra/repositories';
import { makeCreateExternalFileValidationFactory } from '@/main/factories/attachment/external-file';
import { CreateFileTypeUseCase } from '@/use-cases/attachment/file/create-file-type';
import { CreateFileFormatUseCase } from '@/use-cases/attachment/file/create-file-format';
import { CreateExternalFileController } from '@/adapters/controllers/attachment/external-file/create-external-file';

export function makeCreateExternalFileController(): IController {
  const externalFileRepository = new ExternalFileRepository();
  const fileRepository = new FileRepository();
  const uuidAdapter = new UuidAdapter();

  const addPublicVisibilityPermissitionToUserExternalFileUseCase = new
  AddPublicVisibilityPermissitionToUserExternalFileUseCase(externalFileRepository);
  const copyUserExternalFileUseCase = new
  CopyUserExternalFileUseCase(externalFileRepository);
  const readPublicUserExternalFileDataByIdUseCase = new
  ReadPublicUserExternalFileDataByIdUseCase(externalFileRepository);
  const createExternalFileUseCase = new CreateExternalFileUseCase(
    externalFileRepository, uuidAdapter,
  );
  const createTypeUseCase = new CreateFileTypeUseCase(fileRepository, uuidAdapter);
  const createFormatUseCase = new CreateFileFormatUseCase(fileRepository, uuidAdapter);

  const createExternalFileController = new CreateExternalFileController(
    makeCreateExternalFileValidationFactory(),
    addPublicVisibilityPermissitionToUserExternalFileUseCase,
    copyUserExternalFileUseCase,
    readPublicUserExternalFileDataByIdUseCase,
    fileRepository,
    createTypeUseCase,
    createFormatUseCase,
    createExternalFileUseCase,
  );
  return createExternalFileController;
}
