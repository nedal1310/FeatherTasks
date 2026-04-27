import mongoose from "mongoose";
const { Schema, model } = mongoose;

const LogsSchema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    order: { type: Number, default: 0 },
    subject: { type: String, required: true },
    hours: { type: Number, required: true, default:0},
    notes: { type: String, required: false },
    date: { type: String, required: true,
  default: () => new Date().toISOString().split('T')[0], },
  },
  { timestamps: true },
);

export default mongoose.models.Logs || model("Logs", LogsSchema);
