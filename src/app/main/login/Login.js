import React, { useState } from "react";
import { Card, CardContent, Typography, IconButton } from "@material-ui/core";
import { darken } from "@material-ui/core/styles/colorManipulator";
//import GoogleLogin from "react-google-login";
import { GoogleOAuthProvider } from '@react-oauth/google';  
import { GoogleLogin } from '@react-oauth/google';  
//import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import FuseAnimate from "@fuse/core/FuseAnimate";
import { Link } from "react-router-dom";
import clsx from "clsx";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
//import * as Device from "react-device-detect";
import { ssoLogin } from "app/auth/store/loginSlice";
import Divider from "@material-ui/core/Divider";
import JWTLoginTab from "./tabs/JWTLoginTab";
import { showMessage } from "app/store/fuse/messageSlice";
import { makeStyles } from "@material-ui/styles";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import constants from "app/main/config/constants";
import {
  loadingTrue,
  loadingFalse,
} from "app/main/projects/store/projectsSlice";

const useStyles = makeStyles((theme) => ({
  root: {
    background:
      "linear-gradient(to right, " +
      theme.palette.primary.dark +
      " 0%, " +
      darken(theme.palette.primary.dark, 0.5) +
      " 100%)",

    color: theme.palette.primary.contrastText,
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

function Login() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const loginLoading = useSelector(({ projects }) => projects.loading);
  // const [loading, setLoading] = useState({
  //   google: false,
  //   fb: false,
  //   email: false,
  // });

  // function GoogleIcon() {
  //   return (
  //     <svg
  //       width="30"
  //       height="30"
  //       viewBox="0 0 256 262"
  //       xmlns="http://www.w3.org/2000/svg"
  //       preserveAspectRatio="xMidYMid"
  //     >
  //       <path
  //         d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
  //         fill="#4285F4"
  //       />
  //       <path
  //         d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
  //         fill="#34A853"
  //       />
  //       <path
  //         d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
  //         fill="#FBBC05"
  //       />
  //       <path
  //         d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
  //         fill="#EB4335"
  //       />
  //     </svg>
  //   );
  // }

  // function FacebookIcon() {
  //   return (
  //     <svg
  //       xmlns="http://www.w3.org/2000/svg"
  //       viewBox="0 0 48 48"
  //       width="40px"
  //       height="40px"
  //     >
  //       <linearGradient
  //         id="Ld6sqrtcxMyckEl6xeDdMa"
  //         x1="9.993"
  //         x2="40.615"
  //         y1="9.993"
  //         y2="40.615"
  //         gradientUnits="userSpaceOnUse"
  //       >
  //         <stop offset="0" stop-color="#2aa4f4" />
  //         <stop offset="1" stop-color="#007ad9" />
  //       </linearGradient>
  //       <path
  //         fill="url(#Ld6sqrtcxMyckEl6xeDdMa)"
  //         d="M24,4C12.954,4,4,12.954,4,24s8.954,20,20,20s20-8.954,20-20S35.046,4,24,4z"
  //       />
  //       <path
  //         fill="#fff"
  //         d="M26.707,29.301h5.176l0.813-5.258h-5.989v-2.874c0-2.184,0.714-4.121,2.757-4.121h3.283V12.46 c-0.577-0.078-1.797-0.248-4.102-0.248c-4.814,0-7.636,2.542-7.636,8.334v3.498H16.06v5.258h4.948v14.452 C21.988,43.9,22.981,44,24,44c0.921,0,1.82-0.084,2.707-0.204V29.301z"
  //       />
  //     </svg>
  //   );
  // }

  const responseGoogle = (response) => {
    dispatch(loadingTrue());
    const google = {
      token: response.credential,
      cilentId: response.clientId,
    };
    axios
      .post(constants.BASE_URL + "/users/google/login", google)
      .then((response) => {
        if (response.data.message === "Login Success") {
          dispatch(loadingFalse());
          dispatch(ssoLogin(response.data));
        } else {
          dispatch(loadingFalse());
          dispatch(
            showMessage({
              message: response.data.message,
              variant: "error",
            })
          );
        }
      });
  };

  const showAlert = () => {
    dispatch(
      showMessage({
        message: 'To create an account please contact us at - contact@qbuild.app',
        variant: "success",
      })
    );
  }

  // const responseFacebook = (response) => {
  //   setLoading({ fb: true });
  //   const fb = {
  //     userId: response.userID,
  //     token: response.accessToken,
  //     // deviceDetails: Device.deviceDetect(),
  //   };

  //   axios.post(constants.BASE_URL + "/users/fb/login", fb).then((response) => {
  //     if (response.data.message === "Login Success") {
  //       setLoading({ fb: false });
  //       dispatch(ssoLogin(response.data));
  //     } else {
  //       setLoading({ fb: false });
  //       dispatch(
  //         showMessage({
  //           message: response.data.message,
  //           variant: "error",
  //         })
  //       );
  //     }
  //   });
  // };

  const googleError = (error) => {
    console.log('google signin failed-error',error)
  }

  return (
    <div
      className={clsx(
        classes.root,
        "flex flex-col flex-1 flex-shrink-0 items-center justify-center p-32"
      )}
    >
      <div className="flex flex-col items-center justify-center w-full">
        <FuseAnimate animation="transition.expandIn">
          <Card className="w-full max-w-384">
            <CardContent className="flex flex-col items-center justify-center p-32">
              <Backdrop className={classes.backdrop} open={loginLoading}>
                <CircularProgress color="inherit" />
              </Backdrop>
              <img
                className="w-128 m-32"
                src="assets/images/logos/qbuild-black.svg"
                alt="logo"
              />

              <Typography variant="h6" className="text-center md:w-full mb-48">
                LOGIN TO YOUR ACCOUNT
              </Typography>
              <JWTLoginTab />
              <div className="flex flex-col items-center justify-center pt-32">
                <Link className="font-bold" to="/terms"> Terms & Conditions </Link>
                <span className="font-bold">Don't have an account?</span>
                <Link className="font-bold" onClick={()=> showAlert()} > {/*to="/register" */}
                  Create an account
                </Link>
                {/* <div className="my-24 flex items-center justify-center">
                  <Divider className="w-32" />
                  <span className="mx-8 font-bold">OR</span>
                  <Divider className="w-32" />
                </div> */}
              </div>
              {/* <span className="font-medium mb-16">Login With</span> */}
              <div className="flex flex-row justify-between">
                {/* <GoogleLogin
                  buttonText="Login Using"
                  render={(renderProps) => (
                    <IconButton
                      onClick={() => renderProps.onClick()}
                      disabled={renderProps.disabled}
                      variant="contained"
                      size="medium"
                    >
                      {loading.google ? <CircularProgress /> : <GoogleIcon />}
                    </IconButton>
                  )}
                  clientId={constants.GOOGLE_CRED}
                  prompt={"select_account"}
                  // buttonText='SignUp'
                  onSuccess={responseGoogle}
                  onFailure={responseGoogle}
                  cookiePolicy={"single_host_origin"}
                /> */}

                {/* <FacebookLogin
                  appId={constants.FB_APP_ID}
                  fields="name,email,picture"
                  callback={responseFacebook}
                  render={(renderProps) => (
                    <IconButton
                      onClick={renderProps.onClick}
                      variant="contained"
                      size="medium"
                      className="normal-case mx-6"
                    >
                      {loading.fb ? <CircularProgress /> : <FacebookIcon />}
                    </IconButton>
                  )}
                /> */}
                {/* <GoogleOAuthProvider clientId={constants.GOOGLE_CRED}>
                  <GoogleLogin            
                    onSuccess={responseGoogle}
                    onFailure={googleError} 
                    useOneTap 
                    cookiePolicy={"single_host_origin"}   
                  />
                </GoogleOAuthProvider> */}
              </div>
            </CardContent>
          </Card>
        </FuseAnimate>
      </div>
    </div>
  );
}

export default Login;
