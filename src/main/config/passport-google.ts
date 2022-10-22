import passport from 'passport';
import { StrategyOptionsWithRequest, Strategy } from 'passport-google-oauth20';
import env from '@/main/config/env';

const options: StrategyOptionsWithRequest = {
  clientID: env.googleClientId,
  clientSecret: env.googleClientSecret,
  callbackURL: env.googleCallBackUrl,
  scope: ['profile', 'email', 'https://www.googleapis.com/auth/drive'],
  passReqToCallback: true,
};

async function verify(
  req: any, accessToken: any, refreshToken: any, params:any, profile: any, done: any,
) {
  try {
    done(null, { ...profile, credentials: params });
  } catch (e) {
    done(new Error('An authorization error occurred, please try again later.'), false);
  }
}

const strategy = new Strategy(options, verify);

passport.use(strategy);
