import React, { useRef, useState } from "react";
import { Button, Card, CardContent, Typography } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { showMessage } from "app/store/fuse/messageSlice";
import axios from "axios";
import { TextFieldFormsy } from "@fuse/core/formsy";
import Formsy from "formsy-react";
import { darken } from "@material-ui/core/styles/colorManipulator";
import { makeStyles } from "@material-ui/styles";
import FuseAnimate from "@fuse/core/FuseAnimate";
import clsx from "clsx";
import { Link } from "react-router-dom";
import constants from "app/main/config/constants";
import history from "@history";
import { unreadCount, getInvoiceNotifications } from "app/main/notifications/store/notificationSlice";
import { setUserData } from "app/auth/store/userSlice";
import {
  loadingTrue,
  loadingFalse,
} from "app/main/projects/store/projectsSlice";
import { FirebaseMessaging, loginSuccess, userDeviceInfo } from "app/auth/store/loginSlice";
import jwtService from "app/services/jwtService";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles((theme) => ({
  root: {
    background:
      "radial-gradient(" +
      darken(theme.palette.primary.dark, 0.5) +
      " 0%, " +
      theme.palette.primary.dark +
      " 80%)",
    color: theme.palette.primary.contrastText,
  },
}));

function VerifyUser(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [isFormValid, setIsFormValid] = useState(false);
  const formRef = useRef(null);
  const loginLoading = useSelector(({ projects }) => projects.loading);

  function disableButton() {
    setIsFormValid(false);
  }

  function enableButton() {
    setIsFormValid(true);
  }

  function handleSubmit(model) {
    dispatch(loadingTrue());
    axios
      .post(constants.BASE_URL + `/users/Verify-password/${props.match.params.id}`, {
        code: model.code,
      })
      .then((response) => {
        console.log(response)
        if (response.data.message === 'Login success') {
          jwtService.setSession(response.data.data.access_token);
          dispatch(setUserData(response.data.data));
          FirebaseMessaging(dispatch);
          userDeviceInfo(response.data.data._id);
          dispatch(unreadCount(response.data.data._id));
          dispatch(getInvoiceNotifications(response.data.data._id));
          dispatch(loadingFalse());
          history.push({
            pathname: "/projects",
          });
          dispatch(loginSuccess())
        }else if(response.data.message === 'not verified'){
          dispatch(loadingFalse());
          dispatch(
            showMessage({
              message: "Verification code not match. Please Check.",
              variant: "error",
            })
          );
        }
      });
  }

  return (
    <div
      className={clsx(
        classes.root,
        "flex flex-col flex-auto flex-shrink-0 items-center justify-center p-32"
      )}
    >
      <div className="flex flex-col items-center justify-center w-full">
        <FuseAnimate animation="transition.expandIn">
          <Card className="w-full max-w-384">
            <Backdrop className={classes.backdrop} open={loginLoading}>
              <CircularProgress color="inherit" />
            </Backdrop>
            <CardContent className="flex flex-col items-center justify-center p-32">
              
              <div className="w-128 m-32">
                <img src="assets/images/logos/qbuild-black.svg" alt="logo" />
              </div>

              <Typography variant="h6" className=" mb-32">
                Enter Verification Code
              </Typography>

              <Formsy
                onValidSubmit={handleSubmit}
                onValid={enableButton}
                onInvalid={disableButton}
                ref={formRef}
                className="flex flex-col w-full justify-center"
              >
                <TextFieldFormsy
                  className="mb-16"
                  label="Code"
                  autoFocus
                  name="code"
                  variant="outlined"
                  required
                  fullWidth
                />

                <Button
                  // size='small'
                  type="submit"
                  variant="contained"
                  color="primary"
                  // className='flex w-224 mx-auto mt-16 justify-center'
                  aria-label="Reset"
                  disabled={!isFormValid}
                >
                  VERIFY
                </Button>
              </Formsy>

              <div className="flex flex-col items-center justify-center pt-32 pb-24">
                <Link className="font-medium" to="/pages/auth/login">
                  Go back to login
                </Link>
              </div>
            </CardContent>
          </Card>
        </FuseAnimate>
      </div>
    </div>
  );
}

export default VerifyUser;
