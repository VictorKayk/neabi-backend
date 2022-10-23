import {
  signUpParamsSchema,
  signInParamsSchema,
  externalSignInParamsSchema,
  userSchema,
  userUpdadeParamsSchema,
  verifyResetUserPasswordTokenParamsSchema,
  userCritialDataSchema,
} from '@/main/docs/schemas/user';

export const userSchemasDocs = {
  user: userSchema,
  userCritialData: userCritialDataSchema,
  signInParams: signInParamsSchema,
  externalSignInParams: externalSignInParamsSchema,
  signUpParams: signUpParamsSchema,
  userUpdadeParams: userUpdadeParamsSchema,
  verifyResetUserPasswordTokenParams: verifyResetUserPasswordTokenParamsSchema,
};
