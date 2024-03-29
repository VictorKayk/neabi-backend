import path from 'path';

export default {
  port: process.env.PORT ?? 5000,
  jwtSecret: process.env.JWT_SECRET ?? 'secret',
  bcryptSalt: Number(process.env.BCRYPT_SALT) ?? 12,
  expiresIn: process.env.JWT_EXPIRES_IN ?? '30d',
  googleClientId: process.env.GOOGLE_CLIENT_ID ?? '',
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
  googleRefreshToken: process.env.GOOGLE_REFRESH_TOKEN ?? '',
  googleCallBackUrl: process.env.GOOGLE_CALLBACK_URL ?? 'http://localhost:5000/api/user/google/auth',
  baseUrl: process.env.BASE_URL ?? 'http://localhost:5000',
  uploadUrl: process.env.UPLOAD_URL ?? 'http://localhost:5000/static/upload',
  downloadUrl: process.env.DOWNLOAD_URL ?? 'http://localhost:5000/api/attachment/file',
  uploadFolder: process.env.UPLOAD_FOLDER ?? path.join(__dirname, '..', '..', '..', 'public/upload'),
  emailHost: process.env.EMAIL_HOST ?? '',
  emailPort: Number(process.env.EMAIL_PORT) ?? 0,
  emailFrom: process.env.EMAIL_FROM ?? '',
  emailUser: process.env.EMAIL_USER ?? '',
};
