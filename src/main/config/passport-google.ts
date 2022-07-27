import passport from 'passport';
import { StrategyOptions, Strategy } from 'passport-google-oauth20';
import env from '@/main/config/env';

const options: StrategyOptions = {
  clientID: env.googleClientId,
  clientSecret: env.googleClientSecret,
  callbackURL: 'http://localhost:5000/api/user/google/auth',
  scope: ['profile', 'email'],
};

async function verify(accessToken: any, refreshToken: any, profile: any, done: any) {
  try {
    done(null, profile);
  } catch (e) {
    done(new Error('An authorization error occurred, please try again later.'), false);
  }
}

const strategy = new Strategy(options, verify);

passport.use(strategy);
