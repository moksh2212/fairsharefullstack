import { createSlice } from "@reduxjs/toolkit";

const initialState = { loader:false};

const LoadingReducer = createSlice({
  name: 'LoadingReducer',
  initialState,
  reducers: {
    changeLoader: (state, action) => {
      state.loader = action.payload; 
    }
  }
});

export const { changeLoader } = LoadingReducer.actions;
export default LoadingReducer.reducer;