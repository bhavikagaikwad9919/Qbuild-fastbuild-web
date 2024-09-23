import React, { useEffect, useCallback, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { Button, TextField, InputLabel } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import DateFnsUtils from "@date-io/date-fns";
import { addIr, updateIr,  closeEditDialog, closeNewDialog, } from 'app/main/projects/store/projectsSlice';
import moment from "moment";
import { dispatchWarningMessage } from "app/utils/MessageDispatcher";
import CancelIcon from "@material-ui/icons/Cancel";
import IconButton from '@material-ui/core/IconButton';
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import ClearIcon from "@material-ui/icons/Clear";

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 3,
    color: '#fff',
  },
  taskCompleteButton: {
    color: "#fff",
    backgroundColor: "#4caf50",
    border: "none",
    "&:hover": {
      color: "#fff",
      backgroundColor: "#58c55c",
      border: "none",
    },
  },
}));

const initialState = {
  irsNo: '',
  irDate: new Date(),
  activity:'',
  location: '',
  floor: '',
  compliance: 'BALANCE',
  ssaCheck: 'BALANCE',
  items: '',
  remarks: '',
  status: 'OPEN',
};

function IrDialog(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const projectId = useSelector(({ projects }) => projects.details._id);
  const loading = useSelector(({ projects }) => projects.loading);
  const irDetails = useSelector(({ projects }) => projects.irs.detailIr);
  const irs = useSelector(({ projects }) => projects.irs.irList);
  const [open, setOpen] = useState(false);
  const [type, setType] = useState('new');
  const [form, setForm] = useState(initialState);
  const projectDialog = useSelector(({ projects }) => projects.projectDialog); 
  const userId = useSelector(({ auth }) => auth.user.data.id)
  const [rId, setRId] = useState('');
  const [hide, setHide] = useState(false);
  const team = useSelector(({ projects }) => projects.details.team);
  const user = useSelector(({ auth }) => auth.user);
  let today = new Date()
  
  const initprojectDialog = useCallback(() => {
    setOpen(true);
    if (projectDialog.Dialogtype === 'edit') {
      setType('edit');
    }

    if (projectDialog.Dialogtype === "edit" && projectDialog.data) {
      if (irDetails !== '') {
        setForm(irDetails);     
      }
    }
    if (projectDialog.Dialogtype === "new") {
      setType('new');
      setForm(initialState);
    }
  }, [projectDialog.data, projectDialog.Dialogtype, setForm]);

  useEffect(() => {
    if (projectDialog.props.open) {
      initprojectDialog();
    }
  }, [projectDialog.props.open, initprojectDialog]);

  useEffect(() => {
    team.forEach((t)=>{
      if(t._id === user.data.id && t.role === "CIDCO Official"){
        setHide(true)
      }
   })
  }, [user.data.id, team])

  function closeComposeDialog() {
    setForm(initialState);
    projectDialog.Dialogtype === "edit"
      ? dispatch(closeEditDialog())
      : dispatch(closeNewDialog());
  }

  const handleChange = (prop) => (event) => {
      setForm({ ...form, [prop]: event.target.value });
  };

  const handleDateChange = (prop) => (date) => {
    setForm({ ...form, [prop]: date });
  };

  const disableButton = () => {
    return (
      form.irsNo.length > 0 
      // && form.activity.length > 0 
      // && form.location.length > 0 
      // && form.floor.length > 0
    );
  };

  const handleSubmit = () =>{
    let data = { 
      irsNo: form.irsNo,
      irDate: form.irDate,
      activity: form.activity,
      location: form.location,
      floor: form.floor,
      compliance: form.compliance,
      ssaCheck: form.ssaCheck,
      items: form.items,
      status: form.status,
      remarks: form.remarks,
      projectId: projectId,
      folderId : props.data._id,
      addedBy: userId,
      addedDate: new Date()
    }

    dispatch(addIr({ projectId, folderId : props.data._id,  data })).then((response) => {
      setForm(initialState);
      closeComposeDialog();
    })
  }

  const handleUpdate = () =>{
    let data = { 
      irsNo: form.irsNo,
      irDate: form.irDate,
      activity: form.activity,
      location: form.location,
      floor: form.floor,
      compliance: form.compliance,
      ssaCheck: form.ssaCheck,
      items: form.items,
      status: form.status,
      remarks: form.remarks,
      projectId: projectId,
      folderId : props.data._id,
      updatedBy: userId,
      updatedDate: new Date()
    }
      dispatch(updateIr({ projectId, irId: irDetails._id, data, folderId: props.data._id })).then((response) => {
        setForm(initialState);
        closeComposeDialog();
      })
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
              {type === 'new' ? 'Add IR' : 'Edit IR'}
            </Typography>
            <IconButton onClick={() => closeComposeDialog()}>
              <CancelIcon style={{ color: "red" }} />
            </IconButton>
          </Toolbar>
        </AppBar>
        <DialogContent>
          <div className='flex flex-1 flex-col gap-12 w-full mt-10'>
            <TextField
              required
              label='IRS No'
              variant='outlined'
              value={form.irsNo}
              //disabled={ type === 'edit' ? true : false}
              onChange={handleChange('irsNo')}
            />

            <div className="grid grid-cols-2 divide-x divide-gray-400 mt-8">
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <DatePicker
                  required
                  label="Date"
                  className="w-1 mr-10"
                  format="dd/MM/yyyy"
                  maxDate={today}
                  value={form.irDate}
                  onChange={handleDateChange("irDate")}
                  inputVariant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </MuiPickersUtilsProvider>    
              <TextField
               variant="outlined"
               //required
               label="Activity"
               className="w-1 mr-10 ml-10"
               value={form.activity}
               onChange={handleChange("activity")}
              />
            </div>

            <div className="grid grid-cols-2 divide-x divide-gray-400 mt-8">
               <TextField
               variant="outlined"
               //required
               label="Location"
               className="w-1 mr-10"
               value={form.location}
               onChange={handleChange("location")}
              />    
              <TextField
               variant="outlined"
               //required
               label="Floor"
               className="w-1 ml-10 mr-10"
               value={form.floor}
               onChange={handleChange("floor")}
              />
            </div>

            <div class="grid grid-cols-2 divide-x divide-gray-400">
             <FormControl variant="outlined"  className="w-1 mr-10">
              <InputLabel id="demo-simple-select-outlined-label">
                Post Checking By SSA
              </InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={form.ssaCheck}
                onChange={handleChange("ssaCheck")}
                label="Post Checking By SSA"
              >
                <MenuItem value="DONE">DONE</MenuItem>
                <MenuItem value="BALANCE">BALANCE</MenuItem>
              </Select>
             </FormControl>

             <FormControl variant="outlined"  className="w-1">
               <InputLabel id="demo-simple-select-outlined-label"  className="w-1 mr-10 ml-10">
                 COMPLIANCE FROM SPCPL
               </InputLabel>
               <Select
                 labelId="demo-simple-select-outlined-label"
                 id="demo-simple-select-outlined"
                 value={form.compliance}
                 className="w-1 mr-10 ml-10"
                 onChange={handleChange("compliance")}
                 label="COMPLIANCE FROM SPCPL"
               >
                  <MenuItem value="DONE">DONE</MenuItem>
                  <MenuItem value="BALANCE">BALANCE</MenuItem>
               </Select>
             </FormControl>
            </div>

            <TextField
              label='Items Inspected'
              variant='outlined'
              multiline
              rows={2}
              value={form.items}
              onChange={handleChange('items')}
            />

            <TextField
              label='Remarks'
              variant='outlined'
              multiline
              rows={2}
              value={form.remarks}
              onChange={handleChange('remarks')}
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
              ) : ( hide === true ? null :
                <Button
                  variant='contained'
                  color='primary'
                  disabled={!disableButton()}
                  onClick={() => handleUpdate()}
                >
                  Update
                </Button>
              )}
              <Button variant='contained' onClick={() => {closeComposeDialog()}}>
                Close
              </Button>
              <div className="flex flex-1 justify-end">
              {loading.status ? (
                <CircularProgress className="mr-60" color="inherit" size={20} />
              ) :( hide === true ? null :
                <Button
                  variant="outlined"
                  color="primary"
                  className={
                    form.status === 'CLOSED' ? classes.taskCompleteButton : null
                  }
                  onClick={() => {form.status === 'CLOSED' ? setForm({ ...form, status: "OPEN"}):setForm({ ...form, status: "CLOSED"})}}
                >
                  {form.status === 'CLOSED' ? "Mark as Open" : "Mark as Closed"}
                </Button>
              )}
            </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default IrDialog;