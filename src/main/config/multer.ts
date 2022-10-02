import multer from 'multer';
import path from 'path';
import { v4 } from 'uuid';

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, path.join(__dirname, '..', '..', '..', 'public/uploads'));
  },
  filename(req, file, callback) {
    const { originalname } = file;
    callback(null, `${v4()}-${originalname}`);
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
