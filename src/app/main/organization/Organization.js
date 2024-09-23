import React, { useState,useEffect, useRef } from "react";
import { Button, Typography } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import CircularProgress from "@material-ui/core/CircularProgress";
import { darken } from "@material-ui/core/styles/colorManipulator";
import { makeStyles } from "@material-ui/styles";
import OrganizationList from "./OrganizationList";
import OrganizationHeader from "./OrganizationHeader";
import FusePageCarded from "@fuse/core/FusePageCarded";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import FuseAnimateGroup from '@fuse/core/FuseAnimateGroup';
import { TextFieldFormsy } from "@fuse/core/formsy";
import Formsy from "formsy-react";
import Backdrop from '@material-ui/core/Backdrop';
import Chip from "@material-ui/core/Chip";
import AppBar from '@material-ui/core/AppBar';
import CancelIcon from "@material-ui/icons/Cancel";
import IconButton from "@material-ui/core/IconButton";
import Toolbar from '@material-ui/core/Toolbar';
import { getOrganizationsForAdmin, addOrganization, getOrganizations } from "./store/organizationSlice";

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  root: {
    background:
      "radial-gradient(" +
      darken(theme.palette.primary.dark, 0.5) +
      " 0%, " +
      theme.palette.primary.dark +
      " 80%)",
    color: theme.palette.primary.contrastText,
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

function Organization() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const role = useSelector(({ auth }) => auth.user.role);
  const userId = useSelector(({ auth }) => auth.user.data.id);
  const entities = useSelector(({ organizations }) => organizations.entities);
  const ownedOrganizations = useSelector(({ organizations }) => organizations.ownedOrganizations);
  const associatedOrganizations = useSelector(({ organizations }) => organizations.associatedOrganizations);const pageLayout = useRef(null);
  const [addOpen, setAddOpen] = useState(false);
  const [values, setValues] = useState({
    name: '',
    address: '',
    contact: '',
    gstIn:'',
    cIn: '',
    pan: '',
    tan: ''
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const formRef = useRef(null);

  useEffect(() => {
    if(role === 'admin')
    {
      dispatch(getOrganizationsForAdmin()).then(
        (response) => {
 
        }
      );
    }else{
      dispatch(getOrganizations(userId)).then(
        (response) => {
        }
      );
    }
  }, [dispatch]);

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  function openDialog()
  {
    setAddOpen(true);
    setValues({
      name: '',
      address: '',
      contact: '',
      gstIn:'',
      cIn: '',
      pan: '',
      tan: ''
    })
  }

  function disableButton() {
    setIsFormValid(false);
  }

  function enableButton() {
    setIsFormValid(true);
  }

 function handleSubmit () {
     setLoading(true);
     setAddOpen(false)
     values.from = "Organization";
     dispatch(addOrganization({values, userId})).then(
      (response) => {
        setLoading(false);
      });
  }

  function handleChangeTab(event, value) {
    setTabValue(value);
  }
  
  return (
 <React.Fragment>
    <Backdrop className={classes.backdrop} open={loading}>
      <CircularProgress color='inherit' />
    </Backdrop>
    {role === "admin" ? (
    <FusePageCarded
     classes={{
       content: "flex flex-col",
       leftSidebar: "w-256 border-0",
       header: "min-h-72 h-72 sm:h-136 sm:min-h-136",
     }}
     header={<OrganizationHeader onOpen={openDialog}/>}
     content={<OrganizationList data={entities} tab={tabValue} />}
     sidebarInner
     ref={pageLayout}
     innerScroll
    />):(
    <FusePageCarded
     classes={{
       content: "flex flex-col",
       leftSidebar: "w-256 border-0",
       header: "min-h-72 h-72 sm:h-136 sm:min-h-136",
     }}
     header={<OrganizationHeader onOpen={openDialog}/>}
     contentToolbar={
     <>
       <Tabs
         value={tabValue}
         onChange={handleChangeTab}
         indicatorColor="primary"
         textColor="primary"
         variant="scrollable"
         scrollButtons="auto"
         classes={{ root: "w-full h-64" }}
       >
         <Tab
           className="h-64 normal-case"
           label={
             <>
               <div>
                 <Typography variant="subtitle">
                   Owned Organization
                 </Typography>
                 <Chip
                   className="ml-12"
                   label={ownedOrganizations.length}
                   size="small"
                   color="primary"
                 />
               </div>
             </>
           }
         />
         <Tab
            className="h-64 normal-case"
            label={
              <div>
                <Typography variant="subtitle">
                  Associated Organization
                </Typography>
                <Chip
                  className="ml-12"
                  label={associatedOrganizations.length}
                  size="small"
                  color="primary"
                />
              </div>
            }
         />
       </Tabs>
     </>
     }
   content={<OrganizationList data={tabValue === 0 ? ownedOrganizations : associatedOrganizations} tab={tabValue} />}
   sidebarInner
   ref={pageLayout}
   innerScroll
    />
    )}

    <Formsy
      onValid={enableButton}
      onInvalid={disableButton}
      ref={formRef}
    >
 	    <Dialog open={addOpen} className={classes.dialog}  fullWidth maxWidth='sm'>
        <FuseAnimateGroup
          enter={{
            animation: 'transition.slideUpBigIn',
          }}
          leave={{
            animation: 'transition.slideUpBigOut',
          }}
        >
           <AppBar className={classes.appBar}>
           <Toolbar>
            <Typography variant='subtitle1' className="flex w-full items-center justify-start gap-10" color='inherit'>
              {'Add Organization'}
            </Typography>
            <div className="flex w-full items-center justify-end gap-10 ">
            <IconButton onClick={() => setAddOpen(false)}>
             <CancelIcon style={{ color: "red" }} />
            </IconButton>
            </div>
            </Toolbar>
           </AppBar>
          <DialogContent>
           <div className="flex flex-1 flex-col">
             <TextFieldFormsy
               className="mb-24 mt-10"
               label="Name"
               autoFocus
               id="name"
               name="name"
               value={values.name}
               onChange={handleChange("name")}
               variant="outlined"
               required
             />
              <TextFieldFormsy
               validations={{
                 matchRegexp: /^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/,
               }}
               validationErrors={{
                 matchRegexp: "Enter valid contact number",
               }}
               className="mb-24"
               label="Contact"
               id="contact"
               name="contact"
               onChange={handleChange("contact")}
               value={values.contact}
               required
               variant="outlined"
              />
              <TextFieldFormsy
               className="mb-24"
               label="Address"
               autoFocus
               id="address"
               name="address"
               value={values.address}
               onChange={handleChange("address")}
               variant="outlined"
               required
               multiline
               rows={2}
              />
             <div class="grid grid-cols-2 divide-x divide-gray-400">
               <TextFieldFormsy
                 className="w-1 mr-10 mb-24"
                 label="PAN No."
                 autoFocus
                 id="pan"
                 name="pan"
                 value={values.pan}
                 onChange={handleChange("pan")}
                 variant="outlined"
               />
               <TextFieldFormsy
                 className="w-1 ml-10 mb-24"
                 label="TAN No."
                 autoFocus
                 id="tan"
                 name="tan"
                 value={values.tan}
                 onChange={handleChange("tan")}
                 variant="outlined"
               />
             </div>
             <div class="grid grid-cols-2 divide-x divide-gray-400">
               <TextFieldFormsy
                 className="w-1 mr-10 mb-24"
                 label="GSTIN"
                 autoFocus
                 id="gstIn"
                 name="gstIn"
                 value={values.gstIn}
                 onChange={handleChange("gstIn")}
                 variant="outlined"
               />
               <TextFieldFormsy
                 className="w-1 ml-10 mb-24"
                 label="CIN"
                 autoFocus
                 id="cIn"
                 name="cIn"
                 value={values.cIn}
                 onChange={handleChange("cIn")}
                 variant="outlined"
               />
             </div>          
           </div>
          </DialogContent>
          <DialogActions className="justify-start pl-16">
            <Button
              disabled={!isFormValid}
              variant="contained"
              color="primary"
              type="submit"
              onClick={() => handleSubmit()}
            >
              Add
            </Button>
            <Button onClick={() => setAddOpen(false)} variant='contained'>
              Cancel
            </Button>
          </DialogActions>
        </FuseAnimateGroup>
      </Dialog>
    </Formsy>
 </React.Fragment>
 )
}

export default Organization;
