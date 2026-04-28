import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import todoRoutes from "./routes/todoRoutes.js";
import logRoutes from "./routes/logRoutes.js"

dotenv.config({ path: "./.env" });
const PORT = process.env.PORT || 5000;

const app = express();
// middleware
app.use(cors());
app.use(express.json());

app.use("/api/auth", userRoutes);
app.use("/api/todos", todoRoutes);
app.use("/api/logs",logRoutes);

//db config
//connect to mongo
mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("DB Connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.log("DB Error:", err);
  });