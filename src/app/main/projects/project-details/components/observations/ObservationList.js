import FuseAnimate from "@fuse/core/FuseAnimate";
import { makeStyles } from "@material-ui/core/styles";
import { Backdrop, CircularProgress, Fab, Icon, List,Typography, Button } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ObservationsDialog from "./ObservationsDialog";
import { listObservations, openNewDialog, } from "app/main/projects/store/projectsSlice";
import ObservationListItem from "./ObservationListItem";
import FuseAnimateGroup from "@fuse/core/FuseAnimateGroup";

const useStyles = makeStyles((theme) => ({
  addButton: {
    position: "fixed",
    right: 40,
    bottom: 5,
    zIndex: 99,
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

const ObservationList = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const observations = useSelector(
    ({ projects }) => projects.observations.observationsArray
  );
  const projectId = useSelector(({ projects }) => projects.details._id);
  const loading = useSelector(({ projects }) => projects.loading);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(listObservations(projectId));
  }, []);

  return (
    <>
      <div className="flex items-center justify-between px-16 h-36 border-b-1">
        <Typography className="text-16">Observations</Typography>
        <Button color="primary" onClick={() => dispatch(openNewDialog())} variant="contained" className="mb-8" style={{padding:'3px 16px'}} nowrap="true">Add Observation</Button> 
      </div>
      <List className="p-0">
        <FuseAnimateGroup
          enter={{
            animation: "transition.slideUpBigIn",
          }}
        >
          {observations.length>0?
          observations.map((observation) => (
            <ObservationListItem observ={observation} key={observation._id} />
          )):
          <Typography variant="subtitle1" className="mx-8">
            Click on the + sign or click on Add Observation Button and add the required number of observations.
          </Typography>
        }
        </FuseAnimateGroup>
      </List>
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <FuseAnimate animation="transition.expandIn" delay={300}>
        <Fab
          color="primary"
          aria-label="add"
          className={classes.addButton}
          onClick={() => {
            dispatch(openNewDialog())
          }}
        >
          <Icon>add</Icon>
        </Fab>
      </FuseAnimate>

      {/* {open ? ( */}
        <ObservationsDialog />
      {/* ) : null} */}
    </>
  );
};

export default ObservationList;
