import React, { useState } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import {
  Dialog,
  DialogContent,
  Icon,
  IconButton,
  Typography,
} from "@material-ui/core";
import Button from '@material-ui/core/Button';
import MobileStepper from "@material-ui/core/MobileStepper";
import Paper from "@material-ui/core/Paper";
import FuseAnimate from "@fuse/core/FuseAnimate";
import InfoIcon from "@material-ui/icons/Info";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import history from "@history";
import { useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
    backgroundColor: "transparent",
  },
  root: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "100%",
    flexGrow: 1,
  },
  header: {
    display: "flex",
    alignItems: "center",
    height: 50,
    paddingLeft: theme.spacing(4),
    backgroundColor: theme.palette.background.default,
  },
  img: {
    overflow: "hidden",
    display: "block",
    width: "100%",
  },
  videos: {
    position: "fixed",
    right: "0",
    bottom: "0",
    transform: "translateX(calc((100% - 100vw) / 2))"
  },
}));

function ProjectsHeader() {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const [activeStep, setActiveStep] = React.useState(0);
  const role = useSelector(({ auth }) => auth.user.role);
    //https://fastbuild-dev.s3.ap-south-1.amazonaws.com/slideshow/create+project+.jpg
   //https://fastbuild-dev.s3.ap-south-1.amazonaws.com/slideshow/add+project.jpg
  const tutorialSteps = [
    {
      label: "Menus",
      imgPath:
        "https://firebasestorage.googleapis.com/v0/b/qbuild-console.appspot.com/o/Tutorial%2Fproject%2FMenu.PNG?alt=media&token=578d95da-479c-482a-a23f-99357df6ca7d",
    },
    {
      label: "Account",
      imgPath:
        "https://firebasestorage.googleapis.com/v0/b/qbuild-console.appspot.com/o/Tutorial%2Fproject%2FAccount.PNG?alt=media&token=f350b734-ca44-489b-a590-48439058dfb0",
    },
    {
      label: "How to Create Project ?",
      imgPath:
        "https://firebasestorage.googleapis.com/v0/b/qbuild-console.appspot.com/o/Tutorial%2Fproject%2FAccount.PNG?alt=media&token=f350b734-ca44-489b-a590-48439058dfb0",
    },
    {
      label: "Fill Information",
      imgPath:
        "https://firebasestorage.googleapis.com/v0/b/qbuild-console.appspot.com/o/Tutorial%2Fproject%2FAccount.PNG?alt=media&token=f350b734-ca44-489b-a590-48439058dfb0",
    },
    {
      label:"Submit Information",
      imgPath:
      "https://firebasestorage.googleapis.com/v0/b/qbuild-console.appspot.com/o/Tutorial%2Fproject%2FAdd_Project2.PNG?alt=media&token=9b7fd02a-a379-4197-849c-a81c7c80a2ee"  
    },
    {
      label:"Project List",
      imgPath:
      "https://firebasestorage.googleapis.com/v0/b/qbuild-console.appspot.com/o/Tutorial%2Fproject%2FProject_Added.PNG?alt=media&token=6d4dad31-aec3-4329-b13c-fa9c277019fe"  
    },
  ];
  const maxSteps = tutorialSteps.length;
  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  return (
    <>
      <div className="flex flex-1 px-16">
        <div className="flex flex-shrink items-center sm:w-224">
          <div className="flex items-center">
            <FuseAnimate animation="transition.expandIn" delay={300}>
              <Icon className="text-32 mr-12">account_box</Icon>
            </FuseAnimate>
            <FuseAnimate animation="transition.slideLeftIn" delay={300}>
              <Typography variant="h6" className=" sm:flex">
                Projects
              </Typography>
            </FuseAnimate>
          </div>
        </div>
      </div>
      <div className="flex items-center px-8 h-full overflow-x-auto">
         {/* <Button onClick={() => setVideoOpen(true)} variant="contained" className="mb-8 mr-10" style={{padding:'3px 16px'}}>Watch Video</Button> */}
         {role !== 'admin' ?
           <Button 
             onClick={() =>  
               history.push({ pathname: "/projects/add",})
             }
             variant="contained"
             className="mb-8 mr-10"
             style={{padding:'3px 16px'}}
           >
             Create Project
           </Button>
          :null}
          {role !== "admin"? 
           <Button onClick={() => setOpen(true)} variant="contained" className="mb-8" style={{padding:'3px 16px'}}>Tutorial</Button>
          :null}
         {/* <IconButton onClick={() => setOpen(true)}>
          <InfoIcon />
        </IconButton> */}
      </div>
      {open ? (
        <Dialog fullScreen open={open}>
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={() => setOpen(false)}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
          <DialogContent className="p-0">
            <div className={classes.root}>
              <Paper square elevation={0} className={classes.header}>
                <Typography>{tutorialSteps[activeStep].label}</Typography>
              </Paper>
              <img
                className={classes.img}
                src={tutorialSteps[activeStep].imgPath}
                alt={tutorialSteps[activeStep].label}
              />
              <MobileStepper
                steps={maxSteps}
                position="static"
                variant="text"
                activeStep={activeStep}
                nextButton={
                  <Button
                    size="small"
                    onClick={handleNext}
                    disabled={activeStep === maxSteps - 1}
                  >
                    Next
                    {theme.direction === "rtl" ? (
                      <ArrowBackIcon />
                    ) : (
                      <ArrowForwardIcon />
                    )}
                  </Button>
                }
                backButton={
                  <Button
                    size="small"
                    onClick={handleBack}
                    disabled={activeStep === 0}
                  >
                    {theme.direction === "rtl" ? (
                      <ArrowForwardIcon />
                    ) : (
                      <ArrowBackIcon />
                    )}
                    Back
                  </Button>
                }
              />
            </div>
          </DialogContent>
        </Dialog>
      ) : null}
      {videoOpen ? (
    <Dialog fullScreen open={videoOpen}>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => setVideoOpen(false)}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <DialogContent className="p-0">
        <div className={classes.root}>
          <Paper square elevation={0} className={classes.header}>
            <Typography>Projects</Typography>
          </Paper>
          <video width="750" className={classes.videos} controls autoplay >
              <source src="https://firebasestorage.googleapis.com/v0/b/qbuild-console.appspot.com/o/Video%2FHow%20To%20Create%20A%20Project.mp4?alt=media&token=1ac4c2fc-da25-4c81-ab1f-659c25353c98" type="video/mp4"/>
          </video>
        </div>
      </DialogContent>
    </Dialog>
  ) : null}
    </>
  );
}

export default ProjectsHeader;
