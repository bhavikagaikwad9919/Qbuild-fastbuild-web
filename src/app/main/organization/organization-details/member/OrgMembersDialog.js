import React, { useEffect, useCallback, useRef, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  Toolbar,
  AppBar,
  Avatar,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
} from "@material-ui/core";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";
import { TextFieldFormsy } from "@fuse/core/formsy";
import Formsy from "formsy-react";
import FuseUtils from "@fuse/utils";
import {
  closeEditDialog,
  closeNewDialog,
  deleteMember,
  updateMember,
  addMember,
} from "app/main/organization/store/organizationSlice";
import { useDispatch, useSelector } from "react-redux";
import { dispatchWarningMessage } from "app/utils/MessageDispatcher";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { updateDataStructure } from "app/main/organization/store/organizationSlice";


const defaultFormState = {
  id: "",
  name: "",
  email: "",
  contact: "",
  designation: "",
  code: FuseUtils.generateGUID(),
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

function OrgMembersDialog(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const organizationDialog = useSelector(({ organizations }) => organizations.orgDialog);
  const organizationId = useSelector(({ organizations }) => organizations.organization._id);
  const organizationDetails = useSelector(({ organizations }) => organizations.organization);
  const staffData = useSelector(({ organizations }) => organizations.dataStructure.staffs);
  const loading = useSelector(({ organizations }) => organizations.loading);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(defaultFormState);
  const formRef = useRef(null);
  const [selected, setSelected] = useState([]);
  const [moduleList, setModuleList] = useState(["Members","Info","Data Structure"]);
  const isAllSelected = moduleList.length > 0 && selected[0] === 'All' && selected.length === 1;
  const details = useSelector(({ organizations }) => organizations.organization);
  const userId = useSelector(({ auth }) => auth.user.data.id);

  const initorganizationDialog = useCallback(() => {
    if (organizationDialog.Dialogtype === "edit" && organizationDialog.data) {
      setForm({ ...organizationDialog.data });
      setSelected(organizationDialog.data.access)
    }

    if (organizationDialog.Dialogtype === "new") {
      setForm({
        ...defaultFormState,
        ...organizationDialog.data,
        id: FuseUtils.generateGUID(),
      });
    }

    if(details.orgType === 'SSA'){
      setModuleList(["Members","Sites","Info","Dashboard","Data Structure"])
    }
  }, [organizationDialog.data, organizationDialog.Dialogtype, setForm]);

  useEffect(() => {
    if (organizationDialog.props.open) {
      initorganizationDialog();
    }
  }, [organizationDialog.props.open, initorganizationDialog]);

  const handleChange = (prop) => (event) => {
    setForm({ ...form, [prop]: event.target.value });  
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function closeComposeDialog() {
    organizationDialog.Dialogtype === "edit"
      ? dispatch(closeEditDialog())
      : dispatch(closeNewDialog());
  }

  function canBeSubmitted() {
    return (
      form.name.length > 0 &&
      form.email.length > 0 && 
      form.designation.length > 0 &&
      form.contact.length
    );
  }

  function handleSubmit(model) {
    if (organizationDialog.Dialogtype === "new") {
      let data = {
        "contact": model.contact,
        "email": model.email,
        "name": model.name,
        "designation": model.designation,
        "access": selected,
        "code": form.code
      }

      let mat = JSON.parse(JSON.stringify(staffData));
      let filterMat = mat.filter((mt)=> mt.name.toLowerCase() === model.name.toLowerCase());

      if(filterMat.length > 0){
        console.log("Staff entry already present.")
      }else {
        let temp = {
          _id: FuseUtils.generateGUID(),
          name : model.name,
          role : model.designation
        }
   
        mat.push(temp)
      }

      dispatch(addMember({ organizationId, member: data })).then((response) => {
        if(response.payload.code === 200 && response.payload.message !== 'Member already present '){
          let staffs = mat, values = { staffs };
          // dispatch(updateDataStructure({ id : organizationId, values })).then((response) => {
          // });
        }
      });
      closeComposeDialog();
    } else {
      dispatch(
        updateMember({
          organizationId: organizationId,
          memberId: form._id,
          member: {
            "contact": form.contact,
            "email": form.email,
            "name": form.name,
            "designation": form.designation,
            "access": selected
          },
        })
      );
      let mat = JSON.parse(JSON.stringify(staffData));
      let filterMat = mat.filter((mt)=> mt.name.toLowerCase() === form.name.toLowerCase());

      if(filterMat.length > 0){
        console.log("Staff entry already present.")
      }else {
        let temp = {
          _id: FuseUtils.generateGUID(),
          name : form.name,
          role : form.designation
        }
   
        mat.push(temp)
      }

      let staffs = mat, values = { staffs };
      // dispatch(updateDataStructure({ id : organizationId, values })).then((response) => {
      // });
      closeComposeDialog();
    }
  }

  const handleTabChange =  (event) => {
    const value = event.target.value;
    if (value[value.length - 1] === "all") {
      setSelected(moduleList);
      return;
    }else {
      setSelected(value.filter((v) => v !== 'All'));
    }
  };

  function deleteMembers()
  {
    if(organizationDetails.createdBy === organizationDialog.data._id)
    {
      dispatchWarningMessage(dispatch, "This organization was created by "+organizationDialog.data.name+". You can't delete this member.");
    }else{
     dispatch(
      deleteMember({
        organizationId: organizationId,
        memberId: organizationDialog.data._id,
      })
     );
    handleClose();
    dispatch(closeEditDialog());
    }
  }

  return (
    <>
      <Backdrop className={classes.backdrop} open={loading}>
       <CircularProgress color="inherit" />
      </Backdrop>
      <Dialog
        classes={{
          paper: "m-24",
        }}
        {...organizationDialog.props}
        onClose={closeComposeDialog}
        fullWidth
        maxWidth="xs"
      >
       
        <AppBar position="static" elevation={1}>
          <Toolbar className="flex w-full">
            <Typography variant="subtitle1" color="inherit">
              {organizationDialog.Dialogtype === "new"
                ? "New Member"
                : "Edit Member"}
            </Typography>
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
            {organizationDialog.Dialogtype === "edit" && (
              <Typography variant="h6" color="inherit" className="pt-8">
                {form.name}
              </Typography>
            )}
          </div>
        </AppBar>
        <div className="flex flex-col">
          <Formsy
            onValidSubmit={handleSubmit}
            ref={formRef}
          >
            <DialogContent classes={{ root: "p-24" }}>
              <div className="flex flex-1 flex-col">
                <TextFieldFormsy
                  disabled={organizationDialog.Dialogtype === "edit" ? true : false}
                  className="mb-12"
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
                  disabled={organizationDialog.Dialogtype === "edit" ? true : false}
                  className="mb-12"
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
                  className="mb-12"
                  label="Designation"
                  autoFocus
                  id="designation"
                  name="designation"
                  value={form.designation}
                  onChange={handleChange("designation")}
                  variant="outlined"
                  required
                  fullWidth
                />
                <TextFieldFormsy
                  className="mb-12"
                  validations={{
                    matchRegexp: /^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/,
                  }}
                  validationErrors={{
                    matchRegexp: "Enter valid contact number",
                  }}
                  label="Contact"
                  id="contact"
                  name="contact"
                  onChange={handleChange("contact")}
                  value={form.contact}
                  variant="outlined"
                  fullWidth
                />
                {organizationDialog.Dialogtype === 'new' ? 
                  <FormControl fullWidth variant="outlined" className="mb-12">
                  <InputLabel id="demo-simple-select-outlined-label">
                    Access
                  </InputLabel>
                  <Select
                    fullWidth
                    id="Select module"
                    name="Select module"
                    label="Select Modules"
                    variant="outlined"
                    labelId="mutiple-select-label"
                    multiple
                    value={selected}
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
                :
                (organizationDialog.data !== null ? 
                (details.createdBy === organizationDialog.data._id ?
                 null :
                 <FormControl fullWidth variant="outlined" className="mb-12">
                    <InputLabel id="demo-simple-select-outlined-label">
                      Access
                    </InputLabel>
                    <Select
                      fullWidth
                      id="Select module"
                      name="Select module"
                      label="Select Modules"
                      variant="outlined"
                      labelId="mutiple-select-label"
                      multiple
                      value={selected}
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
                 </FormControl>)
                 :null)
                }
              </div>
            </DialogContent>
            <DialogActions className="justify-start pl-16">
              {organizationDialog.Dialogtype === "new" ? (
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
                    {/* <IconButton
                      variant="contained"
                      color="secondary"
                      onClick={() => {
                        handleClickOpen();
                      }}
                    >
                      <Icon className={classes.delete}>delete</Icon>
                    </IconButton> */}
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
            Are you sure want to remove {form.name}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose()} color="primary">
            NO
          </Button>
          <Button
            onClick={() => {
              deleteMembers()
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

export default OrgMembersDialog;
