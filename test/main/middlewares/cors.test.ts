import request from 'supertest';
import app from '@/main/config/app';

describe('CORS', () => {
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
