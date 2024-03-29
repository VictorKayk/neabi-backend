import multer from 'multer';
import { v4 } from 'uuid';
import env from '@/main/config/env';

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, env.uploadFolder);
  },
  filename(req, file, callback) {
    const { mimetype } = file;
    const format = mimetype.split('/')[1];
    callback(null, `${v4()}.${format}`);
  },
});

type fileType = Express.Multer.File
type callbackType = multer.FileFilterCallback

const fileFilter = (req: any, file: fileType, callback: callbackType) => {
  const allowedTypes = ['application', 'audio', 'image', 'text', 'video'];
  const { mimetype } = file;
  const type = mimetype.split('/')[0];

  if (allowedTypes.includes(type)) callback(null, true);
  else callback(null, false);
};

const limits = {
  fileSize: 1 * 1024 * 1024 * 1024, // 1GB
};

export { storage, fileFilter, limits };
