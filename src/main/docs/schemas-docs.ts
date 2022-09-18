import {
  errorSchema,
  signUpParamsSchema,
  signInParamsSchema,
  userSchema,
  userUpdadeParamsSchema,
  verifyResetUserPasswordTokenParamsSchema,
} from '@/main/docs/schemas';

export default {
  user: userSchema,
  signInParams: signInParamsSchema,
  signUpParams: signUpParamsSchema,
  error: errorSchema,
  userUpdadeParams: userUpdadeParamsSchema,
  verifyResetUserPasswordTokenParams: verifyResetUserPasswordTokenParamsSchema,
};
