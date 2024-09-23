import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ImageMarker from "react-image-marker";
import FuseLoading from "@fuse/core/FuseLoading";
import { IconButton, makeStyles, Typography } from "@material-ui/core";
import PrintIcon from "@material-ui/icons/Print";
import CancelIcon from "@material-ui/icons/Cancel";
import { navigateTo } from "app/utils/Navigator";
import { routes } from "app/main/projects/store/projectsSlice";

const useStyles = makeStyles((theme) => ({
  img: {
    width: "4px",
    height: "4px",
    display: "inline-block",
  },
  icon: {
    position: "fixed",
    left: "0px",
    top: "0px",
    zIndex: 1,
  },
  icon1: {
    position: "fixed",
    left: "0px",
    top: "0px",
  },
  viewPort: {
    display: "flex",
    flexGrow: 1,
    height: "100vh",
    alignItems: "center",
    justifyContent: "center",
  },
  marker: {
    display: "inline-block",
    width: "100%",
    maxWidth: "640px",
    Height: "100vh",
  },
}));

const PlanPdf = (props) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const plans = useSelector(({ projects }) => projects.details.plans);
  const projectId = useSelector(({ projects }) => projects.details._id);

  let newPlans = [];
  plans.map((plan) => {
    let markersArray = [];
    let newPlan = {};
    if (plan.tasks.length) {
      plan.tasks.forEach((task) => {
        if (task.markertype === undefined) {
          markersArray.push({
            id: task.taskId,
            index: task.index,
            top: task.marker.y,
            left: task.marker.x,
          });
        } else {
          markersArray.push({
            id: task.taskId,
            index: task.index,
            top: task.marker.y,
            left: task.marker.x,
            name: task.markertype.name,
            url: task.markertype.url
          });
        }
      });
      newPlan.markers = markersArray;
      newPlan.file = plan.file;
      newPlan.name = plan.name;
      newPlans.push(newPlan);
    }else{
      let newPlan = {};
      newPlan.markers = [];
      newPlan.file = plan.file;
      newPlan.name = plan.name;
      newPlans.push(newPlan);
    }
  });

  // if (!newPlans.length) {
  //   return <FuseLoading />;
  // }

  const CustomMarker = (props) => {
    return (
      <>
        {
          props.name === undefined || props.name === "dot marker" ?
            <div className="flex flex-row">
              <img
                className={classes.img}
                src="assets/icons/dot marker.png"
                alt="marker"
              />
              <Typography
                style={{
                  fontSize: "6px",
                  fontWeight: 900,
                  color: "red",
                  marginLeft: "1px",
                }}
              >
                {props.itemNumber + 1}
              </Typography>
            </div>
            :
            <div className="flex flex-row">
              <img
                style={{ height: "15px", width: "15px" }}
                src={`assets/icons/${props.url}`}
                alt="marker"
              />
              <Typography
                style={{
                  fontSize: "6px",
                  fontWeight: 900,
                  color: "red",
                  marginLeft: "1px",
                }}
              >
                 {props.itemNumber + 1}
              </Typography>
            </div>
        }
      </>
    );
  };
  return (
    <div className="flex flex-1 flex-col">
      {newPlans.length >0 ?
       <>
        <div className={classes.icon} id="button2">
        <style>{`@media print {
            #button2{
              display: none;
            }
            #print-component {
              height: 100vh;
            }
              }`}</style>
          <IconButton onClick={() => window.print()}>
            <PrintIcon />
          </IconButton>
        </div>
          <div className={classes.icon1}    style={{ paddingTop: "45px" }}  id="button2">
          <IconButton onClick={() => { navigateTo(`/projects/${projectId}`)
                                       dispatch(routes("Plans"))}}>
           <CancelIcon />
         </IconButton>
       </div>
       </>:
        <div className={classes.icon1}  id="button2">
          <IconButton onClick={() => { navigateTo(`/projects/${projectId}`)
                                       dispatch(routes("Plans"))}}>
           <CancelIcon />
         </IconButton>
        </div>
      }
      
    
      {newPlans.length
        ? newPlans.map((plan) => (
          <div className={classes.viewPort}>
            <div className={classes.marker}>
              <Typography className="font-bold" style={{ textAlign: "center",verticalAlign: "middle", horizontalAlign: "center"}}>
                {plan.name}
              </Typography>
              <ImageMarker
                src={plan.file}
                markers={plan.markers}
                markerComponent={CustomMarker}
              />
            </div>
          </div>
        ))
        : <Typography style={{ textAlign: "center",verticalAlign: "middle", horizontalAlign: "center"}}>
        There are no Plans.
      </Typography>}
    </div>
  );
};

export default PlanPdf;
