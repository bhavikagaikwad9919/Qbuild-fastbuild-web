import React, { useEffect, useCallback, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { Button, TextField } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import ChipInput from "material-ui-chip-input";
import CancelIcon from "@material-ui/icons/Cancel";
import IconButton from "@material-ui/core/IconButton";
import { dispatchWarningMessage } from "app/utils/MessageDispatcher";
import { getData } from "app/main/dataStructure/store/dataSlice";
import { addAgency, updateAgency, closeEditDialog, closeNewDialog, } from 'app/main/organization/store/organizationSlice';

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 3,
    color: '#fff',
  },
}));

const initialState = {
  agencyType:'',
  name: '',
  address: '',
  city: '',
  state: '',
  pincode: '',
  contact: '',
  aadhar: '',
  email: '',
  pan: '',
  gstin: '',
  notes: '',
};

function OrgAgencyDialog(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const organizationDialog = useSelector(({ organizations }) => organizations.orgDialog);
  const organizationId = useSelector(({ organizations }) => organizations.organization._id);
  const loading = useSelector(({ organizations }) => organizations.loading);
  const agencyDetails = useSelector(({ organizations }) => organizations.agencyDetails);
  const agencyType = useSelector(({ dataStructure }) => dataStructure.agencyType);
  const [open, setOpen] = useState(false);
  const [type, setType] = useState('new');
  const [form, setForm] = useState(initialState);
  const [contacts, setContacts] = useState([]);
  
  useEffect(() => {
    dispatch(getData());
  }, [dispatch]);

  const initorganizationDialog = useCallback(() => {
     setOpen(true);
     if (organizationDialog.Dialogtype === 'edit') {
        setType('edit');
      }

     if (organizationDialog.Dialogtype === "edit" && organizationDialog.data) {
      if (agencyDetails !== '') {
        setForm(agencyDetails);
        setContacts(agencyDetails.contact)
      }
     }

    if (organizationDialog.Dialogtype === "new") {
      setType('new');
      setForm(initialState);
      setContacts([]);
    }
  }, [organizationDialog.data, organizationDialog.Dialogtype, agencyDetails, setForm]);

  useEffect(() => {
    if (organizationDialog.props.open) {
      initorganizationDialog();
    }
  }, [organizationDialog.props.open, initorganizationDialog]);

  function handleAddItem(value) {
    setContacts((contacts) => [...contacts, value]);
  }

  function handleDeleteItem(Item, index) {
    setContacts(contacts.filter((item) => item !== Item));
  }


  function closeComposeDialog() {
    organizationDialog.Dialogtype === "edit"
      ? dispatch(closeEditDialog())
      : dispatch(closeNewDialog());
  }

  const handleChange = (prop) => (event) => {
    setForm({ ...form, [prop]: event.target.value });
  };

  const disableButton = () => {
    return (
      form.agencyType.length > 0 &&
      form.name.length > 0 &&
      form.address.length > 0 &&
      form.city.length > 0 &&
      contacts.length > 0
    );
  };

  const handleAdd = () =>{
    form.contact = contacts;

    if(form.aadhar.length > 0){
      if(form.aadhar.length > 12 || form.aadhar.length < 12){
        dispatchWarningMessage(dispatch, "Aadhar no should be 12 digits.")
      }else{
        dispatch(addAgency({ organizationId, form })).then((response) => {
          closeComposeDialog();
        })
      }
    }else{
      dispatch(addAgency({ organizationId, form })).then((response) => {
        closeComposeDialog();
      })
    }
  }

  const handleUpdate = () => {
    let data = {
      address: form.address,
      agencyType: form.agencyType,
      city: form.city,
      contact: contacts,
      createdAt: form.createdAt,
      createdBy: form.createdBy,
      email: form.email,
      gstin: form.gstin,
      name: form.name,
      notes: form.notes,
      pan: form.pan,
      aadhar: form.aadhar,
      pincode: form.pincode,
      preferred: form.preferred,
      projectId: form.projectId,
      services: form.services,
      state: form.state,
      _id: form._id
    }

    if(form.aadhar.length > 0){
      if(form.aadhar.length > 12 || form.aadhar.length < 12){
        dispatchWarningMessage(dispatch, "Aadhar no should be 12 digits.")
      }else{
        dispatch(updateAgency({ organizationId, agencyId: agencyDetails._id, data, })).then((response) => {
          closeComposeDialog();
        })
      }
    }else{
      dispatch(updateAgency({ organizationId, agencyId: agencyDetails._id, data, })).then((response) => {
        closeComposeDialog();
      })
    }
  }

  return (
    <div className='flex flex-1 w-full'>
      <Dialog open={open}  {...organizationDialog.props} fullWidth maxWidth='sm'>
        <Backdrop className={classes.backdrop} open={loading}>
          <CircularProgress color='inherit' />
        </Backdrop>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <Typography variant='subtitle1' className="flex w-full items-center justify-start gap-10" color='inherit'>
              {type === 'new' ? 'Add Agency' : 'Edit Agency'}
            </Typography>
            <IconButton onClick={() => closeComposeDialog()}>
             <CancelIcon style={{ color: "red" }} />
            </IconButton>
          </Toolbar>
        </AppBar>
        <DialogContent>
          <div className='flex flex-1 flex-col gap-12 w-full mt-10'>
            <FormControl variant="outlined" className="mt-8">
              <InputLabel id="demo-simple-select-outlined-label">
                Agency Type
              </InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label"
                required
                id="demo-simple-select-outlined"
                value={form.agencyType}
                onChange={handleChange("agencyType")}
                label="Agency Type"
              >
                {agencyType.map((mem) => (
                  <MenuItem value={mem}> {mem} </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              required
              label='Name'
              variant='outlined'
              value={form.name}
              onChange={handleChange('name')}
            />
            <TextField
              required
              label='Address Line'
              multiline
              rows={2}
              variant='outlined'
              value={form.address}
              onChange={handleChange('address')}
            />
            <TextField
              required
              label='City'
              variant='outlined'
              value={form.city}
              onChange={handleChange('city')}
            />
            <TextField
              label='Pin Code'
              variant='outlined'
              value={form.pincode}
              onChange={handleChange('pincode')}
              type='number'
            />
             <TextField
              label='Aadhar Number'
              variant='outlined'
              value={form.aadhar}
              onChange={handleChange('aadhar')}
              type='number'
            />
            <ChipInput
              id="contacts"
              label="Contacts"
              type='number'
              required
              value={contacts}
              onAdd={(item) => handleAddItem(item)}
              onDelete={(item, index) => handleDeleteItem(item, index)}
              newChipKeyCodes={[13, 188]}
              variant="outlined"
            />
            <TextField
              label='Email'
              variant='outlined'
              value={form.email}
              onChange={handleChange('email')}
            />
            <TextField
              inputProps={{ style: { textTransform: "uppercase" } }}
              label='PAN'
              variant='outlined'
              value={form.pan}
              onChange={handleChange('pan')}
            />
            <TextField
              label='GSTIN (if available)'
              variant='outlined'
              value={form.gstin}
              onChange={handleChange('gstin')}
            />
            <TextField
              label='Notes'
              multiline
              rows={2}
              variant='outlined'
              value={form.notes}
              onChange={handleChange('notes')}
            />
            <div className='flex flex-row gap-10 mb-20 mt-10'>
              {type === 'new' ? (
                <Button
                  variant='contained'
                  color='primary'
                  disabled={!disableButton()}
                  onClick={() => handleAdd()}
                >
                  ADD
                </Button>
              ) : (
                <Button
                  variant='contained'
                  color='primary'
                  onClick={() => handleUpdate() }
                >
                  Save
                </Button>
              )}

              <Button variant='contained' onClick={() => {closeComposeDialog()}}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default OrgAgencyDialog;
