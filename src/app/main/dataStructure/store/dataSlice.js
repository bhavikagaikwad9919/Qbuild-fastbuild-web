import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import constants from "app/main/config/constants";

const name = "dataStructure";

export const updateData = createAsyncThunk(`${name}/updateData`, async ({ id, values }) => {
  const response = await axios.post(`${constants.BASE_URL}/data/${id}/updateData`,{values :values });
  const data = await response.data.data;
  return data;
});

export const addData = createAsyncThunk(`${name}/addData`, async ({ values }) => {
  const response = await axios.post(`${constants.BASE_URL}/data/add/Data`,{values :values });
  const data = await response.data.data;
  return data;
});

export const getData = createAsyncThunk(`${name}/getData`, async () => {
  const response = await axios.get(`${constants.BASE_URL}/data/getData`);
  const data = await response.data.data;
  return data;
});

const dataSlice = createSlice({
  name: name,
  initialState: {
    allData: [],
    teamRoles: [],
    plansType: [],
    taskTitle: [],
    agencyType: [],
    laborRole: [],
    equipmentType: [],
    gradeType: []
  },
  extraReducers: {
    [getData.fulfilled]: (state, action) => {
      if(action.payload === undefined){
        state.allData = [];
        state.teamRoles = [];
        state.plansType = [];
        state.taskTitle = [];
        state.agencyType = [];
        state.laborRole = [];
        state.equipmentType = [];
        state.gradeType = [];
      }else{
        state.allData = action.payload;
        if(action.payload.length > 0){
          state.teamRoles = action.payload[0].teamRoles;
          state.plansType = action.payload[0].plansType;
          state.taskTitle = action.payload[0].taskTitle;
          state.agencyType = action.payload[0].agencyType;
          state.laborRole = action.payload[0].laborRole;
          state.equipmentType = action.payload[0].equipmentType;
          state.gradeType = action.payload[0].gradeType;
        }else{
          state.teamRoles = [];
          state.plansType = [];
          state.taskTitle = [];
          state.agencyType = [];
          state.laborRole = [];
          state.equipmentType = [];
          state.gradeType = [];
        }
      }   
    },
  },
});

export default dataSlice.reducer;
