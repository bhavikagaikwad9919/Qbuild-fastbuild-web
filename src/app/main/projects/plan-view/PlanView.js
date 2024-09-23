import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import ImageMarker from "react-image-marker";
import { routes,getPlanDetails } from "app/main/projects/store/projectsSlice";
import { IconButton, Typography } from "@material-ui/core";
import PrismaZoom from "react-prismazoom";
import FullscreenIcon from "@material-ui/icons/Fullscreen";
import PrintIcon from "@material-ui/icons/Print";
import CancelIcon from "@material-ui/icons/Cancel";
import { navigateTo } from "app/utils/Navigator";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "85vh",
  },
  appBar: {
    position: "relative",
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 3,
    color: "#fff",
  },
  // img: {
  //   maxWidth: "100%",
  //   maxHeight: "100%",
  //   objectFit: "contain",
  // },
  viewPort: {
    display: "flex",
    height: "100vh",
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    position: "fixed",
    bottom: 0,
    textAlign: "center",
    width: "100%",
  },
  indicator: {
    backgroundColor: "#222",
    display: "inline-block",
    padding: "10px",
    color: "#fff",
    borderRadius: "8px 8px 0 0",
  },
  zoom: {
    display: "inline-block",
    width: "100%",
    maxWidth: "640px",
    Height: "100vh",
  },
  button: {
    display: "inline-block",
    margin: "0 5px",
    width: "24px",
    height: "24px",
    textAlign: "center",
    border: "1px solid #fff",
    borderRadius: "50%",
    outline: "none",
    background: "none",
    color: "#fff",
    fontSize: "0.75rem",
    cursor: "pointer",
  },
  img: {
    width: "5px",
    height: "5px",
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
}));

const PlanView = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [file, setFile] = useState("");
  const [markers, setMarkers] = useState([]);
  //const [zoom, setZoom] = useState({ zoom: 1 });
  useEffect(() => {
    dispatch(
      getPlanDetails({
        projectId: props.projectId
          ? props.projectId
          : props.match.params.projectId,
        planId: props.planId ? props.planId : props.match.params.planId,
      })
    ).then((response) => {
      setFile(response.payload.data.file);
      let markersArray = [];
      response.payload.data.tasks.forEach((task) => {
       
        if (task.markertype === undefined) {
          markersArray.push({
            id: task.taskId,
            index: task.index,
            top: task.marker.y,
            left: task.marker.x,
          });
        }else{
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
      setMarkers(markersArray);
    });
    // prismaZoom.zoomIn(0.15);
    // if (props.match.params.zoom) {
    //   prismaZoom.zoomIn(Number(props.match.params.zoom));
    // }
  }, []);

  let prismaZoom = useRef(null);

  const prismaZommRef = (element) => {
    prismaZoom = element;
  };

  const openInNewTab = (url) => {
    const newWindow = window.open(url, "_blank");
    if (newWindow) newWindow.opener = null;
  };

  const CustomMarker = (props) => {
    return (
      <>
       {props.name === undefined || props.name === "dot marker" ?
        <div className="flex flex-row">
          <img
            className={classes.img}
            src="assets/icons/dot marker.png"
            alt="marker"
          />
          <Typography
            style={{
              fontSize: "14px",
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
        fontSize: "14px",
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
    <>
      <div className={classes.viewPort}>
        <div className={classes.icon} id="button1">
          <style>{`@media print {#button1{display: none;}}`}</style>
          {props.feature ? null : (
            <IconButton
              onClick={() =>
                openInNewTab(
                  `https://console.qbuild.app/projects/${props.match.params.projectId}/plans/${props.match.params.planId}/view`
                )
              }
            >
              <FullscreenIcon />
            </IconButton>
          )}

          <IconButton onClick={() => window.print()}>
            <PrintIcon />
          </IconButton>       
        </div>
        <div className={classes.icon1} id="button2"    style={{ paddingTop: "45px" }}>
           <style>{`@media print {#button2{display: none;}}`}</style>
           <IconButton 
             onClick={() => { navigateTo(`/projects/${props.projectId}`)
                              dispatch(routes("Report"))}}>
            <CancelIcon />
          </IconButton>
        </div>
        <PrismaZoom className={classes.zoom} ref={prismaZommRef}>
          <ImageMarker
            src={file}
            markers={markers}
            markerComponent={CustomMarker}
          />
        </PrismaZoom>
      </div>
    </>
  );
};

export default PlanView;
