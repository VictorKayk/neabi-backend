import { Request, Response } from 'express';
import env from '@/main/config/env';

export const DownloadFileByFileNameController = () => (req: Request, res: Response) => {
  const { fileName } = req.params;
  if (!fileName) {
    return res.status(400).send({
      message: 'Invalid File Name',
    });
  }

  // eslint-disable-next-line consistent-return
  res.download(`${env.uploadFolder}/${fileName}`, fileName, (err: any) => {
    if (err) {
      return res.status(500).send({
        message: `Could not download the file. ${fileName}`,
      });
    }
  });

  return res.status(200);
};
