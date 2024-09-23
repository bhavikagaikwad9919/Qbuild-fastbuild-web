import React, { useRef, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import { addProject } from "app/main/projects/store/projectsSlice";
import {
    Typography,
    Dialog,
    Toolbar,
    DialogContent,
    AppBar,
    Backdrop,
    TextField,
    FormControl,
    Button,
    CircularProgress,
    MenuItem,
    InputLabel,
    Select
  } from "@material-ui/core";
import { getOrganization, closeNewDialog } from "app/main/organization/store/organizationSlice";
import { dispatchWarningMessage } from "app/utils/MessageDispatcher";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import CancelIcon from "@material-ui/icons/Cancel";
import IconButton from "@material-ui/core/IconButton";

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 3,
    color: '#fff',
  },
}));


function OrgProjectsDialog(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [type, setType] = useState("");
  const organizationDialog = useSelector(({ organizations }) => organizations.orgDialog);
  const details = useSelector(({ organizations }) => organizations.organization);
  const sites = useSelector(({ organizations }) => organizations.sites);
  const user = useSelector(({ auth }) => auth.user.data);
  const projects = useSelector(({ organizations }) => organizations.project);
  const members = useSelector( ({ organizations }) => organizations.members);
  const [count, setCount] = useState(0);
  const [form, setForm] = useState({
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
  const [loading, setLoading] = useState(false);
  const [siteId, setSiteId] = useState("");
  const [ctsNo, setCtsNo] = useState("");
  let moduleList = ["Plans","Tasks","Inventory","Agency","Work BOQ","Work Order","Purchase Order",
  "Daily Data","Bill Register","Documents","Cube-Register","Checklists","Buildings And Areas","Billing"];
  const [selected, setSelected] = useState([]);
  const isAllSelected = moduleList.length > 0 && selected[0] === 'All' && selected.length === 1;

  useEffect(() => {
    members.forEach((t)=>{  
      if(t._id === details.createdBy)
      {
        setCount(t.subscription.projectCount);
      }
   })
  }, []);
  const handleChange = (prop) => (event) => {
    setForm({ ...form, [prop]: event.target.value });
  };

  const handleChangeRadio = (event) => {
    if(event.target.value === 'structuralAudit'){
      setSelected(["Plans","Tasks","Documents","Buildings And Areas","Billing"]);
    }else{
      setSelected(["Plans","Tasks","Inventory","Agency","Daily Data","Documents","Cube-Register","Checklists"])
    }
    setType(event.target.value);
  };

  function closeComposeDialog(){
    dispatch(closeNewDialog());
    setCtsNo("");
    setSiteId("");
    setType("");
    setForm({
      title: "",
      location: "",
      role: "owner",
      contact: "",
      organizationName:"",
      projectType: "",
      ctsNo:"",
      notes:"",
      siteName: "",
    })
  }

  function changeSiteId(site){
    setSiteId(site._id);
    setCtsNo(site.ctsNo);
  }

  function isFormValid1() {
    if(details.orgType === 'SSA'){
      return (
        form.title.length &&
        form.location.length &&
        type.length > 0 &&
        form.siteName.length > 0 &&
        selected.length > 0
      );
    }else{
      return (
        form.title.length &&
        form.location.length &&
        type.length > 0 && 
        selected.length > 0
      );
    } 
  }

  const handleTabChange =  (event) => {
    const value = event.target.value;
    if (value[value.length - 1] === "all") {
      setSelected(moduleList);
      return;
    }else {
      setSelected(value.filter((v) => v !== 'All'));
    }
  };

  const handleSubmit = () => {
    if(projects.ownedProjects.data.length < count){
      setLoading(true);
      form.projectType = type;
      form.organizationId = details._id;
      form.organizationName = details.name;
      form.ctsNo = ctsNo;
      form.module = selected;
      if(siteId !== ""){
        form.siteId = siteId;
      }
      dispatch(addProject(form)).then((response) => {
        dispatch(getOrganization({ OrganizationId : details._id })).then(
          (response) => {
            setLoading(false);
            closeComposeDialog();
          }
        );
      });
    }else{
      dispatchWarningMessage(dispatch, "Your account exceeded maximum number of projects.");
    }
  };

  return (
    <div className='flex flex-1 w-full'>   
       <Dialog  {...organizationDialog.props}  fullWidth maxWidth='sm'>
         <Backdrop className={classes.backdrop} open={loading}>
            <CircularProgress color='inherit' />
         </Backdrop>
         <AppBar className={classes.appBar}>
             <Toolbar>
                <Typography variant='subtitle1' className="flex w-full items-center justify-start gap-10" color='inherit'>
                  Create Project
                </Typography>
                <div className="flex w-full items-center justify-end gap-10 ">
                  <IconButton onClick={() => closeComposeDialog()}>
                    <CancelIcon style={{ color: "red" }} />
                  </IconButton>
                </div>
             </Toolbar>
         </AppBar>

         <DialogContent>
         <div className='flex flex-1 flex-col gap-12 w-full mt-10'> 
         {details.orgType === 'SSA'  ?
          sites.length ? (
            <FormControl fullWidth variant="outlined">
              <InputLabel id="demo-simple-select-outlined-label" required>
                Select Site
              </InputLabel>
              <Select
                fullWidth
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={form.siteName}
                onChange={handleChange("siteName")}
                label="Site"
                required
              >
                {sites.map((site) => (
                  <MenuItem
                    key={site._id}
                    value={site.name}
                    onClick={()=> changeSiteId(site)}
                  >
                    <Typography>{site.name}</Typography>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : (
           <Typography>No Sites Found. Please Add</Typography>
          )
         :null}
         <TextField
           className="w-full"
           type="text"
           name="name"
           value={form.title}
           label="Project Name"
           variant="outlined"
           onChange={handleChange("title")}
           required
         />
         <TextField
           className="w-full"
           type="text"
           name="location"
           value={form.location}
           label="Project Location"
           onChange={handleChange("location")}
           variant="outlined"
           required
         />

         <FormControl
           variant="outlined"
           className="mb-16 w-full"
         >
           <InputLabel htmlFor="outlined-age-native-simple" required >
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

        <div className='flex flex-row gap-10 mb-20 mt-10'> 
          <Button
            variant='contained'
            color='primary'
            disabled={!isFormValid1()}
            onClick={() => handleSubmit()}
          >
            ADD
          </Button>
          <Button variant='contained' onClick={() => {closeComposeDialog()}}>
           Cancel
          </Button>
        </div>
         </div>
         </DialogContent>
       </Dialog>
    </div>
  );
}  

export default OrgProjectsDialog;
