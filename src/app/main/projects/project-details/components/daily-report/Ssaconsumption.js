import React, { useState, useEffect } from "react";
import { ListItemSecondaryAction, Typography } from "@material-ui/core";
import FuseUtils from "@fuse/utils";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { updateConsumption } from "app/main/projects/store/projectsSlice";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Icon,
  Grid,
  Fab,
} from "@material-ui/core";
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import { dispatchWarningMessage } from "app/utils/MessageDispatcher";
import {
  listInventories,
  addConsumptionData,
  updateConsumptionData,
  saveReport,
  openEditDialog,
  closeNewDialog,
  getDetailReport,
} from "app/main/projects/store/projectsSlice";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import moment from 'moment';

const filter = createFilterOptions();

const useStyles = makeStyles((theme) =>({
  addButton: {
    position: "absolute",
    right: 12,
    bottom: 12,
    zIndex: 99,
    overflow: "auto",
  },
  delete: {
    color: "red",
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

const initialValue = {
  id: "",
  name: "",
  quantity: "",
  unit: "",
  location: "",
  element: "",
  grade:"",
  building:"",
  remarks: "",
};

const initialValues = {
  id: "",
  name: "",
  quantity: "",
  unit: "",
  location: "",
  element: "",
  grade:"",
  building:"",
  remarks: "",
};

function Ssaconsumption(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const projectDialog = useSelector(({ projects }) => projects.projectDialog);
  const consumption = useSelector(({ projects }) => projects.consumption);
  const inventory = useSelector(({ projects }) => projects.inventories);
  const [deleteAccess, setDeleteAccess] = useState();
  const [createAccess, setCreateAccess] = useState();
  const team = useSelector(({ projects }) => projects.details.team);
  const role = useSelector(({ auth }) => auth.user);
  const [newConsumption, setNewConsumption] = useState(consumption);
  const [open, setOpen] = useState(false);
  const [delete1, setDelete1] = useState(false);
  const [error, setError] = useState(false);
  const [type, setType] = useState("Edit");
  const [values, setValues] = useState(initialValues);
  const [list, setList] = useState({
    id: "",
    name: "",
    quantity: "",
    unit: "",
    location: "",
    element: "",
    grade:"",
    building:"",
    remarks: "",
  });
  const [value, setValue] = React.useState(initialValue);
  const projectId = useSelector(({ projects }) => projects.details._id);
  const [consumptionId, setConsumptionId] = useState("");
  const loading = useSelector(({ projects }) => projects.loading);
  const gradeType = useSelector(({ sites }) => sites.dataStructure.gradeType);
  const build = useSelector(({ sites }) => sites.dataStructure.buildings);
  const [floors, setFloors] = useState([]);
  const [elements, setElements] = useState([]);
  const [hide, setHide] = useState(false);

  useEffect(() => {
    team.map((t)=>{
     if(t._id === role.data.id && t.role === "owner"|| role.role === 'admin' || role.role === 'purchaseOfficer')
     {
       setDeleteAccess(true);
       setCreateAccess(true);
     }else if(t._id === role.data.id && t.role !== "owner")
     {
       setDeleteAccess(t.tab_access.includes("Daily Data") || t.tab_access.includes("Remove Daily Data Entries"));
       setCreateAccess(t.tab_access.includes("Daily Data") || t.tab_access.includes("Create/Update Daily Data"));
     }

     if(t._id === role.data.id && t.role === "CIDCO Official"){
      setHide(true)
     }
    })
  }, []);

  useEffect(() => {
    dispatch(updateConsumption(newConsumption));
  }, [newConsumption]);

  useEffect(() => {
    dispatch(listInventories(projectId));
  }, []);
 

  const handleOpen = () => {
    setType("New");
    setOpen(true);
    let filterInv = inventory.filter((inv)=> inv.type.toLowerCase() === 'rmc');
    if(filterInv.length > 0){
      setValue({
        id: filterInv[0]._id,
        name: filterInv[0].type,
        quantity: "",
        unit: filterInv[0].unit,
        location: "",
        element: "",
        grade:"",
        remarks: "",
      })
    }
  };

  const handleClose = () => {
    setOpen(false);
    setValues({ name: "", quantity: "", unit: "", location: "", element: "", grade:"", remarks: ""});
    setValue(initialValue);
  };

  const handleChange = (prop) => (event) => {
    if (prop === "quantity") {
      let re = /[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)/;
      if (re.test(event.target.value) || event.target.value === "") {
        setValues({ ...values, [prop]: event.target.value });
      }
    }else if(prop === 'building'){
      build.map((bl)=>{
        if(bl.name === event.target.value){
          setFloors(bl.floors);
          setElements(bl.element);
        }
      })
      setValues({ ...values, [prop]: event.target.value, location: '', element: '' });
    }else {
      setValues({ ...values, [prop]: event.target.value });
    }
  };

  function buttonDisabled() {
    if (value !== null) {
        return (
          value.name.length > 0 &&
          values.quantity >= 0.01 &&
          values.quantity.length < 9 && 
          values.location.length > 0 &&
          values.element.length > 0 &&
          error === false
        )
    }
  }

  function handleSelectList(
    id,
    name,
    unit,
    quantity,
    location,
    element,
    grade,
    projectInventoryId,
    supplier,
    brand,
    building,
    remarks
  ) {
    invName.forEach((inv) => {
      if (inv.id === projectInventoryId) {
        setValue({
          id: inv.id,
          name: inv.name,
          quantity: inv.quantity,
          unit: inv.unit,
          location: location,
          remarks: remarks,
          element: element,
          grade: grade,
          building: building,
          supplier,
          brand
        });
      }
    })
    setOpen(true);
    setList({ id, name, unit, quantity,location,element, grade, supplier, brand, building, remarks});
    setValues({
      id: projectInventoryId,
      name,
      quantity : quantity.toString(),
      location,
      element,
      grade,
      supplier,
      brand,
      building,
      remarks
    });

    build.map((bl)=>{
      if(bl.name === building){
        setFloors(bl.floors);
        setElements(bl.element);
      }
    })
  }

  let invName = [];
  inventory.forEach((item) => {
    invName.push({
      id: item._id,
      name: item.type,
      unit: item.unit
    });
  });

  function listChange() {
    let mat = JSON.parse(JSON.stringify(consumption));

    if (value.name === "") {
      setOpen(false);
    } else {

      mat.forEach((item) => {

        if (item._id === list.id) {
            item.name = value.name;
            item.value = values.quantity;
            item.location = values.location;
            item.element = values.element;
            item.grade = values.grade;
            item.supplier = values.supplier;
            item.brand = values.brand;
            item.unit = value.unit;
            item.building = values.building;
            item.remarks = values.remarks;
         //   setNewConsumption(mat);
        }
      });

      if(props.data.Dialogtype === 'edit')
      {
        setOpen(false);
        dispatch(updateConsumptionData({ projectId, "type":"update", reportId:props.data.data._id,Data:mat})).then(
          (response) => {
            setValue(initialValue);
            setValues(initialValues);
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
        setValue(initialValue);
        setValues(initialValues);
      }
    }
  }

  function addList() {
    if (value.name === "") {
      setOpen(false);
    } else {
      let mat = {};
      inventory.forEach((item) => {
        if (value.id === item._id) {

            mat = {
              _id: FuseUtils.generateGUID(),
              projectInventoryId: item._id,
              name: value.name,
              value: values.quantity,
              unit: item.unit,
              location: values.location,
              remarks: values.remarks,
              element: values.element,
              grade: values.grade,
              building: values.building,
              supplier:item.supplier,
              brand:item.brand,
            };

            let data = {
              projectInventoryId: item._id,
              name: value.name,
              value: values.quantity,
              unit: item.unit,
              location: values.location,
              remarks: values.remarks,
              element: values.element,
              grade: values.grade,
              building: values.building,
              supplier:item.supplier,
              brand:item.brand,
            };
      
            if(props.data.Dialogtype === 'edit')
            {
                dispatch(addConsumptionData({ projectId, reportId:props.data.data._id, Data:data})).then(
                  (response) => {
                    setValues(initialValues);
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
                });
             
            }else{
              let bodyFormData = new FormData();
              bodyFormData.set("wing", "");
              bodyFormData.set("building", "");
              bodyFormData.set("floor", "");
              bodyFormData.set("flat", "");
              bodyFormData.set("workProgress", JSON.stringify([]));
              bodyFormData.set("inventory", JSON.stringify([]));
              bodyFormData.set("labour", JSON.stringify([]));
              bodyFormData.set("hindrance", JSON.stringify([]));
              bodyFormData.set("consumption", JSON.stringify([data]));
              bodyFormData.set("staff", JSON.stringify([]));
              bodyFormData.set("sitevisitor", JSON.stringify([]));
              bodyFormData.set("notes", JSON.stringify([]));
              bodyFormData.set("equipment", JSON.stringify([]));
              bodyFormData.set("existingAttachments", JSON.stringify([]));
              bodyFormData.append("attachments", '');
              bodyFormData.set("date", props.date);

              dispatch(saveReport({ projectId, formData: bodyFormData })).then(
                (response) => {
                  if(response.payload === undefined)
                  {
                    setValues(initialValues);
                    setOpen(false);
                    props.onClose();
                  }else{
                    dispatch(getDetailReport({ projectId: projectId, reportId: response.payload._id })).then(
                      () => {
                        setValues(initialValues);
                        dispatch(closeNewDialog())
                        dispatch(openEditDialog(response.payload));
                      }
                    );
                  }
                }
              );
            } 
          }
      });
    }
  }

  function deleteList(id) {
    if(props.data.Dialogtype === 'edit')
    {
      setDelete1(true);
      setConsumptionId(id);
    }else{
     let mat = JSON.parse(JSON.stringify(consumption));
     let deletedMat = mat.filter((item) => item._id !== id);
     setNewConsumption(deletedMat);
    }
  }

  function deleteConsumption() {
    let mat = JSON.parse(JSON.stringify(consumption));
    let deletedMat = mat.filter((item) => item._id !== consumptionId);
    setDelete1(false);
    dispatch(updateConsumptionData({ projectId, "type":"delete", reportId:props.data.data._id, Data:deletedMat})).then(
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

  props.onCountChange({ consumption: consumption.length });

  return (
    <>
      {!consumption.length ? (
        <Typography className="text-center" color="textSecondary" variant="h5">
            There are no entries for Consumption!
        </Typography>
      ) : (
        <List component="nav" aria-label="mailbox folders">
          {consumption.map((item) => (
            <>
              <ListItem
                button
                key={item._id}
                onClick={createAccess && hide === false ? (ev) => {
                  setType("Edit");
                  handleSelectList(
                    item._id,
                    item.name,
                    item.unit,
                    item.value,
                    item.location,
                    item.element,
                    item.grade ? item.grade : null,
                    item.projectInventoryId,
                    item.supplier,
                    item.brand,
                    item.building ? item.building : '',
                    item.remarks === undefined || item.remarks === null ? '' : item.remarks,
                  );
                }: () => dispatchWarningMessage(dispatch, "You do not have access to update Consumption. Contact Project Owner.")}
              >
                <ListItemText
                  primary={item.name}
                  secondary={
                    <div className="flex flex-row gap-6">
                      <Typography>{item.value + " " + item.unit}</Typography>
                      <Typography> {item.location ? "at " + item.location : item.location}  </Typography>
                    </div>
                  }
                />
                {hide === true ? null :
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={ deleteAccess ? () => deleteList(item._id):
                        () => dispatchWarningMessage(dispatch, "You do not have access to delete this entry. Contact Project Owner.")}
                        variant="contained"
                    >
                      <Icon className={classes.delete}>delete</Icon>
                    </IconButton>
                  </ListItemSecondaryAction>
                }
              </ListItem>
            </>
          ))}
        </List>
      )}
      {hide === true ? null :
        <Fab
          color="primary"
          aria-label="add"
          disabled={createAccess === true ? false :true}
          className={classes.addButton}
          onClick={handleOpen}
        >
         <Icon>add</Icon>
        </Fab>
      }

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Backdrop className={classes.backdrop} open={loading}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <DialogTitle id="alert-dialog-title">{type === 'Edit' ? "Update Concrete" :"Add Concrete"}</DialogTitle>
        <DialogContent>
          <FormControl variant="outlined">
            {value.name !== ''?(
              <>
                <div class="grid grid-cols-2">
                  {value.name !== ''?
                    <TextField
                      required
                      className="w-1 mr-10 my-10"
                      variant="outlined"
                      id="name"
                      label="Inventory"
                      value={value.name}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      InputProps={{readOnly:true}}
                    /> 
                  :
                    <Typography>RMC not found. Please add it from Inventory</Typography>
                  }

                  {build.length > 0 ?
                    <FormControl variant="outlined" className="w-1 ml-10 my-10">
                     <InputLabel id="demo-simple-select-outlined-label1" required>
                       Select Building
                     </InputLabel>
                     <Select
                       required
                       labelId="demo-simple-select-outlined-label1"
                       id="demo-simple-select-outlined1"
                       value={values.building}
                       onChange={handleChange("building")}
                       label="Building"
                     >
                       {build.map((wo) => (
                         <MenuItem value={wo.name}>
                           <Typography>{wo.name}</Typography>
                         </MenuItem>
                       ))}
                     </Select>
                    </FormControl> 
                  :
                    <Typography className="w-1 ml-10 my-10">Buildings not found. Please add it from Sites</Typography>
                  }
                </div>

                <div class="grid grid-cols-2 divide-x divide-gray-400">
                  <TextField
                    required
                    className="w-1 mr-10 my-10"
                    variant="outlined"
                    id="filled-number"
                    label="Quantity"
                    value={values.quantity}
                    onChange={handleChange("quantity")}
                    type="number"
                    InputLabelProps={{
                     shrink: true,
                    }}
                  />

                  {value !== null ?
                    (value.name==="RMC" || value.name==="Rmc" || value.name==="rmc"?
                      <FormControl variant="outlined" className="w-1 ml-10 my-10">
                        <InputLabel id="demo-simple-select-outlined-label" required>
                          Select Grade
                        </InputLabel>
                        <Select
                          required
                          labelId="demo-simple-select-outlined-label"
                          id="demo-simple-select-outlined"
                          value={values.grade}
                          onChange={handleChange("grade")}
                          label="Grade"
                        >
                          {gradeType.map((wo) => (
                            <MenuItem value={wo}>
                              <Typography>{wo}</Typography>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    :null)
                  :null}
                </div>

               {values.building !== ''?
                 <div class="grid grid-cols-2 divide-x divide-gray-400">
                    <FormControl variant="outlined" className="w-1 mr-10 my-10">
                      <InputLabel id="demo-simple-select-outlined-label" required>
                        Select Floor
                      </InputLabel>
                      <Select
                        required
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        value={values.location}
                        onChange={handleChange("location")}
                        label="Floor"
                      >
                        {floors.map((wo) => (
                          <MenuItem value={wo}>
                            <Typography>{wo}</Typography>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
 
                    <FormControl variant="outlined" className="w-1 ml-10 my-10">
                      <InputLabel id="demo-simple-select-outlined-label" required>
                        Select Element
                      </InputLabel>
                      <Select
                        required
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        value={values.element}
                        onChange={handleChange("element")}
                        label="Element"
                      >
                        {elements.map((wo) => (
                          <MenuItem value={wo}>
                            <Typography>{wo}</Typography>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                 </div>
               :null}

               <TextField
                  className="w-1 mr-10 my-10"
                  variant="outlined"
                  id="name"
                  multiline
                  rows="3"
                  onChange={handleChange("remarks")}
                  label="Remarks"
                  value={values.remarks}
                /> 
              </>
            )
            :
              <Typography>RMC not found. Please add it from Inventory</Typography>
            }  
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            CLOSE
          </Button>
          {type === "Edit" ? (
            <Button
              disabled={!buttonDisabled()}
              onClick={() => listChange()}
              color="primary"
              autoFocus
            >
              UPDATE
            </Button>
          ) : (
            <Button
              disabled={!buttonDisabled()}
              onClick={() => addList()}
              color="primary"
              autoFocus
            >
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
         Do you want to delete Consumption Entry ?
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
           onClick={() => {deleteConsumption()}}
           color="primary"
         >
           Yes
         </Button>
       </DialogActions>
      </Dialog>
    </>
  );
}

export default React.memo(Ssaconsumption);
