import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import constants from "app/main/config/constants";

const name = "users";

export const getUsers = createAsyncThunk(`${name}/getUsers`, async () => {
  const response = await axios.get(`${constants.BASE_URL}/users`);
  const data = await response.data.data.data;
  return data;
});

export const getUser = createAsyncThunk(`${name}/getUser`, async (id) => {
  const response = await axios.get(`${constants.BASE_URL}/users/${id}`);
  const data = await response.data.data;
  return data;
});

export const updateProjectcount = createAsyncThunk(`${name}/updateProjectcount`, async ({id,count}) => {
  const response = await axios.post(`${constants.BASE_URL}/users/updateProjectcount/${id}`,{count:count});
  const data = await response.data.data;
  return data;
});

export const changeUserStatus = createAsyncThunk(`${name}/changeUserStatus`, async ({userId,status}) => {
  const response = await axios.post(`${constants.BASE_URL}/users/userStatus/${userId}`,
  {status:status});
  const data = await response.data.data;
  return data;
});

// export const deleteUser = createAsyncThunk(`${name}/deleteUser`, async (ids) => {
//   const response = await axios.delete(`${constants.BASE_URL}/users/delete/${ids}`);
//   const data = await response.data.data;
//   return data;
// });

export const deviceInfo = createAsyncThunk(
  `${name}/deviceInfo`,
  async ({ userId, info }) => {
    const response = await axios.post(
      `${constants.BASE_URL}/users/${userId}/device/info`,
      info
    );
    const data = await response.data;
    return data;
  }
);

const usersSlice = createSlice({
  name: name,
  initialState: {
    entities: [],
    details: "",
  },
  extraReducers: {
    [getUsers.fulfilled]: (state, action) => {
      state.entities = action.payload;
    },
    [getUser.fulfilled]: (state, action) => {
      state.details = action.payload;
      // let userDetails = JSON.parse(JSON.stringify(action.payload));
      // if (
      //   userDetails.user.deviceDetails &&
      //   userDetails.user.deviceDetails.length
      // ) {
      //   let deviceDetails = userDetails.user.deviceDetails.filter(function (
      //     element
      //   ) {
      //     return element !== null;
      //   });

      //   userDetails.user.deviceDetails = deviceDetails;
      //   state.details = userDetails;
      // }
    },
  },
});

export default usersSlice.reducer;
