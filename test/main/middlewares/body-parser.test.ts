import request from 'supertest';
import setupApp from '@/main/config/app';
import { Express } from 'express';

let app: Express;

describe('Body Parser', () => {
  beforeAll(async () => {
    app = await setupApp();
  });

  it('Should parse body as json', async () => {
    app.post('/test-body-parser', (req, res) => {
      res.send(req.body);
    });

    await request(app)
      .post('/test-body-parser')
      .send({
        name: 'any_name',
      })
      .expect({
        name: 'any_name',
      });
  });
});
