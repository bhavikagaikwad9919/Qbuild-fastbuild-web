import React, { useState, useEffect } from "react";
import { Typography } from "@material-ui/core";
//import FuseUtils from "@fuse/utils";
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
  updateEquipment,
  saveReport,
  openEditDialog,
  closeNewDialog,
  getDetailReport,
  addEquipmentData,
  updateEquipmentData,
  openNewDialog,
  routes
} from "app/main/projects/store/projectsSlice";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Link } from "react-router-dom";
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
  machinery_type: "",
  agencyName: "",
  Count: "",
  hours: 8,
  output: "",
  output_unit:"",
  labour_cost: "",
  fuel_cost: "",
  maintenance_cost:"",
  description: "",
};

function Equipment(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const projectId = useSelector(({ projects }) => projects.details._id);
  const equipment = useSelector(({ projects }) => projects.equipment);
  const vendors = useSelector(({ projects }) => projects.vendors);
  const [newEquipment, setNewEquipment] = useState(equipment);
  const [equipmentId, setEquipmentId] = useState("");
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState(initialState);
  const [machType, setMachType] = useState('');
  const [type, setType] = useState("Edit");
  const [list, setList] = useState({
    id: "",
    machinery_type: "",
    agencyName: "",
    Count: "",
    hours: "",
    output: "",
    output_unit:"",
    labour_cost: "",
    fuel_cost: "",
    maintenance_cost:"",
    description: "",
  });
  const loading = useSelector(({ projects }) => projects.loading);
  const [delete1, setDelete1] = useState(false);
  const [deleteAccess, setDeleteAccess] = useState();
  const [createAccess, setCreateAccess] = useState();
  const team = useSelector(({ projects }) => projects.details.team);
  const user = useSelector(({ auth }) => auth.user);
  const equipmentType = useSelector(({ dataStructure }) => dataStructure.equipmentType);
  const [equipmentList, setEquipmentList] = useState(equipmentType);
  const projectDialog = useSelector(({ projects }) => projects.projectDialog);
  const modules = useSelector(({ projects }) => projects.details.module)
  const [access, setAccess] = useState();

  useEffect(() => {
    dispatch(getVendors(projectId));
  }, [dispatch, projectId]);

  useEffect(() => {
    team.forEach((t)=>{
     if((t._id === user.data.id && t.role === "owner") || user.role === 'admin' || t.role === 'purchaseOfficer')
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
   }, [user.data.id, user.role, team]);


  useEffect(() => {
    dispatch(updateEquipment(newEquipment));
  }, [dispatch, newEquipment]);

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
    machinery_type,
    Count,
    hours,
    output,
    output_unit,
    labour_cost,
    fuel_cost,
    maintenance_cost,
    description
  ) {
    setType("Edit");
    setOpen(true);
    setList({ id, agencyName, machinery_type });
    setValues({ agencyName, machinery_type, Count, hours, output, output_unit, labour_cost, fuel_cost, maintenance_cost, description });
    setMachType(machinery_type)
  }

  const handleClose = () => {
    setOpen(false);
    setValues(initialState);
    setMachType('');
  };

  let vendorsName = [];

  if (!vendors) {
    return <FuseLoading />;
  }

  vendors.vendorsList.forEach((item) => {
    if(item.agencyType === 'Sub-Contractor' || item.agencyType === 'Hirer' || item.agencyType === 'Contractor'){
      vendorsName.push({
        id: item._id,
        name: item.name,
      });
    }
  });

  function listChange() {
    let lat = JSON.parse(JSON.stringify(equipment));
    if (values.agencyName === "" && machType === "") {
      setOpen(false);
    } else {
      lat.forEach((item) => {
        if (item._id === list.id) {
          item.agency = values.agencyName;
          item.machinery_type = machType;
          item.Count = values.Count;
          item.hours = values.hours;
          item.output = values.output;
          item.output_unit = values.output_unit;
          item.labour_cost = values.labour_cost;
          item.fuel_cost = values.fuel_cost;
          item.maintenance_cost = values.maintenance_cost;
          item.description = values.description;
        }
      });
      // setNewEquipment(lat);
      // setOpen(false);
      setEquipmentList(equipmentType)
      if(props.data.Dialogtype === 'edit')
      {
        setOpen(false);
        dispatch(updateEquipmentData({ projectId, "type":"update", reportId:props.data.data._id, Data:lat})).then(
          (response) => {
            setValues(initialState);
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
      // let lab = {
      //   _id: FuseUtils.generateGUID(),
      //   agency: values.agencyName,
      //   machinery_type: values.machinery_type,
      //   Count: values.Count,
      //   hours: values.hours,
      //   output: values.output,
      //   output_unit:values.output_unit,
      //   labour_cost: values.labour_cost,
      //   fuel_cost: values.fuel_cost,
      //   maintenance_cost: values.maintenance_cost,
      //   description: values.description,
      // };

      let data = {
        agency: values.agencyName,
        machinery_type: machType,
        Count: values.Count,
        hours: values.hours,
        output: values.output,
        output_unit:values.output_unit,
        labour_cost: values.labour_cost,
        fuel_cost: values.fuel_cost,
        maintenance_cost: values.maintenance_cost,
        description: values.description,
      };

      setValues({
        agencyName: values.agencyName,
        machinery_type: "",
        Count: "",
        hours: 8,
        output: "",
        output_unit:"",
        labour_cost: "",
        fuel_cost: "",
        maintenance_cost:"",
        description: "",
      });
      setMachType('');
      setEquipmentList(equipmentType)
      if(props.data.Dialogtype === 'edit')
      {
        dispatch(addEquipmentData({ projectId, reportId:props.data.data._id, Data:data})).then(
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
        bodyFormData.set("inventory", JSON.stringify([]));
        bodyFormData.set("labour", JSON.stringify([]));
        bodyFormData.set("hindrance", JSON.stringify([]));
        bodyFormData.set("staff", JSON.stringify([]));
        bodyFormData.set("sitevisitor", JSON.stringify([]));
        bodyFormData.set("notes", JSON.stringify([]));
        bodyFormData.set("equipment", JSON.stringify([data]));
        bodyFormData.set("workProgress", JSON.stringify([]));
        bodyFormData.set("consumption", JSON.stringify([]));
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

  function deleteList(id) {
    if(props.data.Dialogtype === 'edit')
    {
      setDelete1(true);
      setEquipmentId(id);
    }
  }

  function deleteEquipment() {
    let lat = JSON.parse(JSON.stringify(equipment));
    let deletedLat = lat.filter((item) => item._id !== equipmentId);
    setDelete1(false);
    dispatch(updateEquipmentData({ projectId,"type":"delete", reportId:props.data.data._id,Data:deletedLat})).then(
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

  props.onCountChange({ equipment: equipment.length });

  const disableButton = () => {
    if(machType === null || machType === undefined){
      return false;
    }else{
      return (
        values.agencyName.length > 0 && 
        machType.length > 0 &&
        values.Count > 0
      );
    }
  };

  const handleChangeRole = (prop) => (event) => {
    if(event.target.value !== null && event.target.value !== '' && event.target.value !== undefined ){
      let tempMach = equipmentType.filter((eq)=> eq.includes(event.target.value.toLocaleUpperCase()))
      setMachType(event.target.value.toLocaleUpperCase());
      setEquipmentList(tempMach);
    }else{
      setEquipmentList(equipmentType);
      setMachType(event.target.value);
    }
  };

  const changeTitleOptionBaseOnValue = (event, value) => {
    setMachType(value);
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

  if (!equipment.length) {
    return (
      <div className="flex flex-1 items-center justify-center h-full">
        <Typography color="textSecondary" variant="h5">
          There are no Equipments!
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
            <DialogTitle id="alert-dialog-title">{"Update Equipment"}</DialogTitle>
          ) : (
            <DialogTitle id="alert-dialog-title">{"Add Equipment"}</DialogTitle>
          )}
          <DialogContent>
            <div class="w-auto">
              <FormControl variant="outlined">
                <InputLabel id="demo-simple-select-placeholder-label-label" required>
                  Select Vendor
                </InputLabel>
                <Select
                  id="demo-dialog-select"
                  required
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
                <div className="grid grid-cols-2 divide-x divide-gray-400">
                  <Autocomplete
                    required
                    value={machType}
                    id="free-solo-demo"
                    freeSolo
                    options={equipmentList}
                    onChange={(event, value) => {
                      changeTitleOptionBaseOnValue(event, value);
                    }}
                    variant="outlined"
                    className="w-1 mr-10 my-16"
                    renderInput={(params) =>
                    <TextField
                      {...params}
                      label="Machinery Type"
                      required
                      onChange={handleChangeRole("machinery")}
                      variant="outlined"
                    />
                    }
                  />
                  <TextField
                    variant="outlined"
                    className="w-1 ml-10 my-16"
                    label="Count"
                    type="number"
                    required
                    value={values.Count}
                    onChange={handleChange("Count")}
                    autoFocus
                  />
                </div>
                             
                <div class="grid grid-cols-2 divide-x divide-gray-400">
                  <TextField
                    variant="outlined"
                    className="w-1 mr-10 my-16"
                    label="Output"
                    type="number"
                    value={values.output}
                    onChange={handleChange("output")}
                  />
                  <TextField
                    variant="outlined"
                    className="w-1 ml-10 my-16"
                    label="Output Unit"
                    value={values.output_unit}
                    onChange={handleChange("output_unit")}
                  />
                </div>
               
                <div class="grid grid-cols-2 divide-x divide-gray-400">
                  <TextField
                    variant="outlined"
                    className="w-1 mr-10 my-16"
                    label="Hours"
                    type="number"
                    value={values.hours}
                    onChange={handleChange("hours")}
                  />
                 <TextField
                    variant="outlined"
                    className="w-1 ml-10 my-16"
                    label="Labour Cost"
                    type="number"
                    value={values.labour_cost}
                    onChange={handleChange("labour_cost")}
                  />
                </div>
                
                <div class="grid grid-cols-2 divide-x divide-gray-400">
                  <TextField
                    variant="outlined"
                    className="w-1 mr-10 my-16"
                    label="Fuel Cost"
                    type="number"
                    value={values.fuel_cost}
                    onChange={handleChange("fuel_cost")}
                  />
                  <TextField
                    variant="outlined"
                    className="w-1 ml-10 my-16"
                    label="Maintenance / Hiring Cost"
                    type="number"
                    value={values.maintenance_cost}
                    onChange={handleChange("maintenance_cost")}
                  />
                </div>
               
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
              <Button disabled={!disableButton()} onClick={() => listChange()} color="primary" autoFocus>
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
        {equipment.map((item) => (
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
                      item.machinery_type,
                      item.Count,
                      item.hours,
                      item.output,
                      item.output_unit,
                      item.labour_cost,
                      item.fuel_cost,
                      item.maintenance_cost,
                      item.description
                    );
                  }: () => dispatchWarningMessage(dispatch, "You do not have access to update Equipment. Contact Project Owner.")}
                >
                  <ListItemText
                    primary={item.agency}
                    secondary={
                      <>
                        <Typography>
                          {item.Count ? item.Count + " " : null}
                          {item.machinery_type ? item.machinery_type + " " : null}
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
          <DialogTitle id="alert-dialog-title">{"Update Equipment"}</DialogTitle>
        ) : (
          <DialogTitle id="alert-dialog-title">{"Add Equipment"}</DialogTitle>
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
             
             <div class="grid grid-cols-2 divide-x divide-gray-400">
                <Autocomplete
                  value={machType}
                  id="free-solo-demo"
                  freeSolo
                  options={equipmentList}
                  onChange={(event, value) => {
                    changeTitleOptionBaseOnValue(event, value);
                  }}
                  variant="outlined"
                  className="w-1 mr-10 my-16"
                  renderInput={(params) =>
                    <TextField
                      {...params}
                      label="Machinery Type"
                      required
                      onChange={handleChangeRole("machinery")}
                      variant="outlined"
                    />
                  }
                />
                <TextField
                  variant="outlined"
                  required
                  className="w-1 ml-10 my-16"
                  label="Count"
                  type="number"
                  value={values.Count}
                  onChange={handleChange("Count")}
                  autoFocus
                />   
             </div>
                             
             <div class="grid grid-cols-2 divide-x divide-gray-400">
                <TextField
                  variant="outlined"
                  className="w-1 mr-10 my-16"
                  label="Output"
                  value={values.output}
                  onChange={handleChange("output")}
                />
                <TextField
                  variant="outlined"
                  className="w-1 ml-10 my-16"
                  label="Output Unit"
                  value={values.output_unit}
                  onChange={handleChange("output_unit")}
                />
             </div>
               
             <div class="grid grid-cols-2 divide-x divide-gray-400">
                <TextField
                  variant="outlined"
                  className="w-1 mr-10 my-16"
                  //id='filled-number'
                  label="Hours"
                  type="number"
                  value={values.hours}
                  onChange={handleChange("hours")}
                />
                <TextField
                  variant="outlined"
                  className="w-1 ml-10 my-16"
                  //id='filled-number'
                  label="Labour Cost"
                  type="number"
                  value={values.labour_cost}
                  onChange={handleChange("labour_cost")}
                />  
             </div>
                
             <div class="grid grid-cols-2 divide-x divide-gray-400">
                <TextField
                  variant="outlined"
                  className="w-1 mr-10 my-16"
                  label="Fuel Cost"
                  type="number"
                  value={values.fuel_cost}
                  onChange={handleChange("fuel_cost")}
                />
                <TextField
                  variant="outlined"
                  className="w-1 ml-10 my-16"
                  label="Maintenance / Hiring Cost"
                  type="number"
                  value={values.maintenance_cost}
                  onChange={handleChange("maintenance_cost")}
                />
             </div>
             <TextField
                variant="outlined"
                className="my-16"
                //id='filled-number'
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
            <Button disabled={!disableButton()} onClick={() => listChange()} color="primary" autoFocus>
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
         Do you want to delete Equipment Entry?
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
           onClick={() => {deleteEquipment()}}
           color="primary"
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default Equipment;
