import express, { Application, Request, Response } from 'express';

import cors from 'cors';
import morgan from 'morgan';
import session from 'express-session';
import passport from './app/config/passport.config';
import router from './routes';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import config from './app/config';

const app: Application = express();

// BODY PARSER
app.use(express.json());

app.use(
  session({
    secret: config.jwt_access_secret || 'your-super-secret-key',
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// CORS
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
