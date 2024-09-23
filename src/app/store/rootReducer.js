import { combineReducers } from "@reduxjs/toolkit";
import auth from "app/auth/store";
import fuse from "./fuse";
import projects from "../main/projects/store/projectsSlice";
import users from "../main/users/store/usersSlice";
import payment from "../main/payment/store/paymentSlice";
import notification from "app/main/notifications/store/notificationSlice";
import organizations from "../main/organization/store/organizationSlice";
import sites from "../main/organization/organization-details/sites/store/sitesSlice";
import dataStructure from "../main/dataStructure/store/dataSlice";

const createReducer = (asyncReducers) =>
  combineReducers({
    auth,
    fuse,
    projects,
    users,
    payment,
    organizations,
    sites,
    notification,
    dataStructure,
    ...asyncReducers,
  });

export default createReducer;
