import React, { useState, useEffect, useRef } from "react";
import FuseAnimate from "@fuse/core/FuseAnimate";
import FuseLoading from "@fuse/core/FuseLoading";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Typography from "@material-ui/core/Typography";
import { getProjects } from "app/main/projects/store/projectsSlice";
import { useDispatch, useSelector } from "react-redux";
import { addProject } from "app/main/projects/store/projectsSlice";
import {
  Card,
  CardContent,
  TextField,
  Select,
  FormControl,
  InputLabel,
  Button,
  MenuItem,
  CircularProgress,
  DialogContent,
  Icon,
  IconButton,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import clsx from "clsx";
import { darken } from "@material-ui/core/styles/colorManipulator";
import { dispatchWarningMessage } from "app/utils/MessageDispatcher";
import Backdrop from '@material-ui/core/Backdrop';
import { navigateTo } from "app/utils/Navigator";
import { getOrganizations, addOrganization, addMember, addAgency, verifyMember } from "app/main/organization/store/organizationSlice";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ChipInput from "material-ui-chip-input";
import FuseUtils from "@fuse/utils";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
    backgroundColor: "black",
  },
  steps: {
    width: "100%",
  },
  root: {
    background: `radial-gradient(${darken(
      theme.palette.primary.dark,
      0.5
    )} 0%, ${theme.palette.primary.dark} 80%)`,
    color: theme.palette.primary.contrastText,
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  videos: {
    //position: "absolute",
    top: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
    overflow: "hidden"
  },
}));

function getSteps() {
  return ["Create an Organization", "Create Project","Add Member", "Add Agency"];
}

const initialState = {
  agencyType:'',
  name: '',
  address: '',
  contact: '',
  email: '',
  pan: '',
  gstin: '',
};

