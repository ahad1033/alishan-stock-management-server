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
    origin: [
      "http://localhost:5173",
      "https://alishan-stock-management-f8grkqm9m-ahad-ahameds-projects.vercel.app",
      "https://alishan-stock-management.vercel.app",
    ],
    credentials: true,
  })
);

// application routes
app.use("/api/v1", router);

export default app;
