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
};

const initialValues = {
    id: "",
    name: "",
    quantity: "",
    unit: "",
    location: "",
    element: "",
    grade:"",
};

function Consumption(props) {
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
  });
  const [value, setValue] = React.useState(initialValue);
  const projectId = useSelector(({ projects }) => projects.details._id);
  const [consumptionId, setConsumptionId] = useState("");
  const loading = useSelector(({ projects }) => projects.loading);
  const gradeType = useSelector(({ dataStructure }) => dataStructure.gradeType);

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
  };
  const handleClose = () => {
    setOpen(false);
    setValues({ name: "", quantity: "", unit: "", location: "", element: "", grade:""});
    setValue(initialValue);
  };

  const handleChange = (prop) => (event) => {
    if (prop === "quantity") {
      let re = /[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)/;
      if (re.test(event.target.value) || event.target.value === "") {
        setValues({ ...values, [prop]: event.target.value });
      }
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
  ) {
    invName.forEach((inv) => {
      if (inv.id === projectInventoryId) {
        setValue({
          id: inv.id,
          name: inv.name,
          quantity: inv.quantity,
          unit: inv.unit,
          location: inv.location ? inv.location : "",
          element: inv.element ? inv.element : "",
          grade: inv.grade ? inv.grade : "",
          supplier,
          brand
        });
      }
    })
    setOpen(true);
    setList({ id, name, unit, quantity,location,element, grade, supplier, brand });
    setValues({
      id: projectInventoryId,
      name,
      quantity : quantity.toString(),
      location,
      element,
      grade,
      supplier,
      brand
    });
  }
  
  let invName = [];
  inventory.forEach((item) => {
    invName.push({
      id: item._id,
      name: item.type,
    });
  });

  function listChange() {
    let mat = JSON.parse(JSON.stringify(consumption));

    if (value.name === "") {
      setOpen(false);
    } else {

      mat.forEach((item) => {

        if (item._id === list.id) {

          inventory.forEach((inv) => {
            item.name = value.name;
            item.value = values.quantity;
            item.location = values.location;
            item.element = values.element;
            item.grade = values.grade;
            item.supplier = values.supplier;
            item.brand = values.brand;

            if (inv._id === value.id) {
                item.unit = inv.unit;
                setNewConsumption(mat);
                if(props.data.Dialogtype === 'edit')
                {
                  setOpen(false);
                  dispatch(updateConsumptionData({ projectId, "type":"update", reportId:props.data.data._id,Data:item})).then(
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
          });
        }
      });
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
              element: values.element,
              grade: values.grade,
              supplier:item.supplier,
              brand:item.brand,
            };

            let data = {
              projectInventoryId: item._id,
              name: value.name,
              value: values.quantity,
              unit: item.unit,
              location: values.location,
              element: values.element,
              grade: values.grade,
              supplier:item.supplier,
              brand:item.brand,
            };
      
            if(props.data.Dialogtype === 'edit')
            {
                dispatch(addConsumptionData({ projectId, reportId:props.data.data._id, Data:data})).then(
                  (response) => {
                    setValues(initialValues);
                    setValue(initialValue);
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
                    setValue(initialValue);
                    setOpen(false);
                    props.onClose();
                  }else{
                    dispatch(getDetailReport({ projectId: projectId, reportId: response.payload._id })).then(
                      () => {
                        setValues(initialValues);
                        setValue(initialValue);
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
                onClick={createAccess ? (ev) => {
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
              </ListItem>
            </>
          ))}
        </List>
      )}
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
        <DialogTitle id="alert-dialog-title">{"Update Consumption"}</DialogTitle>
        <DialogContent>
          <FormControl variant="outlined">
            <Autocomplete
              required
              value={value}
              disabled={type === 'Edit' ? true : false}
              onChange={(event, newValue) => {
                if (typeof newValue === 'string') {
                  setValue({
                    name: newValue,
                  });
                } else if (newValue && newValue.inputValue) {
                  setValue({
                    name: newValue.inputValue,
                  });
                } else if(newValue === null)
                {
                  setValue(initialValue);
                } else {
                  setValue(newValue);
                }
              }}
              selectOnFocus
              clearOnBlur
              handleHomeEndKeys
              id="free-solo-with-text-demo"
              options={invName}
              getOptionLabel={(option) => {
                if (typeof option === 'string') {
                  return option;
                }
                if (option.inputValue) {
                  return option.inputValue;
                }

                return option.name;
              }}
              renderOption={(option) => option.name}
              style={{ width: 300 }}
              freeSolo
              renderInput={(params) => (
                <TextField {...params} label="Inventory" required variant="outlined" />
              )}
            />
           
            <TextField
              required
              className="mt-10"
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
                 <FormControl variant="outlined" className="mt-8">
                      <InputLabel id="demo-simple-select-outlined-label" required>
                          Select Grade
                      </InputLabel>
                      <Select
                         required
                         className="w-1 mr-10 mx-5"
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

            <TextField
              className="mt-10"
              variant="outlined"
              label="Location"
              value={values.location}
              onChange={handleChange("location")}
              InputLabelProps={{
                shrink: true,
              }}
            />
        
            <TextField
              className="mt-10"
              variant="outlined"
              label="Element"
              value={values.element}
              onChange={handleChange("element")}
              InputLabelProps={{
                shrink: true,
              }}
            />
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

export default React.memo(Consumption);
