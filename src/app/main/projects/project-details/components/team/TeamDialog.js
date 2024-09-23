import React, { useEffect, useCallback, useRef, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Icon,
  IconButton,
  Typography,
  Toolbar,
  AppBar,
  Avatar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  MenuItem
} from "@material-ui/core";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";
import { TextFieldFormsy, SelectFormsy } from "@fuse/core/formsy";
import Formsy from "formsy-react";
import FuseUtils from "@fuse/utils";
import {
  closeEditDialog,
  closeNewDialog,
  deleteTeam,
  updateTeam,
  addTeam,
} from "app/main/projects/store/projectsSlice";
import { useDispatch, useSelector } from "react-redux";
import Checkbox from "@material-ui/core/Checkbox";
import { dispatchWarningMessage } from "app/utils/MessageDispatcher";
import TextField from "@material-ui/core/TextField";
import Autocomplete from '@material-ui/lab/Autocomplete';
import TreeItem from '@material-ui/lab/TreeItem';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import CancelIcon from "@material-ui/icons/Cancel";
import { getOrganization, listMember  } from "app/main/organization/store/organizationSlice";

const defaultFormState = {
  id: "",
  name: "",
  email: "",
  contact: "",
  role: "",
  //whatsapp: "",
  tab_access:[],
};

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 380,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  delete: {
    color: "red",
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
  indeterminateColor: {
    color: "#f50057"
  },
  selectAllText: {
    fontWeight: 500
  },
  selectedAll: {
    backgroundColor: "rgba(0, 0, 0, 0.08)",
    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.08)"
    }
  }
}));

const useItemStyles = makeStyles(theme => ({
  root: {
    "& > .MuiTreeItem-content > .MuiTreeItem-label": {
      display: "flex",
      alignItems: "center",
      padding: "10px 0",
      background: "transparent !important",
      pointerEvents: "none",
    },
    "& > .MuiTreeItem-content  > .MuiTreeItem-label::before": {
      content: "''",
      display: "inline-block",
      width: 18,
      height: 18,
      marginRight: 8,
      border: "2px solid black",
      background: "white",
    }
  },
  iconContainer: {
    marginRight: 12,
    "& > svg": {
      padding: 25,
      "&:hover": {
        opacity: 0.6
      }
    }
  },
  label: {
    padding: 0,
    fontSize : "15px",
    marginTop: "10px",
  },
  selected: {
    "& > .MuiTreeItem-content  > .MuiTreeItem-label::before": {
      background: "blue",
      border: "2px solid transparent",
      
    }
  }
}));

const useViewStyles = makeStyles({
  root: {}
});

