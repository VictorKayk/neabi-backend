export default {
  port: process.env.PORT ?? 5000,
  jwtSecret: process.env.JWT_SECRET ?? 'secret',
  bcryptSalt: Number(process.env.BCRYPT_SALT) ?? 12,
  expiresIn: process.env.JWT_EXPIRES_IN ?? '30d',
};
