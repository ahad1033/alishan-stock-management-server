import cors from "cors";
import cookieParser from "cookie-parser";
import express, { Application } from "express";

import router from "./app/routes";

const app: Application = express();

//parsers
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: ["*"],
    credentials: true,
  })
);

// application routes
app.use("/api/v1", router);

export default app;
