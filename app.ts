import express, { Application, Request, Response } from 'express';

const app: Application = express();

// BODY PARSER
app.use(express.json());

// ROUTER

// HELLO RESPONSE
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Hello World! 👋' });
});
export default app;
