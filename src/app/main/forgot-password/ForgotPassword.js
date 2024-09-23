import React, { useRef, useState } from "react";
import { Button, Card, CardContent, Typography } from "@material-ui/core";
import { useDispatch } from "react-redux";
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

function ForgotPassword() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [isFormValid, setIsFormValid] = useState(false);
  const formRef = useRef(null);

  function disableButton() {
    setIsFormValid(false);
  }

  function enableButton() {
    setIsFormValid(true);
  }

  function handleSubmit(model) {
    axios
      .post(constants.BASE_URL + "/users/forgot-password", {
        email: model.email,
      })
      .then((response) => {
        if (response.data.code === 200) {
          dispatch(
            showMessage({
              message: "Check Your Email For Password Reset Link",
              variant: "success",
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
            <CardContent className="flex flex-col items-center justify-center p-32">
              <div className="w-128 m-32">
                <img src="assets/images/logos/qbuild-black.svg" alt="logo" />
              </div>

              <Typography variant="h6" className=" mb-32">
                RECOVER YOUR PASSWORD
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
                  label="Email"
                  autoFocus
                  type="email"
                  name="email"
                  validations={{
                    isEmail: true,
                  }}
                  validationErrors={{
                    isEmail: "This is not a valid email",
                  }}
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
                  SEND RESET LINK
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

export default ForgotPassword;
