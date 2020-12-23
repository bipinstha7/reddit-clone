import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth";
import postRoutes from "./routes/posts";
import subRoutes from "./routes/subs";
import trim from "./middleware/trim";

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

app.get("/", (_, res) => res.send("You are good to go."));
app.use("/api/v1/auth", trim, authRoutes);
app.use("/api/v1/posts", trim, postRoutes);
app.use("/api/v1/subs", trim, subRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, async () => {
  try {
    await createConnection();
    console.log("Database connected");
    console.log(`Server is listening on port: ${PORT}`);
  } catch (error) {
    console.log({ DatabaseConnectionError: error });
  }
});
