import { createSlice } from "@reduxjs/toolkit";

const initialState = { Expenses: [] };


const ExpensesReducer = createSlice({
    name: 'Expenses',
    initialState,
    reducers: {
      addExpense: (state, action) => {
        state.Expenses.push(action.payload);
      },
      InitializeExpense:(state,action)=>{
      state.Expenses=action.payload
      }
    }
  });
  export const { addExpense ,InitializeExpense} = ExpensesReducer.actions;
  export default ExpensesReducer.reducer; 
  