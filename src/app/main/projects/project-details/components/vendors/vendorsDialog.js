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
import CancelIcon from "@material-ui/icons/Cancel";
import IconButton from "@material-ui/core/IconButton";
import ChipInput from "material-ui-chip-input";
import Autocomplete from '@material-ui/lab/Autocomplete';
import { dispatchWarningMessage } from "app/utils/MessageDispatcher";
import { addVendor, updateVendor,  closeEditDialog, closeNewDialog, } from 'app/main/projects/store/projectsSlice';
import { getAgencies } from "app/main/organization/store/organizationSlice";

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

function VendorsDialog(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const projectId = useSelector(({ projects }) => projects.details._id);
  const loading = useSelector(({ projects }) => projects.loading);
  const vendorDetails = useSelector(({ projects }) => projects.vendors.detailVendor);
  const vendors = useSelector(({ projects }) => projects.vendors.vendorsList);
  const [open, setOpen] = useState(false);
  const [vendor, setVendor] = useState(initialState);
  const [type, setType] = useState('new');
  const [form, setForm] = useState(initialState);
  const projectDialog = useSelector(({ projects }) => projects.projectDialog);
  const agency = useSelector( ({ organizations }) => organizations.agency);
  const orgDetails = useSelector(({ organizations }) => organizations.organization);
  const agencyType = useSelector(({ dataStructure }) => dataStructure.agencyType);
  const [contacts, setContacts] = useState([]);
  const [add, setAdd] = useState(false);
  const [agencyList, setAgencyList] = useState([]);

  useEffect(()=>{
    const unmatched = agency.filter(ven => !vendors.some(agn => ven._id === agn._id));
    setAgencyList(unmatched);
  }, [agency, vendors])

  const initprojectDialog = useCallback(() => {
    /**
     * projectDialog type: 'edit'
     */
     setOpen(true);
      if (projectDialog.Dialogtype === 'edit') {
        setType('edit');
      }

    if (projectDialog.Dialogtype === "edit" && projectDialog.data) {
      if (vendorDetails !== '') {
        setForm(vendorDetails);
        setContacts(vendorDetails.contact)
      }
    }

    /**
     * projectDialog type: 'new'
     */
    if (projectDialog.Dialogtype === "new") {
      setType('new');
      setForm(initialState);
      setContacts([]);
    }
  }, [projectDialog.data, projectDialog.Dialogtype, vendorDetails, setForm]);

  useEffect(() => {
    if (projectDialog.props.open) {
      initprojectDialog();
    }
  }, [projectDialog.props.open, initprojectDialog]);

  // const handleClose = () => {
  //   setOpen(false);
  //   props.close();
  // };

  function closeComposeDialog() {
    setAdd(false);
    setVendor(initialState);
    setForm(initialState);
    projectDialog.Dialogtype === "edit"
      ? dispatch(closeEditDialog())
      : dispatch(closeNewDialog());
  }

  const handleChange = (prop) => (event) => {
    if(event.target.value !== undefined){
      setForm({ ...form, [prop]: event.target.value });
    }
  };

  function handleAddItem(value) {
    let temp = [...contacts, value];
    setForm({ ...form, contact: temp });
    setContacts((contacts) => [...contacts, value]);
  }

  function handleDeleteItem(Item, index) {
    let temp = contacts.filter((item) => item !== Item);
    setForm({ ...form, contact: temp });
    setContacts(contacts.filter((item) => item !== Item));
  }

  function callVendor(data){
    let tempData = {};
    tempData = JSON.parse(JSON.stringify(data));
    tempData.from = "Select";
    setVendor(tempData);
    setForm({ ...form, 'agencyType': data.agencyType });
  }

  const disableButton = () => {
    return (
      form.agencyType.length > 0 &&
      form.name.length > 0 &&
      contacts.length > 0 &&
      form.city.length > 0 
    ) || (
      vendor.agencyType.length > 0 &&
      vendor.name.length > 0 &&
      vendor.contact.length > 0 &&
      vendor.city.length > 0 
    );
  };

  const handleAdd = () =>{
    if(vendor.organizationId === undefined || vendor.organizationId === null){
      form.contact = contacts;
      form.projectId = [];
      form.organizationId = orgDetails._id;
      if(form.aadhar.length > 0){
        if(form.aadhar.length > 12 || form.aadhar.length < 12){
          dispatchWarningMessage(dispatch, "Aadhar no should be 12 digits.")
        }else{
          dispatch(addVendor({ projectId, vendor: form})).then((res) => {
            dispatch(getAgencies(orgDetails._id));
            closeComposeDialog();
          })
        }
      }else{
        dispatch(addVendor({ projectId, vendor: form})).then((res) => {
          dispatch(getAgencies(orgDetails._id));
          closeComposeDialog();
        })
      }
    }else{
      dispatch(addVendor({ projectId, vendor})).then((res) => {
        dispatch(getAgencies(vendor.organizationId));
        closeComposeDialog();
      })
    }
  }

  const handleUpdate = () =>{
    let filterAgency = agency.filter((agen)=> agen._id !== vendorDetails._id)
    let findAgency = filterAgency.filter((agen)=> agen.name === form.name && agen.agencyType === form.agencyType)

    if(findAgency.length > 0){
      dispatchWarningMessage(dispatch, "Agency name with the type is already present, Please Check.")
    }else{
      dispatch(
        updateVendor({
          projectId,
          vendorId: vendorDetails._id,
          form,
        })).then((response) => {
          dispatch(getAgencies(orgDetails._id));
          closeComposeDialog();
        }
      )
    }
  }

  return (
    <div className='flex flex-1 w-full'>
      <Dialog open={open}  {...projectDialog.props} fullWidth maxWidth='sm'>
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
          {type === 'edit' ?
          <>
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
          </>
          :
          agencyList.length  && add === false  ? (
            <>
            <FormControl variant="outlined" className="mt-8">
              <Autocomplete
                value={vendor}
                onChange={(event, value) => {
                  if(value !== null && value !== undefined){
                    callVendor(value)
                  }
                }}
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                id="free-solo-with-text-demo"
                options={agencyList}
                getOptionLabel={(option) => {
                  return option.name + " " + option.agencyType;
                }}
                freeSolo
                renderInput={(params) => (
                  <TextField {...params} label="Select Agency" variant="outlined" />
                )}
              />
              <div className="flex justify-start mt-12 mb-12">
                <Typography className="font-bold cursor-pointer mr-10" color="secondary" onClick={()=> {
                  setAdd(true)
                  setVendor(initialState)
                  setForm({ ...form, 'from': 'form' });
                }}>
                 Click Here
                </Typography>
                <Typography> - To Add New Agency if Agency not found in dropdown list.</Typography>
              </div>
            </FormControl>
            </>
          ): (
            <>
              <FormControl variant="outlined" className="mt-8">
                <InputLabel id="demo-simple-select-outlined-label"> Agency Type </InputLabel>
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
            </>
          )}  
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
                  disabled={!disableButton()}
                  onClick={() =>
                    handleUpdate()
                  }
                >
                  Update
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

export default VendorsDialog;
