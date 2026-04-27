import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import todoRoutes from "./routes/todoRoutes.js";
import logRoutes from "./routes/logRoutes.js"

dotenv.config({ path: "./.env" });

const app = express();
// middleware
app.use(cors());
app.use(express.json());

app.use("/api/auth", userRoutes);
app.use("/api/todos", todoRoutes);
app.use("/api/logs",logRoutes);

//db config
//connect to mongo
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("DB Connected"))
  .catch(err => console.log(" DB Error:", err));

app.get('/', (req, res) => {
  res.json({ message: "Hello from the server!" });
});

const PORT = process.env.PORT || 5000;

app.listen(5000, () => {
   console.log(`Server running on http://localhost:${PORT}`);
});