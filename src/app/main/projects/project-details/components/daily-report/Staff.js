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
import {
  updateStaff,
  saveReport,
  openEditDialog,
  closeNewDialog,
  getDetailReport,
  addStaffData,
  updateStaffData
} from "app/main/projects/store/projectsSlice";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import { dispatchWarningMessage } from "app/utils/MessageDispatcher";
import history from "@history";
import Link from "@material-ui/core/Link";

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
  name: "",
  designation: "",
  status: "",
};

function Staff(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const staff = useSelector(({ projects }) => projects.staff);
  const staffData = useSelector(({ organizations }) => organizations.dataStructure.staffs);
  const [newStaff, setNewStaff] = useState(staff);
  const [staffId, setStaffId] = useState("");
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState(initialState);
  const [type, setType] = useState("Edit");
  const [list, setList] = useState({
    id: "",
    name: "",
    designation: "",
    status: "",
  });
  const loading = useSelector(({ projects }) => projects.loading);
  const [delete1, setDelete1] = useState(false);
  const projectId = useSelector(({ projects }) => projects.details._id);
  const [deleteAccess, setDeleteAccess] = useState();
  const [createAccess, setCreateAccess] = useState();
  const team = useSelector(({ projects }) => projects.details.team);
  const orgDetails = useSelector(({ organizations }) => organizations.organization);
  const role = useSelector(({ auth }) => auth.user);

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
    dispatch(updateStaff(newStaff));
  }, [newStaff]);

  const handleOpen = () => {
    setType("New");
    setOpen(true);
  };

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  function setData(data){
    setValues({ ...values, 'name' :data.name, 'designation': data.role});
  }

  function handleOpenList(
    id,
    name,
    designation,
    status
  ) {
    setType("Edit");
    setOpen(true);
    setList({ id, name, designation, status });
    setValues({ name, designation, status });
  }

  const handleClose = () => {
    setOpen(false);
    setValues({
      name: "",
      designation: "",
      status: "",
    });
  };

  function listChange() {
    let site = JSON.parse(JSON.stringify(staff));
    if (values.name === "" && values.designation === "") {
      setOpen(false);
    } else {
      site.forEach((item) => {
        if (item._id === list.id) {
          item.name = values.name;
          item.designation = values.designation;
          item.status = values.status;
        }
      });
      // setNewStaff(site);
      // setOpen(false);
      if(props.data.Dialogtype === 'edit')
      {
        setOpen(false);
        dispatch(updateStaffData({ projectId, "type":"update", reportId:props.data.data._id,Data:site})).then(
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
    if (values.name === "" && values.designation === "") {
      setOpen(false);
    } else {
      let site = {
        _id: FuseUtils.generateGUID(),
        name: values.name,
        designation: values.designation,
        status: values.status,
      };

      let data = {
        name: values.name,
        designation: values.designation,
        status: values.status,
      };
      // setNewStaff([...newStaff, site]);
      // setOpen(false);
      setValues(initialState);
      
      if(props.data.Dialogtype === 'edit')
      {
        dispatch(addStaffData({ projectId, reportId:props.data.data._id,Data:data})).then(
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
        bodyFormData.set("hindrance", JSON.stringify([]));
        bodyFormData.set("sitevisitor", JSON.stringify([]));
        bodyFormData.set("staff", JSON.stringify([data]));
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

  function deleteList(id) {
    if(props.data.Dialogtype === 'edit')
    {
      setDelete1(true);
      setStaffId(id);
    }else{
      let site = JSON.parse(JSON.stringify(staff));
      let deletedSite = site.filter((item) => item._id !== id);
      setNewStaff(deletedSite);
    } 
  }

  function deleteStaff() {
    let lat = JSON.parse(JSON.stringify(staff));
    let deletedSite = lat.filter((item) => item._id !== staffId);
    setDelete1(false);
    dispatch(updateStaffData({ projectId,"type":"delete", reportId:props.data.data._id,Data:deletedSite})).then(
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

  const disableButton = () => {
    return (
      values.name.length > 0 &&
      values.designation.length > 0 &&
      values.status.length > 0
    );
  };
  props.onCountChange({ staff: staff.length });

  if (!staff.length) {
    return (
      <div className="flex flex-1 items-center justify-center h-full">
        <Typography color="textSecondary" variant="h5">
          There are no Staff Entries!
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
            <DialogTitle id="alert-dialog-title">{"Update Staff"}</DialogTitle>
          ) : (
            <DialogTitle id="alert-dialog-title">{"Add Staff"}</DialogTitle>
          )}
          <DialogContent>
            <div class="w-auto">
              <FormControl variant="outlined">
                <InputLabel id="demo-simple-select-placeholder-label-label" required>
                  Select Name
                </InputLabel>
                <Select
                  required
                  id="demo-dialog-select"
                  value={values.name}
                >
                  {staffData.map((vname) => (
                    <MenuItem key={vname.id} value={vname.name} onClick={()=> setData(vname)}>
                      {vname.name}
                    </MenuItem>
                  ))}
                  <Link
                    className="ml-10 cursor-pointer"
                    onClick={() => 
                    history.push({
                      pathname: `/organization/details/${orgDetails._id}`,
                     })}
                  >
                    Click here to Add New Staff member from Organization
                  </Link>
                </Select> 
                <TextField
                  variant="outlined"
                  className="my-16"
                  label="Designation"
                  value={values.designation}
                  disabled={true}
                  onChange={handleChange("designation")}
                />
                <FormControl variant="outlined" className="mt-8">
                  <InputLabel id="demo-simple-select-placeholder-label-label">
                     Status
                  </InputLabel>
                  <Select
                     label = 'Status'
                     id="demo-dialog-select"
                     value={values.status}
                     onChange={handleChange("status")}
                   >
                     <MenuItem value="Present" >Present</MenuItem>
                     <MenuItem value="Absent" >Absent</MenuItem>
                   </Select>
                </FormControl>
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
        {staff.map((item) => (
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
                      item.name,
                      item.designation,
                      item.status
                    );
                  }: () => dispatchWarningMessage(dispatch, "You do not have access to update Staff Entries. Contact Project Owner.")}
                >
                  <ListItemText
                    primary={item.name}
                    secondary={
                      <>
                        <Typography>
                          {item.designation ? item.designation + " " : null}
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
          <DialogTitle id="alert-dialog-title">{"Update Staff"}</DialogTitle>
        ) : (
          <DialogTitle id="alert-dialog-title">{"Add Staff"}</DialogTitle>
        )}
        <DialogContent>
          <div class="w-auto">
            <FormControl variant="outlined">
              <InputLabel id="demo-simple-select-placeholder-label-label" required>
                Select Name
              </InputLabel>
              <Select
                required
                id="demo-dialog-select"
                value={values.name}
              >
                {staffData.map((vname) => (
                  <MenuItem key={vname.id} value={vname.name} onClick={()=> setData(vname)}>
                    {vname.name}
                  </MenuItem>
                ))}
                <Link
                    className="ml-10 cursor-pointer"
                    onClick={() => 
                    history.push({
                      pathname: `/organization/details/${orgDetails._id}`,
                     })}
                  >
                    Click here to Add New Staff member from Organization
                  </Link>
              </Select> 
              <TextField
                variant="outlined"
                className="my-16"
                label="Designation"
                disabled={true}
                value={values.designation}
                onChange={handleChange("designation")}
              />
              <FormControl variant="outlined" className="mt-8">
                  <InputLabel id="demo-simple-select-placeholder-label-label">
                     Status
                  </InputLabel>
                  <Select
                     label = 'Status'
                     id="demo-dialog-select"
                     value={values.status}
                     onChange={handleChange("status")}
                   >
                     <MenuItem value="Present" >Present</MenuItem>
                     <MenuItem value="Absent" >Absent</MenuItem>
                   </Select>
                </FormControl>
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
         Do you want to delete Staff Entry ?
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
           onClick={() => {deleteStaff()}}
           color="primary"
          >
            Yes
          </Button>
       </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default Staff;
