import request from 'supertest';
import setupApp from '@/main/config/app';
import { Express } from 'express';

let app: Express;

describe('CORS', () => {
  beforeAll(async () => {
    app = await setupApp();
  });

  test('Should enable CORS', async () => {
    app.get('/test-cors', (req, res) => {
      res.send();
    });

    await request(app)
      .get('/test-cors')
      .expect('access-control-allow-origin', '*')
      .expect('access-control-allow-methods', '*')
      .expect('access-control-allow-headers', '*');
  });
});
