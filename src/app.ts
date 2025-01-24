import express, { Application, Request, Response } from "express";
import carRouter from "./app/modules/car/car.routes";
import orderRouter from "./app/modules/order/order.routes";
import cors from "cors";
import morgan from "morgan";
import router from "./routes";

const app: Application = express();

// CORS
app.use(cors());

// 3rd PARTY MIDDLEWARE
app.use(morgan("dev"));

// BODY PARSER
app.use(express.json());

// ROUTER
app.use("/api/v1", router);

// HELLO RESPONSE
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Hello World! 👋" });
});
export default app;
