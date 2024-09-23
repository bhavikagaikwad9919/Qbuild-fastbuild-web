import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import OrganizationService from "app/services/OrganizationService";
import ProjectService from "app/services/ProjectService";
import { dispatchSuccessMessage, dispatchErrorMessage } from "app/utils/MessageDispatcher";

const name = "organizations";

export const getProjects = createAsyncThunk(`${name}/getProjects`, async () => {
  try {
    let response = await ProjectService.getProjects();
    if (response.code === 200) {
      return response.data;
    }
  } catch (e) {
    // dispatchErrorMessage(dispatch, e.message);
  }
});

export const addOrganization = createAsyncThunk(
  `${name}/addOrganization`,
  async ({values, userId }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await OrganizationService.addOrganization(values, userId);
      if (response.code === 200) {
        dispatch(getOrganizations(userId));
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

export const getOrganizationsForAdmin = createAsyncThunk(
  `${name}/getOrganizationsForAdmin`,
  async () => {
    try {
      const response = await OrganizationService.getOrganizationsForAdmin();
      if (response.code === 200) {
        return response.data;
      }
    } catch (e) {
      //dispatchErrorMessage(dispatch, e.message);
      //dispatch(loadingFalse());
    }
  }
);

export const getOrganizations = createAsyncThunk(
  `${name}/getOrganizations`,
  async ( userId , { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await OrganizationService.getOrganizations(userId);
      if (response.code === 200) {
      //  dispatchSuccessMessage(dispatch, response.message);
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

export const getOrganization = createAsyncThunk(
  `${name}/getOrganization`,
  async ({ OrganizationId } , { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await OrganizationService.getOrganization(OrganizationId);
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

export const updateOrganization = createAsyncThunk(
  `${name}/updateOrganization`,
  async ({ values, organizationId },{ dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await OrganizationService.updateOrganization(values, organizationId);
      if (response.code === 200) {
        dispatch(getOrganization({ OrganizationId : organizationId }));
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

export const updateDataStructure = createAsyncThunk(
  `${name}/updateDataStructure`,
  async ({id, values} , { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await OrganizationService.updateDataStructure(id, values);
      if (response.code === 200) {
        dispatch(getOrganization({ OrganizationId : id }));
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

//Members

export const listMember = createAsyncThunk(
  `${name}/listMember`,
  async ({ organizationId }, { dispatch }) => {
    try { 
      dispatch(loadingTrue());
      const response = await OrganizationService.listMember(organizationId);
      if (response.code === 200) {
        dispatch(getOrganization({OrganizationId:organizationId }));
        dispatch(loadingFalse());
        //dispatchSuccessMessage(dispatch, response.message);
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

export const addMember = createAsyncThunk(
  `${name}/addMember`,
  async ({ organizationId, member }, { dispatch }) => {
    try { 
      dispatch(loadingTrue());
      const response = await OrganizationService.addMember(organizationId, member);
      if (response.code === 200) {
        dispatch(listMember({organizationId:organizationId }));
        dispatch(getOrganization({OrganizationId:organizationId }));
        dispatch(loadingFalse());
        dispatchSuccessMessage(dispatch, response.message);
        return response;
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

export const updateMember = createAsyncThunk(
  `${name}/updateMember`,
  async ({ organizationId, memberId, member }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await OrganizationService.updateMember(
        organizationId,
        memberId,
        member
      );
      if (response.code === 200) {
        dispatch(listMember({organizationId:organizationId }));
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

export const deleteMember = createAsyncThunk(
  `${name}/deleteMember`,
  async ({ organizationId, memberId }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await OrganizationService.deleteMember(organizationId, memberId);
      if (response.code === 200) {
        dispatch(listMember({organizationId:organizationId }));
        dispatch(loadingFalse());
        dispatchSuccessMessage(dispatch, response.message);
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

export const verifyMember = createAsyncThunk(
  `${name}/verifyMember`,
  async ({ userId, code }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await OrganizationService.verifyMember(userId, code);
      if (response.code === 200) {
        dispatch(loadingFalse());
        dispatchSuccessMessage(dispatch, response.message);
        return response;
      } else {
        dispatch(loadingFalse());
        dispatchErrorMessage(dispatch, response.message);
        return response;
      }
    } catch (e) {
      dispatch(loadingFalse());
      dispatchErrorMessage(dispatch, e.message);
    }
  }
);

//Sites

export const listSite = createAsyncThunk(
  `${name}/listSite`,
  async ({ organizationId }, { dispatch }) => {
    try { 
      dispatch(loadingTrue());
      const response = await OrganizationService.listSite(organizationId);
      if (response.code === 200) {
        dispatch(getOrganization({OrganizationId:organizationId }));
        dispatch(loadingFalse());
        //dispatchSuccessMessage(dispatch, response.message);
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

export const addSite = createAsyncThunk(
  `${name}/addSite`,
  async ({ organizationId, site }, { dispatch }) => {
    try { 
      dispatch(loadingTrue());
      const response = await OrganizationService.addSite(organizationId, site);
      if (response.code === 200) {
        dispatch(listSite({organizationId:organizationId }));
        dispatch(loadingFalse());
        dispatchSuccessMessage(dispatch, response.message);
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
        dispatch(listSite({organizationId:organizationId }));
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

export const deleteSite = createAsyncThunk(
  `${name}/deleteSite`,
  async ({ organizationId, siteId }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await OrganizationService.deleteSite(organizationId, siteId);
      if (response.code === 200) {
        dispatch(listSite({organizationId:organizationId }));
        dispatch(loadingFalse());
        dispatchSuccessMessage(dispatch, response.message);
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

export const getAgencies = createAsyncThunk(
  `${name}/getAgencies`,
  async (organizationId, { dispatch }) => {
    try {
      const response = await OrganizationService.getAgencies(organizationId);
      if (response.code === 200) {
        return response.data.data;
      } else if (response.message === 'Something went wrong') {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
      } else {
        dispatchErrorMessage(dispatch, response.message);
      }
    } catch (e) {
      if(e.message === "Cannot read properties of undefined (reading 'status')"){
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
      }else{
        dispatchErrorMessage(dispatch, e.message);
      }
    }
  }
);

export const detailAgency = createAsyncThunk(
  `${name}/detailAgency`,
  async (agencyId, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await OrganizationService.detailAgency(agencyId);
      if (response.code === 200) {
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

export const addAgency = createAsyncThunk(
  `${name}/addAgency`,
  async ({ organizationId, form }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await OrganizationService.addAgency(organizationId, form);
      if (response.code === 200) {
        dispatch(getAgencies(organizationId));
        dispatchSuccessMessage(dispatch, response.message);
        dispatch(loadingFalse());
      } else if (response.message === 'Something went wrong') {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
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

export const updateAgency = createAsyncThunk(
  `${name}/updateAgency`,
  async ({ organizationId, agencyId, data }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await OrganizationService.updateAgency(agencyId, data);
      if (response.code === 200) {
        dispatch(detailAgency(agencyId));
        dispatch(getAgencies(organizationId));
        dispatchSuccessMessage(dispatch, response.message);
        dispatch(loadingFalse());
      } else if (response.message === 'Something went wrong') {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
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

const organizationSlice = createSlice({
  name: name,
  initialState: {
    entities: [],
    project: [],
    projects: [],
    allProjects: [],
    ownedOrganizations:[],
    associatedOrganizations:[],
    details: "",
    organization:"",
    ownedProjects:[],
    associatedProjects:[],
    members:[],
    sites: [],
    agency: [],
    dataStructure : {
      laborRole: [],
    },
    agencyDetails: "",
    routes: "Members",
    loading: false,
    orgDialog: {
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
        state.orgDialog = {
          Dialogtype: "new",
          props: {
            open: true,
          },
          data: action.payload,
        };
      } else {
        state.orgDialog = {
          Dialogtype: "new",
          props: {
            open: true,
          },
          data: null,
        };
      }

    },
    closeNewDialog: (state, action) => {
      state.orgDialog = {
        Dialogtype: "new",
        props: {
          open: false,
        },
        data: null,
      };
    },
    openEditDialog: (state, action) => {
      state.orgDialog = {
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
        state.orgDialog = {
          Dialogtype: "edit",
          props: {
            open: false,
          },
          data: null,
        };
      }else if(action.payload.type !== undefined){
        state.orgDialog = {
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
      state.organization = "";
      state.projects = [];
      state.ownedProjects = [];
      state.associatedProjects = [];
      state.members = [];
      state.routes = "Members";
      state.loading =  false;
      state.orgDialog = {
        Dialogtype: "new",
        props: {
          open: false,
        },
        data: null,
      };
    },
  },
  extraReducers: {
    [getProjects.fulfilled]: (state, action) => {
      if(action.payload === undefined){
        state.project = [];
      }else{
        state.project = action.payload;
      }
    },
    [getOrganizations.fulfilled]: (state, action) => {
      if(action.payload === undefined){
        state.entities = [];
        state.ownedOrganizations = [];
        state.associatedOrganizations = [];
      }else{
        state.entities = action.payload;
        state.ownedOrganizations = action.payload.ownedOrganizations;
        state.associatedOrganizations = action.payload.associatedOrganizations;
      }
    },
    [getOrganizationsForAdmin.fulfilled]: (state, action) => {
      if(action.payload === undefined){
        state.entities = [];
      }else{
        state.entities = action.payload;
      }
    },
    [getOrganization.fulfilled]: (state, action) => {
      if(action.payload === undefined){
        state.details = [];
        state.organization = "";
        state.ownedProjects = [];
        state.associatedProjects = [];
        state.projects = [];
        state.dataStructure = {
          laborRole: [],
        };;
        //state.routes = "Members";
      }else{
        state.details = action.payload;

        if(action.payload.Organization === undefined){
          state.organization = [];
          state.members = [];
        }else {
          state.organization = action.payload.Organization;
        }

        state.ownedProjects = action.payload.owned;
        state.associatedProjects = action.payload.associated;
        if(action.payload.OrgProjects === undefined){
          state.projects = []
        }else{
          state.projects = action.payload.OrgProjects;
        } 

        if(action.payload.allProjects === undefined){
          state.allProjects = []
        }else{
          state.allProjects = action.payload.allProjects;
        } 

        if(action.payload.Organization.dataStructure === undefined){
          state.dataStructure = {
            laborRole: [],
          };
        }else{
          state.dataStructure = action.payload.Organization.dataStructure;
        } 
        
       // state.routes = "Members";
      }
    },
    [listSite.fulfilled]: (state, action) => {
      if(action.payload === undefined){
        state.sites = [];
      }else{
        state.sites = action.payload;
      }
    },
    [listMember.fulfilled]: (state, action) => {
      if(action.payload === undefined){
        state.members= [];
        state.routes = "Members";
      }else{
        state.members = action.payload;
        state.routes = "Members";
      }
    },
    [getAgencies.fulfilled]: (state, action) => {
      if(action.payload === undefined){
        state.agency = [];
      }else{
        state.agency = action.payload;
      }
    },
    [detailAgency.fulfilled]: (state, action) => {
      if(action.payload === undefined){
        state.agencyDetails = "";
      }else{
        state.agencyDetails = action.payload;
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
} = organizationSlice.actions;

export default organizationSlice.reducer;