function TeamDialog(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const projectDialog = useSelector(({ projects }) => projects.projectDialog);
  const projectId = useSelector(({ projects }) => projects.details._id);
  const team = useSelector(({ projects }) => projects.details.team);
  const user = useSelector(({ auth }) => auth.user);
  const projectDetails = useSelector(({ projects }) => projects.details);
  const loading = useSelector(({ projects }) => projects.loading);
  const modules = useSelector(({ projects }) => projects.details.module);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(defaultFormState);
  const [isFormValid, setIsFormValid] = useState(false);
  const formRef = useRef(null);
  const [access, setAccess] = useState();
  const [role, setRole] = useState('');
 // const [members, setMembers] = useState([]);
  const [member, setMember] = useState('');
  const [memberId, setMemberId] = useState('');
  const classesView = useViewStyles();
  const classesItem = useItemStyles();
  const [expanded, setExpanded] = React.useState([]);
  const [moduleList, setModuleList] = React.useState([]);
  const [moduleArray, setModuleArray] = React.useState([]);
  const [selected, setSelected] = React.useState([]);
  const teamRoles = useSelector(({ dataStructure }) => dataStructure.teamRoles);
  const members = useSelector( ({ organizations }) => organizations.members);
  const orgDetails = useSelector(({ organizations }) => organizations.organization);
  const [projectRoles, setProjectRoles] = useState([]);

  useEffect(() => {
    team.map((t)=>{
      if(t._id === user.data.id && t.role === "owner" || user.role === 'admin')
      {
        setAccess(true)
      }else if(t._id === user.data.id && t.role !== "owner")
      {
         const member=t.tab_access.filter((i)=>i === "Team");
         if(member[0] === "Team")
         {
           setAccess(true)
         }
      }
    })
  }, [access]);

  useEffect(() =>{
    if(modules.length > 0){
      let list = [], newModule = [];
      modules.forEach((md)=>{
        if(md === 'Plans'){
          list.push("Plans")
          list.push("Upload Plan")
          list.push("View Plan")
          list.push("Mark On Plan")
          list.push("Remove Plan")
        }else if(md === 'Daily Data'){
          
          list.push("Daily Data")
          list.push("Create/Update Daily Data")
          list.push("Remove Daily Data Entries")
          list.push("Approve / Revert Daily Data")
          list.push("View Daily Data")
          list.push("Download Daily Data")
        }else if(md === 'Purchase Order'){
          
          list.push("Purchase Order")
          list.push("Create/Update Purchase Order")
          list.push("View Purchase Order")
          list.push("Download Purchase Order")
        }
        // else if(md === 'Reports'){
          
        //   list.push("Reports")
        //   list.push("Daily Data Reports")
        //   list.push("Cube Register Excel Reports")
        //   list.push("Plan Summary Reports")
        //   list.push("Tasks Excel Reports")
        // }
        else if(md === 'Documents'){
          list.push("Documents")
          list.push("Create/Update Folder")
          list.push("Upload Document")
          list.push("Update Document Details")
          list.push("View/Download Document")
          list.push("Delete Document")
        }else if(md === 'Agency') {
          list.push("Sub-Contractors")
        }else if(md !== 'Checklists') {
          list.push(md)
        }
        newModule.push(md)
      })

      if(orgDetails.orgType === 'SSA'){
        list.push('Drawing Register')
        list.push('Safety NCR')
        list.push('Quality NCR')
        list.push('Inspection Request')
        list.push('RFI Register')
        //list.push('Gfc Workflow')
        list.push('Milestones')
        list.push('Work BOQ')

        newModule.push('Drawing Register')
        newModule.push('Inspection Request')
        newModule.push('RFI Register')
        //newModule.push('Gfc Workflow')
        newModule.push('Milestones')
        newModule.push('Safety NCR')
        newModule.push('Quality NCR')
        setModuleList(list);
        setModuleArray(newModule)
      }else{
        setModuleList(list);
        setModuleArray(newModule)
      }
     
    }else{
      let list = ["Plans","Upload Plan","Mark On Plan","View Plan","Remove Plan",
      "Tasks","Inventory","Sub-Contractors","Work BOQ","Work Order","Purchase Order","Daily Data","Create/Update Daily Data","Remove Daily Data Entries","Approve / Revert Daily Data","View Daily Data","Download Daily Data","Bill Register","Documents","Create/Update Folder","Upload Document","Update Document Details","View/Download Document","Delete Document","Buildings And Areas","Billing"];
      setModuleList(list);
      setModuleArray(["Plans","Tasks","Inventory","Agency","Work BOQ","Work Order","Purchase Order",
      "Daily Data","Cube-Register","Bill Register","Documents","Checklists","Buildings And Areas","Billing"])
    }

    let tempRoles = [];
    teamRoles.map((rl)=>{
      tempRoles.push(rl)
    })

    if(orgDetails.orgType === 'SSA'){
      tempRoles.push('CIDCO Official')
    }

    setProjectRoles(tempRoles);

  }, [modules])

  useEffect(() => {
    if(projectDetails.organizationId !== undefined){
      dispatch(getOrganization({ OrganizationId : projectDetails.organizationId }));
      dispatch(listMember({ organizationId : projectDetails.organizationId }));
    }
  }, []);

  const initprojectDialog = useCallback(() => {
    if (projectDialog.Dialogtype === "edit" && projectDialog.data) {
      setForm({ ...projectDialog.data });
      setSelected(projectDialog.data.tab_access);
      setMemberId(projectDialog.data._id);

      if(projectDialog.data.role === 'owner')
      {
        setRole("Project Owner")
      }else if(projectDialog.data.role === 'projectManager')
      {
        setRole("Project Manager")
      }else if(projectDialog.data.role === 'siteIncharge')
      {
        setRole("Site Incharge")
      }else if(projectDialog.data.role === 'siteEngineer')
      {
        setRole("Site Engineer")
      }else if(projectDialog.data.role === 'purchaseOfficer')
      {
        setRole("Purchase Officer")
      }else if(projectDialog.data.role === 'liaisonOfficer')
      {
        setRole("Liaison Officer")
      }else if(projectDialog.data.role === 'reraOfficer')
      {
        setRole("Rera Officer")
      }else if(projectDialog.data.role === 'architect')
      {
        setRole("Architect")
      }else if(projectDialog.data.role === 'superVisior')
      {
        setRole("Supervisior")
      }else if(projectDialog.data.role === 'afterSales')
      {
        setRole("After Sales")
      }else if(projectDialog.data.role === 'contractor')
      {
        setRole("Contractor")
      }else{
        setRole(projectDialog.data.role)
      }
    }

    if (projectDialog.Dialogtype === "new") {
      setForm({
        ...defaultFormState,
        ...projectDialog.data,
        id: FuseUtils.generateGUID(),
      });
      setSelected([]);
      setRole('');
    }
  }, [projectDialog.data, projectDialog.Dialogtype, setForm]);

  useEffect(() => {
    if (projectDialog.props.open) {
      initprojectDialog();
    }
  }, [projectDialog.props.open, initprojectDialog]);

  const handleChange = (prop) => (event) => {
    if(prop === 'role' && event.target.value ==='owner')
    {
      setSelected([]);
    }
    setForm({ ...form, [prop]: event.target.value });  
  };

  const handleChangeMember = (prop) => (event) => {  
    setMember(event.target.value);  
  };

  const handleToggle = (event, nodeIds) => {
    if (event.target.nodeName !== "svg") {
      return;
    }
    setExpanded(nodeIds);
  };
  const handleSelect = (event, nodeIds) => {
    const first = nodeIds[0];
    if(selected.includes(first)) {
      if(first === "Upload Plan" || first === "View Plan" || first === "Remove Plan" || first === "Mark On Plan")
      {
        setSelected(selected.filter(id => id !== first && id !== "Plans"));
      }else if(first === 'Plans')
      {
        setSelected(selected.filter(id => id !== first && id !== "Upload Plan" && id !== "View Plan" && id !== "Remove Plan" && id !== "Mark On Plan" ));
      }else if(first === "Create/Update Daily Data" || first === "Remove Daily Data Entries" || first === "Approve / Revert Daily Data" || first === "View Daily Data" || first ==="Download Daily Data")
      {
        setSelected(selected.filter(id => id !== first && id !== "Daily Data"));
      }else if(first === 'Daily Data')
      {
        setSelected(selected.filter(id => id !== first && id !== "Create/Update Daily Data" && id !== "Remove Daily Data Entries" && id !== "Approve / Revert Daily Data" && id !== "View Daily Data" && id !== "Download Daily Data" ));
      }
      else if(first === 'Purchase Order')
      {
        setSelected(selected.filter(id => id !== first && id !== "Create/Update Purchase Order" && id !== "View Purchase Order" && id !== "Download Purchase Order" ));
      }
      else if(first === "Create/Update Purchase Order" || first === "View Purchase Order" || first === "Download Purchase Order")
      {
        setSelected(selected.filter(id => id !== first && id !== "Purchase Order"));
      }
      else if(first === 'Reports')
      {
        setSelected(selected.filter(id => id !== first && id !== "Daily Data Reports" && id !== "Cube Register Excel Reports" && id !== "Plan Summary Reports" && id !== "Tasks Excel Reports"));
      }
      else if(first === "Daily Data Reports" || first === "Cube Register Excel Reports" || first === "Plan Summary Reports" || first === "Tasks Excel Reports")
      {
        setSelected(selected.filter(id => id !== first && id !== "Reports"));
      }
     
      else if(first === 'Documents')
      {
        setSelected(selected.filter(id => id !== first && id !== "Upload Document" && id !== "Create/Update Folder" && id !== "Update Document Details"&& id !== "View/Download Document" && id !== "Delete Document" ));
      }
      else if(first === "Upload Document" || first === "Create/Update Folder" || first === "Update Document Details" || first === "View/Download Document" || first === "Delete Document")
      {
        setSelected(selected.filter(id => id !== first && id !== "Documents"));
      }else
      {
        setSelected(selected.filter(id => id !== first));
      }
    }else if(first === "Plans")
    {
      setSelected([first,"Upload Plan","View Plan","Remove Plan","Mark On Plan", ...selected]);
    }else if(first === "Daily Data")
    {
      setSelected([first,"Create/Update Daily Data","Remove Daily Data Entries","Approve / Revert Daily Data","View Daily Data","Download Daily Data", ...selected]);
    }
    else if(first === "Purchase Order")
    {
      setSelected([first,"Create/Update Purchase Order","View Purchase Order","Download Purchase Order", ...selected]);
    }
    else if(first === "Reports")
    {
      setSelected([first,"Daily Data Reports","Cube Register Excel Reports","Plan Summary Reports","Tasks Excel Reports", ...selected]);
    }
    else if(first === "Documents")
    {
      setSelected([first,"Create/Update Folder","Upload Document","View/Download Document","Update Document Details","Delete Document", ...selected]);
    }else{
      let tempArr = [first];
      selected.map((sel)=>{tempArr.push(sel)});
      let filteredPlan = (tempArr.includes("Upload Plan") && tempArr.includes("View Plan") && tempArr.includes("Remove Plan") && tempArr.includes("Mark On Plan"));
      let filteredDocument = (tempArr.includes("Upload Document") && tempArr.includes("Create/Update Folder") &&  tempArr.includes("Update Document Details") && tempArr.includes("View/Download Document") && tempArr.includes("Delete Document"))
      let filteredDailyData = (tempArr.includes("Create/Update Daily Data") && tempArr.includes("Approve / Revert Daily Data") && tempArr.includes("Remove Daily Data Entries")&& tempArr.includes("View Daily Data") && tempArr.includes("Download Daily Data"));
      let filteredDailyDataPo = (tempArr.includes("Create/Update Purchase Order") && tempArr.includes("View Purchase Order") && tempArr.includes("Download Purchase Order"));
      let filteredDailyDataReport = (tempArr.includes("Daily Data Reports") && tempArr.includes("Cube Register Excel Reports") && tempArr.includes("Plan Summary Reports") && tempArr.includes("Tasks Excel Reports"));
      if(filteredPlan){
        if(selected.includes("Plans") === false)
        {
          setSelected([first,"Plans", ...selected]);
        }else{
          setSelected([first, ...selected]);
        }  
      }else if(filteredDocument)
      {
        if(selected.includes("Documents") === false)
        {
          setSelected([first,"Documents", ...selected]);
        }else{
          setSelected([first, ...selected]);
        }
      }else if(filteredDailyData)
      {
        if(selected.includes("Daily Data") === false)
        {
          setSelected([first,"Daily Data", ...selected]);
        }else{
          setSelected([first, ...selected]);
        }
      }else if(filteredDailyDataPo)
      {
        if(selected.includes("Purchase Order") === false)
        {
          setSelected([first,"Purchase Order", ...selected]);
        }else{
          setSelected([first, ...selected]);
        }
      }else if(filteredDailyDataReport)
      {
        if(selected.includes("Reports") === false)
        {
          setSelected([first,"Reports", ...selected]);
        }else{
          setSelected([first, ...selected]);
        }
      }
      else{
        setSelected([first, ...selected]);
      }
    }
  };


  const handleClickOpen = () => {
    setOpen(true);
  };
  
  const handleClose = () => {
    setOpen(false);
  };

  const changeRoleOptionBaseOnValue = (value) => {
    if(value ==='Project Owner')
    {
      setSelected([]);
      setForm({ ...form, role: 'owner',tab_access:[] });
      setRole(value)
    }else{
      setForm({ ...form, role: value });
      setRole(value)
    }  
  }

  const handleChangeRole = (prop) => (event) => {
   if(event.target.value ==='owner' || event.target.value ==='Owner' || event.target.value ==='Project Owner' || event.target.value ==='Project owner' || event.target.value ==='ProjectOwner' || event.target.value ==='Projectowner')
   {
     setSelected([]);
     setForm({ ...form, role: 'owner',tab_access:[] });
     setRole(event.target.value);
   }else{
    setForm({ ...form, role: event.target.value });
    setRole(event.target.value);
   }
  };

  function closeComposeDialog() {
    projectDialog.Dialogtype === "edit"
      ? dispatch(closeEditDialog())
      : dispatch(closeNewDialog());
  }

  function canBeSubmitted() {
    return (
      form.name.length > 0 && form.email.length > 0 && form.role.length > 0
    );
  }

  const checkOwner = () => {
    let value = false;
    let person = team.find((member) => member._id === user.data.id);
    if (person) {
      if (person.role === "projectOwner") {
        value = true;
      }
    }
    if (user.role === "admin") {
      value = true;
    }
    return value;
  };

  function callMember(data){
    setForm({ ...form, 
      name : data.name,
      email : data.email,
      contact : data.contact
    });  
  }

  const handleSelectClick = () => {
    setSelected((oldSelected) =>
      oldSelected.length === 0 ? moduleList : [],
    );
  };

  // const handleSelectClick = () => {
  //   setSelected((oldSelected) =>
  //     oldSelected.length === 0 ? ["Team","Milestones","Plans","Upload Plan","View Plan","Mark On Plan","Remove Plan","Tasks","Inventory","Agency","Work BOQ","Work Order","Purchase Order","Daily Data","Create/Update Daily Data","Remove Daily Data","Bill Register","Documents","Create/Update Folder","Upload Document","Update Document Details","View/Download Document","Delete Document","Buildings And Areas","Billing"] : [],
  //   );
  // };
  function handleSubmit(model) {
    let moduleAccess = selected.filter((q, idx) => selected.indexOf(q) === idx)
    if (projectDialog.Dialogtype === "new") {
      // if(form.whatsapp.charAt(0) !== '+'){
      //   dispatchWarningMessage(dispatch, "Please enter WhatsApp Number with Country Code.");
      // }else{
        let data = {
          "contact": form.contact,
          "email": form.email,
          "name": form.name,
          "role": form.role,
          "tab_access": moduleAccess,
         // "whatsapp": form.whatsapp
         }
         dispatch(addTeam({ projectId, team: data }));
         setSelected([]);
         setMember('');
         setRole('');
         closeComposeDialog();
     // } 
    } else {
     
      // if(form.whatsapp.charAt(0) !== '+'){
      //   dispatchWarningMessage(dispatch, "Please enter WhatsApp Number with Country Code.");
      // }else{
       dispatch(
        updateTeam({
          projectId: projectId,
          memberId: projectDialog.data._id,
          team: {
            "contact": form.contact,
            "email": form.email,
            "name": form.name,
            "role": form.role,
            "tab_access": moduleAccess,
           // "whatsapp": form.whatsapp
           },
        })
       );
       setSelected([]);
       setRole('');
       closeComposeDialog();
      }
    //}
  }

  function deleteTeamMember()
  {
    if(projectDetails.createdBy === projectDialog.data._id)
    {
      dispatchWarningMessage(dispatch, "This project was created by "+projectDialog.data.name+". You can't delete this member.");
    }else{
     dispatch(
      deleteTeam({
        projectId: projectId,
        memberId: projectDialog.data._id,
      })
     );
    handleClose();
    dispatch(closeEditDialog());
    }
  }

  function disableButton() {
    setIsFormValid(false);
  }

  function enableButton() {
    setIsFormValid(true);
  }

  return (
    <>
      <Dialog
        classes={{
          paper: "m-24",
        }}
        {...projectDialog.props}
        onClose={closeComposeDialog}
        fullWidth
        maxWidth="xs"
      >
        <Backdrop className={classes.backdrop} open={loading}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <AppBar position="static" elevation={1}>
          <Toolbar className="flex w-full">
            <Typography variant="subtitle1" className="flex w-full items-center justify-start gap-10" color="inherit">
              {projectDialog.Dialogtype === "new"
                ? "New Team Member"
                : "Edit Team Member"}
            </Typography>
            <IconButton onClick={() => closeComposeDialog()}>
              <CancelIcon style={{ color: "red" }} />
            </IconButton>
          </Toolbar>
          <div className="flex flex-col items-center justify-center pb-24">
            <Avatar
              className="w-96 h-96"
              alt="Team avatar"
              src={
                form.picture && form.picture !== ""
                  ? form.picture
                  : "assets/images/avatars/profile.jpg"
              }
            />
            {projectDialog.Dialogtype === "edit" && (
              <Typography variant="h6" color="inherit" className="pt-8">
                {form.name}
              </Typography>
            )}
          </div>
        </AppBar>
        <div className="flex flex-col">
        
          <Formsy
            onValidSubmit={handleSubmit}
            // onValid={enableButton}
            // onInvalid={disableButton}
            ref={formRef}
          >
            <DialogContent classes={{ root: "p-24" }}>
              <div className="flex flex-1 flex-col">
                {projectDialog.Dialogtype === "edit" ? 
                <>
                <TextFieldFormsy
                  disabled={projectDialog.Dialogtype === "edit" ? true : false}
                  className="mb-24"
                  label="Name"
                  autoFocus
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange("name")}
                  variant="outlined"
                  required
                  fullWidth
                />
                <TextFieldFormsy
                  validations={{
                    isEmail: true,
                  }}
                  validationErrors={{
                    isEmail: "This is not a valid email",
                  }}
                  disabled={projectDialog.Dialogtype === "edit" ? true : false}
                  className="mb-24"
                  label="Email"
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange("email")}
                  variant="outlined"
                  required
                  fullWidth
                />
                <TextFieldFormsy
                  validations={{
                    matchRegexp: /^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/,
                  }}
                  validationErrors={{
                    matchRegexp: "Enter valid contact number",
                  }}
                  disabled={projectDialog.Dialogtype === "edit" ? true : false}
                  className="mb-24"
                  label="Contact"
                  id="contact"
                  name="contact"
                  value={form.contact}
                  variant="outlined"
                  fullWidth
                />
                <Autocomplete
                  id="role"
                  freeSolo
                  className="mb-24"
                  options={projectRoles}
                  value={role}
                  disabled = {projectDetails.createdBy === memberId ? true : false}
                  onInputChange={(event, value) => {
                    changeRoleOptionBaseOnValue(value);
                  }}
                  renderInput={(params) => (
                   <TextField
                      {...params}
                      label="Role"
                      onChange={handleChangeRole("role")}
                      variant="outlined"
                   />
                  )}
                />
                </>
               :( members.length ? 
                <>
                <SelectFormsy
                  fullWidth
                  required
                  labelId="demo-simple-select-label"
                  id="member"
                  name="member"
                  label="Select Member"
                  onChange={handleChangeMember("member")}
                  className="mb-24"
                  value={member}
                  variant="outlined"
                >
                   {members.map((mem) => (
                     <MenuItem key={mem.id} value={mem.name} onClick ={()=> callMember(mem)}>
                       {mem.name}
                     </MenuItem>
                   ))}
                </SelectFormsy>

                <Autocomplete
                  id="role"
                  freeSolo
                  className="mb-24"
                  options={projectRoles}
                  value={role}
                  disabled = {projectDetails.createdBy === memberId ? true : false}
                  onInputChange={(event, value) => {
                    changeRoleOptionBaseOnValue(value);
                  }}
                  renderInput={(params) => (
                   <TextField
                      {...params}
                      label="Role"
                      onChange={handleChangeRole("role")}
                      variant="outlined"
                   />
                  )}
                />
                </>
               : projectDetails.organizationId === undefined ? 
                <Typography className="mb-10 font-bold">Members Not Found. First, Add project to any organization. Then add members in it.</Typography>
                :
                <Typography className="mb-10 font-bold">Members Not Found. Please Add it from {projectDetails.organizationName} Organization.</Typography>
                )}

                {/* <TextFieldFormsy
                  validations={{
                    matchRegexp: /^([+]\d{2})?\d{10}$/,
                  }}
                  validationErrors={{
                    matchRegexp: "Enter valid WhatsApp number",
                  }}
                  //disabled={projectDialog.Dialogtype === "edit" ? true : false}
                  className="mb-24"
                  label="WhatsApp Number"
                  id="whatsapp"
                  name="whatsapp"
                  placeholder="Start number with country code. For India +91"
                  onChange={handleChange("whatsapp")}
                  value={form.whatsapp}
                  variant="outlined"
                  required
                  fullWidth
                /> */}

                {/* <SelectFormsy
                  fullWidth
                  required
                  labelId="demo-simple-select-label"
                  id="role"
                  name="role"
                  label="Role"
                  onChange={handleChange("role")}
                  className="mb-24"
                  value={form.role}
                  variant="outlined"
                >
                  <MenuItem value="owner">Project Owner</MenuItem>
                  <MenuItem value="projectManager">Project Manager</MenuItem>
                  <MenuItem value="siteIncharge">Site Incharge</MenuItem>
                  <MenuItem value="siteEngineer">Site Engineer</MenuItem>
                  <MenuItem value="purchaseOfficer">Purchase Officer</MenuItem>
                  <MenuItem value="liaisonOfficer">Liaison Officer</MenuItem>
                  <MenuItem value="reraOfficer">RERA Officer</MenuItem>
                  <MenuItem value="architect">Architect</MenuItem>
                  <MenuItem value="superVisior">Supervisior</MenuItem>
                  <MenuItem value="contractor">Contractor</MenuItem>
                  <MenuItem value="afterSales">After Sales</MenuItem>
                </SelectFormsy> */}

                
              
              {/* {form.role !== "owner" && form.role !==''?
                <SelectFormsy
                   fullWidth
                   required
                   id="tab_access"
                   name="tab_access"
                   label="Add-Edit Access"
                   variant="outlined"
                   labelId="mutiple-select-label"
                   multiple
                   value={form.tab_access}
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
                       selected.length > 0 && selected.length < options.length
                      }
                    />
                  </ListItemIcon>
                  <ListItemText
                     classes={{ primary: classes.selectAllText }}
                     primary="Select All"
                  />
                 </MenuItem>
                 {options.map((option) => (
                  <MenuItem key={option} value={option}>
                   <ListItemIcon>
                      <Checkbox checked={selected.indexOf(option) > -1} />
                   </ListItemIcon>
                   <ListItemText primary={option} />
                  </MenuItem>
                 ))}
                </SelectFormsy>
              :null}    */}
              {form.role !== "owner" && form.role !==''?       
              <Accordion variant="outlined">
                <AccordionSummary
                 expandIcon={<ExpandMoreIcon />}
                 aria-controls="panel1a-content"
                 id="panel1a-header"
                >
                  <Typography variant="subtitle" color="textPrimary">Module Access</Typography>
                </AccordionSummary>
               <AccordionDetails>
                 <Box sx={{ height: 270, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}>
                   <Box sx={{ mb: 1 }}>
                     <Button onClick={handleSelectClick}>
                       {selected.length === 0 ? 'Select all' : 'Unselect all'}
                     </Button>
                   </Box>
                   <TreeView
                     classes={classesView}
                     defaultCollapseIcon={<ExpandMoreIcon />}
                     defaultExpandIcon={<ChevronRightIcon />}
                     expanded={expanded}
                     selected={selected}
                     onNodeToggle={handleToggle}
                     onNodeSelect={handleSelect}
                     multiSelect
                   >
                      {moduleArray.map((mem) => (
                        (mem === 'Checklists' ? null :
                          (mem === 'Plans' ? 
                            <>
                              <TreeItem classes={classesItem} nodeId="Plans" label="Plans" />
                              <TreeItem classes={classesItem} style={{ 'marginLeft': '20px'}} nodeId="Upload Plan" label="Upload Plan" />
                              <TreeItem classes={classesItem} style={{ 'marginLeft': '20px'}} nodeId="View Plan" label="View Plan" />
                              <TreeItem classes={classesItem} style={{ 'marginLeft': '20px'}} nodeId="Mark On Plan" label="Mark On Plan" />
                              <TreeItem classes={classesItem} style={{ 'marginLeft': '20px'}} nodeId="Remove Plan" label="Remove Plan" />
                            </>
                           :
                           (mem === 'Daily Data' ? 
                             <>
                               <TreeItem classes={classesItem} nodeId="Daily Data" label="Daily Data" />
                               <TreeItem classes={classesItem} style={{ 'marginLeft': '20px'}} nodeId="Create/Update Daily Data" label="Create/Update Daily Data" />
                                <TreeItem classes={classesItem} style={{ 'marginLeft': '20px'}} nodeId="Remove Daily Data Entries" label="Remove Daily Data Entries" />
                                <TreeItem classes={classesItem} style={{ 'marginLeft': '20px'}} nodeId="Approve / Revert Daily Data" label="Approve / Revert Daily Data" />
                                <TreeItem classes={classesItem} style={{ 'marginLeft': '20px'}} nodeId="View Daily Data" label="View Daily Data" />
                                <TreeItem classes={classesItem} style={{ 'marginLeft': '20px'}} nodeId="Download Daily Data" label="Download Daily Data" />
                             </>
                            :
                            (mem === 'Documents' ? 
                              <>
                                <TreeItem classes={classesItem} nodeId="Documents" label="Documents" />
                                <TreeItem classes={classesItem} style={{ 'marginLeft': '20px'}} nodeId="Create/Update Folder" label="Create/Update Folder" />
                                <TreeItem classes={classesItem} style={{ 'marginLeft': '20px'}} nodeId="Upload Document" label="Upload Document" />
                                <TreeItem classes={classesItem} style={{ 'marginLeft': '20px'}} nodeId="Update Document Details" label="Update Document Details" />
                                <TreeItem classes={classesItem} style={{ 'marginLeft': '20px'}} nodeId="View/Download Document" label="View/Download Document" />
                                <TreeItem classes={classesItem} style={{ 'marginLeft': '20px'}} nodeId="Delete Document" label="Delete Document" />
                              </>
                            :
                            (mem === 'Purchase Order' ? 
                             <>
                               <TreeItem classes={classesItem} nodeId="Purchase Order" label="Purchase Order" />
                               <TreeItem classes={classesItem} style={{ 'marginLeft': '20px'}} nodeId="Create/Update Purchase Order" label="Create/Update Purchase Order" />
                                <TreeItem classes={classesItem} style={{ 'marginLeft': '20px'}} nodeId="View Purchase Order" label="View Purchase Order" />
                                <TreeItem classes={classesItem} style={{ 'marginLeft': '20px'}} nodeId="Download Purchase Order" label="Download Purchase Order" />
                             </>
                             :
                             
                            (mem === 'Agency' ?
                              <TreeItem classes={classesItem} nodeId="Sub-Contractors" label="Agency" />
                            :
                            (mem === 'Milestones' ? null
                            :
                              <TreeItem classes={classesItem} nodeId={mem} label={mem} />

                            )
                            )
                           
                            )
                            )
                           )
                          )
                        )
                      ))}
                      
                             <>
                               <TreeItem classes={classesItem} nodeId="Reports" label="Reports" />
                               <TreeItem classes={classesItem} style={{ 'marginLeft': '20px'}} nodeId="Daily Data Reports" label="Daily Data Reports" />
                                <TreeItem classes={classesItem} style={{ 'marginLeft': '20px'}} nodeId="Cube Register Excel Reports" label="Cube Register Excel Reports" />
                                <TreeItem classes={classesItem} style={{ 'marginLeft': '20px'}} nodeId="Plan Summary Reports" label="Plan Summary Reports" />
                                <TreeItem classes={classesItem} style={{ 'marginLeft': '20px'}} nodeId="Tasks Excel Reports" label="Tasks Excel Reports" />

                             </>
                            

                     {/* <TreeItem classes={classesItem} nodeId="Team" label="Team" />
                     <TreeItem classes={classesItem} nodeId="Milestones" label="Milestones" />
                     <TreeItem classes={classesItem} nodeId="Plans" label="Plans" />
                     <TreeItem classes={classesItem} style={{ 'marginLeft': '20px'}} nodeId="Upload Plan" label="Upload Plan" />
                     <TreeItem classes={classesItem} style={{ 'marginLeft': '20px'}} nodeId="View Plan" label="View Plan" />
                     <TreeItem classes={classesItem} style={{ 'marginLeft': '20px'}} nodeId="Mark On Plan" label="Mark On Plan" />
                     <TreeItem classes={classesItem} style={{ 'marginLeft': '20px'}} nodeId="Remove Plan" label="Remove Plan" />
                     <TreeItem classes={classesItem} nodeId="Tasks" label="Tasks" />
                     <TreeItem classes={classesItem} nodeId="Inventory" label="Inventory" />
                     <TreeItem classes={classesItem} nodeId="Sub-Contractors" label="Agency" />
                     <TreeItem classes={classesItem} nodeId="Work BOQ" label="Work BOQ" />
                     <TreeItem classes={classesItem} nodeId="Work Order" label="Work Order" />
                     <TreeItem classes={classesItem} nodeId="Purchase Order" label="Purchase Order" />
                     <TreeItem classes={classesItem} nodeId="Daily Data" label="Daily Data" />
                     <TreeItem classes={classesItem} style={{ 'marginLeft': '20px'}} nodeId="Create/Update Daily Data" label="Create/Update Daily Data" />
                     <TreeItem classes={classesItem} style={{ 'marginLeft': '20px'}} nodeId="Remove Daily Data Entries" label="Remove Daily Data Entries" />
                     <TreeItem classes={classesItem} nodeId="Bill Register" label="Bill Register" />
                     <TreeItem classes={classesItem} nodeId="Documents" label="Documents" />
                     <TreeItem classes={classesItem} style={{ 'marginLeft': '20px'}} nodeId="Create/Update Folder" label="Create/Update Folder" />
                     <TreeItem classes={classesItem} style={{ 'marginLeft': '20px'}} nodeId="Upload Document" label="Upload Document" />
                     <TreeItem classes={classesItem} style={{ 'marginLeft': '20px'}} nodeId="Update Document Details" label="Update Document Details" />
                     <TreeItem classes={classesItem} style={{ 'marginLeft': '20px'}} nodeId="View/Download Document" label="View/Download Document" />
                     <TreeItem classes={classesItem} style={{ 'marginLeft': '20px'}} nodeId="Delete Document" label="Delete Document" />
                     <TreeItem classes={classesItem} nodeId="Buildings And Areas" label="Buildings And Areas" />
                     <TreeItem classes={classesItem} nodeId="Billing" label="Billing" /> */}
                    </TreeView>
                 </Box>
               </AccordionDetails>
              </Accordion> 
              :null}
              </div>
            </DialogContent>
            <DialogActions className="justify-start pl-16">
              {projectDialog.Dialogtype === "new" ? (
                <Button
                  disabled={!canBeSubmitted()}
                  variant="contained"
                  color="primary"
                  type="submit"
                >
                  Add
                </Button>
              ) : (
                <>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={!canBeSubmitted()}
                  >
                    Save
                  </Button>
                  {}
                  {access? (
                    <IconButton
                      variant="contained"
                      color="secondary"
                      onClick={() => {
                        handleClickOpen();
                      }}
                    >
                      <Icon className={classes.delete}>delete</Icon>
                    </IconButton>
                  ) : null}
                </>
              )}
            </DialogActions>
          </Formsy>
        </div>
      </Dialog>
      <Dialog open={open} onClose={handleChange}>
        <DialogTitle id="alert-dialog-title">Delete Member</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure want to remove {form.name} from team?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose()} color="primary">
            NO
          </Button>
          <Button
            onClick={() => {
              deleteTeamMember()
            }}
            color="primary"
            autoFocus
          >
            YES
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default TeamDialog;
