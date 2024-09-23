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
import { DatePicker } from "@material-ui/pickers";
import { addItem, updateItem,  closeEditDialog, closeNewDialog, } from 'app/main/projects/store/projectsSlice';
import moment from "moment";
import CancelIcon from "@material-ui/icons/Cancel";
import IconButton from '@material-ui/core/IconButton';

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
  workItem: '',
  unit: '',
  quantity:''
};

function WorkBOQDialog(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const projectId = useSelector(({ projects }) => projects.details._id);
  const loading = useSelector(({ projects }) => projects.loading);
  const WorkBOQDetails = useSelector(({ projects }) => projects.workBOQs.detailWorkBOQ);
  const [open, setOpen] = useState(false);
  const [type, setType] = useState('new');
  const [form, setForm] = useState(initialState);
  const projectDialog = useSelector(({ projects }) => projects.projectDialog); 
 
  const initprojectDialog = useCallback(() => {
     setOpen(true);
      if (projectDialog.Dialogtype === 'edit') {
        setType('edit');
      }

      if (projectDialog.Dialogtype === "edit" && projectDialog.data) {
        if (WorkBOQDetails !== '') {
          setForm(WorkBOQDetails);     
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
      form.workItem.length > 0 &&
      form.unit.length > 0 &&
      form.quantity > 0
    );
  };

  const handleSubmit = () =>{
    let data = {
      workItem: form.workItem,
      unit: form.unit, 
      quantity: form.quantity,
      totalExecuted: 0
    }

    dispatch(addItem({ projectId, data })).then((response) => {
      setForm(initialState);
      closeComposeDialog();
    })
  }

  const handleUpdate = () =>{
    let data = {
      workItem: form.workItem,
      unit: form.unit, 
      quantity: form.quantity,
      totalExecuted: form.totalExecuted === undefined ? 0 : form.totalExecuted,
      createdBy: form.createdBy,
      createdDate : form.createdDate
    }

    dispatch(updateItem({ projectId, data, workBOQId: WorkBOQDetails._id })).then((response) => {
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
              {type === 'new' ? 'Add Item' : 'Edit Item'}
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
              label='Work Item'
              variant='outlined'
              value={form.workItem}
              onChange={handleChange('workItem')}
            />
            <div class="grid grid-cols-2 divide-x divide-gray-400">
             <TextField
               variant="outlined"
               required
               className="w-1 mr-10"
               label="Unit"
               value={form.unit}
               onChange={handleChange("unit")}
             />
             <TextField
               variant="outlined"
               required
               className="w-1 ml-10"
               type="number"
               label="Total Quantity"
               value={form.quantity}
               onChange={handleChange("quantity")}
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
                  disabled={!disableButton()}
                  onClick={() => handleUpdate()}
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

export default WorkBOQDialog;
