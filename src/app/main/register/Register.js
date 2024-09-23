import FuseAnimate from "@fuse/core/FuseAnimate";
import { useForm } from "@fuse/hooks";
//import GoogleLogin from "react-google-login";
import { GoogleOAuthProvider } from '@react-oauth/google';  
import { GoogleLogin } from '@react-oauth/google';  
//import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Checkbox from "@material-ui/core/Checkbox";
import { useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import { ssoLogin } from "app/auth/store/loginSlice";
import { showMessage } from "app/store/fuse/messageSlice";
import clsx from "clsx";
import axios from "axios";
import constants from "app/main/config/constants";
import React from "react";
import { Link } from "react-router-dom";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import history from "@history";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundImage: 'url("../../assets/images/backgrounds/background.jpg")',
    backgroundSize: "cover",
    backgroundPosition: "0 50%",
    backgroundRepeat: "no-repeat",
    color: theme.palette.primary.contrastText,
  },
}));

function Register(props) {
  let refferalCode = props.match.params.refCode
    ? props.match.params.refCode
    : null;
  const classes = useStyles();
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState({
    google: false,
    fb: false,
    email: false,
  });
  const { form, handleChange, resetForm, setForm } = useForm({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
    acceptTermsConditions: false,
  });

  function isFormValid() {
    return (
      form.name.length > 0 &&
      form.email.length > 0 &&
      form.password.length > 0 &&
      form.password.length > 3 &&
      form.password === form.passwordConfirm &&
      form.acceptTermsConditions
    );
  }

  function GoogleIcon() {
    return (
      <svg
        width="30"
        height="30"
        viewBox="0 0 256 262"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid"
      >
        <path
          d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
          fill="#4285F4"
        />
        <path
          d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
          fill="#34A853"
        />
        <path
          d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
          fill="#FBBC05"
        />
        <path
          d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
          fill="#EB4335"
        />
      </svg>
    );
  }

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

  const accept = () => {
    setForm({ ...form, acceptTermsConditions: true });
    setOpen(false);
  };
  const decline = () => {
    setForm({ ...form, acceptTermsConditions: false });
    setOpen(false);
  };

  function handleSubmit(ev) {
    setLoading({ email: true });
    ev.preventDefault();
    if (refferalCode !== null) {
      form.refferedCode = refferalCode;
    }
    axios
      .post(constants.BASE_URL + "/users/email/register", form)
      .then((response) => {
        if (response.data.message === "User Registered") {
          setLoading({ email: false });
          dispatch(
            showMessage({
              message: "Please Check Your Mail For Verification",
              variant: "success",
              autoHideDuration: null,
            })
          );
          history.push({ pathname: "login"});
        } else {
          setLoading({ email: false });
          dispatch(
            showMessage({
              message: response.data.message,
              variant: "error",
            })
          );
        }
      });

    resetForm();
  }

  const responseGoogle = (response) => {
    setLoading({ google: true });
    const google = {
      SSO: "google",
      token: response.credential,
      cilentId: response.clientId,
    };
    if (refferalCode !== null) {
      google.refferalCode = refferalCode;
    }
    axios
      .post(constants.BASE_URL + "/users/google/register", google)
      .then((response) => {
        if ((response.data.message = "user present")) {
          setLoading({ google: false });
          axios
            .post(constants.BASE_URL + "/users/google/login", google)
            .then((response) => {
              if (response.data.message === "Login Success") {
                dispatch(ssoLogin(response.data));
              }
            });
        }
      });
  };

  // const responseFacebook = (response) => {
  //   setLoading({ fb: true });
  //   const fb = {
  //     SSO: "fb",
  //     userId: response.userID,
  //     token: response.accessToken,
  //     picture: response.picture.data.url,
  //   };
  //   if (refferalCode !== null) {
  //     fb.refferalCode = refferalCode;
  //   }
  //   axios
  //     .post(constants.BASE_URL + "/users/fb/register", fb)
  //     .then((response) => {
  //       if ((response.data.message = "user present")) {
  //         setLoading({ fb: false });
  //         axios
  //           .post(constants.BASE_URL + "/users/fb/login", fb)
  //           .then((response) => {
  //             if (response.data.message === "Login Success") {
  //               dispatch(ssoLogin(response.data));
  //             }
  //           });
  //       }
  //     });
  // };

  const googleError = (error) => {
    console.log('google signin failed-error',error)
  }

  return (
    <>
      <div
        className={clsx(
          classes.root,
          "flex flex-col flex-auto flex-shrink-0 items-center justify-center p-32"
        )}
      >
        <div className="flex flex-col items-center justify-center w-full">
          <FuseAnimate animation="transition.expandIn">
            <Card className="w-full max-w-384 min-h-full">
              <CardContent className="flex flex-col items-center justify-center p-32">
                {loading.email ? (
                  <CircularProgress size={68} />
                ) : (
                  <React.Fragment>
                    <Typography variant="h6" className="mt-16 mb-32">
                      CREATE AN ACCOUNT
                    </Typography>

                    <form
                      name="registerForm"
                      noValidate
                      className="flex flex-col justify-center w-full"
                      onSubmit={handleSubmit}
                    >
                      <TextField
                        className="mb-16"
                        label="Name"
                        autoFocus
                        type="name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        variant="outlined"
                        required
                        fullWidth
                      />

                      <TextField
                        className="mb-16"
                        label="Email"
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        variant="outlined"
                        required
                        fullWidth
                      />

                      <TextField
                        className="mb-16"
                        label="Password"
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        variant="outlined"
                        required
                        fullWidth
                      />

                      <TextField
                        className="mb-16"
                        label="Confirm Password"
                        type="password"
                        name="passwordConfirm"
                        value={form.passwordConfirm}
                        onChange={handleChange}
                        variant="outlined"
                        required
                        fullWidth
                      />
                      <div className="flex flex-1 gap-x-8 items-center justify-start">
                        <Checkbox
                          checked={form.acceptTermsConditions}
                          inputProps={{ "aria-label": "primary checkbox" }}
                          //onClick={() => setOpen(true)}
                          onClick={accept}
                        />
                        <Typography
                          style={{
                            color: "#0000FF",
                            textDecoration: "underline",
                            fontSize: "13px",
                            cursor: "pointer",
                          }}
                          onClick={() => setOpen(true)}
                        >
                          I have read and I accept terms and conditions
                        </Typography>
                      </div>

                      <Button
                        variant="contained"
                        color="primary"
                        className="w-224 mx-auto mt-16"
                        aria-label="Register"
                        disabled={!isFormValid()}
                        type="submit"
                      >
                        CREATE AN ACCOUNT
                      </Button>
                    </form>

                    <div className="flex flex-col items-center justify-center pt-24">
                      <span className="font-medium">
                        Already have an account?
                      </span>
                      <Link className="font-medium" to="/pages/auth/login">
                        Login
                      </Link>
                    </div>
                    <div className="my-24 flex items-center justify-center">
                      <Divider className="w-32" />
                      <span className="mx-8 font-bold">OR</span>
                      <Divider className="w-32" />
                    </div>
                    <span className="font-medium mb-16">Signup With</span>
                    <div className="flex flex-row justify-between">
                      {/* <GoogleLogin
                        render={(renderProps) => (
                          <IconButton
                            size="medium"
                            onClick={() => {
                              renderProps.onClick();
                            }}
                            variant="contained"
                            className="normal-case mx-6"
                          >
                            {loading.google ? (
                              <CircularProgress />
                            ) : (
                              <GoogleIcon />
                            )}
                          </IconButton>
                        )}
                        clientId="1055526564506-hort8tpjmo824irs61ngu03v3hseqjon.apps.googleusercontent.com"
                        prompt={"select_account"}
                        onSuccess={responseGoogle}
                        onFailure={responseGoogle}
                        cookiePolicy={"single_host_origin"}
                      /> */}

                      <GoogleOAuthProvider clientId={constants.GOOGLE_CRED}>
                        <GoogleLogin  
                          render={(renderProps) => (
                            <IconButton
                              size="medium"
                              onClick={() => {
                                renderProps.onClick();
                              }}
                              variant="contained"
                              className="normal-case mx-6"
                            >
                              {loading.google ? (
                                <CircularProgress />
                              ) : (
                                <GoogleIcon />
                              )}
                            </IconButton>
                          )}          
                          onSuccess={responseGoogle}
                          onFailure={googleError} 
                          useOneTap 
                          cookiePolicy={"single_host_origin"}   
                        />
                      </GoogleOAuthProvider>

                      {/* <FacebookLogin
                        appId="2678917582383430"
                        fields="name,email,picture"
                        callback={responseFacebook}
                        render={(renderProps) => (
                          <IconButton
                            size="medium"
                            onClick={renderProps.onClick}
                            variant="contained"
                            className="normal-case mx-6"
                          >
                            {loading.fb ? (
                              <CircularProgress />
                            ) : (
                              <FacebookIcon />
                            )}
                          </IconButton>
                        )}
                      /> */}
                    </div>
                  </React.Fragment>
                )}
              </CardContent>
            </Card>
          </FuseAnimate>
        </div>
      </div>
      {open ? (
        <Dialog
          fullWidth
          maxWidth={"sm"}
          open={open}
          onClose={() => setOpen(false)}
          scroll={"body"}
        >
          <DialogTitle id="scroll-dialog-title">
            Terms and Conditions
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
            This program is distributed in the hope that it will be useful,
            but without any warranty; without even an implied warranty of merchant ability or fitness for a particular purpose.
            Neither Ediquo Tecnologies Pvt Ltd, Neetin Khedkar promise correctness of this app.
            Disclaimer of warranty” There is no warranty for the program, to the extent permitted by applicable law.
            Except when otherwise stated in writing the owners/ developers or copyright holders and/or other parties provide the program "As is" without warranty of any kind.
            The entire risk as to the quality and performance of the program is with you. Should the program prove defective, you assume the cost of all necessary servicing, repair or correction.
            Limitation of liability: In no event unless required by applicable law or agreed to in writing will any owners/ developers or copyright holder, or any other party who modifies and/or 
            conveys the program as permitted above, be liable to you for damages, including any general, special, incidental or consequential damages arising out of the use or inability to use 
            the program (including but not limited to loss of data or data being rendered inaccurate or losses sustained by you or third parties or a failure of the program to operate with any other programs),
            even if such holder or other party has been advised of the possibility of such damages. Further the app developers do not warrant:- •that the application functions or any services or content will be
            uninterrupted or free of errors or omissions • that the defects or errors will be corrected • that the application for the service hosting content are free of viruses or other harmful code 
            • that the application or services or content available through the application will continue to be available.
            It is to be noted:- that the app developers shall have no liability for any issues arising from use of this app or from discontinuation of these services.
            That the app developers and their distribution channels disclaim any express or implied warranties including without limitation non infringement, merchant ability, fitness for a particular purpose,
            title, quality, availability and as to subject matter of content. That the application services and content are provided on as is as available and with all faults.
            It is expressly stated that the app developers are a participant in various associates and affiliate advertising programs designed to provide a means for the app developers to earn fees by linking to
            the affiliate program services and affiliate sites. However the app developers do not guarantee the the quality of the products so purchased through the use of those links and affiliate apps and the app developers
            are in no way responsible for any loss due to subscription to these products for purchase of these products. By downloading accessing or using this app or any page of this app you signify your assent to this disclaimer.
            The contents of this app including without limitation of all data, information, text, graphics, links and other materials are provided as a convenience to our app users and are meant to be used for informational purposes only.
            The app developers do not take responsibility for decisions taken by the user based solely on the information provided in or by this app. The app developers do not guarantee the accuracy of the information provided or any analysis based there on.
            It is expressly understood that the app is linked to other websites that may have different terms of use and privacy policies, please refer to those websites and mobile applications for the appropriate information. 
            Please note that the app developers have no control over the content of these third party websites and mobile applications. In addition, a hyperlink to a non qbuild website or link to access a third party mobile application does not mean that the app developers
            in accept any responsibility for the content or the use of the link website for mobile application. If you decide to access any of these third party websites or applications linked to this app you do so entirely at your own risk.
            </DialogContentText>
            {/* <div className="flex flex-1 gap-10 items-center justify-end">
              <Button onClick={decline} color="primary">
                Decline
              </Button>
              <Button variant="contained" onClick={accept} color="primary">
                Accept
              </Button>
            </div> */}
          </DialogContent>
        </Dialog>
      ) : null}
    </>
  );
}

export default Register;
