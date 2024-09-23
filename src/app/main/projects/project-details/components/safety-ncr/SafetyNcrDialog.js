import React, { useEffect, useRef, useCallback, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import {  Button, TextField, IconButton, Accordion, AccordionSummary, AccordionDetails, Grid, Icon } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { DatePicker } from "@material-ui/pickers";
import { addSafetyData, updateSafetyData, closeEditDialog, closeNewDialog, } from 'app/main/projects/store/projectsSlice';
import moment from "moment";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import CancelIcon from "@material-ui/icons/Cancel";
import ClearIcon from "@material-ui/icons/Clear";
import Autocomplete from '@material-ui/lab/Autocomplete';
import { dispatchWarningMessage } from "app/utils/MessageDispatcher";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

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
  refNo: '',
  description: '',
  status: '',
  age:'',
  reminder: 0,
  reminderWhom: [],
  ncrDoc: [],
};

function SafetyNcrDialog(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const projectId = useSelector(({ projects }) => projects.details._id);
  const loading = useSelector(({ projects }) => projects.loading);
  const safetyNcrDetails = useSelector(({ projects }) => projects.safetyNcrs.detailSafetyNcr);
  const [open, setOpen] = useState(false);
  const [type, setType] = useState('new');
  const [form, setForm] = useState(initialState);
  const projectDialog = useSelector(({ projects }) => projects.projectDialog);
  const [newMembers, setNewMembers] = useState([]);
  const [selectedDate, setSelectedDate] = useState({
    issueDate: new Date(),
    closingDate: null,
    reminderDate : new Date(),
  }); 

  const members = useSelector(({ projects }) => projects.details.team);
  const inputfile = useRef(null);
  const onButtonClick = () => {
    inputfile.current.click();
  };
  const [deleteImages, setDeleteImages] =  useState([]);
  const user = useSelector(({ auth }) => auth.user);
  const team = useSelector(({ projects }) => projects.details.team);
  const [hide, setHide] = useState(false);


  let date = new Date();
  let today = moment(date).format("DD MMM yyyy");
  const initprojectDialog = useCallback(() => {
     setOpen(true);
     let tempMem = [];
      if (projectDialog.Dialogtype === 'edit') {
        setType('edit');
      }

      if (projectDialog.Dialogtype === "edit" && projectDialog.data) {
        if (safetyNcrDetails !== '') {
          setForm(safetyNcrDetails);
          setSelectedDate({
            issueDate:safetyNcrDetails.issueDate,
            closingDate:safetyNcrDetails.closingDate === undefined ? null : safetyNcrDetails.closingDate,
            reminderDate:safetyNcrDetails.closingDate === undefined ? null : safetyNcrDetails.reminderDate,
          })

            members.forEach((mem)=>{
              tempMem.push({
                name : mem.name,
                email: mem.email
              })
            })
          setNewMembers(tempMem)
        }
      }
      if (projectDialog.Dialogtype === "new") {
       setType('new');
       setForm(initialState);
      }
  }, [projectDialog.data, projectDialog.Dialogtype, safetyNcrDetails, setForm]);

  useEffect(() => {
    let tempMem = [];
    if (projectDialog.props.open) {
      initprojectDialog();
    }

    if (projectDialog.Dialogtype === 'new') {
      members.forEach((mem)=>{
        tempMem.push({
          name : mem.name,
          email: mem.email
        })
      })

      setNewMembers(tempMem)
    }
  }, [projectDialog.props.open, initprojectDialog]);

  useEffect(() => {
    team.forEach((t)=>{
      if(t._id === user.data.id && t.role === "CIDCO Official"){
        setHide(true)
      }
   })
  }, [user.data.id, team]);

  const handleDateChange = (prop) => (date) => {
    setSelectedDate({ ...selectedDate, [prop]: date });
  };

  function closeComposeDialog() {
    setForm(initialState);
    projectDialog.Dialogtype === "edit"
      ? dispatch(closeEditDialog())
      : dispatch(closeNewDialog());
  }

  const handleChange = (prop) => (event) => {
    setForm({ ...form, [prop]: event.target.value });
  };

  const callMem = (newMem) =>{
    setForm({ ...form, 'reminderWhom': newMem });
  }

  const handleUploadChange = (event) => {
    const choosedFile = Array.from(event.target.files);
    let newFile = [];
    choosedFile.forEach((file)=>{
      newFile.push(file)
    })
    setForm({ ...form, ncrDoc: newFile });
  };

  function deleteFirstData(id) {
    let newFile = [], deleteFile = [];

    form.ncrDoc.forEach((item, ids)=>{
      if(type === 'edit'){
        if(ids !== id){
          newFile.push(item)
        }else if(item._id !== undefined){
          deleteImages.forEach((img)=>{
            deleteFile.push(img)
          })
          deleteFile.push(item)
          setDeleteImages(deleteFile);
        } 
      }else{
        if(ids !== id){
          newFile.push(item)
        } 
      }
    })
    setForm({ ...form, ncrDoc: newFile });
  }

  const disableButton = () => {
    if(selectedDate.closingDate === null){
      return (
        form.refNo.length > 0 &&
        form.description.length &&
        form.reminder >= 0 &&
        form.reminderWhom.length > 0
      );
    }else{
      return (
        form.refNo.length > 0 &&
        form.description.length
      );
    } 
  };

  const handleSubmit = () =>{
    if(selectedDate.closingDate === null){
      if(moment(selectedDate.issueDate).format("YYYY-MM-DD") === 'Invalid date'){
        dispatchWarningMessage(dispatch, "Please check the date.");
      }else{
        let data = new FormData();
        form.ncrDoc.forEach((file)=>{
          data.append("file", file);
        })

        data.set("refNo",form.refNo);
        data.set("description", form.description); 
        data.set("issueDate" ,moment(selectedDate.issueDate).format("YYYY-MM-DD"));
        data.set("status", 'Open');
        data.set("reminder", form.reminder);
        data.set("reminderWhom", JSON.stringify(form.reminderWhom));
        data.set("reminderDate", moment(selectedDate.issueDate).add(form.reminder, 'day').format("YYYY-MM-DD"));
        data.set("projectId", projectId);

        dispatch(addSafetyData({ projectId, data })).then((response) => {
          setSelectedDate({
            issueDate: new Date(),
            closingDate: null,
            reminderDate: new Date(),
          });
          closeComposeDialog();
        })
      }
     
    }else{
      if(moment(selectedDate.issueDate).format("YYYY-MM-DD") === 'Invalid date' || moment(selectedDate.closingDate).format("YYYY-MM-DD") === 'Invalid date'){
        dispatchWarningMessage(dispatch, "Please check the date.");
      }else{
        let data = new FormData();
        form.ncrDoc.forEach((file)=>{
          data.append("file", file);
        })

        data.set("refNo",form.refNo);
        data.set("description", form.description); 
        data.set("issueDate" ,moment(selectedDate.issueDate).format("YYYY-MM-DD"));
        data.set("closingDate", moment(selectedDate.closingDate).format("YYYY-MM-DD"));
        data.set("status", 'Closed');
        data.set("reminder", form.reminder);
        data.set("reminderWhom", JSON.stringify(form.reminderWhom));
        data.set("reminderDate", moment(selectedDate.issueDate).add(form.reminder, 'day').format("YYYY-MM-DD"));
        data.set("projectId", projectId);

        dispatch(addSafetyData({ projectId, data })).then((response) => {
          setSelectedDate({
            issueDate: new Date(),
            closingDate: null,
            reminderDate: new Date()
          });
          closeComposeDialog();
        })
      } 
    }
  }

  const handleUpdate = () =>{

    if(selectedDate.closingDate === null){
      if(moment(selectedDate.issueDate).format("YYYY-MM-DD") === 'Invalid date'){
        dispatchWarningMessage(dispatch, "Please check the date.");
      }else{
        let data = new FormData(), bfi = [];
        form.ncrDoc.forEach((file)=>{
          if(file._id === undefined){
            data.append("file", file);
          }else{
            bfi.push({name: file.name, pictureUrl: file.pictureUrl, size: file.size})
          } 
        })

        data.set("refNo", form.refNo);
        data.set("description", form.description);
        data.set("issueDate", moment(selectedDate.issueDate).format("YYYY-MM-DD"));
        data.set("status", 'Open');
        data.set("reminder", form.reminder);
        data.set("reminderWhom", JSON.stringify(form.reminderWhom))
        data.set("reminderDate", moment(selectedDate.issueDate).add(form.reminder, 'day').format("YYYY-MM-DD"));
        data.set("projectId", projectId);
        data.set("removeImages", JSON.stringify(deleteImages));
        data.set("ncrDoc", JSON.stringify(bfi))

        dispatch(updateSafetyData({ projectId, data, safetyDataId: safetyNcrDetails._id })).then((response) => {
          setSelectedDate({
            issueDate: new Date(),
            closingDate: null,
            reminderDate: new Date()
          });
          setDeleteImages([]);
          closeComposeDialog();
        })
      }
    }else{
      if(moment(selectedDate.issueDate).format("YYYY-MM-DD") === 'Invalid date' || moment(selectedDate.closingDate).format("YYYY-MM-DD") === 'Invalid date'){
        dispatchWarningMessage(dispatch, "Please check the datet.");
      }else{
        let data = new FormData(), bfi = [];
        form.ncrDoc.forEach((file)=>{
          if(file._id === undefined){
            data.append("file", file);
          }else{
            bfi.push({name: file.name, pictureUrl: file.pictureUrl, size: file.size})
          } 
        })

        data.set("refNo", form.refNo);
        data.set("description", form.description);
        data.set("issueDate", moment(selectedDate.issueDate).format("YYYY-MM-DD"));
        data.set("closingDate", moment(selectedDate.closingDate).format("YYYY-MM-DD"));
        data.set("status", "Closed");
        data.set("reminder", form.reminder);
        data.set("reminderWhom", JSON.stringify(form.reminderWhom));
        data.set("reminderDate", moment(selectedDate.issueDate).add(form.reminder, 'day').format("YYYY-MM-DD"));
        data.set("projectId", projectId);
        data.set("removeImages", JSON.stringify(deleteImages));
        data.set("ncrDoc", JSON.stringify(bfi))

        dispatch(updateSafetyData({ projectId, data, safetyDataId: safetyNcrDetails._id })).then((response) => {
          setSelectedDate({
            issueDate: new Date(),
            closingDate: null,
            reminderDate: new Date()
          });
          setDeleteImages([]);
          closeComposeDialog();
        })
      }
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
              {type === 'new' ? 'Add Data' : 'Edit Data'}
            </Typography>
            <IconButton onClick={() => closeComposeDialog()}>
              <CancelIcon style={{ color: "red" }} />
            </IconButton>
          </Toolbar>
        </AppBar>
        <DialogContent>
          <div className='flex flex-1 flex-col gap-12 w-full mt-10'>
          <Accordion variant="outlined">
             <AccordionSummary
               expandIcon={<ExpandMoreIcon />}
               aria-controls="panel1a-content"
               id="panel1a-header"
             >
               <Typography color="textPrimary">NCR Document</Typography>
             </AccordionSummary>
             <AccordionDetails>
               <div className="flex flex-col w-full">
                 <List
                   component="nav"
                   // className={classes.root}
                   aria-label="mailbox folders"
                 >
                   {form.ncrDoc.map((item,id) => (
                     <React.Fragment>
                       <Grid container alignItems="center" direction="row">
                         <Grid item xs={11}>
                           <ListItem
                             button
                           >
                             <ListItemText
                                primary={item.name}
                             />
                           </ListItem>
                         </Grid>
                         <Grid item xs={1}>
                         <IconButton
                           onClick={() => deleteFirstData(id)}
                           variant="containedhandleUploadChange"
                         >
                           <Icon className={classes.delete}>delete</Icon>
                         </IconButton>
                        </Grid>
                      </Grid>
                    </React.Fragment>
                   ))}
                </List>
                <div className="mt-10">
                  <input
                   accept='application/pdf'
                   ref={inputfile}
                   multiple={false}
                   className='hidden'
                   id='button-file'
                   type='file'
                   onChange={handleUploadChange}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={form.ncrDoc.length}
                    onClick={onButtonClick}
                  >
                    Upload
                  </Button>
                </div>
              </div>
            </AccordionDetails>
          </Accordion> 
        
            <TextField
              required
              label='Ref No.'
              variant='outlined'
              value={form.refNo}
              onChange={handleChange('refNo')}
            />
            <TextField
              label='Description'
              multiline
              rows={5}
              variant='outlined'
              value={form.description}
              onChange={handleChange('description')}
            />
  
            <div className="grid grid-cols-2 divide-x divide-gray-400 mt-8">
              <DatePicker
                inputVariant="outlined"
                required
                className="w-1 mr-10"
                label="Issue Date"
                format="DD MMM yyyy"
                value={selectedDate.issueDate}
                maxDate={today}
                onChange={handleDateChange("issueDate")}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
                InputAdornmentProps={{
                  position: "start"
                }}
              />
              <DatePicker
                inputVariant="outlined"
                className="w-1 ml-10 mr-10"
                label="Closed Date"
                format="DD MMM yyyy"
                minDate={selectedDate.issueDate}
                maxDate={today}
                value={selectedDate.closingDate}
                onChange={handleDateChange("closingDate")}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={() => setSelectedDate({ ...selectedDate, 'closingDate': null })}>
                      <ClearIcon />
                    </IconButton>
                  )
                }}
                InputAdornmentProps={{
                  position: "start"
                }}
              />
            </div> 

            <TextField
              required
              label='Reminder (In Days)'
              variant='outlined'
              // className="w-1/3 mr-10"
              value={form.reminder}
              type="Number"
              onChange={handleChange('reminder')}
            />

            <Autocomplete
              value = {form.reminderWhom}
              multiple
              id="tags-outlined"
              filterSelectedOptions
              options={newMembers}
              getOptionLabel={(option) => option.name}
              getOptionSelected={(option, value) => option.name === value.name}
              onChange={(event, newValue) => { 
                callMem(newValue);
              }}
              renderOption={(option) =>{
                if(option.name === undefined){
                    return option.name;
                }else{
                  return option.name;
                }
              }}
              
              renderInput={(params) => (
                <TextField
                  required
                  {...params}
                  label="Reminds Whom"
                  variant="outlined"
                />
              )}
            />
            
            <div className='flex flex-row gap-10 mb-20 mt-10'>
              {type === 'new' ? (
                <Button
                  variant='contained'
                  color='primary'
                  disabled={!disableButton()}
                  onClick={() =>
                   handleSubmit()
                  }
                >
                  ADD
                </Button>
              ) : (hide === true ? null :
                <Button
                  variant='contained'
                  color='primary'
                  disabled={!disableButton()}
                  onClick={() => handleUpdate()}
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

export default SafetyNcrDialog;
