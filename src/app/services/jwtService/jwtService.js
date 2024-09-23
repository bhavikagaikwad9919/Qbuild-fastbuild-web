import FuseUtils from "@fuse/utils/FuseUtils";
import axios from "axios";
import * as Device from "react-device-detect";
import jwtDecode from "jwt-decode";
import constants from "app/main/config/constants";
//import moment from "moment";
/* eslint-disable camelcase */

class JwtService extends FuseUtils.EventEmitter {
  init() {
    this.setInterceptors();
    this.handleAuthentication();
  }

  setInterceptors = () => {
    axios.interceptors.response.use(
      (response) => {
        return response;
      },
      (err) => {
        return new Promise((resolve, reject) => {
          if (
            err.response.status === 401 &&
            err.config &&
            !err.config.__isRetryRequest
          ) {
            // if you ever get an unauthorized response, logout the user
            this.emit("onAutoLogout", "Invalid access_token");
            this.setSession(null);
          }
          throw err;
        });
      }
    );
  };

  handleAuthentication = () => {
    const access_token = this.getAccessToken();

    if (!access_token) {
      this.emit("onNoAccessToken");

      return;
    }

    if (this.isAuthTokenValid(access_token)) {
      this.setSession(access_token);
      this.emit("onAutoLogin", true);
    } else {
      this.setSession(null);
      this.emit("onAutoLogout", "access_token expired");
    }
  };

  createUser = (data) => {
    return new Promise((resolve, reject) => {
      axios.post("/api/auth/register", data).then((response) => {
        if (response.data.user) {
          this.setSession(response.data.access_token);
          resolve(response.data.user);
        } else {
          reject(response.data.error);
        }
      });
    });
  };

  signInWithEmailAndPassword = (email, password) => {
    let deviceDetails = Device.deviceDetect();
    return new Promise((resolve, reject) => {
      let data = {
        email: email,
        password: password,
        deviceDetails: deviceDetails,
      };

      axios
        .post(constants.BASE_URL + "/users/login", data, {
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          if (response.data.code === 200) {
            this.setSession(response.data.data.access_token);
            resolve(response.data.data);
          } else {
            reject(response.data.error);
          }
        });
    });
  };

  signInWithToken = () => {
    return new Promise((resolve, reject) => {
      axios
        .get(constants.BASE_URL + "/users/jwtToken/verify", {
          headers: {
            data: {
              access_token: this.getAccessToken(),
            },
          },
        })
        .then((response) => {
          if (response.data) {
            this.setSession(response.data.data.accessToken);
            resolve(response.data.data);
          } else {
            this.logout();
            reject("Failed to login with token.");
          }
        })
        .catch((error) => {
          this.logout();

          reject("Failed to login with token.");
        });
    });
  };

  async pushToken(token) {
    try {
      let response = await axios.post(
        `${constants.BASE_URL}/users/push-token/update`,
        {
          pushToken: token,
        }
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async userDeviceData(userId, data) {
    try {
      const response = await axios.post(
        `${constants.BASE_URL}/users/${userId}/device/info`,
        { address: data }
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  async changePassword(form) {
    try {
      const response = await axios.put(
        `${constants.BASE_URL}/users/password/change`,
        form
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }
  updateUserData = (user) => {
    return axios.post("/api/auth/user/update", {
      user,
    });
  };

  setSession = (access_token) => {
    if (access_token) {
      //localStorage.setItem("jwt_access_token", access_token);
      sessionStorage.setItem("jwt_access_token", access_token);
      axios.defaults.headers.common["Authorization"] = access_token;
    } else {
      //localStorage.removeItem("jwt_access_token");
      sessionStorage.removeItem("jwt_access_token");
      delete axios.defaults.headers.common["Authorization"];
    }
  };

  logout = () => {
    this.setSession(null);
  };

  isAuthTokenValid = (access_token) => {
    if (!access_token) {
      return false;
    }
    try {
      const decoded = jwtDecode(access_token);
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        console.warn("access token expired");
        return false;
      } else {
        return true;
      }
    } catch (error) {
      return false;
    }
  };

  getAccessToken = () => {
    //return window.localStorage.getItem("jwt_access_token");
    return window.sessionStorage.getItem("jwt_access_token");
  };
}

const instance = new JwtService();

export default instance;
