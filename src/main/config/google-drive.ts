import { google } from 'googleapis';
import env from '@/main/config/env';
import { Credentials } from 'google-auth-library';

const driveConfig = (credentials: Credentials) => {
  const oauth2Client = new google.auth.OAuth2(
    env.googleClientId,
    env.googleClientSecret,
    env.googleCallBackUrl,
  );

  oauth2Client.setCredentials(credentials);

  const drive = google.drive({
    version: 'v3',
    auth: oauth2Client,
  });

  return { drive };
};

export default driveConfig;
