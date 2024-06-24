import { createSlice } from "@reduxjs/toolkit";

const initialState = { groups: [] };

const GroupReducer = createSlice({
  name: 'GroupReducer',
  initialState,
  reducers: {
    addGroup: (state, action) => {
      state.groups = action.payload; // Expecting an array as the payload
    }
  }
});

export const { addGroup } = GroupReducer.actions;
export default GroupReducer.reducer;