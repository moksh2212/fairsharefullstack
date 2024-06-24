import { createSlice } from "@reduxjs/toolkit";

const initialState = { NewExpenses: [] };


const NewExpensesReducer = createSlice({
    name: 'NewExpensesReducer',
    initialState,
    reducers: {
      addNewExpense: (state, action) => {
        state.NewExpenses.push(action.payload); // Corrected this line
      },
    }
  });
  export const { addNewExpense} = NewExpensesReducer.actions;
  export default NewExpensesReducer.reducer; 
  