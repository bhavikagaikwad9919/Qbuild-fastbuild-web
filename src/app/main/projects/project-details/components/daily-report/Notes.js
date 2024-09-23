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
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import {
  updateNotes,
  saveReport,
  openEditDialog,
  closeNewDialog,
  getDetailReport,
  addNotesData,
  updateNotesData
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
  title: "",
  description: "",
};

function Notes(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const notes = useSelector(({ projects }) => projects.notes);
  const [newNotes, setNewNotes] = useState(notes);
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState(initialState);
  const [type, setType] = useState("Edit");
  const [list, setList] = useState({
    id: "",
    title: "",
    description: "",
  });
  const [notesId, setNotesId] = useState("");
  const loading = useSelector(({ projects }) => projects.loading);
  const [delete1, setDelete1] = useState(false);
  const projectId = useSelector(({ projects }) => projects.details._id);
  const [deleteAccess, setDeleteAccess] = useState();
  const [createAccess, setCreateAccess] = useState();
  const team = useSelector(({ projects }) => projects.details.team);
  const role = useSelector(({ auth }) => auth.user);
  const details = useSelector(({ organizations }) => organizations.organization);
  const build = useSelector(({ sites }) => sites.dataStructure.buildings);
  const [hide, setHide] = useState(false);
  let orgType = '';
  if(details === undefined || details === null){
    orgType = '';
  }else{
    orgType = details.orgType === undefined || details.orgType === null ? '' : details.orgType
  }

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

     if(t._id === role.data.id && t.role === "CIDCO Official"){
      setHide(true)
     }
    })
   }, [role.data.id, role.role, team]);


  useEffect(() => {
    dispatch(updateNotes(newNotes));
  }, [dispatch, newNotes]);

  const handleOpen = () => {
    setType("New");
    setOpen(true);
  };

  const handleChange = (prop) => (event) => {
    const capitalizedTitle = event.target.value.charAt(0).toUpperCase() + event.target.value.slice(1);
    setValues({ ...values, [prop]: capitalizedTitle });
  };

  function handleOpenList(
    id,
    title,
    description
  ) {
    setType("Edit");
    setOpen(true);
    setList({ id, title,description });
    setValues({ title,description  });
  }

  const handleClose = () => {
    setOpen(false);
    setValues({
      title: "",
      description: "",
    });
  };

  function listChange() {
    let note = JSON.parse(JSON.stringify(notes));
    if (values.title === "" && values.description === "") {
      setOpen(false);
    } else {
      note.forEach((item) => {
        if (item._id === list.id) {
          item.title = values.title;
          item.description = values.description;
        }
      });
      // setNewNotes(note);
      // setOpen(false);

      if(props.data.Dialogtype === 'edit')
      {
        setOpen(false);
        dispatch(updateNotesData({ projectId, "type":"update", reportId:props.data.data._id,Data:note})).then(
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
    if (values.title === "" && values.description === "") {
      setOpen(false);
    } else {
      let note = {
        _id: FuseUtils.generateGUID(),
        title: values.title,
        description: values.description,
      };

      let data = {
        title: values.title,
        description: values.description,
      };

      // setNewNotes([...newNotes, note]);
      // setOpen(false);
      
      setValues(initialState);
      
      if(props.data.Dialogtype === 'edit')
      {
        dispatch(addNotesData({ projectId, reportId:props.data.data._id,Data:data})).then(
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
        bodyFormData.set("staff", JSON.stringify([]));
        bodyFormData.set("sitevisitor", JSON.stringify([]));
        bodyFormData.set("notes", JSON.stringify([data]));
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
      setNotesId(id);
    }else{
      let note = JSON.parse(JSON.stringify(notes));
      let deletedNote = note.filter((item) => item._id !== id);
      setNewNotes(deletedNote);
    }
  }

  function deleteNote() {
    let lat = JSON.parse(JSON.stringify(notes));
    let deletedNote = lat.filter((item) => item._id !== notesId);
    setDelete1(false);
    dispatch(updateNotesData({ projectId,"type":"delete", reportId:props.data.data._id,Data:deletedNote})).then(
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
      values.title.length > 0 &&
      values.description.length > 0
    );
  }

  props.onCountChange({ notes: notes.length });

  if (!notes.length) {
    return (
      <div className="flex flex-1 items-center justify-center h-full">
        <Typography color="textSecondary" variant="h5">
          {orgType !=='SSA' ? "There are no Notes!" : "There are no Work Progress found."}
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
            <DialogTitle id="alert-dialog-title">{orgType !== 'SSA' ?"Update Note" : "Update Work Progress"}</DialogTitle>
          ) : (
            <DialogTitle id="alert-dialog-title">{orgType !== 'SSA' ?"Add Note" : "Add Work Progress"}</DialogTitle>
          )}
          <DialogContent>
          <div className="w-auto">
            <FormControl variant="outlined">
              {orgType === 'SSA' ?
                (build.length > 0 ?
                  <FormControl variant="outlined" className="w-1 my-10">
                    <InputLabel id="demo-simple-select-outlined-label1" required>
                      Select Building
                    </InputLabel>
                    <Select
                      required
                      labelId="demo-simple-select-outlined-label1"
                      id="demo-simple-select-outlined1"
                      value={values.title}
                      onChange={handleChange("title")}
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
                  <Typography className="w-1 my-10">Buildings not found. Please add it from Sites</Typography>
                )
              :
                <TextField
                  variant="outlined"
                  className="my-12"
                  label="Title"
                  value={values.title}
                  onChange={handleChange("title")}
                />
              }
              <TextField
                variant="outlined"
                className="my-16"
                style={{width:"300px"}}
                multiline
                rows="6"
                label="Description"
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
        {notes.map((item) => (
          <React.Fragment>
            <Grid container alignItems="center" direction="row">
              <Grid item xs={11}>
                <ListItem
                  button
                  key={item._id}
                  //onTouchTap={handleTouchTap(item.id)}
                  onClick={createAccess && hide === false ? (ev) => {
                    handleOpenList(
                      item._id,
                      item.title,
                      item.description
                    );
                  }: () => dispatchWarningMessage(dispatch, "You do not have access to update an entry. Contact Project Owner.")}
                >
                  <ListItemText
                    primary={item.title}
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
                {hide === true ? null :
                  <IconButton
                    onClick={ deleteAccess ? () => deleteList(item._id):
                    () => dispatchWarningMessage(dispatch, "You do not have access to delete this entry. Contact Project Owner.")}
                    variant="contained"
                  >
                    <Icon className={classes.delete}>delete</Icon>
                  </IconButton>
                }
              </Grid>
            </Grid>
          </React.Fragment>
        ))}
      </List>

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
        {type === "Edit" ? (
          <DialogTitle id="alert-dialog-title">{orgType !== 'SSA' ?"Update Note" : "Update Work Progress"}</DialogTitle>
        ) : (
          <DialogTitle id="alert-dialog-title">{orgType !== 'SSA' ?"Add Note" : "Add Work Progress"}</DialogTitle>
        )}
        <DialogContent>
          <FormControl variant="outlined">
            {orgType === 'SSA' ?
              (build.length > 0 ?
                <FormControl variant="outlined" className="w-1 my-10">
                  <InputLabel id="demo-simple-select-outlined-label1" required>
                    Select Building
                  </InputLabel>
                  <Select
                    required
                    labelId="demo-simple-select-outlined-label1"
                    id="demo-simple-select-outlined1"
                    value={values.title}
                    onChange={handleChange("title")}
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
                  <Typography className="w-1 my-10">Buildings not found. Please add it from Sites</Typography>
              )
            :
              <TextField
                variant="outlined"
                className="my-12"
                label="Title"
                value={values.title}
                onChange={handleChange("title")}
              />
            }
            <TextField
              variant="outlined"
              className="my-16"
              style={{width:"300px"}}
              multiline
              rows="6"
              label="Description"
              value={values.description}
              onChange={handleChange("description")}
            />
          </FormControl>
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
         Do you want to delete Entry ?
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
           onClick={() => {deleteNote()}}
           color="primary"
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default Notes;
