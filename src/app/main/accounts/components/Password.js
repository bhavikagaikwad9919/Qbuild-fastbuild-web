import {
  Button,
  CircularProgress,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  Typography
} from "@material-ui/core";
import React, { useState } from "react";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { changePassword } from "app/auth/store/userSlice";
import * as authActions from "app/auth/store/userSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  clearStates,
  clearEntities,
} from "app/main/projects/store/projectsSlice";
import constants from "app/main/config/constants";
import axios from "axios";
import { showMessage } from "app/store/fuse/messageSlice";

let initialState = {
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
};

function Password() {
  const dispatch = useDispatch();
  const user = useSelector(({ auth }) => auth.user);
  const [values, setValues] = useState(initialState);
  const [visible, setVisible] = useState({
    old: false,
    new: false,
    confirm: false,
  });
  const [loading, setLoading] = useState({
    change: false,
    create: false,
  });
  const handleClickShowPassword = (prop) => {
    setVisible({ ...visible, [prop]: !visible[prop] });
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };
  const disableButton = () => {
    return (
      values.oldPassword.length &&
      values.newPassword.length &&
      values.confirmPassword.length > 3 &&
      values.newPassword === values.confirmPassword
    );
  };
  const handleChangePassword = () => {
    setLoading({ ...loading, change: true });
    dispatch(changePassword(values)).then((response) => {
      if (response.code === 200) {
        setLoading({ ...loading, change: false });
        setValues(initialState);
        dispatch(clearStates());
        dispatch(clearEntities());
        dispatch(authActions.logoutUser());
      } else {
        setLoading({ ...loading, change: false });
      }
    });
  };

  const createPassword = () => {
    setLoading({ ...loading, create: true });
    axios
      .post(constants.BASE_URL + "/users/forgot-password", {
        email: user.data.email,
      })
      .then((response) => {
        if (response.data.code === 200) {
          dispatch(
            showMessage({
              message: "Check Your Email To Create Password",
              variant: "success",
            })
          );
          setLoading({ ...loading, create: false });
          dispatch(clearStates());
          dispatch(clearEntities());
          dispatch(authActions.logoutUser());
        } else {
          setLoading({ ...loading, create: false });
        }
      });
  };
  console.log("data", user.data.password);
  return (
    <div className="flex flex-col p-10 gap-10">
      {!user.data.password ? (
        <div>
          {loading.create ? (
            <CircularProgress size={20} />
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={createPassword}
            >
              Create Password
            </Button>
          )}
        </div>
      ) : (
        <>
          <Typography variant="h5"  style={{'font-size': '2.0rem', 'font-weight': '600'}}> Change Password</Typography>
          <FormControl variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">
              Old Password
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={visible.old ? "text" : "password"}
              value={values.oldPassword}
              onChange={handleChange("oldPassword")}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => handleClickShowPassword("old")}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {visible.old ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
              labelWidth={70}
            />
          </FormControl>
          <FormControl variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">
              New Password
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={visible.new ? "text" : "password"}
              value={values.newPassword}
              onChange={handleChange("newPassword")}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => handleClickShowPassword("new")}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {visible.new ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
              labelWidth={70}
            />
          </FormControl>
          <FormControl variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">
              Confirm Password
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={visible.confirm ? "text" : "password"}
              value={values.confirmPassword}
              onChange={handleChange("confirmPassword")}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => handleClickShowPassword("confirm")}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {visible.confirm ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
              labelWidth={70}
            />
          </FormControl>
          <div className="mt-12">
            {loading.change ? (
              <CircularProgress size={20} />
            ) : (
              <Button
                disabled={!disableButton()}
                variant="contained"
                color="primary"
                onClick={handleChangePassword}
              >
                Change Password
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Password;
