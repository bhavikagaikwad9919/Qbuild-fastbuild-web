import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import OrganizationService from "app/services/OrganizationService";
import {
  dispatchSuccessMessage,
  dispatchErrorMessage,
  dispatchWarningMessage,
} from "app/utils/MessageDispatcher";
import moment from "moment";

const name = "sites";

export const getSite = createAsyncThunk(
  `${name}/getSite`,
  async ({ OrganizationId, SiteId } , { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await OrganizationService.getSite(OrganizationId,SiteId);
      if (response.code === 200) {
       // dispatchSuccessMessage(dispatch, response.message);
        dispatch(loadingFalse());
        return response.data;
      } else if (response.message === 'Something went wrong') {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      dispatchErrorMessage(dispatch, e.message);
      dispatch(loadingFalse());
    }
  }
);

export const updateSite = createAsyncThunk(
  `${name}/updateSite`,
  async ({ organizationId, siteId, site }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await OrganizationService.updateSite(
        organizationId,
        siteId,
        site
      );
      if (response.code === 200) {
        dispatch(getSite({OrganizationId:organizationId, SiteId:siteId }));
        dispatchSuccessMessage(dispatch, response.message);
        dispatch(loadingFalse());
        return response.data;
      } else {
        dispatch(loadingFalse());
        dispatchErrorMessage(dispatch, response.message);
      }
    } catch (e) {
      dispatch(loadingFalse());
      dispatchErrorMessage(dispatch, e.message);
    }
  }
);

export const updateDataStructure = createAsyncThunk(
  `${name}/updateDataStructure`,
  async ({organizationId, siteId, values} , { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await OrganizationService.updateSiteDataStructure(organizationId, siteId, values);
      if (response.code === 200) {
        dispatch(getSite({OrganizationId:organizationId, SiteId:siteId }));
        dispatchSuccessMessage(dispatch, response.message);
        dispatch(loadingFalse());
        return response.data;
      } else if (response.message === 'Something went wrong') {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      dispatchErrorMessage(dispatch, e.message);
      dispatch(loadingFalse());
    }
  }
);

export const downloadEquipmentExcelReport = createAsyncThunk(
  `${name}/downloadEquipementExcelReport`,
  async ({ organizationId, siteId, userId, siteName, filters }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await OrganizationService.downloadEquipmentExcelReport(
        organizationId,
        siteId,
        userId,
        siteName,
        filters
      );
      let startDate;
      if (filters.startDate === "Since Inception") {
        startDate = "Since Inception";
      } else {
        startDate = moment(filters.startDate).format("DD-MM-YYYY");
      }
      let endDate = moment(filters.endDate).format("DD-MM-YYYY");
      var arr = new Uint8Array(response.data);
      var str = String.fromCharCode.apply(String, arr);
      if (/[\u0080-\uffff]/.test(str)) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `${siteName} ${startDate} to ${endDate} Equipment Report.xlsx`
        );
        document.body.appendChild(link);
        link.click();
        dispatch(loadingFalse());
      } else {
        str = JSON.parse(str);
        dispatchWarningMessage(dispatch, str.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if(e.message === "Cannot read properties of undefined (reading 'status')"){
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      }else{
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const downloadConsumptionExcelReport = createAsyncThunk(
  `${name}/downloadConsumptionExcelReport`,
  async ({ organizationId, siteId, userId, siteName, filters }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await OrganizationService.downloadConsumptionExcelReport(
        organizationId,
        siteId,
        userId,
        siteName,
        filters
      );
      let startDate;
      if (filters.startDate === "Since Inception") {
        startDate = "Since Inception";
      } else {
        startDate = moment(filters.startDate).format("DD-MM-YYYY");
      }
      let endDate = moment(filters.endDate).format("DD-MM-YYYY");
      var arr = new Uint8Array(response.data);
      var str = String.fromCharCode.apply(String, arr);
      if (/[\u0080-\uffff]/.test(str)) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `${siteName} ${startDate} to ${endDate} consumption Report.xlsx`
        );
        document.body.appendChild(link);
        link.click();
        dispatch(loadingFalse());
      } else {
        str = JSON.parse(str);
        dispatchWarningMessage(dispatch, str.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if(e.message === "Cannot read properties of undefined (reading 'status')"){
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      }else{
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

const sitesSlice = createSlice({
    name: name,
    initialState: {
      entities: [],
      details: "",
      ownedProjects:[],
      associatedProjects:[],
      members:[],
      dataStructure : {
        laborRole: [],
        equipmentType: [],
        gradeType: [],
        buildings: [],
      },
      routes: "Projects",
      loading: false,
      siteDialog: {
        Dialogtype: "new",
        props: {
          open: false,
        },
        data: null,
      },
    },
    reducers:{
      loadingTrue: (state) => {
        state.loading = true;
      },
      loadingFalse: (state) => {
        state.loading = false;
      },
      openNewDialog: (state, action) => {
        if (action.payload !== undefined) {
          state.siteDialog = {
            Dialogtype: "new",
            props: {
              open: true,
            },
            data: action.payload,
          };
        } else {
          state.siteDialog = {
            Dialogtype: "new",
            props: {
              open: true,
            },
            data: null,
          };
        }
  
      },
      closeNewDialog: (state, action) => {
        state.siteDialog = {
          Dialogtype: "new",
          props: {
            open: false,
          },
          data: null,
        };
      },
      openEditDialog: (state, action) => {
        state.siteDialog = {
          Dialogtype: "edit",
          props: {
            open: true,
          },
          data: action.payload,
        };
      },
      closeEditDialog: (state, action) => {
        if(action.payload === undefined)
        {
          state.siteDialog = {
            Dialogtype: "edit",
            props: {
              open: false,
            },
            data: null,
          };
        }else if(action.payload.type !== undefined){
          state.siteDialog = {
            Dialogtype: "edit",
            props: {
              open: true,
            },
            data: action.payload.payload,
          };
        }
       
      },
      routes: (state, action) => {
        state.routes = action.payload;
      },
      back: (state, action) =>{
        state.details = "";
        state.ownedProjects = [];
        state.associatedProjects = [];
        state.members = [];
        state.routes = "Projects";
        state.loading =  false;
        state.siteDialog = {
          Dialogtype: "new",
          props: {
            open: false,
          },
          data: null,
        };
      },
    },
    extraReducers: {
      [getSite.fulfilled]: (state, action) => {
        if(action.payload === undefined){
          state.details = "";
          state.ownedProjects = [];
          state.associatedProjects = [];
          state.dataStructure = {
            laborRole: [],
            equipmentType: [],
            gradeType: [],
            buildings: [],
          };
        }else{
          state.details = action.payload.site;
          state.ownedProjects = action.payload.owned;
          state.associatedProjects = action.payload.associated;
          if(action.payload.site.dataStructure === undefined){
            state.dataStructure = {
              laborRole: [],
              equipmentType: [],
              gradeType: [],
              buildings: [],
            };
          }else{
            state.dataStructure = action.payload.site.dataStructure;
          } 
        }
      },
    },
  });
  
  export const {
    loadingTrue,
    loadingFalse,
    openNewDialog,
    closeNewDialog,
    openEditDialog,
    closeEditDialog,
    routes,
    back
  } = sitesSlice.actions;
  
  export default sitesSlice.reducer;