import express from 'express'
import { addExpense } from '../controller/expenses.js';
import { getExpense } from '../controller/expenses.js';
import { deleteexpense } from '../controller/expenses.js';
import { bargraphtotalexpenses } from '../controller/expenses.js';
import { PieChartExpense } from "../controller/expenses.js";
import upload from '../utils/multer.js';
const ExpensesRouter=express.Router();


ExpensesRouter.post("/addexpense", upload.single('receipt'), addExpense);
ExpensesRouter.get("/getexpense/:groupId",getExpense)
ExpensesRouter.delete("/Deleteexpense/:_id/:username",deleteexpense)
ExpensesRouter.get("/MonthlyExpenses/:grpid",bargraphtotalexpenses)
ExpensesRouter.get("/PieExpenses/:grpid",PieChartExpense)


export default ExpensesRouter;