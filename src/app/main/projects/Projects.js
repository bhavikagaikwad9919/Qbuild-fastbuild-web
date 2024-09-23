import React, { useEffect, useRef, useState } from "react";
import ProjectsList from "./ProjectsList";
import ProjectsHeader from "./ProjectsHeader";
import { Fab, Icon, Typography, DialogContent } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import history from "@history";
import FuseLoading from "@fuse/core/FuseLoading";
import FusePageCarded from "@fuse/core/FusePageCarded";
import FusePageSimple from "@fuse/core/FusePageSimple";
import FuseAnimate from "@fuse/core/FuseAnimate";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import { getProjects, getAllProjects, back } from "./store/projectsSlice";
import { deviceInfo } from "../users/store/usersSlice";
import { useDispatch, useSelector } from "react-redux";
import Chip from "@material-ui/core/Chip";
import _ from "@lodash";
import Geocode from "react-geocode";
import constants from "app/main/config/constants";
import { constant } from "lodash";
import { updateInvoiceNotifications } from "app/main/notifications/store/notificationSlice";

const useStyles = makeStyles({
  addButton: {
    position: "fixed",
    right: 12,
    bottom: 12,
    zIndex: 99,
  },
  topPaperScrollBody: {
    verticalAlign: 'top',
  },
  scrollPaper: {
    alignItems: 'baseline'
  }
});

function Projects(props) {
  const classes = useStyles();
  const pageLayout = useRef(null);
  const dispatch = useDispatch();
  const entities = useSelector(({ projects }) => projects.entities);
  const role = useSelector(({ auth }) => auth.user.role);
  const [tabValue, setTabValue] = useState("ownedProjects");
  const invoiceNotifications = useSelector(({ notification }) => notification.invoice);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(back());
    {
      role === "admin" ? dispatch(getAllProjects()) : dispatch(getProjects());
    }
  }, [dispatch, role]);

  useEffect(()=>{
    if(invoiceNotifications.length > 0){
      setOpen(true);
    }
  }, [invoiceNotifications])

  if (role !== "admin") {
    if (!entities.ownedProjects) {
      return <FuseLoading />;
    }
  }
  function handleChangeTab(event, value) {
    setTabValue(value);
  }

  return (
    <React.Fragment>
      {role === "admin" ? (
        <FusePageSimple
          classes={{
            content: "flex flex-col",
            leftSidebar: "w-256 border-0",
            header: "min-h-72 h-72 sm:h-136 sm:min-h-136",
          }}
          header={<ProjectsHeader />}
          content={<ProjectsList tab={tabValue} />}
          sidebarInner
          ref={pageLayout}
          innerScroll
        />
      ) : (
        <FusePageCarded
          classes={{
            content: "flex flex-col",
            leftSidebar: "w-256 border-0",
            header: "min-h-72 h-72 sm:h-136 sm:min-h-136",
          }}
          header={<ProjectsHeader />}
          contentToolbar={
            <>
              <Tabs
                value={tabValue}
                onChange={handleChangeTab}
                indicatorColor="primary"
                textColor="primary"
                variant="scrollable"
                scrollButtons="auto"
                classes={{ root: "w-full h-64" }}
              >
                <Tab
                  className="h-64 normal-case"
                  label={
                    <>
                      <div>
                        <Typography variant="subtitle">
                          Owned Projects
                        </Typography>
                        <Chip
                          className="ml-12"
                          label={entities.ownedProjects.data.length}
                          size="small"
                          color="secondary"
                        />
                      </div>
                    </>
                  }
                  value="ownedProjects"
                />
                <Tab
                  className="h-64 normal-case"
                  label={
                    <div>
                      <Typography variant="subtitle">
                        Associated Projects
                      </Typography>
                      <Chip
                        className="ml-12"
                        label={entities.associatedProjects.data.length}
                        size="small"
                        color="secondary"
                      />
                    </div>
                  }
                  value="associatedProjects"
                />
              </Tabs>
            </>
          }
          content={<ProjectsList tab={tabValue} />}
          sidebarInner
          ref={pageLayout}
          innerScroll
        />
      )}

      {role !== 'admin' ? 
        <FuseAnimate animation="transition.expandIn" delay={300}>
          <Fab
            color="primary"
            aria-label="add"
            className={classes.addButton}
            onClick={() => {
              history.push({
                pathname: "/projects/add",
              });
            }}
          >
            <Icon>add</Icon>
          </Fab>
        </FuseAnimate>
      :null}

      <Dialog 
        open={open} 
        onClick={()=> {
          dispatch(updateInvoiceNotifications())
          setOpen(false)
        }} 
        className={classes.scrollPaper}
      >
        <DialogTitle id="alert-dialog-slide-title"> {invoiceNotifications[0] === undefined ? '' : invoiceNotifications[0].description} </DialogTitle>
        <DialogActions>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default Projects;
