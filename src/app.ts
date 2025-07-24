import express, { Application, Request, Response } from 'express';

import cors from 'cors';
import morgan from 'morgan';
import router from './routes';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';

const app: Application = express();

// CORS
//SHOULD HAVE TO CHANGE THE ORIGIN WHEN PRODUCTION!
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://car-frontend-azure.vercel.app',
    ],
    credentials: true,
  })
);

// 3rd PARTY MIDDLEWARE
app.use(morgan('dev'));

// BODY PARSER
app.use(express.json());

// ROUTER
app.use('/api/v1', router);

// HELLO RESPONSE
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Hello World! 👋' });
});

// GLOBAL ERROR HANDLER
app.use(globalErrorHandler);

// NOT FOUND
app.use(notFound);
export default app;
