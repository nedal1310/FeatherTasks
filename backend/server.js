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
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://feathertasks-frontend.onrender.com"
  ],
  credentials: true
}));
app.use(express.json());

app.use("/api/auth", userRoutes);
app.use("/api/todos", todoRoutes);
app.use("/api/logs",logRoutes);

//db config
//connect to mongo
mongoose.set("strictQuery", false);
console.log("Mongoose state:", mongoose.connection.readyState);
mongoose.connect(process.env.MONGO_URI)

  .then(() => {
    console.log("DB Connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
    app.get("/", (req, res) => {
  res.send("Server is running 🚀");
   });
  })
  .catch(err => {
    console.log("DB Error:", err);
  });
  app.use((err, req, res, next) => {
  console.error("🔥 GLOBAL ERROR:", err.stack);
  res.status(500).json({ msg: "Something broke!" });
});
