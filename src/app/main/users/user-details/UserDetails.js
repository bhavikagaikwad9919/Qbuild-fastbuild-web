import React, { useRef, useEffect, useState } from "react";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import FusePageCarded from "@fuse/core/FusePageCarded";
import FuseLoading from "@fuse/core/FuseLoading";
import moment from "moment";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import { useDispatch, useSelector } from "react-redux";
import UserHeader from "./UserDetailsHeader";
import { getUser,updateProjectcount, getUsers, changeUserStatus } from "../store/usersSlice";
import DeviceDetails from "./DeviceDetails";
import UserProjects from "./UserProjects";
import DeleteIcon from "@material-ui/icons/Delete";
import history from "@history";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import { dispatchWarningMessage } from "app/utils/MessageDispatcher";
// import * as Actions from '../store/actions/index';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

function UserDetails(props) {
  const classes = useStyles(props);
  const pageLayout = useRef(null);
  const dispatch = useDispatch();
  const [pageLoading, setPageLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(0);
  const [statusOpen, setStatusOpen] = useState(false);

  useEffect(() => {
    setPageLoading(true);
    dispatch(getUser(props.match.params.userId)).then(
      (response) => {
        setCount(response.payload.user.subscription.projectCount)
        setPageLoading(false);
      }
    );
  }, [dispatch, props.match.params.userId]);

  const details = useSelector(({ users }) => users.details.user);

  if (!details) {
    return <FuseLoading />;
  }

  let registerDate,
    lastLogin,
    lastUpdated = "";
  if (details.createdAt) {
    registerDate = moment(details.createdAt).format("DD-MM-YYYY, hh:mm A");
  }
  if (details.lastLogin) {
    lastLogin = moment(details.lastLogin).format("DD-MM-YYYY, hh:mm A");
  }
  if (details.updatedAt) {
    lastUpdated = moment(details.updatedAt).format("DD-MM-YYYY, hh:mm A");
  }
  // let routes = 'dashboard';
  //const [route, setRoute] = useState('Dashboard');
  function handleChangeTab(event, value) {
    setTabValue(value);
  }

  const handleClose = () =>{
    setOpen(false);
  }

  const handleChange = (prop) => (event) => {
    setCount(event.target.value);
  }

  const updateCount = () =>{

    if(count > 0)
    {
      setPageLoading(true);
      setOpen(false)
      dispatch(updateProjectcount({id:details._id, count})).then((response) => {
        dispatch(getUser(details._id));
        setPageLoading(false); 
        setCount(0);
      });
    }else{
      dispatchWarningMessage(dispatch, "Please enter number greater than 0.");
      setCount(0);
    }
  }

  function inactiveUser()
  {
    setStatusOpen(false);
    setPageLoading(true);
    dispatch(changeUserStatus({
      userId:details._id,
      status:"Deactivate"
    })).then((response) => {
        dispatch(getUsers);
        setPageLoading(false);
        history.push({ pathname: `/users`,})
      }
    );
  }

  function activeUser()
  {
    setStatusOpen(false);
    setPageLoading(true);
    dispatch(changeUserStatus({
      userId:details._id,
      status:"Activate"
    })).then((response) => {
        dispatch(getUsers);
        setPageLoading(false);
        history.push({ pathname: `/users`,})
      }
    );
  }

  // function removeUser()
  // {
  //   setPageLoading(true);
  //   dispatch(deleteUser(details._id)).then(
  //     (response) => {console.log(response)
  //       dispatch(getUsers);
  //       setPageLoading(false)
  //       history.push({ pathname: `/users`,})
  //     }
  //   );
  // }

  return (
    <React.Fragment>
       <Backdrop className={classes.backdrop} open={pageLoading}>
             <CircularProgress color="inherit" />
           </Backdrop>
      <FusePageCarded
        classes={{
          toolbar: "p-0",
          header: "min-h-72 h-72 sm:h-136 sm:min-h-136",
        }}
        header={<UserHeader pageLayout={pageLayout} />}
        contentToolbar={
          <Tabs
            value={tabValue}
            onChange={handleChangeTab}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
            classes={{ root: "flex flex-1 w-full h-64" }}
          >
            <Tab className="h-64 normal-case" label="User Info" />
            <Tab className="h-64 normal-case" label="Projects" />
            <Tab className="h-64 normal-case" label="Device Details" />
          </Tabs>
        }
        content={
          <div>
            {tabValue === 0 && (
              <>
                <div className="p-16 sm:p-24">
                  <div className="flex flex-1 w-full mb-12">
                    <div className="mr-10">
                      <Typography>Email ID:</Typography>
                      <Typography variant="subtitle2">
                        {details.email}
                      </Typography>
                    </div>
                    <div>
                      <Typography>Role:</Typography>
                      <Typography variant="subtitle2">
                        {details.role}
                      </Typography>
                    </div>
                  </div>
                  <Divider />
                  <div className="flex flex-1 w-full my-12">
                    <div className="sm:mr-10 mr-26">
                      <Typography>Last Login</Typography>
                      <Typography variant="subtitle2">{lastLogin}</Typography>
                    </div>
                    <div>
                      <Typography>Last Updated:</Typography>
                      <Typography variant="subtitle2">{lastUpdated}</Typography>
                    </div>
                  </div>
                  <div className="flex flex-1 w-full mb-12">
                    <div className="sm:mr-10 mr-26">
                      <Typography>Registeration Type:</Typography>
                      <Typography variant="Subtitle2" className="pt-4">
                        {details.signUpType ? details.signUpType : null}
                      </Typography>
                    </div>
                    <div>
                      <Typography>Registeration Date:</Typography>
                      <Typography variant="Subtitle2">
                        {registerDate}
                      </Typography>
                    </div>
                  </div>
                  <Divider />
                  <div className="flex flex-1 w-full my-12">
                    <div className="sm:mr-10 mr-26">
                      <Typography>Subscription Type:</Typography>
                      <Typography variant="Subtitle2">
                        {details.subscription
                          ? details.subscription.subscriptionType
                          : null}
                      </Typography>
                    </div>
                    <div>
                      <Typography>Project Count:</Typography>
                      <Typography variant="Subtitle2">
                        {details.subscription
                          ? details.subscription.projectCount
                          : null}
                      </Typography>
                    </div>
                  </div>
                  {/* <div className="flex flex-1 w-full mb-12">
									<div className="sm:mr-10 mr-26">
										<Typography>Registeration Type:</Typography>
										<Typography variant="Subtitle2" className="pt-4">
											{details.signUpType ? details.signUpType : null}
										</Typography>
									</div>
									<div>
										<Typography>Registeration Date:</Typography>
										<Typography variant="Subtitle2">{registerDate}</Typography>
									</div>
								</div> */}
                  <Divider />

                </div>
                <div className="flex w-full h-full items-end justify-start mt-35 ml-20 mb-25">
                 <>
                   <Button
                      style={{ backgroundColor: "orange" }}
                      variant="contained"
                      onClick={() => {setOpen(true)
                      setCount(details.subscription.projectCount)}}
                   >
                      Update Project Count
                   </Button>
                    {details.status === "Active" && details.role !== 'admin'?
                     <Button
                       style={{ backgroundColor: "red", marginLeft: "10px" }}
                       variant="contained"
                       onClick={() => setStatusOpen(true)}
                      >
                        Deactivate User
                      </Button>:
                      details.status === "Deactive" && details.role !== 'admin'?
                      <Button
                       style={{ backgroundColor: "green", marginLeft: "10px" }}
                       variant="contained"
                       onClick={() => setStatusOpen(true)}
                      >
                        Activate User
                      </Button>:null
                    }
                    {/* <Button
                      className="ml-8"
                      style={{ backgroundColor: "red"}}
                      variant="contained"
                      startIcon={<DeleteIcon />}
                      onClick={() => removeUser()}
                    >
                      Delete User
                    </Button> */}
                 </> 
                </div>
              </>
            )}
            {tabValue === 2 && <DeviceDetails />}
            {tabValue === 1 && <UserProjects />}
          </div>
        }
        sidebarInner
        ref={pageLayout}
        innerScroll
      />

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
       <DialogTitle id="alert-dialog-title">{"Update Project Count"}</DialogTitle>
       <DialogContent>
         <div class="w-auto">
           <FormControl variant="outlined">
             <TextField
               variant="outlined"
               className="my-12"
               type="number"
               label="Project Count"
               defaultValue={count}
               onChange={handleChange("count")}
             />
           </FormControl>
         </div>
       </DialogContent>
       <DialogActions>
         <Button onClick={handleClose} color="primary">
           CANCEL
         </Button>
         <Button onClick={() => updateCount()} color="primary" autoFocus>
           OK
         </Button>
       </DialogActions>
      </Dialog>

      <Dialog
        open={statusOpen}
        onClose={() => setStatusOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
       {details.status === "Active"?
         <DialogTitle id="alert-dialog-title">Do you want to Deactivate {details.name}?</DialogTitle>:
         <DialogTitle id="alert-dialog-title">Do you want to Activate {details.name}?</DialogTitle>
       }
       <DialogActions>
         <Button onClick={() => setStatusOpen(false)} color="primary">
           No
         </Button>
         {details.status === "Active"?
           <Button onClick={() => inactiveUser()} color="primary" autoFocus>
             Yes
           </Button>:
           <Button onClick={() => activeUser()} color="primary" autoFocus>
             Yes
           </Button>
         }
       </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default UserDetails;
