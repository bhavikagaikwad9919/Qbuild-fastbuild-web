import React, { useState,useRef,useEffect } from 'react';
import {
  Button,
  Hidden,
  Icon,
  IconButton,
  Typography,
  Dialog,
  DialogContent,
} from '@material-ui/core';
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { Link } from 'react-router-dom';
import FuseAnimate from '@fuse/core/FuseAnimate';
import { useDispatch, useSelector } from 'react-redux';
import { back } from 'app/main/projects/store/projectsSlice';
import HeaderList from './HeaderList';
import MobileStepper from "@material-ui/core/MobileStepper";
import Paper from "@material-ui/core/Paper";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import { openNewDialog } from "app/main/projects/store/projectsSlice";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { getNotification } from "app/main/notifications/store/notificationSlice";

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

function ProjectsHeader(props) {
  const dispatch = useDispatch();
  const details = useSelector(({ projects }) => projects.details);
  const route = useSelector(({ projects }) => projects.routes);
  const [anchor, setAnchor] = useState(null);
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState(false);
  const tutorials = useSelector(({ projects }) => projects.tutorialSteps);
  const [videoOpen, setVideoOpen] = useState(false);
  const [activeStep, setActiveStep] = React.useState(0);
  const [tutorialSteps, setTutorialSteps] = useState([{id:"",Label:"",ImagePath:""}]);
  const [videoUrl, setVideoUrl] = useState("");
  const maxSteps = tutorialSteps.length;
  // const Transition = React.forwardRef(function Transition(props, ref) {
  //   return <Slide direction="up" ref={ref} {...props} />;
  // });
  const team = useSelector(({ projects }) => projects.details.team);
  const [access, setAccess] = useState();
  const [text, setText] = useState();
  const role = useSelector(({ auth }) => auth.user);
  const buildingsState = useSelector(({ projects }) => projects.details.buildings);

  useEffect(() => {

    team.map((t)=>{
      if(t._id === role.data.id && t.role === "owner" || role.role === 'admin')
      {
        setAccess(true)
      }else if(t._id === role.data.id && t.role !== "owner")
      {
        if(route ==="Vendors")
        {
          setAccess(t.tab_access.includes("Sub-Contractors"));
        }else  if(route ==="Upload")
        {
          const member=t.tab_access.filter((i)=>i === "Buildings And Areas");
          if(member[0] === "Buildings And Areas")
          {
            setAccess(true)
          }else{
            setAccess(false)
          }
        }else  if(route ==="Plans")
        {
          setAccess(t.tab_access.includes("Plans") || t.tab_access.includes("Upload Plan"));
        }else  if(route ==="Indent")
        {
          setAccess(t.tab_access.includes("Indent"));
        }
        else  if(route ==="Daily-Report")
        {
          setAccess(t.tab_access.includes("Daily Data") || t.tab_access.includes("Create/Update Daily Data"));
        }else  if(route ==="Work BOQ")
        {        
          setAccess(t.tab_access.includes("Work BOQ"));
        }else  if(route ==="Purchase-Order")
        {
          setAccess(t.tab_access.includes("Purchase Order"));
        }else  if(route === "Work-Order")
        {
          setAccess(t.tab_access.includes("Work Order"));
        }else  if(route ==="Milestone")
        {
          setAccess(t.tab_access.includes("Milestones"));
        }else  if(route ==="Bill-Register")
        {
          setAccess(t.tab_access.includes("Bill Register"));
        }else{
          const member=t.tab_access.filter((i)=>i === route);
          if(member[0] === route)
          {
            setAccess(true)
          }else{
            setAccess(false)
          }
        }  
      }
    })

    if(route === 'Team')
    {
      setText("Add Member")
      setShow(true);
    }else if(route === 'Milestone'){
      setText("Add Milestone")
      setShow(true);
    }else if(route === 'Purchase-Order'){
      setText("Create Purchase Order")
      setShow(true);
    }else if(route === 'Work-Order'){
      setText("Create Work Order")
      setShow(true);
     } else if(route === 'Indent'){
        setText("Create Indent")
        setShow(true);
    }else if(route === 'Bill-Register'){
      setText("Add Bill")
      setShow(true);
    }else if(route === 'Plans'){
      setText("Upload Plan")
      setShow(true);
    }else if(route === 'Tasks'){
      setText("Add Task")
      setShow(true);
    }else if(route === 'Inventory')
    {
      setText("Add Inventory")
      setShow(true);
    }else if(route === 'Vendors')
    {
      setText("Add Agency")
      setShow(true);
    }else if(route === 'SafetyNcr'){
      //setText("Add Data")
      setShow(false);
    }else if(route === 'QualityNcr'){
      //setText("Add Data")
      setShow(false);
    }else if(route === 'Daily-Report')
    {
      setText("Add Daily-Data")
      setShow(true);
    }else if(route ==='Work-BOQ')
    {
      setText("Add Item")
      setShow(true);
    }else if(route === 'Billing')
    {
      setText("Create Bill")
      setShow(true);
    }else if(route === 'Observations')
    {
      setAccess(true)
      setText("Add Observation")
      setShow(true);
    }else if(route === 'Cube-Register')
    {
      setAccess(true)
      setText("Add Sample")
      setShow(true);
    }else if(route === 'Quality-Control')
    {
      setAccess(true)
      setText("Create Checklist")
      setShow(true);
    }else if(route === 'Templates')
    {
      setAccess(true)
      setText("Add Template")
      setShow(true);
    }else if(route === 'Upload')
    {
      if(buildingsState.length !== 0)
      {
        //setText("Add Building Data")
        setShow(true);
      }else{
        setShow(false)
      } 
    }else if(route === 'Documents')
    {
      setText("Upload Documents")
      setShow(true);
    }else{
      setShow(false)
    }
  }, [route,buildingsState]);

  const setTutorial = () =>{
    const Steps= tutorials.filter((i)=>i.Name===route);
    if(Steps[0]===undefined){
      setTutorialSteps([{id:"",Label:"",ImagePath:""}]);
    }else{
      setTutorialSteps(Steps[0].Steps);
    } 
    setOpen(true);
  }

  const setVideo = () =>{
    if(route === "Team")
    {
      setVideoUrl("https://firebasestorage.googleapis.com/v0/b/qbuild-console.appspot.com/o/Video%2FAdd%20%20team%20member.mp4?alt=media&token=8d3b2e01-c367-487a-9ee9-edb84cfdff42");
      setVideoOpen(true);
    }
  }
 
  const closeDialog = () => {
    setTutorialSteps([{id:"",Label:"",ImagePath:""}]);
    setActiveStep(0);
    setOpen(false);
  }

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const addEvent = () => {
    if(route !== 'Plans' || route !== 'Documents' ){
      dispatch(openNewDialog())
    }
  }

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  return (
    <>
      <div className='flex flex-1 items-center justify-between w-full p-8 sm:p-24'>
        <div className='flex flex-col items-start w-full'>
          <FuseAnimate animation='transition.slideRightIn' delay={300}>
            <Typography
              className='normal-case flex items-center sm:mb-5'
              component={Link}
              role='button'
              to='/projects'
              onClick={() => {
                //history.goBack();
                dispatch(back());
                dispatch(getNotification(role.data.id));
              }}
              color='inherit'
            >
              <Icon className='mr-4 text-20'>arrow_back</Icon>
              Projects
            </Typography>
          </FuseAnimate>

          <FuseAnimate animation='transition.slideLeftIn' delay={300}>
            <Typography variant='h6'>{details.title}</Typography>
          </FuseAnimate>
        </div>
      </div>
      <div className='flex items-center px-8 h-full overflow-x-auto'>
        {/* <div
          hidden={
            route === 'Settings' || route === 'Report' || route === 'Documents'
              ? true
              : false
          }
        >
          <Button
            className='mb-6'
            variant='contained'
            color='secondary'
            size='small'
          >
            Add
          </Button>
        </div> */}
        {/* <Button onClick={() => setVideo()} variant="contained" className="mb-8 mr-8" style={{padding:'3px 16px'}}>Watch Video</Button> */}
        {show === true ?
          <Button onClick={() => setTutorial()} variant="contained" className="mb-8 mr-8" style={{padding:'3px 16px'}}>Tutorial</Button>
        :null}
        {/* {show === true && route !== 'Documents' && route !== 'Plans'  && route !== 'Upload'?
          <Button onClick={() => addEvent()}  disabled={access === true ? false :true} variant="contained" className="mb-8" style={{padding:'3px 16px'}} nowrap="true">{text}</Button> 
        :null}  */}

        {/* {show === true && route === 'Documents' ?
          <>
           <Button onClick={() =>  inputFile.current.click()}  disabled={access === true ? false :true} variant="contained" className="mb-8" style={{padding:'3px 16px'}}>{text}</Button> 
           <input
             ref={inputFile}
             className="hidden"
             id="button-file"
             type="file"
             onChange={handleUploadDocuments}
           />
         </>:null}  */}

        {/* {show === true && route === 'Plans' ?
          <>
            <Button onClick={() => dispatch(openNewDialog())}  disabled={access === true ? false :true} variant="contained" className="mb-8" style={{padding:'3px 16px'}}>Add Plans</Button> 
          </>
        :null}  */}

        {/* <IconButton
          className='h-40 w-40 p-0'
          // aria-owns={selectedProject.menuEl ? 'project-menu' : undefined}
          aria-haspopup='true'
          onClick={(event) => setAnchor(event.currentTarget)}
        >
          <Icon>more_vert</Icon>
        </IconButton> */}
      

        {Boolean(anchor) ? (
          <HeaderList open={true} data={anchor} close={() => setAnchor(null)} />
        ) : null}

        <Hidden lgUp>
          <IconButton
            onClick={(ev) => {
              props.pageLayout.current.toggleLeftSidebar();
            }}
            aria-label='open left sidebar'
          >
            <Icon>menu</Icon>
          </IconButton>
        </Hidden>
      </div>
      {open ? (
        <Dialog fullScreen open={open}>
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={() => closeDialog()}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
            </Toolbar>
          </AppBar>

          <DialogContent className="p-0">
            <div className={classes.root}>
              <Paper square elevation={0} className={classes.header}>
                <Typography>{tutorialSteps[activeStep].Label}</Typography>
              </Paper>
              <img
                className={classes.img}
                src={tutorialSteps[activeStep].ImagePath}
                alt={tutorialSteps[activeStep].Label}
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
            <Typography>{route}</Typography>
           </Paper>
           <video width="750" className={classes.videos} controls autoplay >
              <source src={videoUrl} type="video/mp4"/>
           </video>
          </div>
         </DialogContent>
        </Dialog>
      ) : null}

      <Snackbar
        open={message}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success">Plan is Uploading... Please Wait...!</Alert>
      </Snackbar>
      
    </>
  );
}

export default ProjectsHeader;
