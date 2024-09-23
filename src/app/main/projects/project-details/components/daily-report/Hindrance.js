import React, { useState, useEffect } from "react";
import { Typography } from "@material-ui/core";
//import FuseUtils from "@fuse/utils";
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
import FormControl from "@material-ui/core/FormControl";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import {
  updateHindrance,
  saveReport,
  openEditDialog,
  closeNewDialog,
  getDetailReport,
  addHindranceData,
  updateHindranceData
} from "app/main/projects/store/projectsSlice";
import Autocomplete from '@material-ui/lab/Autocomplete';
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
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
  selectedtype: "",
  description: "",
};

function Hindrance(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const projectId = useSelector(({ projects }) => projects.details._id);
  const hindrance = useSelector(({ projects }) => projects.hindrance);
  const [newHindrance, setNewHindrance] = useState(hindrance);
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState(initialState);
  const [type, setType] = useState("Edit");
  const [list, setList] = useState({
    id: "",
    selectedtype: "",
    description: "",
  });
  const [hindranceId, setHindranceId] = useState("");
  const loading = useSelector(({ projects }) => projects.loading);
  const [delete1, setDelete1] = useState(false);
  const [deleteAccess, setDeleteAccess] = useState();
  const [createAccess, setCreateAccess] = useState();
  const team = useSelector(({ projects }) => projects.details.team);
  const role = useSelector(({ auth }) => auth.user);

  useEffect(() => {
    team.forEach((t)=>{
     if((t._id === role.data.id && t.role === "owner") || role.role === 'admin' || role.role === 'purchaseOfficer')
     {
       setDeleteAccess(true);
       setCreateAccess(true);
     }else if(t._id === role.data.id && t.role !== "owner")
     {
       setDeleteAccess(t.tab_access.includes("Daily Data") || t.tab_access.includes("Remove Daily Data Entries"));
       setCreateAccess(t.tab_access.includes("Daily Data") || t.tab_access.includes("Create/Update Daily Data"));
     }
    })
   }, [role.data.id, role.role, team]);


  useEffect(() => {
    dispatch(updateHindrance(newHindrance));
  }, [dispatch, newHindrance]);

  const handleOpen = () => {
    setType("New");
    setOpen(true);
  };

  const handleChange = (prop) => (event) => {    
    const capitalizedTitle = event.target.value.charAt(0).toUpperCase() + event.target.value.slice(1);
    setValues({ ...values, [prop]: capitalizedTitle });
  };

  const changeTypeOptionBaseOnValue = (value) => {
    setValues({ ...values, "selectedtype": value });
  }

  const hindrenceOption =['Material','Labour','Equipment', 'Drawing', 'Other'];

  function handleOpenList(
    id,
    selectedtype,
    description
  ) {
    setType("Edit");
    setOpen(true);
    setList({ id, selectedtype, description });
    setValues({ selectedtype, description });
  }
  
  const handleClose = () => {
    setOpen(false);
    setValues({
      selectedtype: "",
      description: "",
    });
  };

  function listChange() {
    let hind = JSON.parse(JSON.stringify(hindrance));
    if (values.selectedtype === "" && values.description === "") {
      setOpen(false);
    } else {
      hind.forEach((item) => {
        if (item._id === list.id) {
          item.selectedtype = values.selectedtype;
          item.description = values.description;
        }
      });
      // setNewHindrance(hind);
      // setOpen(false);
      if(props.data.Dialogtype === 'edit')
      {
        setOpen(false);
        dispatch(updateHindranceData({ projectId, "type":"update", reportId:props.data.data._id, Data:hind})).then(
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
    if (values.selectedtype === "" && values.description === "") {
      setOpen(false);
    } else {
      // let hind = {
      //   _id: FuseUtils.generateGUID(),
      //   selectedtype: values.selectedtype,
      //   description: values.description,
      // };
      let data = {
        selectedtype: values.selectedtype,
        description: values.description,
      };

      // setNewHindrance([...newHindrance, hind]);
      // setOpen(false);
      setValues(initialState);

      if(props.data.Dialogtype === 'edit')
      {
        dispatch(addHindranceData({ projectId, reportId:props.data.data._id, Data:data})).then(
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
        bodyFormData.set("labour", JSON.stringify([]));
        bodyFormData.set("hindrance", JSON.stringify([data]));
        bodyFormData.set("staff", JSON.stringify([]));
        bodyFormData.set("consumption", JSON.stringify([]));
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
      setHindranceId(id);
    }
  }

  function deleteHindrance() {
    let lat = JSON.parse(JSON.stringify(hindrance));
    let deletedHind = lat.filter((item) => item._id !== hindranceId);
    setDelete1(false);
    dispatch(updateHindranceData({ projectId,"type":"delete", reportId:props.data.data._id, Data:deletedHind})).then(
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

  props.onCountChange({ hindrance: hindrance.length });

  const disableButton = () => {
    return (
      values.selectedtype.length > 0 &&
      values.description.length > 0
    );
  };

  if (!hindrance.length) {
    return (
      <div className="flex flex-1 items-center justify-center h-full">
        <Typography color="textSecondary" variant="h5">
          There was no Hindrance!
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
            <DialogTitle id="alert-dialog-title">{"Update Hindrance"}</DialogTitle>
          ) : (
            <DialogTitle id="alert-dialog-title">{"Add Hindrance"}</DialogTitle>
          )}
          <DialogContent>
            <div class="w-auto">
              <FormControl variant="outlined">
               <Autocomplete
                 id="type"
                 freeSolo
                 className="mb-12"
                 options={hindrenceOption}
                 value={values.selectedtype}
                 onInputChange={(event, value) => {
                   changeTypeOptionBaseOnValue(value);
                 }}
                 renderInput={(params) => (
                 <TextField
                    {...params}
                    label="Type"
                    onChange={handleChange("selectedtype")}
                    variant="outlined"
                  />
                 )}
                />
                {/* <InputLabel id="demo-simple-select-placeholder-label-label">
                  Type
                </InputLabel>
                <Select
                  id="demo-dialog-select"
                  value={values.selectedtype}
                  onChange={handleChange("selectedtype")}
                >
                  <MenuItem value="Material" >Material</MenuItem>
                  <MenuItem value="Labour" >Labour</MenuItem>
                  <MenuItem value="Machinery" >Machinery</MenuItem>
                </Select> */}
                <TextField
                  variant="outlined"
                  className="my-10"
                  multiline
                  style={{width:"300px"}}
                  //id='filled-number'
                  label="Description"
                  rows="6"
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
        {hindrance.map((item) => (
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
                      item.selectedtype,
                      item.description
                    );
                  }: () => dispatchWarningMessage(dispatch, "You do not have access to update Hindrance. Contact Project Owner.")}
                >
                  <ListItemText
                    primary={item.selectedtype}
                    secondary={
                      <>
                        <Typography>
                          {item.description ? item.description + " " : null}
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
          <DialogTitle id="alert-dialog-title">{"Update Hindrance"}</DialogTitle>
        ) : (
          <DialogTitle id="alert-dialog-title">{"Add Hindrance"}</DialogTitle>
        )}
        <DialogContent>
          <div class="w-auto">
            <FormControl variant="outlined">
            <Autocomplete
                 id="type"
                 freeSolo
                 className="mb-12"
                 options={hindrenceOption}
                 value={values.selectedtype}
                 onInputChange={(event, value) => {
                   changeTypeOptionBaseOnValue(value);
                 }}
                 renderInput={(params) => (
                 <TextField
                    {...params}
                    label="Type"
                    onChange={handleChange("selectedtype")}
                    variant="outlined"
                  />
                 )}
                />
              {/* <InputLabel id="demo-simple-select-placeholder-label-label">
                Type
              </InputLabel>
              <Select
                id="demo-dialog-select"
                value={values.selectedtype}
                onChange={handleChange("selectedtype")}
              >
                 <MenuItem value="Material" >Material</MenuItem>
                  <MenuItem value="Labour" >Labour</MenuItem>
                  <MenuItem value="Machinery" >Machinery</MenuItem>
              </Select> */}
              <TextField
                variant="outlined"
                className="my-10"
                multiline
                //id='filled-number'
                style={{width:"300px"}}
                label="Description"
                rows="6"
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
            <Button disabled={!disableButton()}  onClick={() => addList()} color="primary" autoFocus>
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
         Do you want to delete Hindrance Entry ?
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
           onClick={() => {deleteHindrance()}}
           color="primary"
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default Hindrance;
