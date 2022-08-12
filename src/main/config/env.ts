export default {
  port: process.env.PORT ?? 5000,
  jwtSecret: process.env.JWT_SECRET ?? 'secret',
  bcryptSalt: Number(process.env.BCRYPT_SALT) ?? 12,
  expiresIn: process.env.JWT_EXPIRES_IN ?? '30d',
  googleClientId: process.env.GOOGLE_CLIENT_ID ?? '',
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
  baseUrl: process.env.BASE_URL ?? 'http://localhost:3000/api',
  emailHost: process.env.EMAIL_HOST ?? '',
  emailPort: Number(process.env.EMAIL_PORT) ?? 0,
  emailFrom: process.env.EMAIL_FROM ?? '',
  emailUser: process.env.EMAIL_USER ?? '',
  emailPassword: process.env.EMAIL_PASSWORD ?? '',
};
