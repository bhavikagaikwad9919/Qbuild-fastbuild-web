import React, { useEffect, useState, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import "leaflet/dist/leaflet.css";
import { Button, Typography } from "@material-ui/core";
import ImageMarker from "react-image-marker";
import PrismaZoom from "react-prismazoom";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles } from '@material-ui/core/styles';
//import useEventListener from './useEventListner';

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
  viewPort: {
    display: "flex",
    height: "calc(100vh - 120px)",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
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
    width: "6px",
    height: "6px",
    display: "inline-block",
  },
}));

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    '&:focus': {
      backgroundColor: theme.palette.primary.main,
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);

function MarkOnPlan(props) {
  const ref1 = React.useRef(null);
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [markerVisible, setMarkerVisible] = useState(false);
  const [zoom, setZoom] = useState({ zoom: 1 });
  const [oldMarker, setOldMarkers] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [state, setState] = useState({
    svg: null
  });
  const [sSvg, setsSvg] = useState({
    showSvg: ""
  })
  const [dialog, setDialog] = useState({});
  const observed = useRef(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [markertype, setMarkertype] = React.useState({
    markername: "dot marker",
    markerUrl: "dot marker.png"
  });

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose1 = (event) => {
    setAnchorEl(null);
  };


  useEffect(() => {
    async function fetchData() {
      var fileName = props.data.file;
      var fileExtension = fileName.split('.').pop();

      if (fileExtension === "svg") {
        setsSvg({ showSvg: true })
        await fetch(props.data.file)
          .then(res => res.text())
          .then(text => setState({ svg: text }));
      } else {
        setsSvg({ showSvg: false })
      }
    }
    fetchData();

    if (props.open) {
      setOpen(true);

      if (props.data.tasks && props.data.tasks.length) {
        let newMarksers = [];
        props.data.tasks.map((task) => {
          let newMarker;
          if (task.markertype === undefined) {
            newMarker = {
              index: task.index,
              top: task.marker.y,
              left: task.marker.x,
            };
            newMarksers.push(newMarker);
          } else {
            newMarker = {
              index: task.index,
              top: task.marker.y,
              left: task.marker.x,
              name: task.markertype.name,
              url: task.markertype.url
            };
            newMarksers.push(newMarker);
          }


        });

        setOldMarkers(newMarksers);
      }
    }
  }, [props.open]);

  useEffect(() => {
    if (markers.length) {
      setMarkerVisible(false);
    }
  }, [markers]);




  const CustomMarker = (props) => {
    if (markerVisible === true) {
      return (
        <>
          {props.name === undefined || props.name === "dot marker" ?
            <div className="flex flex-row gap-2">
              <img
                className={classes.img}
                src="assets/icons/dot marker.png"
                alt="marker"
              />
              <Typography
                style={{ fontSize: "5px", fontWeight: 900, color: "red" }}
              >
                {props.index}
              </Typography>
            </div>
            : <div className="flex flex-row gap-2">
              <img
                style={{ height: "15px", width: "15px" }}
                //src="assets/icons/dot marker1.png"
                src={`assets/icons/${props.url}`}
                alt="marker"

              />
              <Typography
                style={{ fontSize: "5px", fontWeight: 900, color: "red" }}
              >
                {props.index}.{props.name}
              </Typography>
            </div>
          }
        </>
      );
    } else {
      return (
        <>

          {markertype.markername === "dot marker" ?
            <div className="flex flex-row gap-2">
              <img
                className={classes.img}
                src="assets/icons/dot marker.png"
                alt="marker"
              />
              <Typography
                style={{ fontSize: "5px", fontWeight: 900, color: "red" }}
              >
                {props.index}
              </Typography>
            </div>
            : <div className="flex flex-row gap-2">
              <img
                style={{ height: "15px", width: "15px" }}
                //src="assets/icons/dot marker1.png"
                src={`assets/icons/${markertype.markerUrl}`}
                alt="marker"

              />
              <Typography
                style={{ fontSize: "5px", fontWeight: 900, color: "red" }}
              >
                {markerVisible ? props.index : markertype.markername}
              </Typography>
            </div>
          }
        </>
      );
    }

  };

  const gtb = (value, name) => {
    setMarkertype({ markername: name, markerUrl: value });
  };

  let prismaZoom = useRef(null);

  const prismaZommRef = (element) => {
    prismaZoom = element;
  };

  const onClickOnZoomIn = (event) => {
    prismaZoom.zoomIn(1);
  };

  const onClickOnZoomOut = (event) => {
    prismaZoom.zoomOut(1);
  };

  const handleClose = () => {
    setOpen(false);
    props.close();
  };

  const handleSubmit = () => {
    let planDetails = {
      _id: props.data._id,
      name: props.data.name,
      marker: markers[0],
      markertype: markertype,
      file: props.data.file,
    };

    props.saveDetails(planDetails);
    handleClose();
  };

  const choose = () => {
    console.log("cohh")
  }

  return (
    <div>
      <Dialog fullScreen open={open}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <div className="flex flex-1 items-center justify-between">
              <div className="flex flex-row items-center gap-6">
                <IconButton
                  edge="start"
                  color="inherit"
                  onClick={() => {
                    handleClose();
                  }}
                  aria-label="close"
                >
                  <CloseIcon />
                </IconButton>
                {props.data.name ? (
                  <Typography variant="h6">{props.data.name}</Typography>
                ) : null}
              </div>
              {/* {props.data.marker ? null : ( */}
                <div className="flex gap-10">
                  {markerVisible ? (
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => setMarkerVisible(false)}
                    >
                      Hide Old Markers
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => setMarkerVisible(true)}
                    >
                      Show Old Markers
                    </Button>
                  )}
                  <Button
                    aria-controls="customized-menu"
                    aria-haspopup="true"
                    variant="contained"
                    color="secondary"
                    onClick={handleClick}
                  >
                    Change Marker
                 </Button>
                  <StyledMenu
                    id="customized-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClick={handleClose1}
                  >
                    <StyledMenuItem onClick={() => gtb("Ceiling Leakage.jpg", "Ceiling Leakage")}>
                      <ListItemIcon>
                        <img src="assets/icons/Ceiling Leakage.jpg" style={{ height: "50px", width: "50px" }} alt="Ceiling Leakage" />
                      </ListItemIcon>
                      <ListItemText primary="Ceiling Leakage" />
                    </StyledMenuItem>
                    <StyledMenuItem onClick={() => gtb("wall paint damage.jpg", "Wall Paint Damage")}>
                      <ListItemIcon>
                        <img src="assets/icons/wall paint damage.jpg" style={{ height: "50px", width: "50px" }} alt="Wall Paint Damage" />
                      </ListItemIcon>
                      <ListItemText primary="Wall Paint Damage" />
                    </StyledMenuItem>
                    <StyledMenuItem onClick={() => gtb("wall tiling damage.jpg", "Wall Tiling Damage")}>
                      <ListItemIcon>
                        <img src="assets/icons/wall tiling damage.jpg" style={{ height: "50px", width: "50px" }} alt="Wall Tiling Damage" />
                      </ListItemIcon>
                      <ListItemText primary="Wall Tiling Damage" />
                    </StyledMenuItem>
                    <StyledMenuItem onClick={() => gtb("crack in wall plaster.jpg", "Crack In Wall Plaster")}>
                      <ListItemIcon>
                        <img src="assets/icons/crack in wall plaster.jpg" style={{ height: "50px", width: "50px" }} alt="Crack In Wall Plaster" />
                      </ListItemIcon>
                      <ListItemText primary="Crack In Wall Plaster" />
                    </StyledMenuItem>
                    <StyledMenuItem onClick={() => gtb("wide crack.png", "Wide Crack")}>
                      <ListItemIcon>
                        <img src="assets/icons/wide crack.png" style={{ height: "50px", width: "50px" }} alt="Wide Crack" />
                      </ListItemIcon>
                      <ListItemText primary="Wide Crack" />
                    </StyledMenuItem>
                    <StyledMenuItem onClick={() => gtb("plumbing leakage.jpg", "Plumbing Leakage")}>
                      <ListItemIcon>
                        <img src="assets/icons/plumbing leakage.jpg" style={{ height: "50px", width: "50px" }} alt="Plumbing Leakage" />
                      </ListItemIcon>
                      <ListItemText primary="Plumbing Leakage" />
                    </StyledMenuItem>
                    <StyledMenuItem onClick={() => gtb("rust.jpg", "Rust")}>
                      <ListItemIcon>
                        <img src="assets/icons/rust.jpg" style={{ height: "50px", width: "50px" }} alt="Rust" />
                      </ListItemIcon>
                      <ListItemText primary="Rust" />
                    </StyledMenuItem>
                    <StyledMenuItem onClick={() => gtb("leakage.jpg", "Ceiling Plaster Falling")}>
                      <ListItemIcon>
                        <img src="assets/icons/leakage.jpg" style={{ height: "50px", width: "50px" }} alt="Leakage" />
                      </ListItemIcon>
                      <ListItemText primary="Ceiling Plaster Falling" />
                    </StyledMenuItem>
                    <StyledMenuItem onClick={() => gtb("leaking pipe.jpg", "Leaking Pipe")}>
                      <ListItemIcon>
                        <img src="assets/icons/leaking pipe.jpg" style={{ height: "50px", width: "50px" }} alt="Leaking Pipe" />
                      </ListItemIcon>
                      <ListItemText primary="Leaking Pipe" />
                    </StyledMenuItem>
                    <StyledMenuItem onClick={() => gtb("zigzag line.png", "Crack")}>
                      <ListItemIcon>
                        <img src="assets/icons/zigzag line.png" style={{ height: "50px", width: "50px" }} alt="Leaking Pipe" />
                      </ListItemIcon>
                      <ListItemText primary="Crack" />
                    </StyledMenuItem>
                    <StyledMenuItem onClick={() => gtb("cloud line.png", "Leakages")}>
                      <ListItemIcon>
                        <img src="assets/icons/cloud line.png" style={{ height: "50px", width: "50px" }} alt="Leaking Pipe" />
                      </ListItemIcon>
                      <ListItemText primary="Leakages" />
                    </StyledMenuItem>
                    {markertype.markername !== "dot marker" ?
                      <StyledMenuItem onClick={() => gtb("dot marker.png", "dot marker")}>
                        <ListItemIcon>
                          <img src="assets/icons/dot marker.png" style={{ height: "50px", width: "50px" }} alt="Dot Marker" />
                        </ListItemIcon>
                        <ListItemText primary="Dot Marker" />
                      </StyledMenuItem>
                      : null
                    }
                  </StyledMenu>
                  {markers.length ? (
                    <>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => setMarkers([])}
                      >
                        Remove Marker
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        color="secondary"
                        onClick={handleSubmit}
                      >
                        Save
                      </Button>
                    </>
                  ) : null}
                </div>
              {/* )} */}
            </div>
          </Toolbar>
        </AppBar>
        <DialogContent className="p-0">
          <div className={classes.viewPort}>
            {sSvg.showSvg === true ? (
              <PrismaZoom
                className={classes.zoom}
                topBoundary={120}
                maxZoom={20}
                onZoomChange={(zoom) => setZoom({ zoom })}
                ref={prismaZommRef}
              >
                <ImageMarker
                  src={`data:image/svg+xml;utf8,${encodeURIComponent(state.svg)}`} alt=""
                  markers={markerVisible ? oldMarker : markers}
                  onAddMarker={(marker) => setMarkers([marker])}
                  markerComponent={CustomMarker}
                />
              </PrismaZoom>
            ) : (
              <PrismaZoom
                className={classes.zoom}
                topBoundary={120}
                maxZoom={20}
                onZoomChange={(zoom) => setZoom({ zoom })}
                ref={prismaZommRef}
              >
                <ImageMarker
                  src={props.data.file}
                  markers={markerVisible ? oldMarker : markers}
                  onAddMarker={(marker) => setMarkers([marker])}
                  markerComponent={CustomMarker}
                />
                {/* <canvas ref={elRef} width="800" height="1200" onClick={choose}></canvas> */}
              </PrismaZoom>
            )}
          </div>
          <footer className={classes.footer}>
            <div className={classes.indicator}>
              <button className={classes.button} onClick={onClickOnZoomIn}>
                +
              </button>
              <span className="App-zoomLabel">{`Zoom: ${parseInt(
                zoom.zoom * 100
              )}%`}</span>
              <button className={classes.button} onClick={onClickOnZoomOut}>
                -
              </button>
            </div>
          </footer>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default React.memo(MarkOnPlan);
