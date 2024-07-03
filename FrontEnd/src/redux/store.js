import { configureStore } from "@reduxjs/toolkit";
import GroupReducer from "./GroupReducers"; // Import the reducer function
import CurrentGroupReducer from "./CurrentGroupReducer";
import AmountReduces from "./AmountReduces";
import ExpensesReducers from "./ExpensesReducers";
import NewExpenseReducer from "./NewExpenseReducer";
import LoadingReducer from "./LoadingReducer";
const store = configureStore({
  reducer: {
    GroupReducer: GroupReducer, // Use the imported reducer function
    CurrentGroupReducer:CurrentGroupReducer,
    AmountReducers:AmountReduces,
    ExpenseReducer:ExpensesReducers,
    NewExpenseReducer:NewExpenseReducer,
    LoadingReducer:LoadingReducer,
  }
});

export default store;