import {
  signUpParamsSchema,
  signInParamsSchema,
  userSchema,
  userUpdadeParamsSchema,
  verifyResetUserPasswordTokenParamsSchema,
  userCritialDataSchema,
} from '@/main/docs/schemas/user';

export const userSchemasDocs = {
  user: userSchema,
  userCritialData: userCritialDataSchema,
  signInParams: signInParamsSchema,
  signUpParams: signUpParamsSchema,
  userUpdadeParams: userUpdadeParamsSchema,
  verifyResetUserPasswordTokenParams: verifyResetUserPasswordTokenParamsSchema,
};
