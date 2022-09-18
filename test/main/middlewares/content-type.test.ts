import request from 'supertest';
import setupApp from '@/main/config/app';
import { Express } from 'express';

let app: Express;

describe('Content Type', () => {
  beforeAll(async () => {
    app = await setupApp();
  });

  test('Should return default content type as json', async () => {
    app.get('/test-content-type', (req, res) => {
      res.send();
    });

    await request(app)
      .get('/test-content-type')
      .expect('content-type', /json/);
  });
});
