import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import constants from "app/main/config/constants";

const name = "payment";

export const getallpayment = createAsyncThunk(`${name}/allpayment`, async () => {
  const response = await axios.get(`${constants.BASE_URL}/payment/getallpayment`);
  const data = await response.data.data;
  return data;
});


const paymentSlice = createSlice({
  name: name,
  initialState: {
    entities: [],
  },
  extraReducers: {
    [getallpayment.fulfilled]: (state, action) => {
      state.entities = action.payload;
    },
  },
});

export default paymentSlice.reducer;
