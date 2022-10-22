import { ReadExternalUserDataController } from '@/adapters/controllers/user/read-external-user-data';
import { IController } from '@/adapters/controllers/interfaces';

export function makeExternalUserDataController(): IController {
  const readExternalUserDataController = new ReadExternalUserDataController();
  return readExternalUserDataController;
}
