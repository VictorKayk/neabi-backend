import {
  errorSchema,
  signUpParamsSchema,
  signInParamsSchema,
  userSchema,
  userUpdadeParamsSchema,
  verifyResetUserPasswordTokenParamsSchema,
  roleSchema,
  createRoleParamsSchema,
  userHasRoleSchema,
  userCritialDataSchema,
} from '@/main/docs/schemas';

export default {
  user: userSchema,
  signInParams: signInParamsSchema,
  signUpParams: signUpParamsSchema,
  error: errorSchema,
  userUpdadeParams: userUpdadeParamsSchema,
  verifyResetUserPasswordTokenParams: verifyResetUserPasswordTokenParamsSchema,
  role: roleSchema,
  createRoleParams: createRoleParamsSchema,
  userHasRole: userHasRoleSchema,
  userCritialData: userCritialDataSchema,
};
