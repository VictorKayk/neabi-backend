import express from 'express';
import middlewares from '@/main/config/middlewares';
import routes from '@/main/config/routes';

const app = express();

middlewares(app);
routes(app);

export default app;
