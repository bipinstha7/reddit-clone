import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";
import morgan from "morgan";

import authRoutes from "./routes/auth";
import trim from "./middleware/trim";

const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.get("/", (_, res) => res.send("You are good to go."));
app.use("/api/v1/auth", trim, authRoutes);

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
