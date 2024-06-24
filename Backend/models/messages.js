import mongoose from "mongoose";
import ExpenseSchema from "./expenses.js";
import UserSchema from "./user.js";
const messageSchema = new mongoose.Schema({
  room: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  Members:[UserSchema],
  Expense: { type:ExpenseSchema  }, 
});

const Message = mongoose.model("Message", messageSchema);

export default Message;