export default function NewProject(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const role = useSelector(({ auth }) => auth.user.role);
  const subscription = useSelector(({ auth }) => auth.user.data.subscription);
  const ownedOrganizations = useSelector(({ organizations }) => organizations.ownedOrganizations);
  const associatedOrganizations = useSelector(({ organizations }) => organizations.associatedOrganizations);
  const entities = useSelector(({ projects }) => projects.entities);
  const user = useSelector(({ auth }) => auth.user.data);
  const userId = useSelector(({ auth }) => auth.user.data.id);
  const [sites, setSites]= useState([]);
  const [siteId, setSiteId] = useState("");
  const [ctsNo, setCtsNo] = useState("");
  const [activeStep, setActiveStep] = React.useState(0);
  const [type, setType] = useState("");
  const [organizationId, setOrganizationId] = useState("");
  const [orgType, setOrgType] = useState("");
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState('');
  const [values, setValues] = useState({
    title: "",
    location: "",
    role: "owner",
    contact: "",
    organizationName:"",
    projectType: "",
    ctsNo:"",
    notes:"",
    siteName: "",
  });
  const [open, setOpen] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const [show, setShow] = useState(true);
  let moduleList = ["Milestones","Plans","Tasks","Inventory","Agency","Work BOQ","Work Order","Purchase Order",
  "Daily Data","Bill Register","Documents","Cube-Register","Checklists","Buildings And Areas","Billing"];
  const [selected, setSelected] = useState([]);
  const isAllSelected = moduleList.length > 0 && selected[0] === 'All' && selected.length === 1;

  const [org, setOrg] = useState({
    name: '',
    address: '',
    contact: '',
    gstIn:'',
    cIn: '',
    pan: '',
    tan: '',
    from:''
  });
  const [member, setMember] = useState({
    name: "",
    email: "",
    contact: "",
    designation: "",
    code: FuseUtils.generateGUID(),
  });
  const [form, setForm] = useState(initialState);
  const [contacts, setContacts] = useState([]);
  const [projectId, setProjectId] = useState("");
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    dispatch(getProjects());
    dispatch(getOrganizations(userId)).then(
      (response) => {
      }
    );
  }, [dispatch]);

  function handleAddItem(value) {
    setContacts((contacts) => [...contacts, value]);
  }

  function handleDeleteItem(Item, index) {
    setContacts(contacts.filter((item) => item !== Item));
  }

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleChangeOrg = (prop) => (event) => {
    setOrg({ ...org, [prop]: event.target.value });
  };

  const handleChangeMember = (prop) => (event) => {
    setMember({ ...member, [prop]: event.target.value });
  };

  const handleChangeCode = (event) => {
    setCode(event.target.value);
  };

  const handleChangeAgency = (prop) => (event) => {
    setForm({ ...form, [prop]: event.target.value });
  };


  function handleChangeOrganization  (org) {
    setOrgType(org.orgType)
    setOrganizationId(org._id);
    if(org.sites.length >0){
      setSites(org.sites)
    }else{
      setSites([])
    }
  }

  function handleChangeSite (site) {
    setSiteId(site._id);
    setCtsNo(site.ctsNo);
  }

  const handleChangeRadio = (event) => {
    if(event.target.value === 'structuralAudit'){
      setSelected(["Plans","Tasks","Documents","Buildings And Areas","Billing"]);
    }else{
      setSelected(["Plans","Tasks","Inventory","Agency","Daily Data","Documents","Cube-Register","Checklists"])
    }
    setType(event.target.value);
  };

  function isValuesValid() {
    return (
      values.title.length &&
      values.location.length &&
      values.organizationName.length &&
      type.length > 0 && 
      selected.length > 0
    );
  }

  function isOrgValid() {
    return (
      org.name.length 
    );
  }

  function isFormValid() {
    return (
      form.agencyType.length > 0 &&
      form.name.length > 0 &&
      form.address.length > 0 &&
      contacts.length > 0
    );
  }

  function isMemberValid() {
    return (
      member.name.length > 0 &&
      member.email.length > 0 && 
      member.designation.length > 0 &&
      member.contact.length
    );
  }

  const steps = getSteps();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleTabChange =  (event) => {
    const value = event.target.value;
    if (value[value.length - 1] === "all") {
      setSelected(moduleList);
      return;
    }else {
      setSelected(value.filter((v) => v !== 'All'));
    }
  };

  const disableButton = () => {
    return (
      code.length > 0 
    );
  };

  function handleSubmitOrg() {
    setLoading(true);
    org.from = "OnBoarding";
    dispatch(addOrganization({values: org, userId})).then(
      (response) => {
        if(response.payload !== undefined){
          setOrganizationId(response.payload._id);
          setValues({ ...values, 'organizationName': response.payload.name });
        }
        setLoading(false);
        handleNext()
      }
    );
  }

  const handleSubmit = () => {
    if (subscription.projectCount <= projectCount) {
      dispatchWarningMessage(dispatch, "Your account exceeded maximum number of projects");
      navigateTo(`/projects`);
    }else{
      setLoading(true);
      values.projectType = type;
      values.organizationId = organizationId;
      if(siteId !== ""){
        values.siteId = siteId;
      }
      values.ctsNo = ctsNo;
      values.module = selected;
  
      dispatch(addProject(values)).then((response) => {
        if(response.payload !== undefined){
          setProjectId(response.payload.data._id);
        }
        setLoading(false);
        handleNext()
      });
    }
    
  };

  function handleSubmitMember() {
    setLoading(true);
    let data = {
      "contact": member.contact,
      "email": member.email,
      "name": member.name,
      "designation": member.designation,
      "access": [],
      "code": member.code
    }

    dispatch(addMember({ organizationId, member: data })).then(
      (response) => {
        setLoading(false);
        handleNext()
      }
    );
  }

  const handleSubmitAgency = () =>{
    setLoading(true);
    form.contact = contacts;
    dispatch(addAgency({ organizationId, form })).then((response) => {
      setLoading(false);
      if(projectId === undefined){
        navigateTo(`/projects`);
      }else{
        navigateTo(`/projects/${projectId}`);
      }
    })
  }

  async function verifyToken(){
    setLoading(true);
    dispatch(verifyMember({ userId, code })).then((response) => {
      if(response.payload !== undefined){
        if(response.payload.message === 'Verified.'){
          finish();
        }
      }
      setLoading(false);
    })
  }

  function finish(){
    if(projectId === undefined){
      navigateTo(`/projects`);
    }else{
      navigateTo(`/projects/${projectId}`);
    }
  }

  if (!entities.ownedProjects || !entities.associatedProjects) {
    return <FuseLoading />;
  }
  let projectCount = entities.ownedProjects.data.length;

  function callNext(){
    setVideoOpen(false)
    if(associatedOrganizations.length > 0){
      setOpen(true);
    }else{
      setShow(false)
    }
  }

  function callVideo(){
    setVideoOpen(true)
    //setShow(false)
  }

  function shouldHideButton() {
    return currentTime >= 120; // hide the button till 120 seconds
  }

  return (
    <div
      className={clsx(
        classes.root,
        "flex flex-col flex-auto flex-shrink-0 items-center justify-center p-30"
      )}
    >
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color='inherit' />
      </Backdrop>
      <div className="flex flex-col items-center justify-center w-full">
        <FuseAnimate animation="transition.expandIn">
          <Card className="w-full max-w-400">
            <CardContent className="flex flex-col items-center justify-center p-30">
              <div className="w-full">
                {show === false ?
                  <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map((label) => (
                      <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                : null}

                <div>
                  {activeStep === steps.length ? (
                    <div>
                      <Typography className={classes.instructions}>
                        All steps completed
                      </Typography>
                      <Button onClick={handleReset}>Reset</Button>
                    </div>
                  ) : (
                    <React.Fragment>
                      {show === true ?
                        <React.Fragment>
                          <Typography variant="h6" className="mt-10 text-center font-bold"> Welcome, {user.displayName}</Typography>
                          <Typography variant="subtitle1" className="mt-10 text-center font-bold"> Our mission is to change the way you manage your construction projects. </Typography>
                          <div className="flex flex-1 flex-col items-center justify-center">
                            <Button
                              type="submit"
                              variant="contained"
                              onClick={()=> callVideo()}
                              color="primary"
                              className="mx-auto my-16"
                              aria-label="next"
                            >
                             Let's Start
                            </Button>
                          </div>
                        </React.Fragment>   
                      :null }
                      
                      <div className="flex flex-1 flex-col items-center justify-center px-12">
                        {activeStep === 0 && show === false ? (
                          <React.Fragment>
                            <TextField
                              className="mb-16 w-full"
                              label="Organization Name"
                              placeholder="Enter an Organization name"
                              autoFocus
                              id="name"
                              name="name"
                              value={org.name}
                              onChange={handleChangeOrg("name")}
                              variant="outlined"
                              required
                            />
                            <div className="flex-row my-4">
                              <Button
                                type="submit"
                                variant="contained"
                                onClick={()=> handleSubmitOrg()}
                                color="primary"
                                className="mx-auto my-8"
                                aria-label="next"
                                disabled={!isOrgValid()}
                              >
                                Create
                              </Button>
                            </div>
                          </React.Fragment>
                        ) : activeStep === 1 ? (
                          <React.Fragment>
                            <TextField
                              className="mb-16 w-full"
                              type="text"
                              name="name"
                              value={values.title}
                              label="Project Name"
                              variant="outlined"
                              onChange={handleChange("title")}
                              required
                            />
                            <TextField
                              className="mb-16 w-full"
                              type="text"
                              name="location"
                              value={values.location}
                              label="Project Location"
                              onChange={handleChange("location")}
                              variant="outlined"
                              required
                            />
                            <FormControl
                              variant="outlined"
                              className="mb-16 w-full"
                            >
                              <InputLabel htmlFor="outlined-age-native-simple" required>
                                Project Type
                              </InputLabel>
                              <Select
                                name="type"
                                label="Project Type"
                                value={type}
                                onChange={handleChangeRadio}
                                variant="outlined"
                                required
                              >
                                <MenuItem value="residential">Residential</MenuItem>
                                <MenuItem value="commercial">Commercial</MenuItem>
                                <MenuItem value="infrastucture">Infrastructure </MenuItem>
                                <MenuItem value="structuralAudit">Structural Audit </MenuItem>
                                <MenuItem value="RES-COMM">Residential Cum Commercial </MenuItem>
                              </Select>
                            </FormControl>
                            <div className="flex-row my-16">
                              {loading ? (
                                <CircularProgress className="ml-20" size={20} />
                              ) : (
                                <Button
                                  className="ml-20"
                                  variant="contained"
                                  disabled={!isValuesValid()}
                                  onClick={()=> handleSubmit()}
                                  color="primary"
                                >
                                  Submit
                                </Button>
                              )}
                            </div>
                          </React.Fragment>
                        ) : activeStep === 2 ? (
                          <React.Fragment>
                            <div className='flex flex-1 flex-col gap-12 w-full mt-10'>
                              <TextField
                                //className="mb-24"
                                label="Name"
                                autoFocus
                                id="name"
                                name="name"
                                value={member.name}
                                onChange={handleChangeMember("name")}
                                variant="outlined"
                                required
                                fullWidth
                              />
                              <TextField
                                //className="mb-24"
                                label="Email"
                                id="email"
                                name="email"
                                value={member.email}
                                onChange={handleChangeMember("email")}
                                variant="outlined"
                                required
                                fullWidth
                              />
                              <TextField
                                //className="mb-24"
                                label="Designation"
                                autoFocus
                                id="designation"
                                name="designation"
                                value={member.designation}
                                onChange={handleChangeMember("designation")}
                                variant="outlined"
                                required
                                fullWidth
                             />
                             <TextField
                                label="Contact"
                                id="contact"
                                name="contact"
                                onChange={handleChangeMember("contact")}
                                value={member.contact}
                                variant="outlined"
                                fullWidth
                                required
                             />
                            </div>
                            <div className="flex-row my-16">
                              {loading ? (
                                <CircularProgress className="ml-20" size={20} />
                              ) : (
                                <>
                                  <Button
                                    type="submit"
                                    variant="contained"
                                    onClick={handleNext}
                                    color="primary"
                                    className="mx-auto my-16"
                                    aria-label="next"
                                  >
                                    Skip
                                  </Button>
                                  <Button
                                    className="ml-20"
                                    variant="contained"
                                    disabled={!isMemberValid()}
                                    onClick={()=> handleSubmitMember()}
                                    color="primary"
                                  >
                                    Submit
                                  </Button>
                                </> 
                              )}
                            </div>
                          </React.Fragment>        
                        ) : show === false ? (
                          <React.Fragment>
                           <div className='flex flex-1 flex-col gap-12 w-full mt-10'>
                             <FormControl variant="outlined" className="mt-8">
                               <InputLabel id="demo-simple-select-outlined-label">
                                  Agency Type
                               </InputLabel>
                               <Select
                                 labelId="demo-simple-select-outlined-label"
                                 required
                                 id="demo-simple-select-outlined"
                                 value={form.agencyType}
                                 onChange={handleChangeAgency("agencyType")}
                                 label="Agency Type"
                               >
                                 <MenuItem value="Sub-Contractor">Sub-Contractor</MenuItem>
                                 <MenuItem value="Contractor">Contractor</MenuItem>
                                 <MenuItem value="Supplier">Supplier</MenuItem>
                                 <MenuItem value="Consultant">Consultant</MenuItem>
                                 <MenuItem value="Hirer">Hirer</MenuItem>
                               </Select>
                             </FormControl>
                             <TextField
                               required
                               label='Name'
                               variant='outlined'
                               value={form.name}
                               onChange={handleChangeAgency('name')}
                             />
                             <TextField
                                required
                                label='Address Line'
                                multiline
                                rows={2}
                                variant='outlined'
                                value={form.address}
                                onChange={handleChangeAgency('address')}
                             />
                             <ChipInput
                               id="contacts"
                               label="Contacts"
                               type='number'
                               required
                               value={contacts}
                               onAdd={(item) => handleAddItem(item)}
                               onDelete={(item, index) => handleDeleteItem(item, index)}
                               newChipKeyCodes={[13, 188]}
                               variant="outlined"
                             />
                              <TextField
                                label='Email'
                                variant='outlined'
                                value={form.email}
                                onChange={handleChangeAgency('email')}
                              />
                              <div class="grid grid-cols-2 divide-x divide-gray-400">
                                <TextField
                                  inputProps={{ style: { textTransform: "uppercase" } }}
                                  className="w-1 mr-10 mb-12"
                                  label='PAN'
                                  variant='outlined'
                                  value={form.pan}
                                  onChange={handleChangeAgency('pan')}
                                />
                                <TextField
                                  label='GSTIN (if available)'
                                  className="w-1 ml-10 mb-12"
                                  variant='outlined'
                                  value={form.gstin}
                                  onChange={handleChangeAgency('gstin')}
                                />
                              </div>
                           </div>

                            <div className="flex-row my-16">
                              {loading ? (
                                <CircularProgress className="ml-20" size={20} />
                              ) : (
                                <>
                                  <Button
                                    type="submit"
                                    variant="contained"
                                    onClick={()=> finish()}
                                    color="primary"
                                    className="mx-auto my-16"
                                    aria-label="next"
                                  >
                                   Skip
                                  </Button>
                                  <Button
                                    className="ml-20"
                                    variant="contained"
                                    disabled={!isFormValid()}
                                    onClick={()=> handleSubmitAgency()}
                                    color="primary"
                                  >
                                    Submit
                                  </Button>
                                </> 
                              )}
                            </div>
                          </React.Fragment>
                        ): null}
                      </div>
                    </React.Fragment>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </FuseAnimate>
      </div>

      <Dialog open={open} className={'items-center justify-center'}>
        <Backdrop className={classes.backdrop} open={loading}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <DialogTitle style={{'maxWidth': '250px'}}>
          <Typography className="pt-2 text-15 text-center" color="primary">Please enter verification code that you received in a mail name - Organization Assigned. </Typography>
          <TextField
            className="mb-6 mt-16 w-full"
            label="Verification code"
            autoFocus
            id="code"
            name="code"
            value={code}
            onChange={handleChangeCode}
            variant="outlined"
            required
          />
        </DialogTitle>
        <DialogActions>
          <>
            <Button color="primary" disabled={!disableButton()} onClick={()=> verifyToken()}> Submit </Button>
            <Button
              onClick={() => {
                setOpen(false);
                setShow(false)
              }}
              color="primary"
            >
              Cancel
            </Button>
          </>
        </DialogActions>
      </Dialog>

      {videoOpen ? (
        <Dialog fullScreen open={videoOpen}>
           <DialogTitle id="checklist-dialog-title" className={classes.appBar}>
              <IconButton
                edge="start"
                color="inherit"
                onClick={() => callNext()}
                aria-label="close"
                style={{ display: shouldHideButton() ? 'block' : 'none', "backgroundColor": "white" }}
              >
               <CloseIcon />
              </IconButton>
          </DialogTitle>
          <DialogContent style={{"backgroundColor": "black"}}>
            <video onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)} className={classes.videos} controls autoPlay >
              <source src="https://firebasestorage.googleapis.com/v0/b/qbuild-console.appspot.com/o/Video%2Fqbuild%20welcome%20video%2013%20Dec%2022.mp4?alt=media&token=24909611-0eee-415c-8269-fd0e40a4c115" type="video/mp4"/>
            </video>
          </DialogContent>
        </Dialog>
      ) : null}
    </div>
  );
}
