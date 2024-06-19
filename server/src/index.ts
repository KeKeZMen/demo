import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { authRouter, categoryRouter, requestRouter } from "./routers/index.js";

async function start(): Promise<void> {
  try {
    const app = express();
    app.use(cookieParser());
    app.use(bodyParser.json());
    app.use(cors());

    app.use(authRouter);
    app.use(categoryRouter);
    app.use(requestRouter);

    app.use(errorMiddleware);
    app.listen(3000, () =>
      console.log("Server started on http://localhost:3000")
    );
  } catch (error) {
    console.log(error);
  }
}

start();
