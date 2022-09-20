import express from 'express';
import middlewares from '@/main/config/middlewares';
import routes from '@/main/config/routes';
import swagger from '@/main/config/swagger';

const app = express();

swagger(app);
middlewares(app);
routes(app);

export default app;
