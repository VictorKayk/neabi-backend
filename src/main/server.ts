import 'dotenv/config';
import 'module-alias/register';
import '@/main/config/passport-google';
import setupApp from '@/main/config/app';
import env from '@/main/config/env';

async function server() {
  const app = await setupApp();
  app.listen(env.port, () => {
    console.log(`Listen on port: ${env.port}`);
  });
}

server();
