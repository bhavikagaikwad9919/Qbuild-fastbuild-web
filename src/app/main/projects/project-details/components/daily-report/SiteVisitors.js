import React, { useState, useEffect } from "react";
import { Typography } from "@material-ui/core";
import FuseUtils from "@fuse/utils";
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
  updateSitevisitor,
  saveReport,
  openEditDialog,
  closeNewDialog,
  getDetailReport,
  addSiteVisitorData,
  updateSiteVisitorData
} from "app/main/projects/store/projectsSlice";
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
  name: "",
  designation: "",
  purpose: "",
};

function SiteVisitors(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const sitevisitor = useSelector(({ projects }) => projects.sitevisitor);
  const [newSitevisitor, setNewSitevisitor] = useState(sitevisitor);
  const [sitevisitorId, setSiteVisitorId] = useState("");
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState(initialState);
  const [type, setType] = useState("Edit");
  const [list, setList] = useState({
    id: "",
    name: "",
    designation: "",
    purpose: "",
  });
  const loading = useSelector(({ projects }) => projects.loading);
  const [delete1, setDelete1] = useState(false);
  const projectId = useSelector(({ projects }) => projects.details._id);
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
    dispatch(updateSitevisitor(newSitevisitor));
  }, [dispatch, newSitevisitor]);

  const handleOpen = () => {
    setType("New");
    setOpen(true);
  };

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  function handleOpenList(
    id,
    name,
    designation,
    purpose
  ) {
    setType("Edit");
    setOpen(true);
    setList({ id, name, designation, purpose });
    setValues({ name, designation, purpose });
  }

  const handleClose = () => {
    setOpen(false);
    setValues({
      name: "",
      designation: "",
      purpose: "",
    });
  };

  function listChange() {
    let site = JSON.parse(JSON.stringify(sitevisitor));
    if (values.name === "" && values.designation === "") {
      setOpen(false);
    } else {
      site.forEach((item) => {
        if (item._id === list.id) {
          item.name = values.name;
          item.designation = values.designation;
          item.purpose = values.purpose;
        }
      });
      // setNewSitevisitor(site);
      // setOpen(false);
      if(props.data.Dialogtype === 'edit')
      {
        setOpen(false);
        dispatch(updateSiteVisitorData({ projectId, "type":"update", reportId:props.data.data._id,Data:site})).then(
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
        purpose: values.purpose,
      };

      let data = {
        name: values.name,
        designation: values.designation,
        purpose: values.purpose,
      };
      // setNewSitevisitor([...newSitevisitor, site]);
      // setOpen(false);
      setValues(initialState);
      
      if(props.data.Dialogtype === 'edit')
      {
        dispatch(addSiteVisitorData({ projectId, reportId:props.data.data._id,Data:data})).then(
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
        bodyFormData.set("sitevisitor", JSON.stringify([data]));
        bodyFormData.set("staff", JSON.stringify([]));
        bodyFormData.set("notes", JSON.stringify([]));
        bodyFormData.set("equipment", JSON.stringify([]));
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
      setSiteVisitorId(id);
    }else{
      let site = JSON.parse(JSON.stringify(sitevisitor));
      let deletedSite = site.filter((item) => item._id !== id);
      setNewSitevisitor(deletedSite);
    } 
  }

  function deleteSiteVisitor() {
    let lat = JSON.parse(JSON.stringify(sitevisitor));
    let deletedSite = lat.filter((item) => item._id !== sitevisitorId);
    setDelete1(false);
    dispatch(updateSiteVisitorData({ projectId,"type":"delete", reportId:props.data.data._id,Data:deletedSite})).then(
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
      values.purpose.length > 0
    );
  };
  props.onCountChange({ sitevisitor: sitevisitor.length });

  if (!sitevisitor.length) {
    return (
      <div className="flex flex-1 items-center justify-center h-full">
        <Typography color="textSecondary" variant="h5">
          There are no Site Visitors!
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
            <DialogTitle id="alert-dialog-title">{"Update Site Visitor"}</DialogTitle>
          ) : (
            <DialogTitle id="alert-dialog-title">{"Add Site Visitors"}</DialogTitle>
          )}
          <DialogContent>
          <div class="w-auto">
              <FormControl variant="outlined">
                 <TextField
                  variant="outlined"
                  className="my-12"
                  //id='filled-number'
                  label="Name"
                  value={values.name}
                  onChange={handleChange("name")}
                />
                <TextField
                  variant="outlined"
                  className="my-16"
                  //id='filled-number'
                  label="Designation"
                  value={values.designation}
                  onChange={handleChange("designation")}
                />
                <TextField
                  variant="outlined"
                  className="my-16"
                  //id='filled-number'
                  multiline
                  label="Purpose"
                  rows="4"
                  value={values.purpose}
                  onChange={handleChange("purpose")}
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
        {sitevisitor.map((item) => (
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
                      item.purpose
                    );
                  }: () => dispatchWarningMessage(dispatch, "You do not have access to update Site Visitor. Contact Project Owner.")}
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
          <DialogTitle id="alert-dialog-title">{"Update Site Visitor"}</DialogTitle>
        ) : (
          <DialogTitle id="alert-dialog-title">{"Add Site Visitor"}</DialogTitle>
        )}
        <DialogContent>
          <div class="w-auto">
            <FormControl variant="outlined">
              <TextField
                variant="outlined"
                className="my-12"
                //id='filled-number'
                label="Name"
                value={values.name}
                onChange={handleChange("name")}
              />
              <TextField
                    variant="outlined"
                    className="my-16"
                    //id='filled-number'
                    label="Designation"
                    value={values.designation}
                    onChange={handleChange("designation")}
                  />
              <TextField
                variant="outlined"
                className="my-16"
                multiline
                //id='filled-number'
                rows="4"
                label="Purpose"
                value={values.purpose}
                onChange={handleChange("purpose")}
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
         Do you want to delete Site-Visitor Entry ?
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
           onClick={() => {deleteSiteVisitor()}}
           color="primary"
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default SiteVisitors;
