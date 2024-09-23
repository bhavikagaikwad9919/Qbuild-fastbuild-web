import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  state: null,
  options: {
    anchorOrigin: {
      vertical: "top",
      horizontal: "center",
    },
    autoHideDuration: 6000,
    message: "Hi",
    variant: null,
  },
};
const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    showMessage: (state, action) => {
      state.state = true;
      state.options = {
        ...initialState.options,
        ...action.payload,
      };
    },
    hideMessage: (state, action) => {
      state.state = null;
    },
    successMessage: (state, action) => {
      state.state = true;
      state.options = {
        ...initialState.options,
        ...action.payload,
        variant: "success",
      };
    },
    errorMessage: (state, action) => {
      state.state = true;
      state.options = {
        ...initialState.options,
        ...action.payload,
        variant: "error",
      };
    },
    warningMessage: (state, action) => {
      state.state = true;
      state.options = {
        ...initialState.options,
        ...action.payload,
        variant: "warning",
      };
    },
  },
});

export const {
  hideMessage,
  showMessage,
  successMessage,
  errorMessage,
  warningMessage,
} = messageSlice.actions;

export default messageSlice.reducer;
