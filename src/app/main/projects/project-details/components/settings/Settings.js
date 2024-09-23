import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Dialog,
  DialogActions,
  //DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Backdrop from "@material-ui/core/Backdrop";
import React, { useState, useEffect } from "react";
import DeleteIcon from "@material-ui/icons/Delete";
import Slide from "@material-ui/core/Slide";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteProject,
  updateProjectDetails,
  getReports,
  listInventories,
  getVendors,
  listDocuments,
  listDocumentFolders,
  listItems,
  listPurchaseOrders,
  getBillings,
  getBillingLastRecord,
  getCubeRegister,
  listBills,
} from "app/main/projects/store/projectsSlice";
import { Link } from "react-router-dom";
import { getOrganizations } from "app/main/organization/store/organizationSlice";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { dispatchWarningMessage } from "app/utils/MessageDispatcher";

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
  root: {
    width: "100%",
    marginBottom:'15px'
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function Settings(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const user = useSelector(({ auth }) => auth.user);
  const projectDetails = useSelector(({ projects }) => projects.details);
  const projectType = useSelector(({ projects }) => projects.details.projectType);
  const [open, setOpen] = useState({
    delete: false,
    server:false,
  });
  const [loading, setLoading] = useState({
    save: false,
    delete: false,
    server:false,
    organization:false
  });
  const projectLoading = useSelector(({ projects }) => projects.loading);
  const [access, setAccess] = useState();
  const userId = useSelector(({ auth }) => auth.user.data.id)
  const [sites, setSites]= useState([]);
  const [orgType, setOrgType] = useState("");
  const [organizations, setOrganizations] = useState([]);
  let moduleList = ["Plans","Tasks","Inventory","Agency","Work BOQ","Work Order","Purchase Order",
  "Daily Data","Bill Register","Documents","Cube-Register","Checklists","Buildings And Areas","Billing"];
  const [selected, setSelected] = useState([]);
  const isAllSelected = moduleList.length > 0 && selected[0] === 'All' && selected.length === 1;

  useEffect(() => {
   if (user.role === "admin") {
     setAccess(true)
   } else if (user.data.id === projectDetails.createdBy) {
     setAccess(true)
   } else {
     setAccess(false)
   }
  }, [access, projectDetails.createdBy, user.data.id, user.role]);

  useEffect(() => {
    dispatch(getOrganizations(userId)).then(
      (response) => {
        if(response.payload !== undefined){
          let ownedOrganizations = response.payload.ownedOrganizations;
          let associatedOrganizations =  response.payload.associatedOrganizations;
          let orgs = [];

          ownedOrganizations.forEach((org)=>{
            orgs.push(org)
          });

          associatedOrganizations.forEach((org)=>{
            orgs.push(org)
          });

          setOrganizations(orgs);

          let orgn = orgs.filter((org)=> org._id === projectDetails.organizationId);

          if(orgn.length > 0){
            setOrgType(orgn[0].orgType)
            if(orgn[0].sites.length >0){
              setSites(orgn[0].sites)
            }else{
              setSites([])
            }
          }else{
            setSites([])
          }
        }
      }
    );
  }, [dispatch]);

  useEffect(() => {
    if(projectDetails.module.length === 0){
      setSelected(moduleList);
    }else{
      setSelected(projectDetails.module)
    }
  }, [projectDetails]);

  const [values, setValues] = useState({
    title : projectDetails.title,
    location : projectDetails.location,
    projectType : projectDetails.projectType,
    organizationName : projectDetails.organizationName  === undefined ? '' : projectDetails.organizationName,
    organizationId : projectDetails.organizationId  === undefined ? null : projectDetails.organizationId,
    ctsNo : projectDetails.ctsNo  === undefined ? '' : projectDetails.ctsNo,
    notes : projectDetails.notes  === undefined ? '' : projectDetails.notes,
    siteName : projectDetails.siteName === undefined || projectDetails.siteName === null ? '' : projectDetails.siteName,
    siteId : projectDetails.siteId === undefined || projectDetails.siteId === null ? '' : projectDetails.siteId,
    modules : projectDetails.module.length === 0? moduleList : projectDetails.module,
  });

  function handleChangeOrganization  (org) {
     setOrgType(org.orgType)
     setSites(org.sites);
     values.organizationId = org._id;
  }

  function handleChangeSite (site) {
    values.siteId = site._id;
  }

  // const deleteVisible = () => {
  //   if (user.role === "admin") {
  //     return true;
  //   } else if (user.data.id === projectDetails.createdBy) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // };

  const handleTabChange =  (event) => {
    const value = event.target.value;
    if (value[value.length - 1] === "all") {
      setSelected(moduleList);
      values.modules = moduleList;
      return;
    }else{
      setSelected(value.filter((v) => v !== 'All'));
      values.modules = value;
    }
  };

  const handleChangeRadio = (event) => {
    if(event.target.value === 'structuralAudit'){
      setSelected(["Plans","Tasks","Documents","Buildings And Areas","Billing"]);
      values.modules = ["Plans","Tasks","Documents","Buildings And Areas","Billing"];
      setValues({ ...values, "projectType": event.target.value })
    }else{
      let listModules =  moduleList;
      setSelected(listModules)
      values.modules = listModules;
      setValues({ ...values, "projectType": event.target.value })
    }
  };

  const updateProject = () => {
    if(values.organizationId === ''){
      dispatchWarningMessage(dispatch, "Please select Organization")
    }else{
      setLoading({ ...loading, save: true });
      dispatch(
        updateProjectDetails({
          projectId: projectDetails._id,
          form: values,
        })
      ).then(() => {
        let prId = projectDetails._id;
        if(values.modules.includes('Daily Data') || values.modules.length === 0){
          dispatch(getReports(prId));
        }
      
        if(values.modules.includes('Inventory') || values.modules.length === 0){
          dispatch(listInventories(prId));
        }
      
        if(values.modules.includes('Agency') || values.modules.length === 0){
          dispatch(getVendors(prId));
        }
      
        if(values.modules.includes('Billing') || values.modules.length === 0){
          dispatch(getBillings(prId));
          dispatch(getBillingLastRecord(prId));
        }
      
        if(values.modules.includes('Documents') || values.modules.length === 0){
          dispatch(listDocuments(prId));
          dispatch(listDocumentFolders(prId));
        }
      
        if(values.modules.includes('Work BOQ') || values.modules.length === 0){
          dispatch(listItems(prId));
        }
      
        if(values.modules.includes('Bill Register') || values.modules.length === 0){
          dispatch(listBills(prId));
        }
      
        if(values.modules.includes('Purchase Order') || values.modules.length === 0){
          dispatch(listPurchaseOrders(prId));
        }
      
        if(values.modules.includes('Cube Register') || values.modules.length === 0){
          dispatch(getCubeRegister(prId));
        }
        setLoading({ ...loading, save: false })
      })
    }
  }

  function isFormValid() {
    return (
      values.title.length &&
      values.location.length &&
      values.organizationName.length &&
      values.projectType.length > 0 && 
      values.modules.length > 0
    );
  }

  return (
    <>
      <div className="flex flex-col w-full h-full items-start justify-start pb-12 mb-10">
      <Backdrop className={classes.backdrop} open={loading.organization}>
        <CircularProgress color="inherit" />
      </Backdrop>
        <div className={classes.root}>
          <Accordion expanded={true}>
            <AccordionSummary
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>Project Details</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div className="flex flex-1 flex-col w-full gap-10">
                <div className="flex flex-1 flex-col w-full gap-10">
                  <div className="grid grid-cols-2 divide-x divide-gray-400"> 
                  <TextField
                    variant="outlined"
                    label="Project Name"
                    className="w-1 mr-10"
                    value={values.title}
                    onChange={(event) =>
                      setValues({ ...values, title: event.target.value })
                    }
                  />
                  <TextField
                    variant="outlined"
                    label="Location"
                    className="w-1 ml-10"
                    value={values.location}
                    onChange={(event) =>
                      setValues({ ...values, location: event.target.value })
                    }
                  />
                  </div>  
                  
                  <div className="grid grid-cols-2 divide-x divide-gray-400"> 
                  <FormControl
                    variant="outlined"
                    className={classes.formControl}
                  >
                    <InputLabel id="demo-simple-select-outlined-label">
                      Project Type
                    </InputLabel>
                    <Select
                      value={values.projectType}
                      className="w-1 mr-10"
                      onChange={handleChangeRadio}
                      label="Project Type"
                    >
                      <MenuItem value="residential">Residential</MenuItem>
                      <MenuItem value="commercial">Commercial</MenuItem>
                      <MenuItem value="infrastucture">Infrastructure</MenuItem>
                      <MenuItem value="structuralAudit">Structural Audit</MenuItem>
                      <MenuItem value="RES-COMM">Residential Cum Commercial</MenuItem>
                      <MenuItem value="other">Others</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl
                    variant="outlined"
                    className={classes.formControl}
                  >
                    <InputLabel htmlFor="outlined-age-native-simple"  className=" ml-10">
                      Organization
                    </InputLabel>
                    <Select
                      name="organization"
                      label="Your Organization"
                      className="w-1 ml-10"
                      value={values.organizationName}
                      onChange={(event) =>
                        setValues({ ...values, organizationName: event.target.value })
                      }
                      variant="outlined"
                      required
                    >
                     {organizations.map((detail) => (
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
                  </div>

                  { orgType === 'SSA' ?
                    <>
                     <div className="grid grid-cols-2 divide-x divide-gray-400"> 
                      {values.organizationName !== "" && sites !== undefined ? 
                       <FormControl
                         variant="outlined"
                         className={classes.formControl}
                       >
                         <InputLabel htmlFor="outlined-age-native-simple">
                           Site
                         </InputLabel>
                         <Select
                           name="sites"
                           label="Sites"
                           className="w-1 mr-10"
                           value={values.siteName}
                             onChange={(event) =>
                             setValues({ ...values, siteName: event.target.value })
                           }
                           variant="outlined"
                           required
                         >
                           {sites.map((site) => (
                             <MenuItem key={site._id} value={site.name} onClick={() => handleChangeSite(site)}>
                               {site.name}
                             </MenuItem>
                           ))}
                         </Select>
                       </FormControl>
                     :
                      <Typography variant="subtitle">Sites not found.</Typography>}
   
                     <TextField
                       variant="outlined"
                       label="CTS No"
                       className="w-1 ml-10"
                       value={values.ctsNo}
                       onChange={(event) =>
                         setValues({ ...values, ctsNo: event.target.value })
                       }
                     />
                     </div>
                     <div className="grid grid-cols-2 divide-x divide-gray-400"> 
                     <TextField
                       variant="outlined"
                       label="Notes"
                       className="w-1 mr-10"
                       value={values.notes}
                       multiline
                       rows={2}
                       onChange={(event) =>
                         setValues({ ...values, notes: event.target.value })
                       }
                     />
                      <FormControl fullWidth variant="outlined">
                         <InputLabel className="w-1 ml-10" id="demo-simple-select-outlined-label" required>
                           Select Modules
                         </InputLabel>
                         <Select
                           fullWidth
                           required
                           id="Select module"
                           name="Select module"
                           label="Select Modules"
                           className="w-1 ml-10"
                           variant="outlined"
                           labelId="mutiple-select-label"
                           multiple
                           multiline
                           rows={2}
                           value={values.modules}
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
                       </FormControl>
                     </div>
                    </>
                  :
                  <>
                    {values.projectType === "structuralAudit" ?
                      <>
                        <div className="grid grid-cols-2 divide-x divide-gray-400"> 
                          <TextField
                            variant="outlined"
                            label="CTS No"
                            className="w-1 mr-10"
                            value={values.ctsNo}
                            onChange={(event) =>
                              setValues({ ...values, ctsNo: event.target.value })
                            }
                          />  
                          <TextField
                            variant="outlined"
                            label="Notes"
                            className="w-1 ml-10"
                            value={values.notes}
                            multiline
                            rows={2}
                            onChange={(event) =>
                             setValues({ ...values, notes: event.target.value })
                            }
                          />                   
                        </div>
                      </>
                      :
                      <>
                      <div className="grid grid-cols-2 divide-x divide-gray-400"> 
                     <TextField
                       variant="outlined"
                       label="CTS No"
                       className="w-1 mr-10"
                       value={values.ctsNo}
                       onChange={(event) =>
                         setValues({ ...values, ctsNo: event.target.value })
                       }
                     />
                      <FormControl fullWidth variant="outlined">
                         <InputLabel className="w-1 ml-10" id="demo-simple-select-outlined-label" required>
                           Select Modules
                         </InputLabel>
                         <Select
                           fullWidth
                           required
                           id="Select module"
                           name="Select module"
                           label="Select Modules"
                           className="w-1 ml-10"
                           variant="outlined"
                           labelId="mutiple-select-label"
                           multiple
                           multiline
                           rows={2}
                           value={values.modules}
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
                      </FormControl>
                     </div>
                     <div className="grid grid-cols-2 divide-x divide-gray-400"> 
                     <TextField
                       variant="outlined"
                       label="Notes"
                       className="w-1 mr-10"
                       value={values.notes}
                       multiline
                       rows={2}
                       onChange={(event) =>
                         setValues({ ...values, notes: event.target.value })
                       }
                     />
                     </div>
                    </>
                  }
                     
                    </>
                  } 
                </div>
                <div className="flex flex-1">
                  {loading.save ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        updateProject();
                      }}
                      disabled={access === true ? !isFormValid() :true}
                    >
                      Save
                    </Button>
                  )}
                </div>
              </div>
            </AccordionDetails>
          </Accordion>
        </div>
        <div className="flex w-full h-full items-end justify-start mt-35 mb-25">
          {access ? (
             <>
            <Button
              style={{ backgroundColor: "red" }}
              variant="contained"
              startIcon={<DeleteIcon />}
              onClick={() => setOpen({ ...open, delete: true })}
            >
              Delete Project
            </Button>

            {/* <Button
             className="ml-8"
             variant="contained"
             onClick={() =>
             dispatch(
               exportProject({
                 projectId: projectDetails._id,
                 projectName: projectDetails.title,
                 deleteServer:"Yes",
               })) }
           >
             Export Project
           </Button> */}
           </>
          ) : null}
        </div>
      </div>
      <Backdrop className={classes.backdrop} open={projectLoading}>
          <CircularProgress color="inherit" />
        </Backdrop>
      {open.delete ? (
        <Dialog open={open.delete} TransitionComponent={Transition}>
          {/* <Backdrop className={classes.backdrop} open={loading}>
            <CircularProgress color="inherit" />
          </Backdrop> */}
          <DialogTitle>Delete Project ?</DialogTitle>
          <DialogActions>
            <Button onClick={() => setOpen({ ...open, delete: false })}>
              Cancel
            </Button>
            {loading.delete ? (
              <CircularProgress color="inherit" size={20} />
            ) : (
              <Button
                style={{ color: "red" }}
                onClick={() => {
                  setOpen({ ...open, delete: false });
                  setLoading({ ...loading, delete: true });
                  dispatch(
                    deleteProject({
                      projectId: projectDetails._id,
                      deleteServer:"No"
                    })
                  ).then(() => setLoading({ ...loading, delete: false }));
                }}
              >
                Delete
              </Button>
            )}
          </DialogActions>
        </Dialog>
      ) : null}

      {open.server ? (
        <Dialog open={open.server} TransitionComponent={Transition}>
          {/* <Backdrop className={classes.backdrop} open={loading}>
            <CircularProgress color="inherit" />
          </Backdrop> */}
          <DialogTitle>Do you want to delete project permenantly ?</DialogTitle>
          <DialogActions>
            <Button onClick={() => {
                  setOpen({ ...open, server: false });
                  setLoading({ ...loading, server: true });
                  dispatch(
                    deleteProject({
                      projectId: projectDetails._id,
                      deleteServer:"No"
                    })
                  ).then(() => setLoading({ ...loading, server: false }));
                }}>
             No
            </Button>
            {loading.delete ? (
              <CircularProgress color="inherit" size={20} />
            ) : (
              <Button
                style={{ color: "red" }}
                onClick={() => {
                  setOpen({ ...open, server: false });
                  setLoading({ ...loading, server: false });
                  dispatch(
                    deleteProject({
                      projectId: projectDetails._id,
                      deleteServer:"Yes"
                    })
                  ).then(() => setLoading({ ...loading, server: false }));
                }}
              >
                Yes
              </Button>
            )}
          </DialogActions>
        </Dialog>
      ) : null}
    </>
  );
}

export default Settings;
