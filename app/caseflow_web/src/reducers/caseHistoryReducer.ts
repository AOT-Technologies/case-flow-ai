import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  caseHistory: [],
};

const setCaseHistorySlice = createSlice({
  name: "caseHistory",
  initialState,
  reducers: {
    setCaseHistory: (state, action) => {
      state.caseHistory = action.payload;
    },
  },
  extraReducers: {
    logout: (state, action) => {
      state = initialState;
    },
  },
});

export const {
  setCaseHistory,
} = setCaseHistorySlice.actions;
export default setCaseHistorySlice.reducer;
