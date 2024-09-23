import { createSlice } from "@reduxjs/toolkit";
import { showMessage } from "app/store/fuse/messageSlice";
import {
  loadingTrue,
  loadingFalse,
} from "app/main/projects/store/projectsSlice";
import firebaseService from "app/services/firebaseService";
import jwtService from "app/services/jwtService";
import { setUserData, pushToken } from "./userSlice";
import history from "@history";
import firebase from "app/firebase/firebase";
import Geocode from "react-geocode";
import constants from "app/main/config/constants";
import { unreadCount, getInvoiceNotifications } from "app/main/notifications/store/notificationSlice";

export const FirebaseMessaging = (dispatch) => {
  const messaging = firebase.messaging();
  messaging
    .requestPermission()
    .then(() => {
      return messaging.getToken();
    })
    .then((token) => {
      dispatch(pushToken(token));
    })
    .catch((err) => {
      console.log(err);
    });
};

export const userDeviceInfo = (userId) => {
  Geocode.setApiKey(constants.MAP_KEY);
  Geocode.setLanguage("en");
  let address = "";
  navigator.geolocation.getCurrentPosition(
    (position) => {
      Geocode.fromLatLng(
        position.coords.latitude,
        position.coords.longitude
      ).then(
        (response) => {
          address = response.results[0].formatted_address;
          const request = jwtService.userDeviceData(userId, address);
          return request;
        },
        (error) => {
          address = '';
          const request = jwtService.userDeviceData(userId, address);
          return request;
        }
      );
    },
    (error) => {
      address = "denied";
      const request = jwtService.userDeviceData(userId, address);
      return request;
    },
    {
      timeout: 1000,
      maximumAge: 10000,
      enableHighAccuracy: true,
    }
  );
};

export const submitLogin = ({ email, password }) => async (dispatch) => {
  dispatch(loadingTrue());
  return jwtService
    .signInWithEmailAndPassword(email, password)
    .then((data) => {

      if(data.status === 2){
        dispatch(loadingFalse());
        dispatch(
          showMessage({
            message: "User not verified yet, Please check your mail.",
            variant: "error"
          })
        );
        return dispatch(loginError());
      }else if(data.status === 4)
      {
        dispatch(loadingFalse());
        dispatch(
          showMessage({
            message: "Your Account is currently deactivated. Please contact to Admin(admin@qbuild.app).",
            variant: "error"
          })
        );
        return dispatch(loginError());
      }else {
        if(data.department === 'admin'){
          history.push({
            pathname: `/verify-user/${data._id}`,
          });
          dispatch(
            showMessage({
              message: "Please Check Your Mail For Verification Code",
              variant: "success"
            })
          );
          dispatch(loadingFalse());
        }else if(data.projects.length > 0 || (data.onBoarding === 'Completed' || data.onBoarding === undefined)){
          dispatch(setUserData(data));
          dispatch(loadingFalse());
          FirebaseMessaging(dispatch);
          userDeviceInfo(data._id);
          dispatch(unreadCount(data._id));
          dispatch(getInvoiceNotifications(data._id));
          history.push({
            pathname: "/projects",
          });
          dispatch(loginSuccess())
          return data;
        }else{
          FirebaseMessaging(dispatch);
          userDeviceInfo(data._id);
          dispatch(unreadCount(data._id));
          dispatch(getInvoiceNotifications(data._id));
          dispatch(setUserData(data));
          history.push({
            pathname: "/onBoarding",
          });
          dispatch(loginSuccess())
          return data;
        }
        
        //return dispatch(loginSuccess());
      }
    })
    .catch((error) => {
      dispatch(loadingFalse());
      dispatch(
        showMessage({
          message: "Incorrect Email or Password",
          variant: "error",
        })
      );

      return dispatch(loginError(error));
    });
};

export const ssoLogin = ({ data }) => async (dispatch) => {
  if(data.status === 2){
    dispatch(loadingFalse());
    dispatch(
      showMessage({
        message: "User not verified yet, Please check your mail.",
        variant: "error"
      })
    );
    return dispatch(loginError());
  }else if(data.status === 4)
  {
    dispatch(loadingFalse());
    dispatch(
      showMessage({
        message: "Your Account is currently deactivated. Please contact to Admin(admin@qbuild.app).",
        variant: "error"
      })
    );
    return dispatch(loginError());
  }else {
    jwtService.setSession(data.access_token);
    dispatch(setUserData(data));
    FirebaseMessaging(dispatch);
    userDeviceInfo(data._id);
    dispatch(getInvoiceNotifications(data._id));
    if(data.department === 'admin'){
      history.push({
        pathname: "/projects",
      });
    }else if(data.projects.length > 0 || (data.onBoarding === 'Completed' || data.onBoarding === undefined)){
      history.push({
        pathname: "/projects",
      });
    }else{
      history.push({
        pathname: "/onBoarding",
      });
    }
  }
  return dispatch(loginSuccess());
};

export const submitLoginWithFireBase = ({ username, password }) => async (
  dispatch
) => {
  if (!firebaseService.auth) {
    console.warn(
      "Firebase Service didn't initialize, check your configuration"
    );

    return () => false;
  }
  return firebaseService.auth
    .signInWithEmailAndPassword(username, password)
    .then(() => {
      return dispatch(loginSuccess());
    })
    .catch((error) => {
      const usernameErrorCodes = [
        "auth/email-already-in-use",
        "auth/invalid-email",
        "auth/operation-not-allowed",
        "auth/user-not-found",
        "auth/user-disabled",
      ];
      const passwordErrorCodes = ["auth/weak-password", "auth/wrong-password"];

      const response = {
        username: usernameErrorCodes.includes(error.code)
          ? error.message
          : null,
        password: passwordErrorCodes.includes(error.code)
          ? error.message
          : null,
      };

      if (error.code === "auth/invalid-api-key") {
        dispatch(showMessage({ message: error.message }));
      }

      return dispatch(loginError(response));
    });
};

const initialState = {
  success: false,
  error: {
    username: null,
    password: null,
  },
};

const loginSlice = createSlice({
  name: "auth/login",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.success = true;
    },
    loginError: (state, action) => {
      state.success = false;
      state.error = action.payload;
    },
  },
  extraReducers: {},
});

export const { loginSuccess, loginError } = loginSlice.actions;

export default loginSlice.reducer;

