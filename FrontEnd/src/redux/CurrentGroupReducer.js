import { createSlice } from "@reduxjs/toolkit";

const initialState = { ob: {
    Groups:""
} };

const CurrentGroupReducer = createSlice({
  name: 'CurrentGroupReducer',
  initialState,
  reducers: {
    add: (state, action) => {
      state.ob=action.payload;
    }
  }
});
export const { add } = CurrentGroupReducer.actions;
export default CurrentGroupReducer.reducer; 
