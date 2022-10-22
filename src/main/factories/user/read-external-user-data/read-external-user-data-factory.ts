import { ReadExternalUserDataController } from '@/adapters/controllers/user/read-external-user-data';
import { IController } from '@/adapters/controllers/interfaces';

export function makeReadExternalUserDataController(): IController {
  const readExternalUserDataController = new ReadExternalUserDataController();
  return readExternalUserDataController;
}
