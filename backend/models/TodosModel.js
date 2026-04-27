import mongoose from "mongoose";
const {Schema,model}=mongoose

const TodosSchema= new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  text: { type: String, required: true },
  isCompleted: { type: Boolean, default: false },
  isFav: { type: Boolean, default: false },
   order: { type: Number, default: 0 },
}, { timestamps: true })

export default mongoose.models.Todos || model("Todos",TodosSchema) ;