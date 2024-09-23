import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AdminService from 'app/services/AdminService';

let name = 'admin'

export const monthlySignups = createAsyncThunk(`${name}/monthlySignups`, async () => {
	  try {
    let response = await AdminService.monthlySignups();
    if (response.code === 200) {
      return response.data;
    }
  } catch (e) {
    // dispatchErrorMessage(dispatch, e.message);
  }
});



const AdminSlice = createSlice({
	name: `${name}`,
    initialState: {
        monthlySignups:''
    },
	reducers: {},
	extraReducers: {
        [monthlySignups.fulfilled]: (state, action) => {
            state.monthlySignups = action.payload
        }
	}
});

export default AdminSlice.reducer;
