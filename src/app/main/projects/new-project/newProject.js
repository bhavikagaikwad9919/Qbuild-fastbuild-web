import React, { useState, useEffect } from "react";
import FuseAnimate from "@fuse/core/FuseAnimate";
import FuseLoading from "@fuse/core/FuseLoading";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Typography from "@material-ui/core/Typography";
import { getProjects } from "../store/projectsSlice";
import { useDispatch, useSelector } from "react-redux";
import { addProject } from "../store/projectsSlice";
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
} from "@material-ui/core";
import clsx from "clsx";
import { darken } from "@material-ui/core/styles/colorManipulator";
import { dispatchWarningMessage } from "app/utils/MessageDispatcher";
import Backdrop from '@material-ui/core/Backdrop';
import { navigateTo } from "app/utils/Navigator";
import { getOrganizations } from "app/main/organization/store/organizationSlice";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

const useStyles = makeStyles((theme) => ({
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
}));

function getSteps() {
  return ["Create New Project", "Personal Information"];
}

function getSteps1() {
  return ["Create New Project"];
}

export default function NewProject(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const role = useSelector(({ auth }) => auth.user.role);
  const subscription = useSelector(({ auth }) => auth.user.data.subscription);
  const ownedOrganizations = useSelector(({ organizations }) => organizations.ownedOrganizations);
  const entities = useSelector(({ projects }) => projects.entities);
  const userId = useSelector(({ auth }) => auth.user.data.id);
  const [sites, setSites]= useState([]);
  const [siteId, setSiteId] = useState("");
  const [ctsNo, setCtsNo] = useState("");
  const [activeStep, setActiveStep] = React.useState(0);
  const [type, setType] = useState("");
  const [organizationId, setOrganizationId] = useState("");
  const [orgType, setOrgType] = useState("");
  const [loading, setLoading] = useState(false);
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
  let moduleList = ["Plans","Tasks","Inventory","Agency","Work BOQ","Work Order","Purchase Order",
  "Daily Data","Bill Register","Documents","Cube-Register","Checklists","Buildings And Areas","Billing"];
  const [selected, setSelected] = useState([]);
  const isAllSelected = moduleList.length > 0 && selected[0] === 'All' && selected.length === 1;

  useEffect(() => {
    dispatch(getProjects());
    dispatch(getOrganizations(userId)).then(
      (response) => {
      }
    );
  }, [dispatch]);

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
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

  function isFormValid() {
    return (
      values.title.length &&
      values.location.length &&
      values.organizationName.length &&
      type.length > 0 && 
      selected.length > 0
    );
  }

  const steps = entities.ownedProjects === undefined ? [] : entities.ownedProjects.data.length > 0 ? getSteps1():getSteps();

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
      values.contact.length > 9 && 
      values.contact.length <= 13
    );
  };

  const handleSubmit = () => {
    setLoading(true);
    values.projectType = type;
    values.organizationId = organizationId;
    if(siteId !== ""){
      values.siteId = siteId;
    }
    values.ctsNo = ctsNo;
    values.module = selected;
    dispatch(addProject(values)).then((response) => {
      navigateTo("/projects");
      setLoading(false);
    });
  };

  if (!entities.ownedProjects || !entities.associatedProjects) {
    return <FuseLoading />;
  }
  let projectCount = entities.ownedProjects.data.length;

  if (role !== "admin") {
    if (subscription.projectCount <= projectCount) {
      return (
        <div
          className={clsx(
            classes.root,
            "flex flex-auto flex-shrink-0 items-center justify-center"
          )}
        >
          <FuseAnimate animation="transition.expandIn">
            <Card className="w-full max-w-400">
              <CardContent className="flex flex-col items-center justify-center p-30 gap-6">
                <Typography>
                  Your account exceeded maximum number of projects
                </Typography>
                <Link to="/projects">Click here to see your projects</Link>
              </CardContent>
            </Card>
          </FuseAnimate>
        </div>
      );
    }
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
              <Typography
                variant="subtitle1"
                className="mt-10 text-center"
              >
                {entities.ownedProjects.data.length
                  ? `CREATE PROJECT`
                  : `LET'S CREATE YOUR FIRST PROJECT`}
              </Typography>

              <div className="w-full">
                {entities.ownedProjects.data.length ? (
                  <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map((label) => (
                      <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                ) : null}

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
                      <div className="flex flex-1 flex-col items-center justify-center px-12">
                        {activeStep === 0 ? (
                          <React.Fragment>
                            <FormControl
                              variant="outlined"
                              className="mb-16 w-full"
                            >
                              <InputLabel htmlFor="outlined-age-native-simple" required>
                                Organization
                              </InputLabel>
                              <Select
                                name="organization"
                                label="Your Organization"
                                value={values.organizationName}
                                onChange={handleChange("organizationName")}
                                variant="outlined"
                                required
                              >
                               {ownedOrganizations.map((detail) => (
                                 <MenuItem key={detail._id} value={detail.name} onClick={() => handleChangeOrganization(detail)}>
                                   {detail.name}
                                 </MenuItem>
                               ))}
                               <Link
                                 className="ml-12 cursor-pointer"
                                 to={`/organization/${userId}`}
                                >
                                 Click here to add Organization
                                </Link>
                              </Select>
                            </FormControl>
                            {values.organizationName !== "" && orgType === 'SSA' ? 
                              <FormControl
                                variant="outlined"
                                className="mb-16 w-full"
                              >
                               <InputLabel htmlFor="outlined-age-native-simple" required>
                                 Sites
                               </InputLabel>
                               <Select
                                 name="sites"
                                 label="Sites"
                                 value={values.siteName}
                                 onChange={handleChange("siteName")}
                                 variant="outlined"
                                 required
                               >
                                 {sites.map((site) => (
                                   <MenuItem key={site._id} value={site.name} onClick={() => handleChangeSite(site)}>
                                     {site.name}
                                   </MenuItem>
                                 ))}
                                 <Link
                                 className="ml-12 cursor-pointer"
                                 to={`/organization/details/${organizationId}`}
                                >
                                 Click here to add Sites
                                </Link>
                               </Select>
                              </FormControl>
                            :null}
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
                            {/* <FormControl
                              variant="outlined"
                              className="mb-16 w-full"
                            >
                              <InputLabel htmlFor="outlined-age-native-simple">
                                Role
                              </InputLabel>
                              <Select
                                name="role"
                                label="Your Role"
                                value={values.role}
                                onChange={handleChange("role")}
                                variant="outlined"
                                required
                              >
                                <MenuItem value="owner">Project Owner</MenuItem>
                                <MenuItem value="manager">
                                  Project Manager
                                </MenuItem>
                                <MenuItem value="incharge">
                                  Site Incharge
                                </MenuItem>
                              </Select>
                            </FormControl> */}
                            
                            {/* <TextField
                              className="mb-16 w-full"
                              type="text"
                              name="CTS No"
                              value={values.ctsNo}
                              label="CTS No"
                              onChange={handleChange("ctsNo")}
                              variant="outlined"
                              required
                            /> */}
                            {/* <TextField
                              className="mb-16 w-full"
                              type="text"
                              name="Notes"
                              value={values.notes}
                              label="Notes"
                              onChange={handleChange("notes")}
                              variant="outlined"
                              multiline
                              rows={2}
                              required
                            /> */}
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
                            {/* <FormControl fullWidth variant="outlined">
                              <InputLabel id="demo-simple-select-outlined-label" required>
                                Select Modules
                              </InputLabel>
                              <Select
                                fullWidth
                                required
                                id="Select module"
                                name="Select module"
                                label="Select Modules"
                                variant="outlined"
                                labelId="mutiple-select-label"
                                multiple
                                value={selected}
                                onChange={handleTabChange}
                                renderValue={(selected) => selected.join(", ")}
                              >
                                <MenuItem
                                 value="all"
                                 classes={{
                                   root: isAllSelected ? classes.selectedAll : ""
                                 }}
                                >
                                 <ListItemIcon>
                                   <Checkbox
                                     classes={{ indeterminate: classes.indeterminateColor }}
                                     checked={isAllSelected}
                                     indeterminate={
                                       selected.length > 0 && selected.length < moduleList.length
                                     }
                                   />
                                 </ListItemIcon>
                                 <ListItemText
                                    classes={{ primary: classes.selectAllText }}
                                    primary="All"
                                 />
                                </MenuItem>
                                {moduleList.map((option) => (
                                  <MenuItem key={option} value={option}>
                                    <ListItemIcon>
                                      <Checkbox checked={selected.indexOf(option) > -1} />
                                    </ListItemIcon>
                                    <ListItemText primary={option} />
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl> */}
                            {/* <FormControl component="fieldset">
                              <FormLabel className="mb-8" component="legend">
                                Project Type
                              </FormLabel>
                              <RadioGroup
                                row
                                aria-label="Projec Type"
                                name="type"
                                value={type}
                                onChange={handleChangeRadio}
                              >
                                <FormControlLabel
                                  // className='w-1/3'
                                  control={<Radio />}
                                  value="residential"
                                  label="Residential"
                                />
                                <FormControlLabel
                                  // className='w-1/3'
                                  control={<Radio />}
                                  value="commercial"
                                  label="Commercial"
                                />
                                <FormControlLabel
                                  // className='w-1/3'
                                  control={<Radio />}
                                  value="infrastucture"
                                  label="Infrastructure"
                                />
                                <FormControlLabel
                                  // className='w-1/3'
                                  control={<Radio />}
                                  value="structuralAudit"
                                  label="Structural Audit"
                                />
                                <FormControlLabel
                                  // className='w-1/3'
                                  control={<Radio />}
                                  value="RES-COMM"
                                  label="Residential Cum Commercial"
                                />
                                <FormControlLabel
                                  // className='w-1/3'
                                  control={<Radio />}
                                  value="other"
                                  label="Other"
                                />
                              </RadioGroup>
                            </FormControl> */}
                            {entities.ownedProjects.data.length  !== 0 ? (
                             <div className="flex-row my-16">
                              <Button
                                type="submit"
                                variant="contained"
                                onClick={handleSubmit}
                                color="primary"
                                className="mx-auto my-16"
                                aria-label="next"
                                disabled={!isFormValid()}
                              >
                                Create
                              </Button>
                              <Button
                                type="submit"
                                variant="contained"
                                component={Link}
                                role='button'
                                to={'/projects'}
                                color="primary"
                                className="ml-20"
                              >
                                Cancel
                              </Button>
                             </div>
                            ) : (
                              <div className="flex-row my-16">
                              <Button
                                type="submit"
                                variant="contained"
                                onClick={handleNext}
                                color="primary"
                                className="mx-auto my-16"
                                aria-label="next"
                                disabled={!isFormValid()}
                              >
                                Next
                              </Button>
                              <Button
                                type="submit"
                                variant="contained"
                                component={Link}
                                role='button'
                                to={'/projects'}
                                color="primary"
                                className="ml-20"
                              >
                                Cancel
                              </Button>
                             </div> 
                            )}
                          </React.Fragment>
                        ) : (
                          <React.Fragment>
                            <TextField
                              className="mb-16 w-full"
                              type="text"
                              name="contact"
                              validations={{
                                matchRegexp: /^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/,
                              }}
                              validationErrors={{
                                matchRegexp: "Enter valid contact number",
                              }}
                              value={values.contact}
                              label="Contact Number"
                              onChange={handleChange("contact")}
                              variant="outlined"
                            />
                            {/* <TextField
                              className="mb-16 w-full"
                              type="text"
                              name="whatsapp"
                              validations={{
                                matchRegexp: /^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/,
                              }}
                              validationErrors={{
                                matchRegexp: "Enter valid contact number",
                              }}
                              value={values.whatsapp}
                              label="WhatsApp Number"
                              placeholder="Start number with country code. For India +91"
                              onChange={handleChange("whatsapp")}
                              variant="outlined"
                            /> */}
                            <div className="flex-row my-16">
                              <Button
                                variant="contained"
                                disabled={activeStep === 0}
                                onClick={handleBack}
                              >
                                Back
                              </Button>
                              {loading ? (
                                <CircularProgress className="ml-20" size={20} />
                              ) : (
                                <Button
                                  className="ml-20"
                                  variant="contained"
                                  disabled={!disableButton()}
                                  onClick={handleSubmit}
                                  color="primary"
                                >
                                  Submit
                                </Button>
                              )}
                            </div>
                          </React.Fragment>
                        )}
                      </div>
                    </React.Fragment>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </FuseAnimate>
      </div>
    </div>
  );
}
