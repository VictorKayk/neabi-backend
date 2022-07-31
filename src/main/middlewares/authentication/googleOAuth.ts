import passport from 'passport';

export const googleLoginAuth = passport.authenticate('google', { session: false });
export const googleLoginAuthCb = passport.authenticate('google', { session: false, failureRedirect: '/api/signin', failureMessage: true });
