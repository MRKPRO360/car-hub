import express, { Application, Request, Response } from 'express';
import carRouter from './src/models/car/car.routes';

const app: Application = express();

// BODY PARSER
app.use(express.json());

// ROUTER
app.use('/api/cars', carRouter);

// HELLO RESPONSE
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Hello World! 👋' });
});
export default app;
