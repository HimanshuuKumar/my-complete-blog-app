import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();
app.use(cors());

mongoose
  .connect(process.env.MONGO_URL, { dbName: "Blog_Mern_App" })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.log(err));

app.use(express.json());

//routers

app.use("/api/v1", userRoutes);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`server is running on port ${port}`));
