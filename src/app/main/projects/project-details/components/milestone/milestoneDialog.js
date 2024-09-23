import React, { useEffect, useCallback, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { Button, TextField, InputLabel, IconButton, } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { DatePicker } from "@material-ui/pickers";
import { addMilestone, updateMilestone,  closeEditDialog, closeNewDialog, } from 'app/main/projects/store/projectsSlice';
import moment from "moment";
import CancelIcon from "@material-ui/icons/Cancel";

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
  title: '',
  description: '',
  startDate: new Date(),
  endDate: new Date(),
};

function MilestoneDialog(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const projectId = useSelector(({ projects }) => projects.details._id);
  const loading = useSelector(({ projects }) => projects.loading);
  const milestoneDetails = useSelector(({ projects }) => projects.milestones.detailMilestone);
  const [open, setOpen] = useState(false);
  const [type, setType] = useState('new');
  const [form, setForm] = useState(initialState);
  const projectDialog = useSelector(({ projects }) => projects.projectDialog); 
  const [selectedDate, setSelectedDate] = useState({
    startDate: new Date(),
    endDate: new Date(),
  }); 

  const initprojectDialog = useCallback(() => {
     setOpen(true);
      if (projectDialog.Dialogtype === 'edit') {
        setType('edit');
      }

      if (projectDialog.Dialogtype === "edit" && projectDialog.data) {
        if (milestoneDetails !== '') {
          setForm(milestoneDetails);
          setSelectedDate({
            startDate:milestoneDetails.startDate,
            endDate:milestoneDetails.endDate,
          })
        }
      }
      if (projectDialog.Dialogtype === "new") {
       setType('new');
       setForm(initialState);
      }
  }, [projectDialog.data, projectDialog.Dialogtype, milestoneDetails, setForm]);

  useEffect(() => {
    if (projectDialog.props.open) {
      initprojectDialog();
    }
  }, [projectDialog.props.open, initprojectDialog]);

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

  const disableButton = () => {
    return (
      form.title.length > 0 
    );
  };

  const handleSubmit = () =>{
    let data = {
      title: form.title,
      description: form.description, 
      startDate: moment(selectedDate.startDate).format("YYYY-MM-DD"),
      endDate: moment(selectedDate.endDate).format("YYYY-MM-DD"),
    }

    dispatch(addMilestone({ projectId, data })).then((response) => {
      setSelectedDate({
        startDate: new Date(),
        endDate: new Date(),
      });
      closeComposeDialog();
    })
  }

  const handleUpdate = () =>{
    let data = {
      title: form.title,
      description: form.description, 
      startDate: moment(selectedDate.startDate).format("YYYY-MM-DD"),
      endDate: moment(selectedDate.endDate).format("YYYY-MM-DD"),
      createdBy: form.createdBy,
      createdDate : form.createdDate
    }

    dispatch(updateMilestone({ projectId, data, milestoneId: milestoneDetails._id })).then((response) => {
      setSelectedDate({
        startDate: new Date(),
        endDate: new Date(),
      });
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
              {type === 'new' ? 'Add Milestone' : 'Edit Milestone'}
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
              label='Title'
              variant='outlined'
              value={form.title}
              onChange={handleChange('title')}
            />
            <TextField
              label='Description'
              multiline
              rows={2}
              variant='outlined'
              value={form.description}
              onChange={handleChange('description')}
            />
             <InputLabel>Select Date</InputLabel>
             <div className="flex flex-row mt-10 mb-10 gap-10">
                <DatePicker
                  inputVariant="outlined"
                  required
                  label="Start Date"
                  format="DD MMM yyyy"
                  value={selectedDate.startDate}
                  onChange={handleDateChange("startDate")}
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                />
                <DatePicker
                  inputVariant="outlined"
                  required
                  label="End Date"
                  format="DD MMM yyyy"
                  minDate={selectedDate.startDate}
                  value={selectedDate.endDate}
                  onChange={handleDateChange("endDate")}
                  KeyboardButtonProps={{
                      "aria-label": "change date",
                  }}
                />
             </div>    
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
              ) : (
                <Button
                  variant='contained'
                  color='primary'
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

export default MilestoneDialog;
