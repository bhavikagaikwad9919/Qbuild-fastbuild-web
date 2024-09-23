import React, { useState, useEffect } from "react";
import { Typography } from "@material-ui/core";
import FuseUtils from "@fuse/utils";
import MenuItem from "@material-ui/core/MenuItem";
import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Icon,
  IconButton,
  Fab,
  Grid,
} from "@material-ui/core";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import FuseLoading from "@fuse/core/FuseLoading";
import {
  getVendors,
  updateLabour,
  addLabourData,
  updateLabourData,
  routes,
  saveReport,
  openEditDialog,
  closeNewDialog,
  closeEditDialog,
  getDetailReport,
  openNewDialog
} from "app/main/projects/store/projectsSlice";
import { Link } from "react-router-dom";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import Autocomplete from '@material-ui/lab/Autocomplete';
import { dispatchWarningMessage } from "app/utils/MessageDispatcher";

const useStyles = makeStyles((theme) =>({
  addButton: {
    position: "absolute",
    right: 12,
    bottom: 12,
    zIndex: 99,
  },
  delete: {
    color: "red",
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

let initialState = {
  role: "",
  agencyName: "",
  labourCount: "",
  paid_amount:"",
  hours: 8,
  description: "",
};

function Labour(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getVendors(projectId));
  }, [dispatch]);
  const projectId = useSelector(({ projects }) => projects.details._id);
  const loading = useSelector(({ projects }) => projects.loading);
  const labour = useSelector(({ projects }) => projects.labour);
  const vendors = useSelector(({ projects }) => projects.vendors);
  const [newLabour, setNewLabour] = useState(labour);
  // let labour = [...labourState];
  // let vendors = [...vendorsState];
  const [open, setOpen] = useState(false);
  const [delete1, setDelete1] = useState(false);
  const [values, setValues] = useState(initialState);
  const [lbRole, setLbRole] = React.useState('');
  const [type, setType] = useState("Edit");
  const [labourId, setLabourId] = useState("");
  const [deleteAccess, setDeleteAccess] = useState();
  const [createAccess, setCreateAccess] = useState();
  const team = useSelector(({ projects }) => projects.details.team);
  const user = useSelector(({ auth }) => auth.user);
  const [list, setList] = useState({
    id: "",
    role: "",
    agencyName: "",
    labourCount: "",
    paid_amount:"",
    hours: "",
    description: "",
  });
  const laborRole = useSelector(({ dataStructure }) => dataStructure.laborRole);
  const modules = useSelector(({ projects }) => projects.details.module)
  const [roleList, setRoleList] = useState(laborRole);
  const projectDialog = useSelector(({ projects }) => projects.projectDialog);
  const [access, setAccess] = useState();

  useEffect(() => {
    team.map((t)=>{
     if(t._id === user.data.id && t.role === "owner"|| user.role === 'admin' || t.role === 'purchaseOfficer')
     {
       setDeleteAccess(true);
       setCreateAccess(true);
       setAccess(true)
     }else if(t._id === user.data.id && t.role !== "owner")
     {
       setDeleteAccess(t.tab_access.includes("Daily Data") || t.tab_access.includes("Remove Daily Data Entries"));
       setCreateAccess(t.tab_access.includes("Daily Data") || t.tab_access.includes("Create/Update Daily Data"));
       const member = t.tab_access.filter((i)=> i === "Agency" || i === 'Sub-Contractors');
        console.log(member)
        if(member[0] === "Agency" || member[0] === "Sub-Contractors")
        {
          setAccess(true);
        }
      }
    })
   }, [access]);

  useEffect(() => {
    dispatch(updateLabour(newLabour));
  }, [newLabour]);

  const handleOpen = () => {
    setType("New");
    setOpen(true);
  };

  const handleChange = (prop) => (event) => {
    if(event.target.value !== undefined){
      setValues({ ...values, [prop]: event.target.value });
    }
  };


  function handleOpenList(
    id,
    agencyName,
    role,
    paid_amount,
    labourCount,
    hours,
    description
  ) {
    setType("Edit");
    setOpen(true);
    setList({ id, agencyName, role });
    setValues({ agencyName, role, paid_amount, labourCount, hours, description });
    setLbRole(role.toLocaleUpperCase());
  }

  const handleClose = () => {
    setOpen(false);
    setValues({
      agencyName: "",
      role: "",
      paid_amount:"",
      hours: 8,
      labourCount: "",
      description: "",
    });
    setLbRole('');
  };

  let vendorsName = [];
  if (!vendors) {
    return <FuseLoading />;
  }

  vendors.vendorsList.forEach((item) => {
    if(item.agencyType === 'Sub-Contractor' || item.agencyType === 'Contractor'){
      vendorsName.push({
       id: item._id,
       name: item.name,
      });
    }
  });

  function listChange() {
    let lat = JSON.parse(JSON.stringify(labour));
    if (values.name === "" && values.quantity === "") {
      setOpen(false);
    } else {
      lat.forEach((item) => {
        if (item._id === list.id) {
          item.agency = values.agencyName;
          item.role = lbRole;
          item.paid_amount = values.paid_amount;
          item.labourCount = values.labourCount;
          item.hours = values.hours;
          item.description = values.description;
        }
      });
      
      setRoleList(laborRole)
      if(props.data.Dialogtype === 'edit')
      {
        setOpen(false);
        dispatch(updateLabourData({ projectId, "type":"update", reportId:props.data.data._id,Data:lat})).then(
          (response) => {
            dispatch(getDetailReport({ projectId,reportId:props.data.data._id})).then(
              (response) => {
                let row = {
                  "_id": response.payload._id,
                  "createdAt": response.payload.createdAt,
                  "submittedDate": response.payload.submittedDate,
                  "approvalDate": response.payload.approvalDate,
                  "status": response.payload.status === 0 ? 'Inactive' :response.payload.status === 1 ? 'New' : response.payload.status === 2 ? 'Submitted' :response.payload.status === 3 ? 'Approved' : response.payload.status === 4 ? 'Reverted':null,
                }
                dispatch(openEditDialog(row));
              }
            );
          }
        );
      }else{
        setOpen(false);
      }
    }
  }

  function addList() {
    if (values.name === "" && values.quantity === "") {
      setOpen(false);
    } else {
      let lab = {
        _id: FuseUtils.generateGUID(),
        agency: values.agencyName,
        role: lbRole,
        paid_amount: values.paid_amount,
        labourCount: values.labourCount,
        hours: values.hours,
        description: values.description,
      };
      //setNewLabour([...newLabour, lab]);
      let data = {
        agency: values.agencyName,
        role: lbRole.toLocaleUpperCase(),
        paid_amount: values.paid_amount,
        labourCount: values.labourCount,
        hours: values.hours,
        description: values.description,
      };
      setValues({
        agencyName: values.agencyName,
        role: "",
        paid_amount:"",
        hours: 8,
        labourCount: "",
        description: "",
      });
      setLbRole('');
      setRoleList(laborRole)
      if(props.data.Dialogtype === 'edit')
      {
        dispatch(addLabourData({ projectId, reportId:props.data.data._id,Data:data})).then(
          (response) => {
            dispatch(getDetailReport({ projectId,reportId:props.data.data._id})).then(
              (response) => {
                let row = {
                  "_id": response.payload._id,
                  "createdAt": response.payload.createdAt,
                  "submittedDate": response.payload.submittedDate,
                  "approvalDate": response.payload.approvalDate,
                  "status": response.payload.status === 0 ? 'Inactive' :response.payload.status === 1 ? 'New' : response.payload.status === 2 ? 'Submitted' :response.payload.status === 3 ? 'Approved' : response.payload.status === 4 ? 'Reverted':null,
                }
                dispatch(openEditDialog(row));
              }
            );
          }
        );
      }else{
        let bodyFormData = new FormData();
        bodyFormData.set("wing", "");
        bodyFormData.set("building", "");
        bodyFormData.set("floor", "");
        bodyFormData.set("flat", "");
        bodyFormData.set("workProgress", JSON.stringify([]));
        bodyFormData.set("inventory", JSON.stringify([]));
        bodyFormData.set("labour", JSON.stringify([data]));
        bodyFormData.set("hindrance", JSON.stringify([]));
        bodyFormData.set("staff", JSON.stringify([]));
        bodyFormData.set("sitevisitor", JSON.stringify([]));
        bodyFormData.set("notes", JSON.stringify([]));
        bodyFormData.set("consumption", JSON.stringify([]));
        bodyFormData.set("equipment", JSON.stringify([]));
        bodyFormData.set("existingAttachments", JSON.stringify([]));
        bodyFormData.append("attachments", '');
        bodyFormData.set("date", props.date);

        dispatch(saveReport({ projectId, formData: bodyFormData })).then(
          (response) => {
            if(response.payload === undefined)
            {
              setOpen(false);
              props.onClose();
            }else{
              dispatch(getDetailReport({ projectId: projectId, reportId: response.payload._id })).then(
                () => {
                  dispatch(closeNewDialog())
                  dispatch(openEditDialog(response.payload));
                }
              );
            }
          }
        );
      }
    }
  }

  const disableButton = () => {
    if(lbRole === null || lbRole === undefined){
      return false
    }else{
      return (
        values.agencyName.length > 0 &&
        lbRole.length > 0 &&
        values.labourCount > -1
      );
    }
  };
 
  function deleteList(id) {
    if(props.data.Dialogtype === 'edit')
    {
      setDelete1(true);
      setLabourId(id);
    }else{
      let lat = JSON.parse(JSON.stringify(labour));
      let deletedLat = lat.filter((item) => item._id !== id);
      setNewLabour(deletedLat);
    } 
  }

  function deleteLabour() {
    let lat = JSON.parse(JSON.stringify(labour));
    let deletedLat = lat.filter((item) => item._id !== labourId);
    setDelete1(false);
    dispatch(updateLabourData({ projectId,"type":"delete", reportId:props.data.data._id,Data:deletedLat})).then(
      (response) => {
        dispatch(getDetailReport({ projectId,reportId:props.data.data._id})).then(
          (response) => {
            let row = {
              "_id": response.payload._id,
              "createdAt": response.payload.createdAt,
              "submittedDate": response.payload.submittedDate,
              "approvalDate": response.payload.approvalDate,
              "status": response.payload.status === 0 ? 'Inactive' :response.payload.status === 1 ? 'New' : response.payload.status === 2 ? 'Submitted' :response.payload.status === 3 ? 'Approved' : response.payload.status === 4 ? 'Reverted':null,
            }
            dispatch(openEditDialog(row));
          }
        );
      }
    );
  }
  props.onCountChange({ labour: labour.length });

  const handleChangeRole = (prop) => (event) => {
    if(event.target.value !== null && event.target.value !== '' && event.target.value !== undefined ){
      let tempRoles = laborRole.filter((role)=> role.includes(event.target.value.toLocaleUpperCase()))
      setLbRole(event.target.value.toLocaleUpperCase());
      setRoleList(tempRoles);
    }else{
      setRoleList(laborRole);
      setLbRole(event.target.value);
    }
    
  };

  const changeTitleOptionBaseOnValue = (event, value) => {
    setLbRole(value);
  }

function redirectToAgency(){
  if(modules.length === 0 || modules.includes("Agency")){
    if(access === true){
      if(projectDialog.Dialogtype === 'new'){
        props.onClose();
        sessionStorage.setItem("link", 'link');
        dispatch(routes("Vendors"));
      }else if(projectDialog.Dialogtype === 'edit'){
        props.onClose();
        sessionStorage.setItem("link", 'link');
        dispatch(routes("Vendors"));
      }
    }else{
      dispatchWarningMessage(dispatch, "You don't have access to add a Contractor from Agency.")
    }
  }else{
    dispatchWarningMessage(dispatch, "Please include Agency module from Settings to Add Contractor.")
  }
}

  if (!labour.length) {
    return (
      <div className="flex flex-1 items-center justify-center h-full">
        <Typography color="textSecondary" variant="h5">
         There are no entries for Labor!
        </Typography>
        <Fab
          color="primary"
          aria-label="add"
          disabled={createAccess === true ? false :true}
          className={classes.addButton}
          onClick={handleOpen}
        >
          <Icon>add</Icon>
        </Fab>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <Backdrop className={classes.backdrop} open={loading}>
           <CircularProgress color="inherit" />
          </Backdrop>
          {type === "Edit" ? (
            <DialogTitle id="alert-dialog-title">{"Update Labor"}</DialogTitle>
          ) : (
            <DialogTitle id="alert-dialog-title">{"Add Labor"}</DialogTitle>
          )}
          <DialogContent>
            <div class="w-auto">
              <FormControl variant="outlined">
                  <InputLabel id="demo-simple-select-placeholder-label-label" required>
                    Select Vendor
                  </InputLabel>
                  <Select
                   required
                   id="demo-dialog-select"
                   value={values.agencyName}
                   onChange={handleChange("agencyName")}
                  >
                   <MenuItem key="none" value="Departmental">Departmental</MenuItem>
                   {vendorsName.map((vname) => (
                    <MenuItem key={vname.id} value={vname.name}>
                      {vname.name}
                    </MenuItem>
                   ))}
                    <Link
                      className="cursor-pointer ml-10 mt-10"
                      onClick={() => { 
                       redirectToAgency();
                      }}
                    >
                      Click here to Add New Contractor
                    </Link>
                  </Select> 

                  <Autocomplete
                    value={lbRole}
                    id="free-solo-demo"
                    freeSolo
                    options={roleList}
                    onChange={(event, value) => {
                      changeTitleOptionBaseOnValue(event, value);
                    }}
                    variant="outlined"
                    className="mt-10"
                    renderInput={(params) =>
                    <TextField
                      {...params}
                      label="Role"
                      onChange={handleChangeRole("title")}
                      variant="outlined"
                    />
                  }
                />

                <div class="grid grid-cols-2 divide-x divide-gray-400">
                  <TextField
                    required
                    variant="outlined"
                    className="w-1 mr-10 my-16"
                    type="number"
                    label="Labor's Count"
                    value={values.labourCount}
                    onChange={handleChange("labourCount")}
                  />
                  <TextField
                    variant="outlined"
                    className="w-1 ml-10 my-16"
                    type="number"
                    label="Hours"
                    value={values.hours}
                    onChange={handleChange("hours")}
                  />
                </div>
                <TextField
                  variant="outlined"
                  className="my-16"
                  type="number"
                  label="Paid Amount"
                  value={values.paid_amount}
                  onChange={handleChange("paid_amount")}
                />
                <TextField
                  variant="outlined"
                  className="my-16"
                  label="Description"
                  multiline
                  rows="4"
                  value={values.description}
                  onChange={handleChange("description")}
                />
              </FormControl>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              CLOSE
            </Button>
            {type === "Edit" ? (
              <Button disabled={!disableButton()}  onClick={() => listChange()} color="primary" autoFocus>
                UPDATE
              </Button>
            ) : (
              <Button disabled={!disableButton()} onClick={() => addList()} color="primary" autoFocus>
                ADD
              </Button>
            )}
          </DialogActions>
        </Dialog>
      </div>
    );
  }
  return (
    <React.Fragment>
      <List
        component="nav"
        // className={classes.root}
        aria-label="mailbox folders"
      >
        {labour.map((item) => (
          <React.Fragment>
            <Grid container alignItems="center" direction="row">
              <Grid item xs={11}>
                <ListItem
                  button
                  key={item._id}
                  //onTouchTap={handleTouchTap(item.id)}
                  onClick={createAccess ? (ev) => {
                    handleOpenList(
                      item._id,
                      item.agency,
                      item.role,
                      item.paid_amount,
                      item.labourCount,
                      item.hours,
                      item.description
                    );
                  }: () => dispatchWarningMessage(dispatch, "You do not have access to update Labor. Contact Project Owner.")}
                >
                  <ListItemText
                    primary={item.agency}
                    secondary={
                      <>
                        <Typography>
                          {item.labourCount ? item.labourCount + " " : null}
                          {item.role ? item.role + " " : null}
                          {item.hours ? " for " + item.hours + " hours" : null}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              </Grid>
              <Grid item xs={1}>
                <IconButton
                  onClick={ deleteAccess ? () => deleteList(item._id):
                    () => dispatchWarningMessage(dispatch, "You do not have access to delete this entry. Contact Project Owner.")}
                  variant="contained"
                >
                  <Icon className={classes.delete}>delete</Icon>
                </IconButton>
              </Grid>
            </Grid>
          </React.Fragment>
        ))}
      </List>

      <Fab
        color="primary"
        aria-label="add"
        disabled={createAccess === true ? false :true}
        className={classes.addButton}
        onClick={handleOpen}
      >
        <Icon>add</Icon>
      </Fab>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Backdrop className={classes.backdrop} open={loading}>
          <CircularProgress color="inherit" />
        </Backdrop>
        {type === "Edit" ? (
          <DialogTitle id="alert-dialog-title">{"Update Labor"}</DialogTitle>
        ) : (
          <DialogTitle id="alert-dialog-title">{"Add Labor"}</DialogTitle>
        )}
        <DialogContent>
          <div class="w-auto">
            <FormControl variant="outlined">
              <InputLabel id="demo-simple-select-placeholder-label-label">
                Sub-Contractors
              </InputLabel>
              <Select
                id="demo-dialog-select"
                value={values.agencyName}
                onChange={handleChange("agencyName")}
              >
                <MenuItem key="none" value="Departmental">Departmental</MenuItem>
                {vendorsName.map((vname) => (
                  <MenuItem key={vname.id} value={vname.name}>
                    {vname.name}
                  </MenuItem>
                ))}
                <Link
                  className="cursor-pointer ml-10 mt-10"
                  onClick={() => { 
                    redirectToAgency();
                  }}
                >
                  Click here to Add New Contractor
                </Link>
              </Select>
              {/* <TextField
                variant="outlined"
                className="my-16"
                //id='filled-number'
                label="Role"
                value={values.role}
                onChange={handleChange("role")}
              /> */}
                <Autocomplete
              value={lbRole}
              className="mt-10"
              id="free-solo-demo"
              freeSolo
              options={roleList}
              onChange={(event, value) => {
                changeTitleOptionBaseOnValue(event, value);
              }}
              variant="outlined"
              renderInput={(params) =>
                <TextField
                  {...params}
                  label="Role"
                  onChange={handleChangeRole("title")}
                  variant="outlined"
                />
              }
          />
              <div class="grid grid-cols-2 divide-x divide-gray-400">
                <TextField
                  variant="outlined"
                  className="w-3/4 my-16"
                  type="number"
                  //id='filled-number'
                  label="Labours Count"
                  value={values.labourCount}
                  onChange={handleChange("labourCount")}
                />
                <TextField
                  variant="outlined"
                  className="w-3/4 my-16"
                  type="number"
                  //id='filled-number'
                  label="Hours"
                  value={values.hours}
                  onChange={handleChange("hours")}
                />
              </div>
              <TextField
                variant="outlined"
                className="my-16"
                //id='filled-number'
                label="Paid Amount"
                type="number"
                value={values.paid_amount}
                onChange={handleChange("paid_amount")}
              />
              <TextField
                variant="outlined"
                className="my-16"
                multiline
                rows="4"
                label="Description"
                value={values.description}
                onChange={handleChange("description")}
              />

              {/* <Input
              classes='my-14'
              id='standard-adornment-weight'
              value={values.quantity}
              onChange={handleChange('quantity')}
              // endAdornment={<InputAdornment position='end'>Kg</InputAdornment>}
              aria-describedby='standard-weight-helper-text'
              inputProps={{
                'aria-label': 'quantity',
              }}
            /> */}
            </FormControl>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            CLOSE
          </Button>
          {type === "Edit" ? (
            <Button disabled={!disableButton()}  onClick={() => listChange()} color="primary" autoFocus>
              UPDATE
            </Button>
          ) : (
            <Button disabled={!disableButton()} onClick={() => addList()} color="primary" autoFocus>
              ADD
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <Dialog open={delete1}>
        <Backdrop className={classes.backdrop} open={loading}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <DialogTitle id="alert-dialog-slide-title">
          Do you want to delete Labour Entry ?
        </DialogTitle>
        <DialogActions>
          <Button
            onClick={() => {
              setDelete1(false);
            }}
            color="primary"
          >
            No
          </Button>
          <Button
            onClick={() => {deleteLabour()}}
            color="primary"
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default Labour;
