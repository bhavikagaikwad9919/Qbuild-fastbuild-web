import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import _ from "@lodash";
import {
  dispatchSuccessMessage,
  dispatchErrorMessage,
  dispatchWarningMessage,
} from "app/utils/MessageDispatcher";
import constants from "app/main/config/constants";
import ProjectService from "app/services/ProjectService";
//import { navigateTo } from "app/utils/Navigator";
import moment from "moment";
import history from "@history";
const name = "projects";

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

export const getAllProjects = createAsyncThunk(
  `${name}/getAllProjects`,
  async () => {
    try {
      let response = await ProjectService.getAllProjects();
      if (response.code === 200) {
        return response.data;
      }
    } catch (e) {
      // dispatchErrorMessage(dispatch, e.message);
    }
  }
);

export const getProject = createAsyncThunk(
  `${name}/getProject`,
  async (projectId, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.getProject(projectId);
      if (response.code === 200) {
        dispatch(loadingFalse());
        return response.data;
      } else {
        dispatch(loadingFalse());
        dispatchErrorMessage(dispatch, response.message);
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const createProject = createAsyncThunk(
  `${name}/createProject`,
  async (project, { dispatch }) => {
    try {
      let response = await ProjectService.addProject(project);
      if (response.code === 200) {
        dispatchSuccessMessage(dispatch, response.message);
        // ("/projects");navigateTo
        return response;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
      } else {
        dispatchErrorMessage(dispatch, response.message);
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
      } else {
        dispatchErrorMessage(dispatch, e.message);
      }
    }
  }
);

export const addProject = createAsyncThunk(
  `${name}/addProject`,
  async (project, { dispatch }) => {
    try {
      let response = await ProjectService.addProject(project);
      if (response.code === 200) {
        dispatchSuccessMessage(dispatch, response.message);
        //navigateTo("/projects");
        return response;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
      } else {
        dispatchErrorMessage(dispatch, response.message);
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const updateProjectDetails = createAsyncThunk(
  `${name}/updateProjectDetails`,
  async ({ projectId, form }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.updateProjectDetails(
        projectId,
        form
      );
      if (response.code === 200) {
        dispatch(getProject(projectId));
        //window.location.reload(false);
        dispatchSuccessMessage(dispatch, response.message);
        return response.data;
      } else {
        dispatch(loadingFalse());
        dispatchErrorMessage(dispatch, response.message);
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const deleteProject = createAsyncThunk(
  `${name}/deleteProject`,
  async ({ projectId, deleteServer }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      let response = await ProjectService.deleteProject(
        projectId,
        deleteServer
      );
      if (response.code === 200) {
        dispatch(loadingFalse());
        dispatchSuccessMessage(dispatch, response.message);
        history.goBack();
      } else {
        dispatch(loadingFalse());
        dispatchErrorMessage(dispatch, response.message);
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

// export const exportProject = createAsyncThunk(
//   `${name}/exportProject`,
//   async ({ projectId, projectName,deleteServer}, { dispatch }) => {
//     try {
//       dispatch(loadingTrue());
//       const response = await ProjectService.exportProject(projectId);

//       if (response.status === 200) {
//         const url = window.URL.createObjectURL(new Blob([response.data]), { type: 'application/zip' });
//         const link = document.createElement("a");
//         link.href = url;
//         link.setAttribute("download", `${projectName}.zip`);
//         document.body.appendChild(link);
//         link.click();
//         dispatchSuccessMessage(dispatch, "Project Exported Successfully.");
//         await dispatch(deleteProject({projectId,deleteServer}))
//         dispatch(loadingFalse());
//       } else if (response.statusText !== 'OK') {
//         dispatch(loadingFalse());
//         dispatchErrorMessage(dispatch, "Oops... Network Issue.");
//       } else {
//         dispatch(loadingFalse());
//         dispatchErrorMessage(dispatch, response.statusText);
//       }

//     } catch (e) {
//       dispatch(loadingFalse());
//       dispatchErrorMessage(dispatch, e.message);
//     }
//   }
// );

export const exportItemDocument = createAsyncThunk(
  `${name}/exportItemDocument`,
  async (
    { projectId, itemId, itemName, documents, projectName, checklistTitle },
    { dispatch }
  ) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.exportItemDocument(
        projectId,
        itemId,
        itemName,
        documents
      );
      if (response.status === 200) {
        const url = window.URL.createObjectURL(new Blob([response.data]), {
          type: "application/zip",
        });
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `${projectName}-${checklistTitle}-${itemName}.zip`
        );
        document.body.appendChild(link);
        link.click();
        dispatchSuccessMessage(dispatch, "Documents Exported Successfully.");
        dispatch(loadingFalse());
      } else if (response.statusText !== "OK") {
        dispatch(loadingFalse());
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
      } else {
        dispatch(loadingFalse());
        dispatchErrorMessage(dispatch, response.statusText);
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const dashboard = createAsyncThunk(
  `${name}/dashbord`,
  async (projectId, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.dashboard(projectId);
      if (response.code === 200) {
        dispatch(loadingFalse());
        return response.data;
      } else {
        dispatch(loadingFalse());
        dispatchErrorMessage(dispatch, response.message);
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const addBuildingAreas = createAsyncThunk(
  `${name}/addBuildingAreas`,
  async ({ projectId, form }, { dispatch }) => {
    try {
      const response = await ProjectService.addBuildingAreas(projectId, form);
      if (response.code === 200) {
        dispatch(getProject(projectId));
        dispatchSuccessMessage(dispatch, response.message);
        return response.data;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
      } else {
        dispatchErrorMessage(dispatch, response.message);
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
      } else {
        dispatchErrorMessage(dispatch, e.message);
      }
    }
  }
);

export const deleteBuildingAreas = createAsyncThunk(
  `${name}/deleteBuildingAreas`,
  async ({ projectId, form }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.deleteBuildingAreas(
        projectId,
        form
      );
      if (response.code === 200) {
        dispatch(getProject(projectId));
        dispatchSuccessMessage(dispatch, response.message);
        return response.data;
      } else {
        dispatch(loadingFalse());
        dispatchErrorMessage(dispatch, response.message);
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const addTeam = createAsyncThunk(
  `${name}/addTeam`,
  async ({ projectId, team }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.addTeam(projectId, team);
      if (response.code === 200) {
        dispatch(getProject(projectId));
        dispatch(loadingFalse());
        dispatchSuccessMessage(dispatch, response.message);
        return response.data;
      } else {
        dispatch(loadingFalse());
        dispatchErrorMessage(dispatch, response.message);
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const updateTeam = createAsyncThunk(
  `${name}/updateTeam`,
  async ({ projectId, memberId, team }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.updateTeam(
        projectId,
        memberId,
        team
      );
      if (response.code === 200) {
        dispatch(getProject(projectId));
        dispatch(loadingFalse());
        return response.data;
      } else {
        dispatch(loadingFalse());
        dispatchErrorMessage(dispatch, response.message);
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const deleteTeam = createAsyncThunk(
  `${name}/deleteTeam`,
  async ({ projectId, memberId }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.deleteTeam(projectId, memberId);
      if (response.code === 200) {
        dispatch(getProject(projectId));
        dispatch(loadingFalse());
        dispatchSuccessMessage(dispatch, response.message);
        return response.data;
      } else {
        dispatch(loadingFalse());
        dispatchErrorMessage(dispatch, response.message);
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const getPlans = createAsyncThunk(`${name}/getPlans`, async (params) => {
  const response = await axios.get(
    `${constants.BASE_URL}/projects/${params}/plan`
  );
  const data = await response.data;
  return data;
});

export const getPlanDetails = createAsyncThunk(
  `${name}/getPlanDetails`,
  async ({ projectId, planId }, { dispatch }) => {
    try {
      const response = await ProjectService.getPlanDetails(projectId, planId);
      if (response.code === 200) {
        return response;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
      } else {
        dispatchErrorMessage(dispatch, response.message);
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
      } else {
        dispatchErrorMessage(dispatch, e.message);
      }
    }
  }
);

export const assignPlan = createAsyncThunk(
  `${name}/assignPlan`,
  async ({ projectId, planId, data }, { dispatch }) => {
    try {
      const response = await ProjectService.assignPlan(projectId, planId, data);
      if (response.code === 200) {
        dispatchSuccessMessage(dispatch, response.message);
        return response;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
      } else {
        dispatchErrorMessage(dispatch, response.message);
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
      } else {
        dispatchErrorMessage(dispatch, e.message);
      }
    }
  }
);

export const revisePlan = createAsyncThunk(
  `${name}/revisePlan`,
  async ({ projectId, planId, payload }, { dispatch }) => {
    try {
      const response = await ProjectService.revisePlan(
        projectId,
        planId,
        payload
      );
      if (response.code === 200) {
        dispatch(getProject(projectId));
        dispatchSuccessMessage(dispatch, response.message);
        return response;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
      } else {
        dispatchErrorMessage(dispatch, response.message);
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
      } else {
        dispatchErrorMessage(dispatch, e.message);
      }
    }
  }
);

export const addTask = createAsyncThunk(
  `${name}/addTask`,
  async ({ projectId, payload }, { dispatch }) => {
    try {
      const response = await ProjectService.addTask(projectId, payload);
      if (response.code === 200) {
        dispatch(getProject(projectId));
        dispatch(listTasks({ projectId }));
        dispatchSuccessMessage(dispatch, response.message);
        return response;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
      } else {
        dispatchErrorMessage(dispatch, response.message);
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
      } else {
        dispatchErrorMessage(dispatch, e.message);
      }
    }
  }
);

export const editTask = createAsyncThunk(
  `${name}/editTask`,
  async ({ projectId, taskId, payload }, { dispatch }) => {
    try {
      const response = await ProjectService.editTask(
        projectId,
        taskId,
        payload
      );
      if (response.code === 200) {
        dispatch(getProject(projectId));
        dispatch(listTasks({ projectId }));
        dispatchSuccessMessage(dispatch, response.message);
        return response;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
      } else {
        dispatchErrorMessage(dispatch, response.message);
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
      } else {
        dispatchErrorMessage(dispatch, e.message);
      }
    }
  }
);

export const deleteImageTask = createAsyncThunk(
  `${name}/deleteImageTask`,
  async ({ projectId, taskId, imageId }, { dispatch }) => {
    try {
      const response = await ProjectService.deleteImageTask(
        projectId,
        taskId,
        imageId
      );
      if (response.code === 200) {
        dispatch(listTasks({ projectId }));
        dispatch(taskDetails({ projectId, taskId })).then((response) =>
          dispatch(openEditDialog(response.payload))
        );
        dispatchSuccessMessage(dispatch, response.message);
        return response;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
      } else {
        dispatchErrorMessage(dispatch, response.message);
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
      } else {
        dispatchErrorMessage(dispatch, e.message);
      }
    }
  }
);

export const uploadPlan = createAsyncThunk(
  `${name}/uploadPlan`,
  async ({ projectId, payload }, { dispatch }) => {
    try {
      const response = await ProjectService.uploadPlan(projectId, payload);
      if (response.code === 200) {
        dispatch(getProject(projectId));
        dispatchSuccessMessage(dispatch, response.message);
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
      } else {
        dispatchErrorMessage(dispatch, response.message);
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
      } else {
        dispatchErrorMessage(dispatch, e.message);
      }
    }
  }
);

export const updatePlan = createAsyncThunk(
  `${name}/updatePlan`,
  async ({ projectId, planId, form }, { dispatch }) => {
    try {
      const response = await ProjectService.updatePlan(projectId, planId, form);
      if (response.code === 200) {
        dispatch(getProject(projectId));
        dispatchSuccessMessage(dispatch, response.message);
        return response;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
      } else {
        dispatchErrorMessage(dispatch, response.message);
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
      } else {
        dispatchErrorMessage(dispatch, e.message);
      }
    }
  }
);

export const deletePlans = createAsyncThunk(
  `${name}/deletePlans`,
  async ({ projectId, ids }, { dispatch }) => {
    try {
      const response = await ProjectService.deletePlans(projectId, ids);
      if (response.code === 200) {
        dispatch(getProject(projectId));
        dispatch(listTasks({ projectId }));
        dispatchSuccessMessage(dispatch, response.message);
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
      } else {
        dispatchErrorMessage(dispatch, response.message);
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
      } else {
        dispatchErrorMessage(dispatch, e.message);
      }
    }
  }
);

export const supersedePlan = createAsyncThunk(
  `${name}/supersedePlan`,
  async ({ projectId, id }, { dispatch }) => {
    try {
      const response = await ProjectService.supersedePlan(projectId, id);
      if (response.code === 200) {
        dispatch(getProject(projectId));
        dispatch(listTasks({ projectId }));
        dispatchSuccessMessage(dispatch, response.message);
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
      } else {
        dispatchErrorMessage(dispatch, response.message);
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
      } else {
        dispatchErrorMessage(dispatch, e.message);
      }
    }
  }
);

export const convertToImage = createAsyncThunk(
  `${name}/convertToImage`,
  async (file, { dispatch }) => {
    try {
      const payload = new FormData();
      payload.append("plan", file);
      const response = await ProjectService.pdfToImage(payload);
      if (response.code === 200) {
        return response.data;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
      } else {
        dispatchErrorMessage(dispatch, response.message);
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
      } else {
        dispatchErrorMessage(dispatch, e.message);
      }
    }
  }
);

export const listTasks = createAsyncThunk(
  `${name}/listTasks`,
  async ({ projectId, filter }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.listTasks(projectId, filter);
      if (response.code === 200) {
        dispatch(loadingFalse());
        return response.data;
      } else {
        dispatch(loadingFalse());
        dispatchErrorMessage(dispatch, response.message);
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const taskDetails = createAsyncThunk(
  `${name}/taskDetails`,
  async ({ projectId, taskId }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.taskDetails(projectId, taskId);
      if (response.code === 200) {
        dispatch(loadingFalse());
        return response.data[0];
      } else {
        dispatch(loadingFalse());
        dispatchErrorMessage(dispatch, response.message);
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const resolveIssue = createAsyncThunk(
  `${name}/resoveIssue`,
  async ({ projectId, taskId, status, completion }, { dispatch }) => {
    try {
      // dispatch(loadingTrue());
      const response = await ProjectService.resolveIssue(
        projectId,
        taskId,
        status,
        completion
      );
      if (response.code === 200) {
        dispatch(getProject(projectId));
        dispatch(listTasks({ projectId }));
        dispatch(loadingFalse());
        dispatchSuccessMessage(dispatch, response.message);
        dispatch(taskDetails({ projectId, taskId })).then((response) => {
          dispatch(openEditDialog(response.payload));
        });
        dispatch(listTasks({ projectId }));
        return response.data;
      } else {
        dispatch(loadingFalse());
        dispatchErrorMessage(dispatch, response.message);
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const deleteTasks = createAsyncThunk(
  `${name}/deleteTasks`,
  async ({ projectId, values }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.deleteTasks(projectId, values);
      if (response.code === 200) {
        dispatch(listTasks({ projectId }));
        dispatchSuccessMessage(dispatch, response.message);
        dispatch(loadingFalse());
        return response.data;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const listInventories = createAsyncThunk(
  `${name}/listInventories`,
  async (projectId, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.listInventories(projectId);
      if (response.code === 200) {
        dispatch(loadingFalse());
        return response.data;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const getInventory = createAsyncThunk(
  `${name}/getInventory`,
  async ({ projectId, inventoryId }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.getInventory(
        projectId,
        inventoryId
      );
      if (response.code === 200) {
        dispatch(loadingFalse());
        return response.data;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const addInventory = createAsyncThunk(
  `${name}/addInventory`,
  async (
    { projectId, type, unit, brand, supplier, threshold },
    { dispatch }
  ) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.addInventory(
        projectId,
        type,
        unit,
        brand,
        supplier,
        threshold
      );
      if (response.code === 200) {
        dispatch(loadingFalse());
        dispatch(listInventories(projectId));
        dispatchSuccessMessage(dispatch, response.message);
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const updateDetailInventory = createAsyncThunk(
  `${name}/updateDetailInventory`,
  async ({ projectId, inventoryId, form }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.updateDetailInventory(
        projectId,
        inventoryId,
        form
      );
      if (response.code === 200) {
        dispatch(loadingFalse());
        dispatch(listInventories(projectId));
        dispatchSuccessMessage(dispatch, response.message);
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const updateInventory = createAsyncThunk(
  `${name}/updateInventory`,
  async ({ projectId, inventoryId, type, values }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.updateInventory(
        projectId,
        inventoryId,
        type,
        values
      );
      if (response.code === 200) {
        dispatch(loadingFalse());
        dispatch(getReports(projectId));
        dispatch(listInventories(projectId))
          .then(() => {
            dispatch(getInventory({ projectId, inventoryId }));
          })
          .then(() => {
            dispatchSuccessMessage(dispatch, response.message);
          });
        return response.data;
      } else {
        dispatch(loadingFalse());
        dispatchErrorMessage(dispatch, response.message);
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

// export const importInventoryTransactions = createAsyncThunk(
//   `${name}/importInventoryTransactions`,
//   async ({ projectId,inventoryId, payload }, { dispatch }) => {
//     try {
//       dispatch(loadingTrue());
//       const response = await ProjectService.importInventoryTransactions(projectId, inventoryId, payload);
//       if (response.code === 200) {
//         dispatch(listInventories(projectId));
//         dispatchSuccessMessage(dispatch, response.message);
//         dispatch(loadingFalse());
//       } else if (response.message === 'Something went wrong') {
//         dispatchErrorMessage(dispatch, "Oops... Network Issue.");
//         dispatch(loadingFalse());
//       } else {
//         dispatchErrorMessage(dispatch, response.message);
//         dispatch(loadingFalse());
//       }
//     } catch (e) {
//       dispatchErrorMessage(dispatch, e.message);
//       dispatch(loadingFalse());
//     }
//   }
// );

export const importInventory = createAsyncThunk(
  `${name}/importInventory`,
  async ({ projectId, payload }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.importInventory(projectId, payload);
      if (response.code === 200) {
        dispatch(listInventories(projectId));
        dispatchSuccessMessage(dispatch, response.message);
        dispatch(loadingFalse());
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

// export const importTransactions = createAsyncThunk(
//   `${name}/importTransactions`,
//   async ({ projectId, inventoryId, payload }, { dispatch }) => {
//     try {
//       dispatch(loadingTrue());
//       const response = await ProjectService.importTransactions(projectId, inventoryId, payload);
//       if (response.code === 200) {
//         dispatch(listInventories(projectId));
//         dispatch(getReports(projectId));
//         dispatch(listInventories(projectId))
//           .then(() => {
//             dispatch(getInventory({ projectId, inventoryId }));
//           })
//           .then(() => {
//             dispatchSuccessMessage(dispatch, response.message);
//           });
//         dispatchSuccessMessage(dispatch, response.message);
//         dispatch(loadingFalse());
//       } else if (response.message === 'Something went wrong') {
//         dispatchErrorMessage(dispatch, "Oops... Network Issue.");
//         dispatch(loadingFalse());
//       } else {
//         dispatchErrorMessage(dispatch, response.message);
//         dispatch(loadingFalse());
//       }
//     } catch (e) {
//       dispatchErrorMessage(dispatch, e.message);
//       dispatch(loadingFalse());
//     }
//   }
// );

// export const importDailyDataEntries = createAsyncThunk(
//   `${name}/importDailyDataEntries`,
//   async ({ projectId, payload }, { dispatch }) => {
//     try {
//       dispatch(loadingTrue());
//       const response = await ProjectService.importDailyDataEntries(projectId, payload);
//       if (response.code === 200) {
//         dispatch(getReports(projectId));
//         dispatchSuccessMessage(dispatch, response.message);
//         dispatch(loadingFalse());
//       } else if (response.message === 'Something went wrong') {
//         dispatchErrorMessage(dispatch, "Oops... Network Issue.");
//         dispatch(loadingFalse());
//       } else {
//         dispatchErrorMessage(dispatch, response.message);
//         dispatch(loadingFalse());
//       }
//     } catch (e) {
//       dispatchErrorMessage(dispatch, e.message);
//       dispatch(loadingFalse());
//     }
//   }
// );

// export const importCubeEntries = createAsyncThunk(
//   `${name}/importCubeEntries`,
//   async ({ projectId, payload }, { dispatch }) => {
//     try {
//       dispatch(loadingTrue());
//       const response = await ProjectService.importCubeEntries(projectId, payload);
//       if (response.code === 200) {
//         dispatch(getCubeRegister(projectId));
//         dispatchSuccessMessage(dispatch, response.message);
//         dispatch(loadingFalse());
//       } else if (response.message === 'Something went wrong') {
//         dispatchErrorMessage(dispatch, "Oops... Network Issue.");
//         dispatch(loadingFalse());
//       } else {
//         dispatchErrorMessage(dispatch, response.message);
//         dispatch(loadingFalse());
//       }
//     } catch (e) {
//       dispatchErrorMessage(dispatch, e.message);
//       dispatch(loadingFalse());
//     }
//   }
// );

export const exportInventory = createAsyncThunk(
  `${name}/exportInventory`,
  async ({ projectId, projectName }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.exportInventory(projectId);
      // if (response.code === 200) {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `${projectName}-Inventory_Export_Report.csv`
      );
      document.body.appendChild(link);
      link.click();
      dispatch(loadingFalse());
      // } else if (response.message === 'Something went wrong') {
      //   dispatchErrorMessage(dispatch, "Oops... Network Issue.");
      //   dispatch(loadingFalse());
      // } else {
      //   dispatchErrorMessage(dispatch, response.message);
      //   dispatch(loadingFalse());
      // }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const deleteTransaction = createAsyncThunk(
  `${name}/deleteTransction`,
  async ({ projectId, inventoryId, transactionId }, { dispatch }) => {
    try {
      const response = await ProjectService.deleteTransaction(
        projectId,
        inventoryId,
        transactionId
      );
      if (response.code === 200) {
        dispatch(listInventories(projectId))
          .then(() => {
            dispatch(getInventory({ projectId, inventoryId }));
          })
          .then(() => {
            dispatchSuccessMessage(dispatch, response.message);
          });
        return response.data;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
      } else {
        dispatchErrorMessage(dispatch, response.message);
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
      } else {
        dispatchErrorMessage(dispatch, e.message);
      }
    }
  }
);

export const listDocuments = createAsyncThunk(
  `${name}/listDocuments`,
  async (projectId, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.listDocuments(projectId);
      if (response.code === 200) {
        dispatch(loadingFalse());
        return response.data;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const getDocument = createAsyncThunk(
  `${name}/getDocument`,
  async ({ projectId, documentId }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.getDocument(projectId, documentId);
      if (response.code === 200) {
        dispatch(loadingFalse());
        return response.data;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const updateDocumentAcl = createAsyncThunk(
  `${name}/updateDocument`,
  async ({ projectId, documentId, ids }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.updateDocumentAcl(
        projectId,
        documentId,
        ids
      );
      if (response.code === 200) {
        dispatch(listDocuments(projectId));
        dispatch(getDocument({ projectId, documentId }));
        dispatch(loadingFalse());
        dispatchSuccessMessage(dispatch, response.message);
        return response.code;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const removeDocumentAcl = createAsyncThunk(
  `${name}/updateDocument`,
  async ({ projectId, documentId, id }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.removeDocumentAcl(
        projectId,
        documentId,
        id
      );
      if (response.code === 200) {
        dispatch(listDocuments(projectId));
        dispatch(getDocument({ projectId, documentId }));
        dispatch(loadingFalse());
        dispatchSuccessMessage(dispatch, response.message);
        return response.code;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const updateDocument = createAsyncThunk(
  `${name}/updateDocument`,
  async ({ projectId, documentId, form }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.updateDocument(
        projectId,
        documentId,
        form
      );
      if (response.code === 200) {
        dispatch(listDocuments(projectId));
        dispatch(listDocumentFolders(projectId));
        dispatch(loadingFalse());
        dispatchSuccessMessage(dispatch, response.message);
        return response.code;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const deleteDocument = createAsyncThunk(
  `${name}/deleteDocument`,
  async ({ projectId, documentId }, { dispatch }) => {
    try {
      const response = await ProjectService.deleteDocument(
        projectId,
        documentId
      );

      if (response.code === 200) {
        dispatch(getProject(projectId));
        dispatch(listDocuments(projectId));
        dispatchSuccessMessage(dispatch, response.message);
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
      } else {
        dispatchErrorMessage(dispatch, response.message);
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
      } else {
        dispatchErrorMessage(dispatch, e.message);
      }
    }
  }
);

export const listDocumentFolders = createAsyncThunk(
  `${name}/listDocumentFolders`,
  async (projectId, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.listDocumentFolders(projectId);
      if (response.code === 200) {
        dispatch(loadingFalse());
        return response.data;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const addDocumentFolder = createAsyncThunk(
  `${name}/addDocumentFolder`,
  async ({ projectId, folderName, folderId }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.addDocumentFolder(
        projectId,
        folderName,
        folderId
      );
      if (response.code === 200) {
        dispatch(loadingFalse());
        dispatch(listDocuments(projectId));
        dispatch(listDocumentFolders(projectId));
        dispatchSuccessMessage(dispatch, response.message);
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
      } else {
        dispatchErrorMessage(dispatch, response.message);
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
      } else {
        dispatchErrorMessage(dispatch, e.message);
      }
    }
  }
);

export const updateFolderName = createAsyncThunk(
  `${name}/updateFolderName`,
  async ({ projectId, folderId, folderName, subfolderId }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.updateFolderName(
        projectId,
        folderId,
        folderName,
        subfolderId
      );
      if (response.code === 200) {
        dispatch(loadingFalse());
        dispatch(listDocuments(projectId));
        dispatch(listDocumentFolders(projectId));
        dispatchSuccessMessage(dispatch, response.message);
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
      } else {
        dispatchErrorMessage(dispatch, response.message);
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
      } else {
        dispatchErrorMessage(dispatch, e.message);
      }
    }
  }
);

export const listDrawingFolders = createAsyncThunk(
  `${name}/listDrawingFolders`,
  async (projectId, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.listDrawingFolders(projectId);
      if (response.code === 200) {
        dispatch(loadingFalse());
        return response.data;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const addDrawingFolder = createAsyncThunk(
  `${name}/addDrawingFolder`,
  async ({ projectId, folderName, folderType }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.addDrawingFolder(
        projectId,
        folderName,
        folderType
      );
      if (response.code === 200) {
        dispatch(loadingFalse());
        //dispatch(listDrawings(projectId));
        dispatch(listDrawingFolders(projectId));
        dispatchSuccessMessage(dispatch, response.message);
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
      } else {
        dispatchErrorMessage(dispatch, response.message);
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
      } else {
        dispatchErrorMessage(dispatch, e.message);
      }
    }
  }
);

export const updateDrawingFolder = createAsyncThunk(
  `${name}/updateDrawingFolder`,
  async ({ projectId, folderId, folderName, folderType }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.updateDrawingFolder(
        projectId,
        folderId,
        folderName,
        folderType
      );
      if (response.code === 200) {
        dispatch(loadingFalse());
        //dispatch(listDrawings(projectId));
        dispatch(listDrawingFolders(projectId));
        dispatchSuccessMessage(dispatch, response.message);
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
      } else {
        dispatchErrorMessage(dispatch, response.message);
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
      } else {
        dispatchErrorMessage(dispatch, e.message);
      }
    }
  }
);

export const listDrawings = createAsyncThunk(
  `${name}/listDrawings`,
  async ({ projectId, folderId }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.listDrawings(projectId, folderId);
      if (response.code === 200) {
        dispatch(loadingFalse());
        return response.data;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const addDrawing = createAsyncThunk(
  `${name}/addDrawing`,
  async ({ projectId, folderId, data }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.addDrawing(
        projectId,
        folderId,
        data
      );
      if (response.code === 200) {
        dispatch(loadingFalse());
        dispatch(listDrawings({ projectId, folderId }));
        dispatchSuccessMessage(dispatch, response.message);
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
      } else {
        dispatchErrorMessage(dispatch, response.message);
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
      } else {
        dispatchErrorMessage(dispatch, e.message);
      }
    }
  }
);

export const detailDrawing = createAsyncThunk(
  `${name}/detailDrawing`,
  async ({ projectId, drawingId }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.detailDrawing(projectId, drawingId);
      if (response.code === 200) {
        dispatch(loadingFalse());
        return response.data;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const updateDrawing = createAsyncThunk(
  `${name}/updateDrawing`,
  async ({ projectId, drawingId, data, folderId }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.updateDrawing(
        projectId,
        drawingId,
        data,
        folderId
      );
      if (response.code === 200) {
        dispatch(loadingFalse());
        dispatch(listDrawings({ projectId, folderId }));
        dispatchSuccessMessage(dispatch, response.message);
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
      } else {
        dispatchErrorMessage(dispatch, response.message);
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
      } else {
        dispatchErrorMessage(dispatch, e.message);
      }
    }
  }
);

export const deleteDrawings = createAsyncThunk(
  `${name}/deleteDrawings`,
  async ({ projectId, folderId, ids }, { dispatch }) => {
    try {
      const response = await ProjectService.deleteDrawings(projectId, ids);
      if (response.code === 200) {
        dispatch(getProject(projectId));
        dispatch(listDrawings({ projectId, folderId }));
        dispatchSuccessMessage(dispatch, response.message);
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
      } else {
        dispatchErrorMessage(dispatch, response.message);
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
      } else {
        dispatchErrorMessage(dispatch, e.message);
      }
    }
  }
);

export const listSafetyNcrs = createAsyncThunk(
  `${name}/listSafetyNcrs`,
  async (projectId, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.listSafetyNcrs(projectId);
      if (response.code === 200) {
        dispatch(loadingFalse());
        return response.data;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const addSafetyData = createAsyncThunk(
  `${name}/addSafetyData`,
  async ({ projectId, data }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.addSafetyData(projectId, data);
      if (response.code === 200) {
        dispatch(loadingFalse());
        dispatch(getProject(projectId));
        dispatch(listSafetyNcrs(projectId));
        dispatchSuccessMessage(dispatch, response.message);
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
      } else {
        dispatchErrorMessage(dispatch, response.message);
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
      } else {
        dispatchErrorMessage(dispatch, e.message);
      }
    }
  }
);

export const detailSafetyData = createAsyncThunk(
  `${name}/detailSafetyData`,
  async ({ safetyDataId }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.detailSafetyData(safetyDataId);
      if (response.code === 200) {
        dispatch(loadingFalse());
        return response.data;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const updateSafetyData = createAsyncThunk(
  `${name}/updateSafetyData`,
  async ({ projectId, safetyDataId, data }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.updateSafetyData(
        safetyDataId,
        data
      );
      if (response.code === 200) {
        dispatch(loadingFalse());
        dispatch(getProject(projectId));
        dispatch(listSafetyNcrs(projectId));
        dispatchSuccessMessage(dispatch, response.message);
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
      } else {
        dispatchErrorMessage(dispatch, response.message);
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
      } else {
        dispatchErrorMessage(dispatch, e.message);
      }
    }
  }
);

// export const deleteSafetyNcrs = createAsyncThunk(
//   `${name}/deleteSafetyNcrs`,
//   async ({ projectId, folderId, ids }, { dispatch }) => {
//     try {
//       const response = await ProjectService.deleteSafetyNcrs(ids);
//       if (response.code === 200) {
//         dispatch(getProject(projectId));
//         dispatch(listSafetyNcrs(projectId));
//         dispatchSuccessMessage(dispatch, response.message);
//       } else if (response.message === 'Something went wrong') {
//         dispatchErrorMessage(dispatch, "Oops... Network Issue.");
//       } else {
//         dispatchErrorMessage(dispatch, response.message);
//       }
//     } catch (e) {
//       if(e.message === "Cannot read properties of undefined (reading 'status')"){
//         dispatchErrorMessage(dispatch, "Network Error, please try again.");
//       }else{
//         dispatchErrorMessage(dispatch, e.message);
//       }
//     }
//   }
// );

export const listQualityNcrs = createAsyncThunk(
  `${name}/listQualityNcrs`,
  async (projectId, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.listQualityNcrs(projectId);
      if (response.code === 200) {
        dispatch(loadingFalse());
        return response.data;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const addQualityData = createAsyncThunk(
  `${name}/addQualityData`,
  async ({ projectId, data }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.addQualityData(projectId, data);
      if (response.code === 200) {
        dispatch(loadingFalse());
        dispatch(getProject(projectId));
        dispatch(listQualityNcrs(projectId));
        dispatchSuccessMessage(dispatch, response.message);
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
      } else {
        dispatchErrorMessage(dispatch, response.message);
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
      } else {
        dispatchErrorMessage(dispatch, e.message);
      }
    }
  }
);

export const detailQualityData = createAsyncThunk(
  `${name}/detailQualityData`,
  async ({ qualityDataId }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.detailQualityData(qualityDataId);
      if (response.code === 200) {
        dispatch(loadingFalse());
        return response.data;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const updateQualityData = createAsyncThunk(
  `${name}/updateQualityData`,
  async ({ projectId, qualityDataId, data }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.updateQualityData(
        qualityDataId,
        data
      );
      if (response.code === 200) {
        dispatch(loadingFalse());
        dispatch(getProject(projectId));
        dispatch(listQualityNcrs(projectId));
        dispatchSuccessMessage(dispatch, response.message);
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
      } else {
        dispatchErrorMessage(dispatch, response.message);
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
      } else {
        dispatchErrorMessage(dispatch, e.message);
      }
    }
  }
);

// export const deleteQualityNcrs = createAsyncThunk(
//   `${name}/deleteQualityNcrs`,
//   async ({ projectId, folderId, ids }, { dispatch }) => {
//     try {
//       const response = await ProjectService.deleteQualityNcrs(ids);
//       if (response.code === 200) {
//         dispatch(getProject(projectId));
//         dispatch(listQualityNcrs(projectId));
//         dispatchSuccessMessage(dispatch, response.message);
//       } else if (response.message === 'Something went wrong') {
//         dispatchErrorMessage(dispatch, "Oops... Network Issue.");
//       } else {
//         dispatchErrorMessage(dispatch, response.message);
//       }
//     } catch (e) {
//       if(e.message === "Cannot read properties of undefined (reading 'status')"){
//         dispatchErrorMessage(dispatch, "Network Error, please try again.");
//       }else{
//         dispatchErrorMessage(dispatch, e.message);
//       }
//     }
//   }
// );

export const listMilestones = createAsyncThunk(
  `${name}/listMilestones`,
  async (projectId, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.listMilestones(projectId);
      if (response.code === 200) {
        dispatch(loadingFalse());
        return response.data;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const addMilestone = createAsyncThunk(
  `${name}/addMilestone`,
  async ({ projectId, data }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.addMilestone(projectId, data);
      if (response.code === 200) {
        dispatch(loadingFalse());
        dispatch(getProject(projectId));
        dispatch(listMilestones(projectId));
        dispatchSuccessMessage(dispatch, response.message);
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
      } else {
        dispatchErrorMessage(dispatch, response.message);
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
      } else {
        dispatchErrorMessage(dispatch, e.message);
      }
    }
  }
);

export const detailMilestone = createAsyncThunk(
  `${name}/detailMilestone`,
  async ({ projectId, milestoneId }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.detailMilestone(
        projectId,
        milestoneId
      );
      if (response.code === 200) {
        dispatch(loadingFalse());
        return response.data;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const updateMilestone = createAsyncThunk(
  `${name}/updateMilestone`,
  async ({ projectId, milestoneId, data }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.updateMilestone(
        projectId,
        milestoneId,
        data
      );
      if (response.code === 200) {
        dispatch(loadingFalse());
        dispatch(getProject(projectId));
        dispatch(listMilestones(projectId));
        dispatchSuccessMessage(dispatch, response.message);
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
      } else {
        dispatchErrorMessage(dispatch, response.message);
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
      } else {
        dispatchErrorMessage(dispatch, e.message);
      }
    }
  }
);

export const listItems = createAsyncThunk(
  `${name}/listItems`,
  async (projectId, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.listItems(projectId);
      if (response.code === 200) {
        dispatch(loadingFalse());
        return response.data;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const addItem = createAsyncThunk(
  `${name}/addItem`,
  async ({ projectId, data }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.addItem(projectId, data);
      if (response.code === 200) {
        dispatch(loadingFalse());
        dispatch(getProject(projectId));
        dispatch(listItems(projectId));
        dispatchSuccessMessage(dispatch, response.message);
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
      } else {
        dispatchErrorMessage(dispatch, response.message);
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
      } else {
        dispatchErrorMessage(dispatch, e.message);
      }
    }
  }
);

export const detailWorkBOQItem = createAsyncThunk(
  `${name}/detailWorkBOQItem`,
  async ({ projectId, workBOQId }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.detailWorkBOQItem(
        projectId,
        workBOQId
      );
      if (response.code === 200) {
        dispatch(loadingFalse());
        return response.data;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const updateItem = createAsyncThunk(
  `${name}/updateItem`,
  async ({ projectId, workBOQId, data }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.updateItem(
        projectId,
        workBOQId,
        data
      );
      if (response.code === 200) {
        dispatch(loadingFalse());
        dispatch(getProject(projectId));
        dispatch(listItems(projectId));
        dispatchSuccessMessage(dispatch, response.message);
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
      } else {
        dispatchErrorMessage(dispatch, response.message);
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
      } else {
        dispatchErrorMessage(dispatch, e.message);
      }
    }
  }
);

export const getExecutableQty = createAsyncThunk(
  `${name}/getExecutableQty`,
  async ({ projectId, itemId }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.getExecutableQty(projectId, itemId);
      if (response.code === 200) {
        dispatch(loadingFalse());
        return response.data;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const listPurchaseOrders = createAsyncThunk(
  `${name}/listPurchaseOrders`,
  async (projectId, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.listPurchaseOrders(projectId);
      if (response.code === 200) {
        dispatch(loadingFalse());
        return response.data;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const detailPurchaseOrder = createAsyncThunk(
  `${name}/detailPurchaseOrder`,
  async ({ purchaseId }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.detailPurchaseOrder(purchaseId);
      if (response.code === 200) {
        dispatch(loadingFalse());
        return response.data;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const fecthPurchaseOrderBySupplierId = createAsyncThunk(
  `${name}/fecthPurchaseOrderBySupplierId`,
  async ({ supplierId, inventoryId }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.fecthPurchaseOrderBySupplierId(
        supplierId,
        inventoryId
      );
      if (response.code === 200) {
        dispatch(loadingFalse());
        return response.data;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const createPurchaseOrder = createAsyncThunk(
  `${name}/createPurchaseOrder`,
  async ({ projectId, finalData }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.createPurchaseOrder(
        projectId,
        finalData
      );
      if (response.code === 200) {
        dispatch(loadingFalse());
        dispatch(getProject(projectId));
        dispatch(listPurchaseOrders(projectId));
        dispatchSuccessMessage(dispatch, response.message);
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
      } else {
        dispatchErrorMessage(dispatch, response.message);
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
      } else {
        dispatchErrorMessage(dispatch, e.message);
      }
    }
  }
);

export const updatepurchaseOrder = createAsyncThunk(
  `${name}/updatepurchaseOrder`,
  async ({ projectId, purchaseId, finalData }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.updatepurchaseOrder(
        purchaseId,
        finalData
      );
      if (response.code === 200) {
        dispatch(loadingFalse());
        dispatch(getProject(projectId));
        dispatch(listPurchaseOrders(projectId));
        dispatchSuccessMessage(dispatch, response.message);
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
      } else {
        dispatchErrorMessage(dispatch, response.message);
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
      } else {
        dispatchErrorMessage(dispatch, e.message);
      }
    }
  }
);

export const downloadPOPdfReport = createAsyncThunk(
  `${name}/downloadPOPdfReport`,
  async ({ projectId, projectName, purchaseId, orderNo }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.downloadPOPdfReport(purchaseId);   
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `${projectName} - ${orderNo}.pdf`
      );
      document.body.appendChild(link);
      link.click();
      dispatch(loadingFalse());
    } 
    catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);


export const downloadPO = createAsyncThunk(
  `${name}/downloadPO`,
  async ({ projectId, projectName, purchaseId, orderNo }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.downloadPO(purchaseId);
      var arr = new Uint8Array(response.data);
      var str = String.fromCharCode.apply(String, arr);
      if (/[\u0080-\uffff]/.test(str)) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `${projectName} - ${orderNo} Purchase Order Report.xlsx`
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
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

//

// export const downloadPOReport = createAsyncThunk(
//   `${name}/downloadPOReport`,
//   async ({ projectId, projectName, purchaseId, orderNo }, { dispatch }) => {
//     try {
//       dispatch(loadingTrue());
//       const response = await ProjectService.downloadPOReport(projectId);
//       var arr = new Uint8Array(response.data);
//       var str = String.fromCharCode.apply(String, arr);
//       if (/[\u0080-\uffff]/.test(str)) {
//         const url = window.URL.createObjectURL(new Blob([response.data]));
//         const link = document.createElement("a");
//         link.href = url;
//         link.setAttribute(
//           "download",
//           `${projectName} - ${projectId} Purchase Order Report.xlsx`
//         );
//         document.body.appendChild(link);
//         link.click();
//         dispatch(loadingFalse());
//       } else {
//         str = JSON.parse(str);
//         dispatchWarningMessage(dispatch, str.message);
//         dispatch(loadingFalse());
//       }
//     } catch (e) {
//       if (
//         e.message === "Cannot read properties of undefined (reading 'status')"
//       ) {
//         dispatchErrorMessage(dispatch, "Network Error, please try again.");
//         dispatch(loadingFalse());
//       } else {
//         dispatchErrorMessage(dispatch, e.message);
//         dispatch(loadingFalse());
//       }
//     }
//   }
// );


// export const downloadPOReport = createAsyncThunk(
//   `${name}/downloadPOReport`,
//   async ({ projectId, projectName,supplier, startDate, endDate }, { dispatch }) => {
//     try {
//       dispatch(loadingTrue());
//       const response = await ProjectService.downloadPOReport(projectId, projectName,supplier, startDate, endDate);

//       let formattedStartDate;
//       if (startDate === "Since Inception") {
//         formattedStartDate = "Since Inception";
//       } else {
//         formattedStartDate = moment(startDate).format("DD-MM-YYYY");
//       }
//       let formattedEndDate = moment(endDate).format("DD-MM-YYYY");

//       var arr = new Uint8Array(response.data);
//       var str = String.fromCharCode.apply(String, arr);
      
//       if (/[\u0080-\uffff]/.test(str)) {
//         const url = window.URL.createObjectURL(new Blob([response.data]));
//         const link = document.createElement("a");
//         link.href = url;
//         // Update the download filename based on supplier and date range
//         link.setAttribute(
//           "download",
//           `${projectName} - ${projectId} ${supplier ? supplier + ' ' : ''}Purchase Order Report ${formattedStartDate} to ${formattedEndDate}.xlsx`
//         );
//         document.body.appendChild(link);
//         link.click();
//         dispatch(loadingFalse());
//       } else {
//         str = JSON.parse(str);
//         dispatchWarningMessage(dispatch, str.message);
//         dispatch(loadingFalse());
//       }
//     } catch (e) {
//       if (
//         e.message === "Cannot read properties of undefined (reading 'status')"
//       ) {
//         dispatchErrorMessage(dispatch, "Network Error, please try again.");
//         dispatch(loadingFalse());
//       } else {
//         dispatchErrorMessage(dispatch, e.message);
//         dispatch(loadingFalse());
//       }
//     }
//   }
// );

export const downloadPOReport = createAsyncThunk(
  `${name}/downloadPOReport`,
  async ({ projectId, projectName, supplier, startDate, endDate }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.downloadPOReport(projectId, projectName, supplier, startDate, endDate);

      let formattedStartDate;
       if (startDate === "Since Inception") {
         formattedStartDate = "Since Inception";
       } else {
        formattedStartDate = moment(startDate).format("DD-MM-YYYY");
       }
       let formattedEndDate = moment(endDate).format("DD-MM-YYYY");

      const contentType = response.headers['content-type'];

      if (contentType && contentType.includes('application/json')) {
        const jsonResult = await response.json();
        dispatchWarningMessage(dispatch, jsonResult.message);
      } else {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute(
          'download',
          `${projectName} - ${projectId} ${supplier ? supplier + ' ' : ''}Purchase Order Report ${formattedStartDate} to ${formattedEndDate}.xlsx`
        );
        document.body.appendChild(link);
        link.click();
      }

      dispatch(loadingFalse());
    } catch (e) {
      if (e.message === "Cannot read properties of undefined (reading 'status')") {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
      } else {
        dispatchErrorMessage(dispatch, e.message);
      }

      dispatch(loadingFalse());
    }
  }
);


export const viewPO = createAsyncThunk(
  `${name}/viewPO`,
  async ({ projectId, projectName, purchaseId, orderNo }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.viewPO(purchaseId);
      if (response.code === 200) {
        dispatch(loadingFalse());
        return response.data;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const listWorkOrders = createAsyncThunk(
  `${name}/listWorkOrders`,
  async (projectId, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.listWorkOrders(projectId);
      if (response.code === 200) {
        dispatch(loadingFalse());
        return response.data;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const detailWorkOrder = createAsyncThunk(
  `${name}/detailWorkOrder`,
  async ({ projectId, workId }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.detailWorkOrder(projectId, workId);
      if (response.code === 200) {
        dispatch(loadingFalse());
        return response.data;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const createWorkOrder = createAsyncThunk(
  `${name}/createWorkOrder`,
  async ({ projectId, finalData }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.createWorkOrder(
        projectId,
        finalData
      );
      if (response.code === 200) {
        dispatch(loadingFalse());
        dispatch(getProject(projectId));
        dispatch(listWorkOrders(projectId));
        dispatchSuccessMessage(dispatch, response.message);
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
      } else {
        dispatchErrorMessage(dispatch, response.message);
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
      } else {
        dispatchErrorMessage(dispatch, e.message);
      }
    }
  }
);

export const updateworkOrder = createAsyncThunk(
  `${name}/updateworkOrder`,
  async ({ projectId, workId, finalData }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.updateworkOrder(
        projectId,
        workId,
        finalData
      );
      if (response.code === 200) {
        dispatch(loadingFalse());
        dispatch(getProject(projectId));
        dispatch(listWorkOrders(projectId));
        dispatchSuccessMessage(dispatch, response.message);
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
      } else {
        dispatchErrorMessage(dispatch, response.message);
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
      } else {
        dispatchErrorMessage(dispatch, e.message);
      }
    }
  }
);

export const downloadWO = createAsyncThunk(
  `${name}/downloadWO`,
  async ({ projectId, projectName, workId, orderNo }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.downloadWO(projectId, workId);
      var arr = new Uint8Array(response.data);
      var str = String.fromCharCode.apply(String, arr);
      if (/[\u0080-\uffff]/.test(str)) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `${projectName} - ${orderNo} Work Order Report.xlsx`
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
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const viewWO = createAsyncThunk(
  `${name}/viewWO`,
  async ({ projectId, projectName, workId, orderNo }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.viewWO(projectId, workId);
      if (response.code === 200) {
        dispatch(loadingFalse());
        return response.data;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const addTemplate = createAsyncThunk(
  `${name}/addTemplate`,
  async ({ projectId, form }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.addTemplate(projectId, form);
      if (response.code === 200) {
        dispatch(getProject(projectId));
        dispatchSuccessMessage(dispatch, response.message);
        dispatch(loadingFalse());
        return response.data;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
      } else {
        dispatchErrorMessage(dispatch, e.message);
      }
    }
  }
);

export const updateTemplate = createAsyncThunk(
  `${name}/updateTemplate`,
  async ({ projectId, templateId, newForm }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.updateTemplate(
        projectId,
        templateId,
        newForm
      );
      if (response.code === 200) {
        dispatch(getProject(projectId));
        dispatchSuccessMessage(dispatch, response.message);
        dispatch(loadingFalse());
        return response.data;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
      } else {
        dispatchErrorMessage(dispatch, e.message);
      }
    }
  }
);

export const addChecklist = createAsyncThunk(
  `${name}/addChecklist`,
  async ({ projectId, values }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.addCheckList(projectId, values);
      if (response.code === 200) {
        dispatch(getProject(projectId));
        dispatchSuccessMessage(dispatch, response.message);
        dispatch(loadingFalse());
        return response.data;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
      } else {
        dispatchErrorMessage(dispatch, e.message);
      }
    }
  }
);

export const detailChecklist = createAsyncThunk(
  `${name}/detailChecklist`,
  async ({ projectId, checklistId }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.detailChecklist(
        projectId,
        checklistId
      );
      if (response.code === 200) {
        dispatch(loadingFalse());
        return response.data;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const updateChecklistDetails = createAsyncThunk(
  `${name}/updateChecklistDetails`,
  async ({ projectId, checklistId, details }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.updateChecklistDetails(
        projectId,
        checklistId,
        details
      );
      if (response.code === 200) {
        dispatch(getProject(projectId));
        dispatch(loadingFalse());
        dispatchSuccessMessage(dispatch, response.message);
        return response.data;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const detailItem = createAsyncThunk(
  `${name}/detailItem`,
  async ({ projectId, checklistId, itemId }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.detailItem(
        projectId,
        checklistId,
        itemId
      );
      if (response.code === 200) {
        dispatch(loadingFalse());
        return response.data;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const addComment = createAsyncThunk(
  `${name}/addComment`,
  async ({ projectId, checklistId, values }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.addComment(
        projectId,
        checklistId,
        values
      );
      if (response.code === 200) {
        dispatch(detailItem({ projectId, checklistId, itemId: values.itemId }));
        dispatchSuccessMessage(dispatch, response.message);
        dispatch(loadingFalse());
        return response.data;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
      } else {
        dispatchErrorMessage(dispatch, e.message);
      }
    }
  }
);

export const deleteComment = createAsyncThunk(
  `${name}/deleteComment`,
  async ({ projectId, checklistId, itemId, commentId }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.deleteComment(
        projectId,
        checklistId,
        itemId,
        commentId
      );
      if (response.code === 200) {
        dispatch(detailItem({ projectId, checklistId, itemId, commentId }));
        dispatchSuccessMessage(dispatch, response.message);
        dispatch(loadingFalse());
        return response.data;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
      } else {
        dispatchErrorMessage(dispatch, e.message);
      }
    }
  }
);

export const markCheclistItem = createAsyncThunk(
  `${name}/markCheclistItem`,
  async ({ projectId, checklistId, itemId, value, markedBy }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.markChecklistItem(
        projectId,
        checklistId,
        itemId,
        value,
        markedBy
      );
      if (response.code === 200) {
        dispatch(getProject(projectId));
        dispatch(detailItem({ projectId, checklistId, itemId }));
        //dispatch(detailChecklist({ projectId, checklistId }));
        dispatchSuccessMessage(dispatch, response.message);
        dispatch(loadingFalse());
        return response.data;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const deleteChecklists = createAsyncThunk(
  `${name}/deleteChecklists`,
  async ({ projectId, values }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.deleteChecklists(projectId, values);
      if (response.code === 200) {
        dispatch(getProject(projectId));
        dispatchSuccessMessage(dispatch, response.message);
        dispatch(loadingFalse());
        return response.data;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const deleteTemplates = createAsyncThunk(
  `${name}/deleteTemplates`,
  async ({ projectId, values }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.deleteTemplates(projectId, values);
      if (response.code === 200) {
        dispatch(getProject(projectId));
        dispatchSuccessMessage(dispatch, response.message);
        dispatch(loadingFalse());
        return response.data;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const getReports = createAsyncThunk(
  `${name}/getReport`,
  async (projectId, { dispatch }) => {
    try {
      const response = await ProjectService.getReports(projectId);
      if (response.code === 200) {
        return response.data;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
      } else {
        dispatchErrorMessage(dispatch, response.message);
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
      } else {
        dispatchErrorMessage(dispatch, e.message);
      }
    }
  }
);

export const getDetailReport = createAsyncThunk(
  `${name}/getDetailReport`,
  async ({ projectId, reportId }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.getDetailReport(
        projectId,
        reportId
      );
      if (response.code === 200) {
        return response.data;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const saveReport = createAsyncThunk(
  `${name}/saveReport`,
  async ({ projectId, formData }, { dispatch }) => {
    dispatch(loadingTrue());
    try {
      const response = await ProjectService.saveReport(projectId, formData);
      if (response.code === 200) {
        dispatch(getProject(projectId));
        dispatch(listInventories(projectId));
        dispatch(getReports(projectId));
        dispatchSuccessMessage(dispatch, response.message);
        dispatch(loadingFalse());
        return response.data;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const updateReportDate = createAsyncThunk(
  `${name}/updateReportDate`,
  async ({ projectId, data }, { dispatch }) => {
    dispatch(loadingTrue());
    try {
      const response = await ProjectService.updateReportDate(projectId, data);
      if (response.code === 200) {
        dispatch(getProject(projectId));
        dispatch(listInventories(projectId));
        dispatch(getReports(projectId));
        dispatchSuccessMessage(dispatch, response.message);
        dispatch(loadingFalse());
        return response.data;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const addLabourData = createAsyncThunk(
  `${name}/addLabourData`,
  async ({ projectId, reportId, Data }, { dispatch }) => {
    dispatch(loadingTrue());
    try {
      const response = await ProjectService.addLabourData(
        projectId,
        reportId,
        Data
      );
      if (response.code === 200) {
        dispatch(getReports(projectId));
        dispatchSuccessMessage(dispatch, response.message);
        dispatch(loadingFalse());
        return response.data;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const updateLabourData = createAsyncThunk(
  `${name}/updateLabourData`,
  async ({ projectId, type, reportId, Data }, { dispatch }) => {
    dispatch(loadingTrue());
    try {
      const response = await ProjectService.updateLabourData(
        projectId,
        type,
        reportId,
        Data
      );
      if (response.code === 200) {
        dispatch(getReports(projectId));
        dispatchSuccessMessage(dispatch, response.message);
        dispatch(loadingFalse());
        return response.data;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const updateEquipmentData = createAsyncThunk(
  `${name}/updateEquipmentData`,
  async ({ projectId, type, reportId, Data }, { dispatch }) => {
    dispatch(loadingTrue());
    try {
      const response = await ProjectService.updateEquipmentData(
        projectId,
        type,
        reportId,
        Data
      );
      if (response.code === 200) {
        dispatch(getReports(projectId));
        dispatchSuccessMessage(dispatch, response.message);
        dispatch(loadingFalse());
        return response.data;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const addEquipmentData = createAsyncThunk(
  `${name}/addEquipmentData`,
  async ({ projectId, reportId, Data }, { dispatch }) => {
    dispatch(loadingTrue());
    try {
      const response = await ProjectService.addEquipmentData(
        projectId,
        reportId,
        Data
      );
      if (response.code === 200) {
        dispatch(getReports(projectId));
        dispatchSuccessMessage(dispatch, response.message);
        dispatch(loadingFalse());
        return response.data;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const addHindranceData = createAsyncThunk(
  `${name}/addHindranceData`,
  async ({ projectId, reportId, Data }, { dispatch }) => {
    dispatch(loadingTrue());
    try {
      const response = await ProjectService.addHindranceData(
        projectId,
        reportId,
        Data
      );
      if (response.code === 200) {
        dispatch(getReports(projectId));
        dispatchSuccessMessage(dispatch, response.message);
        dispatch(loadingFalse());
        return response.data;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const updateHindranceData = createAsyncThunk(
  `${name}/updateHindranceData`,
  async ({ projectId, type, reportId, Data }, { dispatch }) => {
    dispatch(loadingTrue());
    try {
      const response = await ProjectService.updateHindranceData(
        projectId,
        type,
        reportId,
        Data
      );
      if (response.code === 200) {
        dispatch(getReports(projectId));
        dispatchSuccessMessage(dispatch, response.message);
        dispatch(loadingFalse());
        return response.data;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);



export const addIndentData = createAsyncThunk(
  `${name}/addIndentData`,
  async ({ projectId, data }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.addIndentData( data);
      if (response.code === 200) {
        dispatch(loadingFalse());
        dispatch(getProject(projectId));
        dispatch(listIndent({projectId:projectId,page:1,limit:50}));
        dispatchSuccessMessage(dispatch, response.message);
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
      } else {
        dispatchErrorMessage(dispatch, response.message);
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
      } else {
        dispatchErrorMessage(dispatch, e.message);
      }
    }
  }
);


export const updateIndentData = createAsyncThunk(
  `${name}/updateIndentData`,
  async ({ projectId,indentId, data }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.updateIndentData(
        indentId,
        data
      );
      if (response.code === 200 || response.message === "Intent updated successfully") {
        dispatch(loadingFalse() );
        dispatch(listIndent({projectId:projectId,page:1,limit:50}));
        dispatchSuccessMessage(dispatch, response.message);
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
      } else {
        dispatchErrorMessage(dispatch, response.message);
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
      } else {
        dispatchErrorMessage(dispatch, e.message);
      }
    }
  }
);



export const detailIndent = createAsyncThunk(
  `${name}/detailIndent`,
  async ({ indentId }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.detailIndent(indentId);
      console.log("response3",response.data)

      if (response.status === 200) {
        dispatch(loadingFalse());
        console.log("response3",response.data)
        return response.data; 

      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);


export const listIndent = createAsyncThunk(
  `${name}/listIndent`,
  async ({projectId,  page, limit }, { dispatch }) => {

    try {
      console.log("projectId",projectId)
      dispatch(loadingTrue());
      const response = await ProjectService.listIndent(projectId, page, limit);
      dispatch(loadingFalse());
      console.log("responnnse123",response)
      return response;
    } catch (error) {
      dispatchErrorMessage(dispatch, error.message);
      dispatch(loadingFalse());
      throw error;
    }
  }
);


export const addSiteVisitorData = createAsyncThunk(
  `${name}/addSiteVisitorData`,
  async ({ projectId, reportId, Data }, { dispatch }) => {
    dispatch(loadingTrue());
    try {
      const response = await ProjectService.addSiteVisitorData(
        projectId,
        reportId,
        Data
      );
      if (response.code === 200) {
        dispatch(getReports(projectId));
        dispatchSuccessMessage(dispatch, response.message);
        dispatch(loadingFalse());
        return response.data;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const updateSiteVisitorData = createAsyncThunk(
  `${name}/updateSiteVisitorData`,
  async ({ projectId, type, reportId, Data }, { dispatch }) => {
    dispatch(loadingTrue());
    try {
      const response = await ProjectService.updateSiteVisitorData(
        projectId,
        type,
        reportId,
        Data
      );
      if (response.code === 200) {
        dispatch(getReports(projectId));
        dispatchSuccessMessage(dispatch, response.message);
        dispatch(loadingFalse());
        return response.data;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const addStaffData = createAsyncThunk(
  `${name}/addStaffData`,
  async ({ projectId, reportId, Data }, { dispatch }) => {
    dispatch(loadingTrue());
    try {
      const response = await ProjectService.addStaffData(
        projectId,
        reportId,
        Data
      );
      if (response.code === 200) {
        dispatch(getReports(projectId));
        dispatchSuccessMessage(dispatch, response.message);
        dispatch(loadingFalse());
        return response.data;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const updateStaffData = createAsyncThunk(
  `${name}/updateStaffData`,
  async ({ projectId, type, reportId, Data }, { dispatch }) => {
    dispatch(loadingTrue());
    try {
      const response = await ProjectService.updateStaffData(
        projectId,
        type,
        reportId,
        Data
      );
      if (response.code === 200) {
        dispatch(getReports(projectId));
        dispatchSuccessMessage(dispatch, response.message);
        dispatch(loadingFalse());
        return response.data;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const addNotesData = createAsyncThunk(
  `${name}/addNotesData`,
  async ({ projectId, reportId, Data }, { dispatch }) => {
    dispatch(loadingTrue());
    try {
      const response = await ProjectService.addNotesData(
        projectId,
        reportId,
        Data
      );
      if (response.code === 200) {
        dispatch(getReports(projectId));
        dispatchSuccessMessage(dispatch, response.message);
        dispatch(loadingFalse());
        return response.data;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const updateNotesData = createAsyncThunk(
  `${name}/updateNotesData`,
  async ({ projectId, type, reportId, Data }, { dispatch }) => {
    dispatch(loadingTrue());
    try {
      const response = await ProjectService.updateNotesData(
        projectId,
        type,
        reportId,
        Data
      );
      if (response.code === 200) {
        dispatch(getReports(projectId));
        dispatchSuccessMessage(dispatch, response.message);
        dispatch(loadingFalse());
        return response.data;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const addWorkProgressData = createAsyncThunk(
  `${name}/addWorkProgressData`,
  async ({ projectId, reportId, Data }, { dispatch }) => {
    dispatch(loadingTrue());
    try {
      const response = await ProjectService.addWorkProgressData(
        projectId,
        reportId,
        Data
      );
      if (response.code === 200) {
        dispatch(getReports(projectId));
        dispatchSuccessMessage(dispatch, response.message);
        dispatch(loadingFalse());
        return response.data;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const updateWorkProgressData = createAsyncThunk(
  `${name}/updateWorkProgressData`,
  async ({ projectId, type, reportId, Data }, { dispatch }) => {
    dispatch(loadingTrue());
    try {
      const response = await ProjectService.updateWorkProgressData(
        projectId,
        type,
        reportId,
        Data
      );
      if (response.code === 200) {
        dispatch(getReports(projectId));
        dispatchSuccessMessage(dispatch, response.message);
        dispatch(loadingFalse());
        return response.data;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const uploadAttachments = createAsyncThunk(
  `${name}/uploadAttachments`,
  async ({ projectId, reportId, Data }, { dispatch }) => {
    dispatch(loadingTrue());
    try {
      const response = await ProjectService.uploadAttachments(
        projectId,
        reportId,
        Data
      );
      if (response.code === 200) {
        dispatch(getReports(projectId));
        dispatchSuccessMessage(dispatch, response.message);
        dispatch(loadingFalse());
        return response.data;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const deleteAttachments = createAsyncThunk(
  `${name}/deleteAttachments`,
  async ({ projectId, reportId, Data }, { dispatch }) => {
    dispatch(loadingTrue());
    try {
      const response = await ProjectService.deleteAttachments(
        projectId,
        reportId,
        Data
      );
      if (response.code === 200) {
        dispatch(getReports(projectId));
        dispatchSuccessMessage(dispatch, response.message);
        dispatch(loadingFalse());
        return response.data;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const addMaterialData = createAsyncThunk(
  `${name}/addMaterialData`,
  async ({ projectId, reportId, Data }, { dispatch }) => {
    dispatch(loadingTrue());
    try {
      const response = await ProjectService.addMaterialData(
        projectId,
        reportId,
        Data
      );
      if (response.code === 200) {
        dispatch(getReports(projectId));
        dispatch(listInventories(projectId));
        dispatchSuccessMessage(dispatch, response.message);
        dispatch(loadingFalse());
        return response.data;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const updateMaterialData = createAsyncThunk(
  `${name}/updateMaterialData`,
  async ({ projectId, type, reportId, Data }, { dispatch }) => {
    dispatch(loadingTrue());
    try {
      const response = await ProjectService.updateMaterialData(
        projectId,
        type,
        reportId,
        Data
      );
      if (response.code === 200) {
        dispatch(getReports(projectId));
        dispatch(listInventories(projectId));
        dispatchSuccessMessage(dispatch, response.message);
        dispatch(loadingFalse());
        return response.data;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const deleteMaterialTransaction = createAsyncThunk(
  `${name}/deleteMaterialTransaction`,
  async ({ projectId, reportId, Data }, { dispatch }) => {
    dispatch(loadingTrue());
    try {
      const response = await ProjectService.deleteMaterialTransaction(
        projectId,
        reportId,
        Data
      );
      if (response.code === 200) {
        dispatch(getReports(projectId));
        dispatch(listInventories(projectId));
        dispatchSuccessMessage(dispatch, response.message);
        dispatch(loadingFalse());
        return response.data;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const addConsumptionData = createAsyncThunk(
  `${name}/addConsumptionData`,
  async ({ projectId, reportId, Data }, { dispatch }) => {
    dispatch(loadingTrue());
    try {
      const response = await ProjectService.addConsumptionData(
        projectId,
        reportId,
        Data
      );
      if (response.code === 200) {
        dispatch(getReports(projectId));
        dispatch(listInventories(projectId));
        dispatchSuccessMessage(dispatch, response.message);
        dispatch(loadingFalse());
        return response.data;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const updateConsumptionData = createAsyncThunk(
  `${name}/updateConsumptionData`,
  async ({ projectId, type, reportId, Data }, { dispatch }) => {
    dispatch(loadingTrue());
    try {
      const response = await ProjectService.updateConsumptionData(
        projectId,
        type,
        reportId,
        Data
      );
      if (response.code === 200) {
        dispatch(getReports(projectId));
        dispatch(listInventories(projectId));
        dispatchSuccessMessage(dispatch, response.message);
        dispatch(loadingFalse());
        return response.data;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const submitReport = createAsyncThunk(
  `${name}/submitReport`,
  async ({ projectId, reportId }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.submitReport(projectId, reportId);
      if (response.code === 200) {
        dispatch(getReports(projectId));
        dispatchSuccessMessage(dispatch, response.message);
        dispatch(loadingFalse());
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const approveReport = createAsyncThunk(
  `${name}/approveReport`,
  async ({ projectId, reportId }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.approveReport(projectId, reportId);
      if (response.code === 200) {
        dispatch(getReports(projectId));
        dispatchSuccessMessage(dispatch, response.message);
        dispatch(loadingFalse());
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const viewSafetyNcrExcelReport = createAsyncThunk(
  `${name}/viewSafetyNcrExcelReport`,
  async ({ projectId, projectName, filters }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.viewSafetyNcrExcelReport(
        projectId,
        projectName,
        filters
      );
      if (response.code === 200) {
        dispatch(listSafetyNcrs(projectId));
        dispatchSuccessMessage(dispatch, response.message);
        dispatch(loadingFalse());
        return response.data;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const revertReport = createAsyncThunk(
  `${name}/revertReport`,
  async ({ projectId, reportId, note }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.revertReport(
        projectId,
        reportId,
        note
      );
      if (response.code === 200) {
        dispatch(getReports(projectId));
        dispatch(getDetailReport({ projectId, reportId }));
        dispatchSuccessMessage(dispatch, response.message);
        dispatch(loadingFalse());
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const downloadDailyReport = createAsyncThunk(
  `${name}/downloadDailyReport`,
  async (
    { projectId, projectName, date, reportId, userId, orgType },
    { dispatch }
  ) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.downloadDailyReport(
        projectId,
        reportId,
        userId,
        orgType
      );
      let blob = new Blob([response.data], {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      let url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Daily Report-${projectName}-${date}.xlsx`);
      document.body.appendChild(link);
      link.click();
      //window.open(url);
      dispatch(loadingFalse());
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const viewDailyReport = createAsyncThunk(
  `${name}/viewDailyReport`,
  async ({ projectId, reportId, userId }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.viewDailyReport(
        projectId,
        reportId,
        userId
      );
      if (response.code === 200) {
        dispatch(getReports(projectId));
        //dispatchSuccessMessage(dispatch, response.message);
        dispatch(loadingFalse());
        return response.data;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const sendDailyReport = createAsyncThunk(
  `${name}/sendDailyReport`,
  async (
    { projectId, projectName, date, reportId, userId, orgType, emails },
    { dispatch }
  ) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.sendDailyReport(
        projectId,
        reportId,
        userId,
        emails
      );
      if (response.code === 200) {
        dispatch(getReports(projectId));
        //dispatchSuccessMessage(dispatch, response.message);
        dispatch(loadingFalse());
        return response.data;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const downloadPdfDailyReport = createAsyncThunk(
  `${name}/downloadPdfDailyReport`,
  async ({ projectId, reportId, projectName, date, userId }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.downloadPdfDailyReport(
        projectId,
        reportId,
        userId
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Daily Report-${projectName}-${date}.pdf`);
      document.body.appendChild(link);
      link.click();
      dispatch(loadingFalse());
    } catch (e) {
      dispatchErrorMessage(dispatch, e.message);
      dispatch(loadingFalse());
    }
  }
);

export const downloadTaskExcelReport = createAsyncThunk(
  `${name}/downloadTaskExcelReport`,
  async ({ projectId, projectName, today, userId }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.downloadTaskExcelReport(
        projectId,
        projectName,
        today,
        userId
      );
      var arr = new Uint8Array(response.data);
      var str = String.fromCharCode.apply(String, arr);
      if (/[\u0080-\uffff]/.test(str)) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `Task Excel Report-${projectName}-${today}.xlsx`
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
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const downloadTaskPdfReport = createAsyncThunk(
  `${name}/downloadTaskPdfReport`,
  async ({ projectId, projectName, today, userId }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.downloadTaskPdfReport(
        projectId,
        userId
      );
      var arr = new Uint8Array(response.data);
      var str = String.fromCharCode.apply(String, arr);
      if (/[\u0080-\uffff]/.test(str)) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `Task PDF Report-${projectName}-${today}.pdf`
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
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const downloadInventoryExcelReport = createAsyncThunk(
  `${name}/downloadInventoryExcelReport`,
  async ({ projectId, projectName, filters, suppliers }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.downloadInventoryExcelReport(
        projectId,
        filters,
        suppliers
      );
      let startDate;
      if (filters.startDate === "Since Inception") {
        startDate = "Since Inception";
      } else {
        startDate = moment(filters.startDate).format("DD-MM-YYYY");
      }

      let endDate = moment(filters.endDate).format("DD-MM-YYYY");
      // var arr = new Uint8Array(response.data);
      // var str = String.fromCharCode.apply(String, arr);

      var arr = new Uint8Array(response.data);
      var str = "";
      for (var i = 0; i < arr.length; i++) {
        str += String.fromCharCode(arr[i]);
      }
      if (/[\u0080-\uffff]/.test(str)) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `${projectName} ${startDate} to ${endDate} Inventory Report.xlsx`
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
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const viewInvoiceReport = createAsyncThunk(
  `${name}/viewInvoiceReport`,
  async (
    { projectId, projectName, billId, billDate, userId },
    { dispatch }
  ) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.viewInvoiceReport(
        projectId,
        billId,
        userId
      );
      if (response.code === 200) {
        dispatch(loadingFalse());
        return response.data;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const downloadSingleInventoryExcelReport = createAsyncThunk(
  `${name}/downloadSingleInventoryExcelReport`,
  async ({ projectId, inventoryId, filters }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.downloadSingleInventoryExcelReport(
        projectId,
        inventoryId,
        filters
      );
      var arr = new Uint8Array(response.data);
      var str = String.fromCharCode.apply(String, arr);
      if (/[\u0080-\uffff]/.test(str)) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `Inventory_${inventoryId}.xlsx`);
        document.body.appendChild(link);
        link.click();
        dispatch(loadingFalse());
      } else {
        str = JSON.parse(str);
        dispatchWarningMessage(dispatch, str.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const downloadLabourExcelReport = createAsyncThunk(
  `${name}/downloadLabourExcelReport`,
  async ({ projectId, projectName, filters }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.downloadLabourExcelReport(
        projectId,
        projectName,
        filters
      );
      let startDate;
      if (filters.startDate === "Since Inception") {
        startDate = "Since Inception";
      } else {
        startDate = moment(filters.startDate).format("DD-MM-YYYY");
      }
      let endDate = moment(filters.endDate).format("DD-MM-YYYY");
      // var str = String.fromCharCode.apply(String, arr);
      var arr = new Uint8Array(response.data);
      var str = "";
      for (var i = 0; i < arr.length; i++) {
        str += String.fromCharCode(arr[i]);
      }
      if (/[\u0080-\uffff]/.test(str)) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `${projectName} ${startDate} to ${endDate} Labour Report.xlsx`
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
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const downloadDrawingExcelReport = createAsyncThunk(
  `${name}/downloadDrawingExcelReport`,
  async ({ projectId, projectName, filters }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.downloadDrawingExcelReport(
        projectId,
        projectName,
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
          `${projectName} ${startDate} to ${endDate} Drawing Report.xlsx`
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
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const downloadIrExcelReport = createAsyncThunk(
  `${name}/downloadIrExcelReport`,
  async ({ projectId, projectName, filters }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.downloadIrExcelReport(
        projectId,
        projectName,
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
          `${projectName} ${startDate} to ${endDate} IR Report.xlsx`
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
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const downloadRfiExcelReport = createAsyncThunk(
  `${name}/downloadRfiExcelReport`,
  async ({ projectId, projectName, filters }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.downloadRfiExcelReport(
        projectId,
        projectName,
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
          `${projectName} ${startDate} to ${endDate} RFI Report.xlsx`
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
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const downloadGfcExcelReport = createAsyncThunk(
  `${name}/downloadGfcExcelReport`,
  async ({ projectId, projectName, filters }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.downloadGfcExcelReport(
        projectId,
        projectName,
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
          `${projectName} ${startDate} to ${endDate} GFC Report.xlsx`
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
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const downloadSafetyNcrExcelReport = createAsyncThunk(
  `${name}/downloadSafetyNcrExcelReport`,
  async ({ projectId, projectName, filters }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.downloadSafetyNcrExcelReport(
        projectId,
        projectName,
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
          `${projectName} ${startDate} to ${endDate} Safety Ncr Report.xlsx`
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
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const downloadQualityNcrExcelReport = createAsyncThunk(
  `${name}/downloadQualityNcrExcelReport`,
  async ({ projectId, projectName, filters }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.downloadQualityNcrExcelReport(
        projectId,
        projectName,
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
          `${projectName} ${startDate} to ${endDate} Quality Ncr Report.xlsx`
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
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const downloadEquipmentExcelReport = createAsyncThunk(
  `${name}/downloadEquipementExcelReport`,
  async ({ projectId, projectName, filters }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.downloadEquipmentExcelReport(
        projectId,
        projectName,
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
          `${projectName} ${startDate} to ${endDate} Equipment Report.xlsx`
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
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const downloadHindranceExcelReport = createAsyncThunk(
  `${name}/downloadHindranceExcelReport`,
  async ({ projectId, projectName, filters }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.downloadHindranceExcelReport(
        projectId,
        projectName,
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
          `${projectName} ${startDate} to ${endDate} Hindrance Report.xlsx`
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
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const downloadSitevisitorExcelReport = createAsyncThunk(
  `${name}/downloadSitevisitorExcelReport`,
  async ({ projectId, projectName, filters }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.downloadSitevisitorExcelReport(
        projectId,
        projectName,
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
          `${projectName} ${startDate} to ${endDate} Site-Visitor Report.xlsx`
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
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const downloadStaffExcelReport = createAsyncThunk(
  `${name}/downloadStaffExcelReport`,
  async ({ projectId, projectName, filters }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.downloadStaffExcelReport(
        projectId,
        projectName,
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
          `${projectName} ${startDate} to ${endDate} Staff Report.xlsx`
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
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const downloadAttachmentExcelReport = createAsyncThunk(
  `${name}/downloadAttachmentExcelReport`,
  async ({ projectId, projectName, filters }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.downloadAttachmentExcelReport(
        projectId,
        projectName,
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
          `${projectName} ${startDate} to ${endDate} Attachment Report.xlsx`
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
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const downloadNotesExcelReport = createAsyncThunk(
  `${name}/downloadNotesExcelReport`,
  async ({ projectId, projectName, filters }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.downloadNotesExcelReport(
        projectId,
        projectName,
        filters
      );
      let startDate;
      if (filters.startDate === "Since Inception") {
        startDate = "Since Inception";
      } else {
        startDate = moment(filters.startDate).format("DD-MM-YYYY");
      }
      let endDate = moment(filters.endDate).format("DD-MM-YYYY");
      // var arr = new Uint8Array(response.data);
      // var str = String.fromCharCode.apply(String, arr);
      var arr = new Uint8Array(response.data);
      var str = "";
      for (var i = 0; i < arr.length; i++) {
        str += String.fromCharCode(arr[i]);
      }
      if (/[\u0080-\uffff]/.test(str)) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        if (filters.orgType === "SSA") {
          link.setAttribute(
            "download",
            `${projectName} ${startDate} to ${endDate} Work Progress Report.xlsx`
          );
        } else {
          link.setAttribute(
            "download",
            `${projectName} ${startDate} to ${endDate} Notes Report.xlsx`
          );
        }

        document.body.appendChild(link);
        link.click();
        dispatch(loadingFalse());
      } else {
        str = JSON.parse(str);
        dispatchWarningMessage(dispatch, str.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const downloadConsumptionExcelReport = createAsyncThunk(
  `${name}/downloadConsumptionExcelReport`,
  async ({ projectId, projectName, filters }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.downloadConsumptionExcelReport(
        projectId,
        projectName,
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
          `${projectName} ${startDate} to ${endDate} Consumption Report.xlsx`
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
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const downloadWorkProgressExcelReport = createAsyncThunk(
  `${name}/downloadWorkProgressExcelReport`,
  async ({ projectId, projectName, filters }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.downloadWorkProgressExcelReport(
        projectId,
        projectName,
        filters
      );
      let startDate;
      if (filters.startDate === "Since Inception") {
        startDate = "Since Inception";
      } else {
        startDate = moment(filters.startDate).format("DD-MM-YYYY");
      }
      let endDate = moment(filters.endDate).format("DD-MM-YYYY");
      // var arr = new Uint8Array(response.data);
      // var str = String.fromCharCode.apply(String, arr);
      var arr = new Uint8Array(response.data);
      var str = "";
      for (var i = 0; i < arr.length; i++) {
        str += String.fromCharCode(arr[i]);
      }
      if (/[\u0080-\uffff]/.test(str)) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `${projectName} ${startDate} to ${endDate} Work Activity Report.xlsx`
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
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const downloadInvoiceExcelReport = createAsyncThunk(
  `${name}/downloadInvoiceExcelReport`,
  async (
    { projectId, projectName, billId, billDate, userId },
    { dispatch }
  ) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.downloadInvoiceExcelReport(
        projectId,
        billId,
        userId
      );
      var arr = new Uint8Array(response.data);
      var str = String.fromCharCode.apply(String, arr);
      if (/[\u0080-\uffff]/.test(str)) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `${projectName} ${billDate} Invoice Report.xlsx`
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
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const downloadChecklist = createAsyncThunk(
  `${name}/downloadChecklist`,
  async (
    { projectId, projectName, checklistId, checklistTitle },
    { dispatch }
  ) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.downloadChecklist(
        projectId,
        checklistId
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `Checklist for ${checklistTitle} in ${projectName}.pdf`
      );
      document.body.appendChild(link);
      link.click();
      dispatch(loadingFalse());
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const viewChecklist = createAsyncThunk(
  `${name}/viewChecklist`,
  async ({ projectId, checklistId }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.viewChecklist(
        projectId,
        checklistId
      );
      if (response.code === 200) {
        dispatch(getProject(projectId));
        dispatchSuccessMessage(dispatch, response.message);
        dispatch(loadingFalse());
        return response.data;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const addEntryToSummary = createAsyncThunk(
  `${name}/addEntryToSummary`,
  async (
    { projectId, userId, reportName, actionType, title },
    { dispatch }
  ) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.addEntryToSummary(
        projectId,
        userId,
        reportName,
        actionType,
        title
      );
      if (response.code === 200) {
        dispatch(getProject(projectId));
        //dispatchSuccessMessage(dispatch, response.message);
        dispatch(loadingFalse());
        return response.data;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const downloadTemplate = createAsyncThunk(
  `${name}/downloadTemplate`,
  async ({ projectId, templateId }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.downloadTemplate(
        projectId,
        templateId
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Template_${templateId}.pdf`);
      document.body.appendChild(link);
      link.click();
      dispatch(loadingFalse());
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const downloadStructuralAuditReport = createAsyncThunk(
  `${name}/downloadStructuralAuditReport`,
  async ({ projectId, filter }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.downloadStructuralAuditReport(
        projectId,
        filter
      );
      if (filter === "pdf") {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `Structural_Audit_${projectId}.pdf`);
        document.body.appendChild(link);
        link.click();
      } else {
        let myWindow = window.open("Structural Audit", "blank");
        myWindow.document.write(response.data);
        myWindow.document.close();
      }
      dispatch(loadingFalse());
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const getVendors = createAsyncThunk(
  `${name}/getVendors`,
  async (projectId, { dispatch }) => {
    try {
      const response = await ProjectService.getVendors(projectId);
      if (response.code === 200) {
        return response.data.data;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
      } else {
        dispatchErrorMessage(dispatch, response.message);
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
      } else {
        dispatchErrorMessage(dispatch, e.message);
      }
    }
  }
);

export const detailVendor = createAsyncThunk(
  `${name}/detailVendor`,
  async (vendorId, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.detailVendor(vendorId);
      if (response.code === 200) {
        dispatch(loadingFalse());

        return response.data;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const addVendor = createAsyncThunk(
  `${name}/addVendor`,
  async ({ projectId, vendor }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.addVendor(projectId, vendor);
      if (response.code === 200) {
        dispatch(getVendors(projectId));
        dispatchSuccessMessage(dispatch, response.message);
        dispatch(loadingFalse());
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const updateVendor = createAsyncThunk(
  `${name}/updateVendor`,
  async ({ projectId, vendorId, form }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.updateVendor(vendorId, form);
      if (response.code === 200) {
        dispatch(detailVendor(vendorId));
        dispatch(getVendors(projectId));
        dispatchSuccessMessage(dispatch, response.message);
        dispatch(loadingFalse());
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const importVendor = createAsyncThunk(
  `${name}/importVendor`,
  async ({ projectId, payload }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.importVendor(projectId, payload);
      if (response.code === 200) {
        dispatch(getVendors(projectId));
        dispatchSuccessMessage(dispatch, response.message);
        dispatch(loadingFalse());
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const exportVendor = createAsyncThunk(
  `${name}/exportVendor`,
  async ({ projectId, projectName }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.exportVendor(projectId);
      // if (response.code === 200) {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${projectName}-Vendor_Export_Report.csv`);
      document.body.appendChild(link);
      link.click();
      dispatch(loadingFalse());
      //   return response.data;
      // } else if (response.message === 'Something went wrong') {
      //   dispatchErrorMessage(dispatch, "Oops... Network Issue.");
      //   dispatch(loadingFalse());
      // } else {
      //   dispatchErrorMessage(dispatch, response.message);
      //   dispatch(loadingFalse());
      // }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const addbilling = createAsyncThunk(
  `${name}/addbilling`,
  async ({ projectId, data }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.addbilling(projectId, data);
      if (response.code === 200) {
        dispatch(getProject(projectId));
        dispatch(getBillings(projectId));
        dispatch(getBillingLastRecord(projectId));
        dispatchSuccessMessage(dispatch, response.message);
        dispatch(loadingFalse());
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const getBillings = createAsyncThunk(
  `${name}/getBillings`,
  async (projectId, { dispatch }) => {
    try {
      const response = await ProjectService.getBillings(projectId);
      if (response.code === 200) {
        return response.data.data;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
      } else {
        dispatchErrorMessage(dispatch, response.message);
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
      } else {
        dispatchErrorMessage(dispatch, e.message);
      }
    }
  }
);

export const detailBilling = createAsyncThunk(
  `${name}/detailBillng`,
  async (billingId, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.detailBilling(billingId);
      if (response.code === 200) {
        dispatch(loadingFalse());

        return response.data;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const getBillingLastRecord = createAsyncThunk(
  `${name}/getBillingLastRecord`,
  async (projectId, { dispatch }) => {
    try {
      const response = await ProjectService.getBillingLastRecord(projectId);
      if (response.code === 200) {
        return response.data;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
      } else {
        dispatchErrorMessage(dispatch, response.message);
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
      } else {
        dispatchErrorMessage(dispatch, e.message);
      }
    }
  }
);

export const updateBill = createAsyncThunk(
  `${name}/updateBill`,
  async ({ projectId, billId, data }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.updateBill(projectId, billId, data);
      if (response.code === 200) {
        dispatch(detailBilling(billId));
        dispatch(getBillings(projectId));
        dispatchSuccessMessage(dispatch, response.message);
        dispatch(loadingFalse());
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const addbill = createAsyncThunk(
  `${name}/addbill`,
  async ({ projectId, form }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.addbill(projectId, form);
      if (response.code === 200) {
        dispatch(getProject(projectId));
        dispatch(listBills(projectId));
        dispatchSuccessMessage(dispatch, response.message);
        dispatch(loadingFalse());
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const listBills = createAsyncThunk(
  `${name}/listBiils`,
  async (projectId, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.getbills(projectId);
      if (response.code === 200) {
        dispatch(loadingFalse());
        return response.data;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const detailBill = createAsyncThunk(
  `${name}/detailBill`,
  async ({ projectId, billId }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.detailBill(projectId, billId);
      if (response.code === 200) {
        dispatch(loadingFalse());
        return response.data;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const billUpdate = createAsyncThunk(
  `${name}/billUpdate`,
  async ({ projectId, billId, form }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.billUpdate(projectId, billId, form);
      if (response.code === 200) {
        dispatch(getProject(projectId));
        dispatch(detailBill({ projectId, billId }));
        dispatch(listBills(projectId));
        dispatchSuccessMessage(dispatch, response.message);
        dispatch(loadingFalse());
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

// export const deleteBillData = createAsyncThunk(
//   `${name}/deleteBillData`,
//   async ({projectId, billId, orderId}, { dispatch }) => {
//     try {
//       dispatch(loadingTrue());
//       const response = await ProjectService.deleteBillData(projectId, billId , orderId);
//       if (response.code === 200) {
//         dispatch(getProject(projectId));
//         dispatch(detailBill({projectId, billId}));
//         dispatch(listBills(projectId));
//         dispatch(loadingFalse());
//         dispatchSuccessMessage(dispatch, response.message);
//         return response.data;
//       } else if (response.message === 'Something went wrong') {
//         dispatchErrorMessage(dispatch, "Oops... Network Issue.");
//         dispatch(loadingFalse());
//       } else {
//         dispatchErrorMessage(dispatch, response.message);
//         dispatch(loadingFalse());
//       }
//     } catch (e) {
//       if(e.message === "Cannot read properties of undefined (reading 'status')"){
//         dispatchErrorMessage(dispatch, "Network Error, please try again.");
//         dispatch(loadingFalse());
//       }else{
//         dispatchErrorMessage(dispatch, e.message);
//         dispatch(loadingFalse());
//       }
//     }
//   }
// );

export const downloadBillExcelReport = createAsyncThunk(
  `${name}/downloadBillExcelReport`,
  async ({ projectId, projectName, billId, orderDate }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.downloadBillExcelReport(
        projectId,
        billId
      );
      var arr = new Uint8Array(response.data);
      var str = String.fromCharCode.apply(String, arr);
      if (/[\u0080-\uffff]/.test(str)) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${projectName} ${orderDate} Bill.xlsx`);
        document.body.appendChild(link);
        link.click();
        dispatch(loadingFalse());
      } else {
        str = JSON.parse(str);
        dispatchWarningMessage(dispatch, str.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const downloadBillRegisterExcelReport = createAsyncThunk(
  `${name}/downloadBillRegisterExcelReport`,
  async ({projectId,
    filters,
    }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.downloadBillRegisterExcelReport(
        projectId,
    filters,
      );
      console.log("resposne",response)

      let startDate;
      if (filters.startDate === "Since Inception") {
        startDate = "Since Inception";
      } else {
        startDate = moment(filters.startDate).format("DD-MM-YYYY");
      }
      let endDate = moment(filters.endDate).format("DD-MM-YYYY");
      var arr = new Uint8Array(response.data);
      var str = "";
      for (var i = 0; i < arr.length; i++) {
        str += String.fromCharCode(arr[i]);
      }
      if (/[\u0080-\uffff]/.test(str)) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `${startDate} to ${endDate} Bill Register Excel Report.xlsx`
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
      dispatchErrorMessage(dispatch, "Network Error, please try again.");
      dispatch(loadingFalse());
    }
  }
);

export const viewBillExcelReport = createAsyncThunk(
  `${name}/viewBillExcelReport`,
  async ({ projectId, projectName, billId, orderDate }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.viewBillExcelReport(
        projectId,
        billId
      );
      if (response.code === 200) {
        dispatch(loadingFalse());
        return response.data;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const listObservations = createAsyncThunk(
  `${name}/listObservations`,
  async (projectId, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.listObservations(projectId);
      if (response.code === 200) {
        dispatch(loadingFalse());
        return response.data;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const getObservations = createAsyncThunk(
  `${name}/getObservations`,
  async (projectId, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.getObservations(projectId);
      if (response.code === 200) {
        dispatch(loadingFalse());
        return response.data;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const addObservation = createAsyncThunk(
  `${name}/addObservation`,
  async ({ projectId, payload }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.addObservation(projectId, payload);
      if (response.code === 200) {
        dispatch(listObservations(projectId));
        dispatchSuccessMessage(dispatch, response.message);
        dispatch(loadingFalse());
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const getCubeRegister = createAsyncThunk(
  `${name}/getCubeRegister`,
  async (projectId, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.getCubeRegister(projectId);
      if (response.code === 200) {
        dispatch(loadingFalse());
        return response.data;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const addCubeRegister = createAsyncThunk(
  `${name}/addCubeRegister`,
  async ({ projectId, finalData }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.addCubeRegister(finalData);
      if (response.code === 200) {
        dispatch(getCubeRegister(projectId));
        dispatchSuccessMessage(dispatch, response.message);
        dispatch(loadingFalse());
        return response.data;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
      } else {
        dispatchErrorMessage(dispatch, e.message);
      }
    }
  }
);

export const detailSample = createAsyncThunk(
  `${name}/detailSample`,
  async ({ sampleId }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.detailSample(sampleId);
      if (response.code === 200) {
        dispatch(loadingFalse());

        return response.data;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const updateSample = createAsyncThunk(
  `${name}/updateSample`,
  async ({ projectId, sampleId, finalData }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.updateSample(sampleId, finalData);
      if (response.code === 200) {
        dispatch(getCubeRegister(projectId));
        dispatch(loadingFalse());
        dispatchSuccessMessage(dispatch, response.message);
        return response.code;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const downloadCubeRegisterExcelReport = createAsyncThunk(
  `${name}/downloadCubeRegisterExcelReport`,
  async (
    { projectId, projectName, suppliers, grades, filters },
    { dispatch }
  ) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.downloadCubeRegisterExcelReport(
        projectId,
        projectName,
        suppliers,
        grades,
        filters
      );
      console.log("resposne",response)
      let startDate;
      if (filters.startDate === "Since Inception") {
        startDate = "Since Inception";
      } else {
        startDate = moment(filters.startDate).format("DD-MM-YYYY");
      }
      let endDate = moment(filters.endDate).format("DD-MM-YYYY");
      var arr = new Uint8Array(response.data);
      var str = "";
      for (var i = 0; i < arr.length; i++) {
        str += String.fromCharCode(arr[i]);
      }
      if (/[\u0080-\uffff]/.test(str)) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `${projectName} ${startDate} to ${endDate} Cube Register Excel Report.xlsx`
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
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const listIrFolders = createAsyncThunk(
  `${name}/listIrFolders`,
  async (projectId, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.listIrFolders(projectId);
      if (response.code === 200) {
        dispatch(loadingFalse());
        return response.data;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const updateIrFolder = createAsyncThunk(
  `${name}/updateIrFolder`,
  async ({ projectId, folderId, folderName, folderType }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.updateIrFolder(
        projectId,
        folderId,
        folderName
      );
      if (response.code === 200) {
        dispatch(loadingFalse());
        dispatch(listIrFolders(projectId));
        dispatchSuccessMessage(dispatch, response.message);
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
      } else {
        dispatchErrorMessage(dispatch, response.message);
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
      } else {
        dispatchErrorMessage(dispatch, e.message);
      }
    }
  }
);

export const addIrFolder = createAsyncThunk(
  `${name}/addIrFolder`,
  async ({ projectId, folderName, folderType }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.addIrFolder(
        projectId,
        folderName,
        folderType
      );
      if (response.code === 200) {
        dispatch(loadingFalse());
        dispatch(listIrFolders(projectId));
        dispatchSuccessMessage(dispatch, response.message);
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
      } else {
        dispatchErrorMessage(dispatch, response.message);
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
      } else {
        dispatchErrorMessage(dispatch, e.message);
      }
    }
  }
);

export const listGfcFolders = createAsyncThunk(
  `${name}/listGfcFolders`,
  async (projectId, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.listGfcFolders(projectId);
      if (response.code === 200) {
        dispatch(loadingFalse());
        return response.data;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const updateGfcFolder = createAsyncThunk(
  `${name}/updateGfcFolder`,
  async ({ projectId, folderId, folderName, folderType }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.updateGfcFolder(
        projectId,
        folderId,
        folderName
      );
      if (response.code === 200) {
        dispatch(loadingFalse());
        dispatch(listGfcFolders(projectId));
        dispatchSuccessMessage(dispatch, response.message);
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
      } else {
        dispatchErrorMessage(dispatch, response.message);
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
      } else {
        dispatchErrorMessage(dispatch, e.message);
      }
    }
  }
);

export const addGfcFolder = createAsyncThunk(
  `${name}/addGfcFolder`,
  async ({ projectId, folderName, folderType }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.addGfcFolder(
        projectId,
        folderName,
        folderType
      );
      if (response.code === 200) {
        dispatch(loadingFalse());
        //dispatch(listDrawings(projectId));
        dispatch(listGfcFolders(projectId));
        dispatchSuccessMessage(dispatch, response.message);
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
      } else {
        dispatchErrorMessage(dispatch, response.message);
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
      } else {
        dispatchErrorMessage(dispatch, e.message);
      }
    }
  }
);

export const listIrs = createAsyncThunk(
  `${name}/listIrs`,
  async ({ projectId, folderId }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.listIrs(projectId, folderId);
      if (response.code === 200) {
        dispatch(loadingFalse());
        return response.data;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const addIr = createAsyncThunk(
  `${name}/addIr`,
  async ({ projectId, folderId, data }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.addIr(data);
      if (response.code === 200) {
        dispatch(loadingFalse());
        dispatch(listIrs({ projectId, folderId }));
        dispatchSuccessMessage(dispatch, response.message);
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
      } else {
        dispatchErrorMessage(dispatch, response.message);
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
      } else {
        dispatchErrorMessage(dispatch, e.message);
      }
    }
  }
);

export const detailIr = createAsyncThunk(
  `${name}/detailIr`,
  async ({ projectId, irId }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.detailIr(projectId, irId);
      if (response.code === 200) {
        dispatch(loadingFalse());
        return response.data;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const updateIr = createAsyncThunk(
  `${name}/updateIr`,
  async ({ projectId, irId, data, folderId }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.updateIr(irId, data);
      if (response.code === 200) {
        dispatch(loadingFalse());
        dispatch(listIrs({ projectId, folderId }));
        dispatchSuccessMessage(dispatch, response.message);
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
      } else {
        dispatchErrorMessage(dispatch, response.message);
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
      } else {
        dispatchErrorMessage(dispatch, e.message);
      }
    }
  }
);

export const deleteIrs = createAsyncThunk(
  `${name}/deleteIrs`,
  async ({ projectId, folderId, ids }, { dispatch }) => {
    try {
      const response = await ProjectService.deleteIrs(projectId, ids);
      if (response.code === 200) {
        dispatch(getProject(projectId));
        dispatch(listIrs({ projectId, folderId }));
        dispatchSuccessMessage(dispatch, response.message);
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
      } else {
        dispatchErrorMessage(dispatch, response.message);
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
      } else {
        dispatchErrorMessage(dispatch, e.message);
      }
    }
  }
);

export const listGfcs = createAsyncThunk(
  `${name}/listGfcs`,
  async ({ projectId, folderId }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.listGfcs(projectId, folderId);
      if (response.code === 200) {
        dispatch(loadingFalse());
        return response.data;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const addGfc = createAsyncThunk(
  `${name}/addGfc`,
  async ({ projectId, folderId, data }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.addGfc(data);
      if (response.code === 200) {
        dispatch(loadingFalse());
        dispatch(listGfcs({ projectId, folderId }));
        dispatchSuccessMessage(dispatch, response.message);
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
      } else {
        dispatchErrorMessage(dispatch, response.message);
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
      } else {
        dispatchErrorMessage(dispatch, e.message);
      }
    }
  }
);

export const detailGfc = createAsyncThunk(
  `${name}/detailGfc`,
  async ({ projectId, gfcId }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.detailGfc(projectId, gfcId);
      if (response.code === 200) {
        dispatch(loadingFalse());
        return response.data;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const updateGfc = createAsyncThunk(
  `${name}/updateGfc`,
  async ({ projectId, gfcId, data, folderId }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.updateGfc(gfcId, data);
      if (response.code === 200) {
        dispatch(loadingFalse());
        dispatch(listGfcs({ projectId, folderId }));
        dispatchSuccessMessage(dispatch, response.message);
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
      } else {
        dispatchErrorMessage(dispatch, response.message);
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
      } else {
        dispatchErrorMessage(dispatch, e.message);
      }
    }
  }
);

export const listRfis = createAsyncThunk(
  `${name}/listRfis`,
  async (projectId, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.listRfis(projectId);
      if (response.code === 200) {
        dispatch(loadingFalse());
        return response.data;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const addRfi = createAsyncThunk(
  `${name}/addRfi`,
  async ({ projectId, data }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.addRfi(data);
      if (response.code === 200) {
        dispatch(loadingFalse());
        dispatch(listRfis(projectId));
        dispatchSuccessMessage(dispatch, response.message);
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
      } else {
        dispatchErrorMessage(dispatch, response.message);
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
      } else {
        dispatchErrorMessage(dispatch, e.message);
      }
    }
  }
);

export const detailRfi = createAsyncThunk(
  `${name}/detailRfi`,
  async ({ projectId, rfiId }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.detailRfi(projectId, rfiId);
      if (response.code === 200) {
        dispatch(loadingFalse());
        return response.data;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const updateRfi = createAsyncThunk(
  `${name}/updateRfi`,
  async ({ projectId, rfiId, data }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.updateRfi(rfiId, data);
      if (response.code === 200) {
        dispatch(loadingFalse());
        dispatch(listRfis(projectId));
        dispatchSuccessMessage(dispatch, response.message);
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
      } else {
        dispatchErrorMessage(dispatch, response.message);
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
      } else {
        dispatchErrorMessage(dispatch, e.message);
      }
    }
  }
);

export const getInformation = createAsyncThunk(
  `${name}/getInformation`,
  async (projectId, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.getInformation(projectId);
      if (response.code === 200) {
        dispatch(loadingFalse());
        return response.data;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const addInformation = createAsyncThunk(
  `${name}/addInformation`,
  async ({ projectId, form }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.addInformation(projectId, form);
      if (response.code === 200) {
        dispatch(getInformation(projectId));
        dispatchSuccessMessage(dispatch, response.message);
        dispatch(loadingFalse());
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const addRepairHistory = createAsyncThunk(
  `${name}/addRepairHistory`,
  async ({ projectId, form }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.addRepairHistory(projectId, form);
      if (response.code === 200) {
        dispatch(getInformation(projectId));
        dispatchSuccessMessage(dispatch, response.message);
        dispatch(loadingFalse());
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const getTutorial = createAsyncThunk(`${name}/getTutorial`, async () => {
  try {
    let response = await ProjectService.getTutorial();
    if (response.code === 200) {
      return response.data;
    }
  } catch (e) {
    // dispatchErrorMessage(dispatch, e.message);
  }
});

export const updateInformation = createAsyncThunk(
  `${name}/updateInformation`,
  async ({ projectId, form }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await ProjectService.updateInformation(projectId, form);
      if (response.code === 200) {
        dispatch(getInformation(projectId));
        dispatchSuccessMessage(dispatch, response.message);
        dispatch(loadingFalse());
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, response.message);
        dispatch(loadingFalse());
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
        dispatch(loadingFalse());
      } else {
        dispatchErrorMessage(dispatch, e.message);
        dispatch(loadingFalse());
      }
    }
  }
);

export const getReportSummary = createAsyncThunk(
  `${name}/getReportSummary`,
  async ({ projectId, date }, { dispatch }) => {
    try {
      const response = await ProjectService.getReportSummary(projectId, date);
      if (response.code === 200) {
        return response.data;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
      } else {
        dispatchErrorMessage(dispatch, response.message);
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
      } else {
        dispatchErrorMessage(dispatch, e.message);
      }
    }
  }
);

export const getSSADashboard = createAsyncThunk(
  `${name}/getSSADashboard`,
  async ({ userId, orgId, dashDate }, { dispatch }) => {
    try {
      const response = await ProjectService.getSSADashboard(
        orgId,
        dashDate,
        userId
      );
      if (response.code === 200) {
        return response.data;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
      } else {
        dispatchErrorMessage(dispatch, response.message);
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
      } else {
        dispatchErrorMessage(dispatch, e.message);
      }
    }
  }
);

export const getDashboardAsPerProject = createAsyncThunk(
  `${name}/getDashboardAsPerProject`,
  async ({ projectId, invId }, { dispatch }) => {
    try {
      const response = await ProjectService.getDashboardAsPerProject(
        projectId,
        invId
      );
      if (response.code === 200) {
        return response.data;
      } else if (response.message === "Something went wrong") {
        dispatchErrorMessage(dispatch, "Oops... Network Issue.");
      } else {
        dispatchErrorMessage(dispatch, response.message);
      }
    } catch (e) {
      if (
        e.message === "Cannot read properties of undefined (reading 'status')"
      ) {
        dispatchErrorMessage(dispatch, "Network Error, please try again.");
      } else {
        dispatchErrorMessage(dispatch, e.message);
      }
    }
  }
);

let initialState = {
  entities: "",
  dashboard: "",
  details: "",
  tutorialSteps: [],
  document: {
    documentsArray: [],
    detailDocument: "",
  },
  documentFolders: [],
  drawingFolders: [],
  drawings: {
    drawingList: [],
    detailDrawing: "",
  },
  irFolders: [],
  irs: {
    irList: [],
    detailIr: "",
  },
  rfis: {
    rfiList: [],
    detailRfi: "",
  },
  gfcFolders: [],
  gfcs: {
    gfcList: [],
    detailGfc: "",
  },
  tasks: {
    tasksArray: [],
    taskDetails: {},
  },
  mom : {
    momArray: [],
    momDetails: {},
  },
  checklist: {
    checklistArray: [],
    detailChecklist: {
      details: "",
      checklistGroup: [],
    },
  },
  template: {
    templateArray: [],
    detailTemplate: {},
  },
  routes: "Dashboard",
  reports: [],
  reportSummary: [],
  // reportTemplate:[],
  // structuralAuditPath:"./StructuralAudit",
  detailReport: "",
  material: [],
  labour: [],
  equipment: [],
  hindrance: [],
  indent: [],
  sitevisitor: [],
  staff: [],
  notes: [],
  consumption: [],
  workProgress: [],
  attachments: [],
  files: [],
  milestones: {
    milestonesList: [],
    detailMilestone: "",
  },
  safetyNcrs: {
    safetyNcrsList: [],
    detailSafetyNcr: "",
    viewData: [],
  },
  qualityNcrs: {
    qualityNcrsList: [],
    detailQualityNcr: "",
  },
  workBOQs: {
    workBOQsList: [],
    detailWorkBOQ: "",
  },
  indent: {
    indentList: [],
    detailIndent: "",
    pendingIntentsCount: 0,
  },
  purchaseOrders: {
    purchaseOrderList: [],
    detailPurchaseOrder: "",
  },
  supplierPo: [],
  workOrders: {
    workOrderList: [],
    detailWorkOrder: "",
  },
  bills: {
    billsList: [],
    detailBill: "",
  },
  vendors: {
    vendorsList: [],
    detailVendor: "",
  },
  billing: {
    billingList: [],
    detailBilling: "",
    LastRecord: [],
  },
  inventories: [],
  detailInventory: "",
  reportObservations: {
    observationsArray: [],
  },
  observations: {
    observationsArray: [],
  },
  additionalInformation: {
    ward: "",
    constructionYear: "",
    no_of_storey: "",
    use: "",
    date_of_inspection: "",
    validity_period: "",
    constructionMode: {
      foundation: "",
      floors: "",
      walls: "",
      beams: "",
      coloums: "",
      roof: "",
    },
    conditionsOf: {
      internalPlaster: "",
      externalPlaster: "",
      plumbing: "",
      drainLinesChambers: "",
    },
    breifDescription: {
      waterproofing: "",
      externalPlaster: "",
      slabRecasting: "",
      columnJacketing: "",
      structuralRepairs: "",
      rccCover: "",
      beamRecasting: "",
      partialEvacuation: "",
      propping: "",
      criticalObservation: "",
    },
    conclusions: {
      livableRepairs: [{ observations: "", key_reason: "" }],
      structuralRepairs: [{ observations: "", key_reason: "" }],
      course_of_repairs: [{ observations: "", key_reason: "" }],
      nature_of_repairs: [{ observations: "", key_reason: "" }],
      propping: [{ observations: "", key_reason: "" }],
      safety_measures: [{ observations: "", key_reason: "" }],
      enhancement: [{ observations: "", key_reason: "" }],
      repairCost: [{ observations: "", key_reason: "" }],
      reconstructionCost: [{ observations: "", key_reason: "" }],
      remarks: [{ observations: "", key_reason: "" }],
      critical_condition: [{ observations: "", key_reason: "" }],
    },
    image: {
      name: "",
      url: "",
      size: "",
    },
    repairHistory: [],
  },
  cubeRegister: {
    sampleList: [],
    detailSample: "",
  },

  loading: false,
  projectDialog: {
    Dialogtype: "new",
    props: {
      open: false,
    },
    data: null,
  },
};
const projectsSlice = createSlice({
  name: "projects",
  initialState: initialState,
  reducers: {
    detailsChecklist: (state, action) => {
      let detailChecklist = {
        details: action.payload,

        detailItem: {
          comments: [],
        },
      };
      state.checklist.detailChecklist = detailChecklist;
    },
    detailTemplate: (state, action) => {
      let grouped = _.mapValues(
        _.groupBy(action.payload.templateData, "category"),
        (clist) => clist.map((item) => _.omit(item, "category"))
      );
      let detailTemplate = {
        details: action.payload,
        templateItems: Object.entries(grouped).map((item) => ({
          [item[0]]: item[1],
        })),
      };
      state.template.detailTemplate = detailTemplate;
    },
    routes: (state, action) => {
      state.routes = action.payload;
    },
    // structuralAuditPath: (state, action) => {
    //   state.structuralAuditPath= action.payload;
    // },
    clearDocumentDetails: (state) => {
      state.document.detailDocument = "";
    },
    updateMaterial: (state, action) => {
      state.material = action.payload;
    },
    updateLabour: (state, action) => {
      state.labour = action.payload;
    },
    updateHindrance: (state, action) => {
      state.hindrance = action.payload;
    },
    updateIndent: (state, action) => {
      state.indent = action.payload;
    },
    updateSitevisitor: (state, action) => {
      state.sitevisitor = action.payload;
    },
    updateStaff: (state, action) => {
      state.staff = action.payload;
    },
    updateNotes: (state, action) => {
      state.notes = action.payload;
    },
    updateConsumption: (state, action) => {
      state.consumption = action.payload;
    },
    updateWorkProgress: (state, action) => {
      state.workProgress = action.payload;
    },
    updateEquipment: (state, action) => {
      state.equipment = action.payload;
    },
    updateAttachments: (state, action) => {
      state.attachments = action.payload;
    },
    back: (state, action) => {
      state.details = "";
      state.routes = "";
      state.document = {
        documentsArray: [],
        detailDocument: "",
      };
      state.vendors = {
        vendorsList: [],
        detailVendor: "",
      };
      state.milestones = {
        milestonesList: [],
        detailMilestone: "",
      };
      state.safetyNcrs = {
        safetyNcrsList: [],
        detailSafetyNcr: "",
        viewData: [],
      };
      state.qualityNcrs = {
        qualityNcrsList: [],
        detailQualityNcr: "",
      };
      state.workBOQs = {
        workBOQsList: [],
        detailWorkBOQ: "",
      };
      state.indent = {
        indentList: [],
       detailIndent: "",
       pendingIntentsCount: 0,
      };
      state.bills = {
        billsList: [],
        detailBill: "",
      };
      state.purchaseOrders = {
        purchaseOrderList: [],
        detailPurchaseOrder: "",
      };
      state.supplierPo = [];
      state.workOrders = {
        workOrderList: [],
        detailWorkOrder: "",
      };
      state.cubeRegister = {
        sampleList: [],
        detailSample: "",
      };
      state.tasks = {
        tasksArray: [],
        taskDetails: {},
      };
      state.mom = {
        momArray: [],
        momDetails: {},
      };
      state.checklist = {
        checklistArray: [],
        detailChecklist: {
          details: "",
          checklistGroup: [],
        },
      };
      state.template = {
        templateArray: [],
        detailTemplate: {},
      };
      state.routes = "Dashboard";
      // state.reportTemplate=[];
      // state.structuralAuditPath="./StructuralAudit";
    },
    openNewDialog: (state, action) => {
      if (action.payload !== undefined) {
        state.projectDialog = {
          Dialogtype: "new",
          props: {
            open: true,
          },
          data: action.payload,
        };
      } else {
        state.projectDialog = {
          Dialogtype: "new",
          props: {
            open: true,
          },
          data: null,
        };
      }
    },
    closeNewDialog: (state, action) => {
      state.projectDialog = {
        Dialogtype: "new",
        props: {
          open: false,
        },
        data: null,
      };
    },
    openEditDialog: (state, action) => {
      if (action.payload.type === undefined) {
        state.projectDialog = {
          Dialogtype: "edit",
          props: {
            open: true,
          },
          data: action.payload,
        };
      } else {
        state.projectDialog = {
          Dialogtype: "edit",
          props: {
            open: true,
          },
          type: action.payload.type,
          index: action.payload.index,
          data: action.payload.payload,
        };
      }
    },
    closeEditDialog: (state, action) => {
      if (action.payload === undefined) {
        state.projectDialog = {
          Dialogtype: "edit",
          props: {
            open: false,
          },
          data: null,
        };
      } else if (action.payload.type !== undefined) {
        state.projectDialog = {
          Dialogtype: "edit",
          props: {
            open: true,
          },
          type: action.payload.type,
          index: action.payload.index,
          data: action.payload.payload,
        };
      }
    },
    clearStates: (state, action) => {
      state.material = [];
      state.labour = [];
      state.equipment = [];
      state.hindrance = [];
      state.indent = [];
      state.sitevisitor = [];
      state.staff = [];
      state.notes = [];
      state.workProgress = [];
      state.attachments = [];
      state.files = [];
      state.consumption = [];
      // state.routes = 'Upload';
    },
    clearEntities: (state, action) => {
      state.entities = "";
    },
    loadingTrue: (state) => {
      state.loading = true;
    },
    loadingFalse: (state) => {
      state.loading = false;
    },
    clearAllStates: (state) => initialState,
  },
  extraReducers: {
    // [getProject.fulfilled]: (state, action) => action.payload,
    [getProjects.fulfilled]: (state, action) => {
      if (action.payload === undefined) {
        state.entities = "";
      } else {
        state.entities = action.payload;
      }
    },
    [getAllProjects.fulfilled]: (state, action) => {
      if (action.payload === undefined) {
        state.entities = "";
      } else {
        state.entities = action.payload;
      }
    },
    [getProject.fulfilled]: (state, action) => {
      if (action.payload === undefined) {
        state.details = [];
        state.template.templateArray = [];
        state.checklist.checklistArray = [];
        state.details.module = [];
      } else {
        state.details = action.payload;
        if (action.payload.module === undefined) {
          state.details.module = [];
        } else {
          state.details.module = action.payload.module;
        }
        if (action.payload.checklist.length) {
          let checklists = [];
          action.payload.checklist.forEach((item) => {
            if (item.status !== 2) {
              checklists.push(item);
            }
          });
          state.checklist.checklistArray = checklists;
        }

        if (action.payload.checklistTemplates.length) {
          let templates = [];
          action.payload.checklistTemplates.forEach((item) => {
            if (item.status !== 2) {
              templates.push(item);
            }
          });
          state.template.templateArray = templates;
        }
      }

      // if(action.payload.reportTemplate===undefined)
      // {
      //   state.reportTemplate=[];
      //   localStorage.setItem("structuralAuditPath","./StructuralAudit")
      // }else{
      //   state.reportTemplate=action.payload.reportTemplate;
      //   const template = state.reportTemplate.filter(i => i.name === "Structural_Audit_Report")
      // if(template.length>0)
      // {
      //  state.structuralAuditPath=template[0].url;
      //  localStorage.setItem("structuralAuditPath",template[0].url)
      // }else{
      //   state.structuralAuditPath="./StructuralAudilt";
      //   localStorage.setItem("structuralAuditPath","./StructuralAudit")
      // }
      // }

      // if (action.payload.documents.length) {
      //   state.document = {
      //     documentsArray: [],
      //     detailDocument: "",
      //   };
      //   let data = JSON.parse(JSON.stringify(action.payload));
      //   data.documents.forEach((doc) => {
      //     if (doc.status === 1) {
      //       doc.url = doc.file;
      //       doc.file = decodeURI(doc.file.replace(/^.*[\\\/]/, ""));
      //       if (doc.size) {
      //         if (doc.size / Math.pow(1024, 3) > 1) {
      //           doc.size = (doc.size / Math.pow(1024, 3)).toFixed(1) + "GB";
      //         } else if (
      //           doc.size / Math.pow(1024, 3) < 1 &&
      //           doc.size / Math.pow(1024, 2) > 1
      //         ) {
      //           doc.size = (doc.size / Math.pow(1024, 2)).toFixed(1) + "MB";
      //         } else if (doc.size / 1000000 < 1 && doc.size / 1000 > 1) {
      //           doc.size = (doc.size / 1024).toFixed(1) + "KB";
      //         } else {
      //           doc.size = doc.size.toFixed(1) + "B";
      //         }
      //       }
      //       state.document.documentsArray.push(doc);
      //     }
      //   });
      // }
    },
    [getTutorial.fulfilled]: (state, action) => {
      if (action.payload !== undefined) {
        state.tutorialSteps = action.payload;
      } else {
        state.tutorialSteps = [];
      }
    },
    [listTasks.fulfilled]: (state, action) => {
      let newArray = [];
      if (action.payload !== undefined) {
        action.payload.forEach((arr) => {
          if (arr.status !== 2) {
            newArray.push(arr);
          }
        });
      } else {
        state.tasks.tasksArray = newArray;
      }

      state.tasks.tasksArray = newArray;
    },
    [listDocuments.fulfilled]: (state, action) => {
      // state.document.documentsArray = action.payload;
      if (action.payload) {
        state.document = {
          documentsArray: [],
          detailDocument: "",
        };
        let documents = JSON.parse(JSON.stringify(action.payload));
        documents.forEach((doc) => {
          if (doc.status === 1) {
            doc.url = doc.file;
            doc.file = decodeURI(doc.file.replace(/^.*[\\]/, ""));
            if (doc.size) {
              if (doc.size / Math.pow(1024, 3) > 1) {
                doc.size = (doc.size / Math.pow(1024, 3)).toFixed(1) + "GB";
              } else if (
                doc.size / Math.pow(1024, 3) < 1 &&
                doc.size / Math.pow(1024, 2) > 1
              ) {
                doc.size = (doc.size / Math.pow(1024, 2)).toFixed(1) + "MB";
              } else if (doc.size / 1000000 < 1 && doc.size / 1000 > 1) {
                doc.size = (doc.size / 1024).toFixed(1) + "KB";
              } else {
                doc.size = doc.size.toFixed(1) + "B";
              }
            }
            state.document.documentsArray.push(doc);
          }
        });
      } else if (action.payload === undefined) {
        state.document = {
          documentsArray: [],
          detailDocument: "",
        };
      }
    },
    [getDocument.fulfilled]: (state, action) => {
      if (action.payload === undefined) {
        state.document.detailDocument = "";
      } else {
        state.document.detailDocument = action.payload;
      }
    },
    [listDocumentFolders.fulfilled]: (state, action) => {
      if (action.payload !== undefined) {
        state.documentFolders = action.payload;
      } else {
        state.documentFolders = [];
      }
    },

    [listDrawingFolders.fulfilled]: (state, action) => {
      if (action.payload !== undefined) {
        state.drawingFolders = action.payload;
      } else {
        state.drawingFolders = [];
      }
    },

    [listDrawings.fulfilled]: (state, action) => {
      if (action.payload !== undefined) {
        state.drawings.drawingList = action.payload;
      } else {
        state.drawings.drawingList = [];
      }
    },

    [detailDrawing.fulfilled]: (state, action) => {
      if (action.payload === undefined) {
        state.drawings.detailDrawing = "";
      } else {
        state.drawings.detailDrawing = action.payload;
      }
    },

    [listIrFolders.fulfilled]: (state, action) => {
      if (action.payload !== undefined) {
        state.irFolders = action.payload;
      } else {
        state.irFolders = [];
      }
    },

    [listGfcFolders.fulfilled]: (state, action) => {
      if (action.payload !== undefined) {
        state.gfcFolders = action.payload;
      } else {
        state.gfcFolders = [];
      }
    },

    [listIrs.fulfilled]: (state, action) => {
      if (action.payload !== undefined) {
        state.irs.irList = action.payload;
      } else {
        state.irs.irList = [];
      }
    },

    [detailIr.fulfilled]: (state, action) => {
      if (action.payload === undefined) {
        state.irs.detailIr = "";
      } else {
        state.irs.detailIr = action.payload;
      }
    },

    [listGfcs.fulfilled]: (state, action) => {
      if (action.payload !== undefined) {
        state.gfcs.gfcList = action.payload;
      } else {
        state.gfcs.gfcList = [];
      }
    },

    [detailGfc.fulfilled]: (state, action) => {
      if (action.payload === undefined) {
        state.gfcs.detailGfc = "";
      } else {
        state.gfcs.detailGfc = action.payload;
      }
    },

    [listRfis.fulfilled]: (state, action) => {
      if (action.payload !== undefined) {
        state.rfis.rfiList = action.payload;
      } else {
        state.rfis.rfiList = [];
      }
    },

    [detailRfi.fulfilled]: (state, action) => {
      if (action.payload === undefined) {
        state.rfis.detailRfi = "";
      } else {
        state.rfis.detailRfi = action.payload;
      }
    },

    [listMilestones.fulfilled]: (state, action) => {
      if (action.payload !== undefined) {
        state.milestones.milestonesList = action.payload;
      } else {
        state.milestones.milestonesList = [];
      }
    },
    [detailMilestone.fulfilled]: (state, action) => {
      if (action.payload === undefined) {
        state.milestones.detailMilestone = "";
      } else {
        state.milestones.detailMilestone = action.payload;
      }
    },

    [listSafetyNcrs.fulfilled]: (state, action) => {
      if (action.payload !== undefined) {
        state.safetyNcrs.safetyNcrsList = action.payload;
      } else {
        state.safetyNcrs.safetyNcrsList = [];
      }
    },

    [viewSafetyNcrExcelReport.fulfilled]: (state, action) => {
      if (action.payload !== undefined) {
        state.safetyNcrs.viewData = action.payload;
      } else {
        state.safetyNcrs.viewData = [];
      }
    },

    [detailSafetyData.fulfilled]: (state, action) => {
      if (action.payload === undefined) {
        state.safetyNcrs.detailSafetyNcr = "";
      } else {
        state.safetyNcrs.detailSafetyNcr = action.payload;
      }
    },

    [listQualityNcrs.fulfilled]: (state, action) => {
      if (action.payload !== undefined) {
        state.qualityNcrs.qualityNcrsList = action.payload;
      } else {
        state.qualityNcrs.qualityNcrsList = [];
      }
    },

    [detailQualityData.fulfilled]: (state, action) => {
      if (action.payload === undefined) {
        state.qualityNcrs.detailQualityNcr = "";
      } else {
        state.qualityNcrs.detailQualityNcr = action.payload;
      }
    },

    [listItems.fulfilled]: (state, action) => {
      if (action.payload !== undefined) {
        state.workBOQs.workBOQsList = action.payload;
      } else {
        state.workBOQs.workBOQsList = [];
      }
    },
    [detailWorkBOQItem.fulfilled]: (state, action) => {
      if (action.payload === undefined) {
        state.workBOQs.detailWorkBOQ = "";
      } else {
        state.workBOQs.detailWorkBOQ = action.payload;
      }
    },
    [listBills.fulfilled]: (state, action) => {
      if (action.payload !== undefined) {
        state.bills.billsList = action.payload;
      } else {
        state.bills.billsList = [];
      }
    },
    [detailBill.fulfilled]: (state, action) => {
      if (action.payload === undefined) {
        state.bills.detailBill = "";
      } else {
        state.bills.detailBill = action.payload;
      }
    },
    [listIndent.fulfilled]: (state, action) => {
      state.indent.indentList = action.payload.intents?? [];
      state.indent.pendingIntentsCount =action.payload.pendingIntentsCount?? 0
    }, 
    [detailIndent.fulfilled]: (state, action) => {
      state.indent.detailIndent = action.payload ?? [];
    },    
    [listPurchaseOrders.fulfilled]: (state, action) => {
      if (action.payload !== undefined) {
        state.purchaseOrders.purchaseOrderList = action.payload;
      } else {
        state.purchaseOrders.purchaseOrderList = [];
      }
    },
    [detailPurchaseOrder.fulfilled]: (state, action) => {
      if (action.payload === undefined) {
        state.purchaseOrders.detailPurchaseOrder = "";
      } else {
        state.purchaseOrders.detailPurchaseOrder = action.payload;
      }
    },
    [fecthPurchaseOrderBySupplierId.fulfilled]: (state, action) => {
      if (action.payload === undefined) {
        state.supplierPo = [];
      } else {
        state.supplierPo = action.payload;
      }
    },

    [listWorkOrders.fulfilled]: (state, action) => {
      if (action.payload !== undefined) {
        state.workOrders.workOrderList = action.payload;
      } else {
        state.workOrders.workOrderList = [];
      }
    },
    [detailWorkOrder.fulfilled]: (state, action) => {
      if (action.payload === undefined) {
        state.workOrders.detailWorkOrder = "";
      } else {
        state.workOrders.detailWorkOrder = action.payload;
      }
    },
    [taskDetails.fulfilled]: (state, action) => {
      if (action.payload === undefined) {
        state.tasks.taskDetails = {};
      } else {
        state.tasks.taskDetails = action.payload;
      }
    },
    [dashboard.fulfilled]: (state, action) => {
      if (action.payload === undefined) {
        state.dashboard = "";
      } else {
        state.dashboard = action.payload;
      }
    },
    [detailChecklist.fulfilled]: (state, action) => {
      // let grouped = _.mapValues(
      //   _.groupBy(action.payload.groupData, 'category'),
      //   (clist) => clist.map((item) => _.omit(item, 'category'))
      // );

      // const group = Object.keys(action.payload.groupData);
      if (action.payload === undefined) {
        state.checklist.detailChecklist = {
          details: "",
          checklistGroup: [],
          detailItem: {
            comments: [],
          },
        };
      } else {
        let group = [];
        Object.keys(action.payload.groupData).forEach(function (key) {
          group.push({ category: key, details: action.payload.groupData[key] });
        });

        let detailChecklist = {
          details: action.payload,
          checklistGroup: group,
          // checklistItems: Object.entries(grouped).map((item) => ({
          //   [item[0]]: item[1],
          // })),
          detailItem: {
            comments: [],
          },
        };
        state.checklist.detailChecklist = detailChecklist;
        // state.checklist.detailChecklist.details = action.payload;
      }
    },
    [detailItem.fulfilled]: (state, action) => {
      if (action.payload === undefined) {
        state.checklist.detailChecklist.detailItem = {
          comments: [],
        };
      } else {
        state.checklist.detailChecklist.detailItem = action.payload;
      }
    },
    [getReports.fulfilled]: (state, action) => {
      if (action.payload === undefined) {
        state.reports = [];
      } else {
        state.reports = action.payload;
      }
    },
    [getReportSummary.fulfilled]: (state, action) => {
      if (action.payload === undefined) {
        state.reportSummary = [];
      } else {
        state.reportSummary = action.payload;
      }
    },
    [getDetailReport.fulfilled]: (state, action) => {
      if (action.payload === undefined) {
        state.detailReport = "";
      } else {
        state.detailReport = action.payload;

        if (
          action.payload.inventory === null ||
          action.payload.inventory === undefined
        ) {
          state.material = [];
        } else {
          state.material = action.payload.inventory;
        }

        if (
          action.payload.labour === null ||
          action.payload.labour === undefined
        ) {
          state.labour = [];
        } else {
          state.labour = action.payload.labour;
        }

        if (
          action.payload.equipment === null ||
          action.payload.equipment === undefined
        ) {
          state.equipment = [];
        } else {
          state.equipment = action.payload.equipment;
        }

        if (
          action.payload.hindrance === null ||
          action.payload.hindrance === undefined
        ) {
          state.hindrance = [];
        } else {
          state.hindrance = action.payload.hindrance;
        }

        if (
          action.payload.indent === null ||
          action.payload.indent === undefined
        ) {
          state.indent = [];
        } else {
          state.indent = action.payload.indent;
        }

        if (
          action.payload.consumption === null ||
          action.payload.consumption === undefined
        ) {
          state.consumption = [];
        } else {
          state.consumption = action.payload.consumption;
        }

        if (
          action.payload.sitevisitor === null ||
          action.payload.sitevisitor === undefined
        ) {
          state.sitevisitor = [];
        } else {
          state.sitevisitor = action.payload.sitevisitor;
        }

        if (
          action.payload.staff === null ||
          action.payload.staff === undefined
        ) {
          state.staff = [];
        } else {
          state.staff = action.payload.staff;
        }

        if (
          action.payload.notes === null ||
          action.payload.notes === undefined
        ) {
          state.notes = [];
        } else {
          state.notes = action.payload.notes;
        }

        if (
          action.payload.workProgress === null ||
          action.payload.workProgress === undefined
        ) {
          state.workProgress = [];
        } else {
          state.workProgress = action.payload.workProgress;
        }

        if (
          action.payload.attachments === null ||
          action.payload.attachments === undefined
        ) {
          state.attachments = [];
        } else {
          state.attachments = action.payload.attachments;
        }
      }
      state.loading = false;
    },
    [getVendors.fulfilled]: (state, action) => {
      if (action.payload === undefined) {
        state.vendors.vendorsList = [];
      } else {
        state.vendors.vendorsList = action.payload;
      }
    },
    [getBillings.fulfilled]: (state, action) => {
      if (action.payload !== undefined) {
        state.billing.billingList = action.payload;
      } else {
        state.billing.billingList = [];
      }
    },
    [getBillingLastRecord.fulfilled]: (state, action) => {
      if (action.payload !== undefined) {
        state.billing.LastRecord = action.payload;
      } else {
        state.billing.LastRecord = [];
      }
    },
    [detailVendor.fulfilled]: (state, action) => {
      if (action.payload === undefined) {
        state.vendors.detailVendor = "";
      } else {
        state.vendors.detailVendor = action.payload;
      }
    },

    [detailSample.fulfilled]: (state, action) => {
      if (action.payload === undefined) {
        state.cubeRegister.detailSample = "";
      } else {
        state.cubeRegister.detailSample = action.payload;
      }
    },
    [detailBilling.fulfilled]: (state, action) => {
      if (action.payload === undefined) {
        state.billing.detailBilling = "";
      } else {
        state.billing.detailBilling = action.payload;
      }
    },
    [listInventories.fulfilled]: (state, action) => {
      if (action.payload === undefined) {
        state.inventories = [];
      } else {
        state.inventories = action.payload;
      }
    },
    [getInventory.fulfilled]: (state, action) => {
      if (action.payload === undefined) {
        state.detailInventory = "";
      } else {
        state.detailInventory = action.payload;
      }
    },
    [listObservations.fulfilled]: (state, action) => {
      if (action.payload === undefined) {
        state.observations.observationsArray = [];
      } else {
        state.observations.observationsArray = action.payload;
      }
    },
    [getObservations.fulfilled]: (state, action) => {
      if (action.payload === undefined) {
        state.reportObservations.observationsArray = [];
      } else {
        state.reportObservations.observationsArray = action.payload;
      }
    },
    [getInformation.fulfilled]: (state, action) => {
      if (action.payload === undefined) {
        state.additionalInformation = {
          ward: "",
          constructionYear: "",
          no_of_storey: "",
          use: "",
          date_of_inspection: "",
          validity_period: "",
          constructionMode: {
            foundation: "",
            floors: "",
            walls: "",
            beams: "",
            coloums: "",
            roof: "",
          },
          conditionsOf: {
            internalPlaster: "",
            externalPlaster: "",
            plumbing: "",
            drainLinesChambers: "",
          },
          breifDescription: {
            waterproofing: "",
            externalPlaster: "",
            slabRecasting: "",
            columnJacketing: "",
            structuralRepairs: "",
            rccCover: "",
            beamRecasting: "",
            partialEvacuation: "",
            propping: "",
            criticalObservation: "",
          },
          conclusions: {
            livableRepairs: [{ observations: "", key_reason: "" }],
            structuralRepairs: [{ observations: "", key_reason: "" }],
            course_of_repairs: [{ observations: "", key_reason: "" }],
            nature_of_repairs: [{ observations: "", key_reason: "" }],
            propping: [{ observations: "", key_reason: "" }],
            safety_measures: [{ observations: "", key_reason: "" }],
            enhancement: [{ observations: "", key_reason: "" }],
            repairCost: [{ observations: "", key_reason: "" }],
            reconstructionCost: [{ observations: "", key_reason: "" }],
            remarks: [{ observations: "", key_reason: "" }],
            critical_condition: [{ observations: "", key_reason: "" }],
          },
          image: {
            name: "",
            url: "",
            size: "",
          },
          repairHistory: [],
        };
      } else {
        state.additionalInformation = action.payload;
      }
    },
    [getCubeRegister.fulfilled]: (state, action) => {
      if (action.payload !== undefined) {
        state.cubeRegister.sampleList = action.payload;
      } else {
        state.cubeRegister.sampleList = [];
      }
    },
  },
});

export const {
  detailsChecklist,
  detailTemplate,
  routes,
  //structuralAuditPath,
  clearDocumentDetails,
  updateMaterial,
  updateLabour,
  updateSitevisitor,
  updateStaff,
  updateNotes,
  updateConsumption,
  updateWorkProgress,
  updateHindrance,
  updateIndent,
  updateEquipment,
  updateAttachments,
  back,
  clearStates,
  clearEntities,
  openNewDialog,
  closeNewDialog,
  openEditDialog,
  closeEditDialog,
  loadingTrue,
  loadingFalse,
  clearAllStates,
} = projectsSlice.actions;

export default projectsSlice.reducer;
