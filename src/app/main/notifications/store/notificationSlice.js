import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import NotificationService from "app/services/NotificationService";
import {  dispatchErrorMessage } from "app/utils/MessageDispatcher";
import { notificationCount } from "app/store/fuse/navigationSlice";

let name = "notification";
export const getNotification = createAsyncThunk(
  `${name}/getNotification`,
  async (userId, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await NotificationService.getNotification(userId);
      if (response.code === 200) {
        dispatch(unreadCount(userId));
        dispatch(loadingFalse());
        return response.data;
      } else {
        dispatch(loadingFalse());
        dispatchErrorMessage(dispatch, response.message);
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

export const getNotificationForAdmin = createAsyncThunk(
  `${name}/getNotificationForAdmin`,
  async ({userId, page, limit, text}, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await NotificationService.getNotificationForAdmin(userId, page, limit, text);
      if (response.code === 200) {
        dispatch(loadingFalse());
        return response.data;
      } else {
        dispatch(loadingFalse());
        dispatchErrorMessage(dispatch, response.message);
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


export const deleteNotifications = createAsyncThunk(
  `${name}/deleteNotifications`,
  async ({selectedIds, userId, page, limit }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await NotificationService.deleteNotifications(selectedIds);
      if (response.code === 200) {
        dispatch(getNotificationForAdmin({userId, page, limit}));
        dispatch(loadingFalse());
        return response.data;
      } else {
        dispatch(loadingFalse());
        dispatchErrorMessage(dispatch, response.message);
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

export const unreadCount = createAsyncThunk(
  `${name}/unreadCount`,
  async (userId, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await NotificationService.unreadCount(userId);
      if (response.code === 200) {
        dispatch(loadingFalse());

        dispatch(notificationCount(response.data));
        return response.data;
      } else {
        dispatch(loadingFalse());
        dispatchErrorMessage(dispatch, response.message);
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

export const readNotification = createAsyncThunk(
  `${name}/readNotification`,
  async ({notificationId, userId}, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await NotificationService.readNotification(
        notificationId
      );
      if (response.code === 200) {
        dispatch(getNotification(userId));
        dispatch(unreadCount(userId));
        dispatch(loadingFalse());
        return response.data;
      } else {
        dispatch(loadingFalse());
        dispatchErrorMessage(dispatch, response.message);
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

export const addNotifications = createAsyncThunk(
  `${name}/addNotifications`,
  async ({data, userId, page, limit }, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await NotificationService.addNotifications(data);
      if (response.code === 200) {
        dispatch(getNotificationForAdmin({userId, page, limit}));
        dispatch(loadingFalse());
        return response.data;
      } else {
        dispatch(loadingFalse());
        dispatchErrorMessage(dispatch, response.message);
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

export const getInvoiceNotifications = createAsyncThunk(
  `${name}/getInvoiceNotifications`,
  async (userId, { dispatch }) => {
    try {
      dispatch(loadingTrue());
      const response = await NotificationService.getInvoiceNotifications(userId);
      if (response.code === 200) {
        dispatch(loadingFalse());
        dispatch(notificationCount(response.data));
        return response.data;
      } else {
        dispatch(loadingFalse());
        dispatchErrorMessage(dispatch, response.message);
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

const notificationSlice = createSlice({
  name: name,
  initialState: {
    entities: [],
    loading: false,
    unreadCount: 0,
    count:0,
    invoice: []
  },
  reducers: {
    loadingTrue: (state) => {
      state.loading = true;
    },
    loadingFalse: (state) => {
      state.loading = false;
    },
    updateInvoiceNotifications: (state, action) => {
      state.invoice = [];
    },
  },
  extraReducers: {
    [getNotification.fulfilled]: (state, action) => {
      if(action.payload === undefined){
        state.entities = [];
      }else{
        state.entities = action.payload.notifications;
        state.count = action.payload.count;
      }
    },
    [getNotificationForAdmin.fulfilled]: (state, action) => {
      if(action.payload === undefined){
        state.entities = [];
      }else{
        state.entities = action.payload.notifications;
        state.count = action.payload.count;
      }
    },
    [unreadCount.fulfilled]: (state, action) => {
      if(action.payload === undefined){
        state.unreadCount = 0;
      }else{
        state.unreadCount = action.payload;
      }
    },
    [getInvoiceNotifications.fulfilled]: (state, action) => {
      if(action.payload === undefined){
        state.invoice = [];
      }else{
        state.invoice = action.payload;
      }
    },
  },
});

export const { loadingTrue, loadingFalse, updateInvoiceNotifications } = notificationSlice.actions;

export default notificationSlice.reducer;
