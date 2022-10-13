import { google } from 'googleapis';
import env from '@/main/config/env';

const oauth2Client = new google.auth.OAuth2(
  env.googleClientId,
  env.googleClientSecret,
  env.googleCallBackUrl,
);

oauth2Client.setCredentials({ refresh_token: env.googleRefreshToken });

const drive = google.drive({
  version: 'v3',
  auth: oauth2Client,
});

export default drive;
