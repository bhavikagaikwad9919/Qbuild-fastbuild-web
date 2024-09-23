import React, { useEffect, useCallback, useState } from 'react';
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
    Radio,
    RadioGroup,
    FormLabel,
    TextField,
    FormControl,
    Button,
    FormControlLabel,
    CircularProgress,
    MenuItem,
    InputLabel,
    Select
  } from "@material-ui/core";
import { getOrganization } from "app/main/organization/store/organizationSlice";
import { getSite, closeNewDialog } from "app/main/organization/organization-details/sites/store/sitesSlice";

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 3,
    color: '#fff',
  },
}));


function SiteProjectsDialog(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [type, setType] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const siteDialog = useSelector(({ sites }) => sites.siteDialog);
  const organization = useSelector(({ organizations }) => organizations.organization);
  const site = useSelector(({ sites }) => sites.details);
  const [form, setForm] = useState({
    title: "",
    location: "",
    role: "owner",
    contact: "",
    projectType: "",
    ctsNo:"",
    notes:"",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPageLoading(true);
    dispatch(getOrganization({ OrganizationId : props.organizationId })).then(
      (response) => {
        setPageLoading(false);
      }
    );
  }, [dispatch, props.organizationId]);

  const handleChange = (prop) => (event) => {
    setForm({ ...form, [prop]: event.target.value });
  };

  const handleChangeRadio = (event) => {
    setType(event.target.value);
  };

  function closeComposeDialog(){
    dispatch(closeNewDialog());
    setForm({
      title: "",
      location: "",
      role: "owner",
      contact: "",
      projectType: "",
      ctsNo:"",
      notes:"",
    });
    setType("");
  }

  const handleSubmit = () => {
    setLoading(true);
    setAddOpen(false);
    form.projectType = type;
    form.organizationId = organization._id;
    form.organizationName = organization.name;
    form.siteId = site._id;
    form.siteName = site.name;
    form.ctsNo = site.ctsNo;

     dispatch(addProject(form)).then((response) => {
       dispatch(getOrganization({ OrganizationId : organization._id })).then(
         (response) => {
          dispatch(getSite({ OrganizationId : organization._id, SiteId : site._id })).then(
            (response) => {
              setLoading(false);
             closeComposeDialog()
            });
         });
     });
  };

  function isFormValid1() {
    return (
      form.title.length &&
      form.location.length &&
      type.length > 0
    );
  }

  return (
    <div className='flex flex-1 w-full'>   
       <Dialog  {...siteDialog.props}  fullWidth maxWidth='sm'>
         <Backdrop className={classes.backdrop} open={loading}>
            <CircularProgress color='inherit' />
         </Backdrop>
         <AppBar className={classes.appBar}>
             <Toolbar>
                 <Typography variant='subtitle1' color='inherit'>
                     Create Project
                 </Typography>
             </Toolbar>
         </AppBar>
         <DialogContent>
         <div className='flex flex-1 flex-col gap-12 w-full mt-10'>
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
         {/* <TextField
           className="w-full"
           type="text"
           name="CTS No"
           value={form.ctsNo}
           label="CTS No"
           onChange={handleChange("ctsNo")}
           variant="outlined"
         /> */}
         {/* <TextField
           className="w-full"
           type="text"
           name="Notes"
           value={form.notes}
           label="Notes"
           onChange={handleChange("notes")}
           variant="outlined"
           multiline
           rows={2}
        /> */}

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

export default SiteProjectsDialog;
