import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import constants from "app/main/config/constants";

const name = "report";

export const getReportSummary = createAsyncThunk(`${name}/getReportSummary`, async ({date}) => {
  const response = await axios.get(`${constants.BASE_URL}/projects/report/summary?date=${date}`);
  const data = await response.data.data;
  return data;
});

export const getReportSummaryPerOrganization = createAsyncThunk(`${name}/getReportSummaryPerOrganization`, async ({start, end, orgId}) => {
  const response = await axios.get(`${constants.BASE_URL}/organization/${orgId}/reportSummary?startDate=${start}&endDate=${end}`);
  const data = await response.data.data;
  return data;
});

const reportSlice = createSlice({
  name: name,
  initialState: {
    entities: [],
  },
  extraReducers: {
    [getReportSummary.fulfilled]: (state, action) => {console.log("oki--",action.payload)
      if(action.payload === undefined){
        state.entities = [];
      }else{
        state.entities = action.payload;
      }   
    },
  },
});

export default reportSlice.reducer;
