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
  Icon,
  IconButton
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
  deleteSite,
  addSite,
  updateSite
} from "app/main/organization/store/organizationSlice";
import { useDispatch, useSelector } from "react-redux";
import { dispatchWarningMessage } from "app/utils/MessageDispatcher";

const defaultFormState = {
  id: "",
  name: "",
  address: "",
  reraNo: "",
  ctsNo: "",
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

function OrgSitesDialog(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const organizationDialog = useSelector(({ organizations }) => organizations.orgDialog);
  const organizationId = useSelector(({ organizations }) => organizations.organization._id);
  const organizationDetails = useSelector(({ organizations }) => organizations.organization);
  const loading = useSelector(({ organizations }) => organizations.loading);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(defaultFormState);
  const formRef = useRef(null);

  const initorganizationDialog = useCallback(() => {
    if (organizationDialog.Dialogtype === "edit" && organizationDialog.data) {
      setForm({ ...organizationDialog.data });
    }

    if (organizationDialog.Dialogtype === "new") {
      setForm({
        ...defaultFormState,
        ...organizationDialog.data,
        id: FuseUtils.generateGUID(),
      });
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
      form.name.length > 0 && form.address.length > 0 && form.ctsNo.length > 0
    );
  }

  function handleSubmit(model) {
    if (organizationDialog.Dialogtype === "new") {
      let data = {
        "name": model.name,
        "address": model.address,
        "reraNo": model.reraNo,
        "ctsNo": model.ctsNo,
      }
      dispatch(addSite({ organizationId, site: data }));
      closeComposeDialog(); 
    }else {
      dispatch(
        updateSite({
          organizationId: organizationId,
          siteId: form._id,
          site: {
            "address": form.address,
            "name": form.name,
            "reraNo": form.reraNo,
            "ctsNo": form.ctsNo
           },
      }))
      closeComposeDialog(); 
    }
  }

  function deleteSites()
  {
    if(organizationDetails.createdBy === organizationDialog.data._id)
    {
      dispatchWarningMessage(dispatch, "This organization was created by "+organizationDialog.data.name+". You can't delete this site.");
    }else{
     dispatch(
      deleteSite({
        organizationId: organizationId,
        siteId: organizationDialog.data._id,
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
                ? "New Site"
                : "Edit Site"}
            </Typography>
          </Toolbar>
        </AppBar>
        <div className="flex flex-col">
          <Formsy
            onValidSubmit={handleSubmit}
            ref={formRef}
          >
            <DialogContent classes={{ root: "p-24" }}>
              <div className="flex flex-1 flex-col">
                <TextFieldFormsy
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
                <div class="grid grid-cols-2 divide-x divide-gray-400">
                 <TextFieldFormsy
                    className="w-3/4 mb-24"
                    label="Rera No"
                    autoFocus
                    id="reraNo"
                    name="reraNo"
                    value={form.reraNo}
                    onChange={handleChange("reraNo")}
                    variant="outlined"
                 />
                 <TextFieldFormsy
                    className="w-3/4 mb-24"
                    label="CTS No"
                    autoFocus
                    id="ctsNo"
                    name="ctsNo"
                    value={form.ctsNo}
                    onChange={handleChange("ctsNo")}
                    variant="outlined"
                    required
                 />
                </div> 
                <TextFieldFormsy
                  className="mb-24"
                  label="Address"
                  autoFocus
                  id="address"
                  name="address"
                  value={form.address}
                  onChange={handleChange("address")}
                  variant="outlined"
                  required
                  multiline
                  rows={2}
                  fullWidth
                />
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
        <DialogTitle id="alert-dialog-title">Delete Site</DialogTitle>
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
              deleteSites()
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

export default OrgSitesDialog;
