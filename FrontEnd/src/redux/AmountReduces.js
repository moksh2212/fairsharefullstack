import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  amount: 0,
};

const AmountReducer = createSlice({
  name: "Amount", // The name property should be a string
  initialState,
  reducers: {
    changeAmount: (state, action) => {
      state.amount = action.payload; // You need to access the payload property of the action object
    },
  },
});

export const { changeAmount } = AmountReducer.actions;
export default AmountReducer.reducer;