import React, { useEffect, useRef, useState } from "react";
import { Button, IconButton, InputAdornment, Icon } from "@material-ui/core";
import { TextFieldFormsy } from "@fuse/core/formsy";
import Formsy from "formsy-react";
import { submitLogin } from "app/auth/store/loginSlice";
import { useDispatch, useSelector } from "react-redux";

import { Link } from "react-router-dom";

function JWTLoginTab(props) {
  const dispatch = useDispatch();
  const login = useSelector(({ auth }) => auth.login);

  const [isFormValid, setIsFormValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const formRef = useRef(null);

  useEffect(() => {
    if (login.error && (login.error.email || login.error.password)) {
      formRef.current.updateInputsWithError({
        ...login.error,
      });
      disableButton();
    }
  }, [login.error]);

  function disableButton() {
    setIsFormValid(false);
  }

  function enableButton() {
    setIsFormValid(true);
  }

  function handleSubmit(model) {
    dispatch(submitLogin(model));
  }

  return (
    <div className="w-full">
      <Formsy
        onValidSubmit={handleSubmit}
        onValid={enableButton}
        onInvalid={disableButton}
        ref={formRef}
        className="flex flex-col justify-center w-full"
      >
        <TextFieldFormsy
          className="mb-16"
          type="text"
          name="email"
          label="Email"
          validations={{
            isEmail: true,
          }}
          validationErrors={{
            isEmail: "This is not a valid email",
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Icon className="text-20" color="action">
                  email
                </Icon>
              </InputAdornment>
            ),
          }}
          variant="outlined"
          required
        />

        <TextFieldFormsy
          className="mb-16"
          type="password"
          name="password"
          label="Password"
          validations={{
            minLength: 4,
          }}
          validationErrors={{
            minLength: "Min character length is 4",
          }}
          InputProps={{
            className: "pr-2",
            type: showPassword ? "text" : "password",
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)}>
                  <Icon className="text-20" color="action">
                    {showPassword ? "visibility" : "visibility_off"}
                  </Icon>
                </IconButton>
              </InputAdornment>
            ),
          }}
          variant="outlined"
          required
        />
        <div className="flex items-center justify-between">
          <Link className="font-medium" to="/forgot-password">
            Forgot Password?
          </Link>
        </div>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          className="w-full mx-auto mt-16 normal-case"
          aria-label="LOG IN"
          disabled={!isFormValid}
          value="legacy"
        >
          Login
        </Button>
      </Formsy>

      {/* <div className="flex flex-col items-center pt-24">
                <Typography className="text-14 font-600 py-8">
                    Credentials
                </Typography>

                <Divider className="mb-16 w-256"/>

                <table className="text-left w-256">
                    <thead>
                        <tr>
                            <th><Typography className="font-600" color="textSecondary">Role</Typography></th>
                            <th><Typography className="font-600" color="textSecondary">Username</Typography></th>
                            <th><Typography className="font-600" color="textSecondary">Password</Typography></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><Typography>Admin</Typography></td>
                            <td><Typography>admin</Typography></td>
                            <td><Typography>admin</Typography></td>
                        </tr>
                        <tr>
                            <td><Typography>Staff</Typography></td>
                            <td><Typography>staff</Typography></td>
                            <td><Typography>staff</Typography></td>
                        </tr>
                    </tbody>
                </table>
            </div> */}
    </div>
  );
}

export default JWTLoginTab;
