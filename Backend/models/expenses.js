import mongoose from "mongoose";

const ExpenseSchema = mongoose.Schema({
  GroupId: {
    type: String,
    required: true,
  },
  ExpenseName: {
    type: String,
    required: true,
  },
  Amount: {
    type: Number,
    required: true,
  },
  DivisionType: {
    type: String,
    required: true,
  },
  CreatedBy: {
    type: String,
    required: true,
  },
  ExpenseDivision: {
    type: Map,
    of: Number,
    required: true,
  },
  PaidBy: {
    type: String,
    required: true,
  },
  shown: {
    type: Boolean,
    required: true,
  },
  url: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
export default ExpenseSchema;
export const Expense = mongoose.model("Expense", ExpenseSchema);
