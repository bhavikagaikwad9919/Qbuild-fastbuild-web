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
import { addDrawing, updateDrawing,  closeEditDialog, closeNewDialog, } from 'app/main/projects/store/projectsSlice';
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
}));

const initialState = {
  drawingName: '',
  drawingNo: '',
  drawingDate: new Date(),
  copies: '',
  media:'',
  issuedFor: '',
  trNo: '',
  revision: '',
  refNo: '',
  drawingStatus: '',
  remarks: '',
  issuedSite: false,
};

function DrawingDialog(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const projectId = useSelector(({ projects }) => projects.details._id);
  const loading = useSelector(({ projects }) => projects.loading);
  const drawingDetails = useSelector(({ projects }) => projects.drawings.detailDrawing);
  const drawings = useSelector(({ projects }) => projects.drawings.drawingList);
  const [open, setOpen] = useState(false);
  const [type, setType] = useState('new');
  const [form, setForm] = useState(initialState);
  const projectDialog = useSelector(({ projects }) => projects.projectDialog); 
  const [rId, setRId] = useState('');
  const revisions = [{id:0, value:'R0'}, {id:1, value:'R1'}, {id:2, value:'R2'}, {id:3, value: 'R3'}, {id:4, value:'R4'}, {id:5, value:'R5'}, {id:6, value:'R6'}, {id:7, value:'R7'}, {id:8, value:'R8'}, {id:9, value:'R9'},{id:10, value: 'R10'},{id:11, value: 'R11'}, {id:12, value:'R12'}, {id:13, value:'R13'}, {id:14, value:'R14'}, {id:15, value: 'R15'}];
  const [hide, setHide] = useState(false);
  const team = useSelector(({ projects }) => projects.details.team);
  const user = useSelector(({ auth }) => auth.user);

  const initprojectDialog = useCallback(() => {
    setOpen(true);
    if (projectDialog.Dialogtype === 'edit') {
      setType('edit');
    }

    if (projectDialog.Dialogtype === "edit" && projectDialog.data) {
      if (drawingDetails !== '') {
        setForm(drawingDetails); 
        revisions.map((rev)=>{
          if(rev.value === drawingDetails.revision){
            setRId(rev.id);
          }
        })    
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
  }, [user.data.id, team]);

  function closeComposeDialog() {
    setForm(initialState);
    projectDialog.Dialogtype === "edit"
      ? dispatch(closeEditDialog())
      : dispatch(closeNewDialog());
  }

  const handleChange = (prop) => (event) => {
    if(prop === 'issuedSite'){
      setForm({ ...form, [prop]: event.target.checked });
    }else if(prop === 'drawingNo'){

      if(event.target.value.length > 0){
        setForm({ ...form, [prop]: event.target.value });
      }else{
        setForm({ ...form, [prop]: event.target.value, 'revision': '' });
      }
    }else{
      setForm({ ...form, [prop]: event.target.value });
    }
  };

  const handleDateChange = (prop) => (date) => {
    setForm({ ...form, [prop]: date });
  };

  const disableButton = () => {
    return (
      form.drawingName.length > 0 &&
      form.drawingNo.length > 0 && 
      form.revision.length &&
      form.trNo.length
    );
  };

  const handleSubmit = () =>{
    let data = {
      copies: form.copies,
      drawingDate: form.drawingDate,
      drawingName: form.drawingName,
      drawingNo: form.drawingNo,
      issuedFor: form.issuedFor,
      media: form.media,
      revision: form.revision,
      trNo: form.trNo,
      refNo: form.refNo,
      drawingStatus: form.drawingStatus,
      remarks: form.remarks,
      issuedSite: form.issuedSite,
      discp: props.data.folderType,
      projectId: projectId
    }

    // let filterDrawing = drawings.filter((draw)=> draw.drawingNo === form.drawingNo)

    // if(filterDrawing.length > rId){
    //   dispatchWarningMessage(dispatch, `Please check the revision.`)
    // }else if(filterDrawing.length !== rId){
    //   dispatchWarningMessage(dispatch, `Please check the revision. Drawing with revision - R${rId -1} not found.`)
    // }else{
      dispatch(addDrawing({ projectId, folderId : props.data._id,  data })).then((response) => {
        setForm(initialState);
        closeComposeDialog();
      })
   // }
  }

  const handleUpdate = () =>{
    let data = {
      copies: form.copies,
      drawingDate: form.drawingDate,
      drawingName: form.drawingName,
      drawingNo: form.drawingNo,
      issuedFor: form.issuedFor,
      media: form.media,
      revision: form.revision,
      trNo: form.trNo,
      refNo: form.refNo,
      drawingStatus: form.drawingStatus,
      remarks: form.remarks,
      issuedSite: form.issuedSite,
      discp: props.data.folderType,
      projectId: projectId
   }

   let filterDrawing = drawings.filter((draw)=> draw._id.toString() !== drawingDetails._id.toString() && draw.drawingNo === form.drawingNo)

  //  if(drawingDetails.revision === form.revision){
  //     dispatch(updateDrawing({ projectId, drawingId: drawingDetails._id, data, folderId: props.data._id })).then((response) => {
  //       setForm(initialState);
  //       closeComposeDialog();
  //     })
  //  }else if(filterDrawing.length >= rId){
  //     dispatchWarningMessage(dispatch, `Drawing with revision - ${form.revision} is already present.`)
  //  }else if(filterDrawing.length !== rId){
  //     dispatchWarningMessage(dispatch, `Please check the revision.`)
  //  }else{
      dispatch(updateDrawing({ projectId, drawingId: drawingDetails._id, data, folderId: props.data._id })).then((response) => {
        setForm(initialState);
        closeComposeDialog();
      })
   //}
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
              {type === 'new' ? 'Add Drawing' : 'Edit Drawing'}
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
              label='Drawing Name'
              variant='outlined'
              value={form.drawingName}
              onChange={handleChange('drawingName')}
            />

            <TextField
              required
              label='Drawing No'
              variant='outlined'
              value={form.drawingNo}
              //disabled={ type === 'edit' ? true : false}
              onChange={handleChange('drawingNo')}
            />

            <div className="grid grid-cols-3 divide-x divide-gray-400 mt-8">
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <DatePicker
                  required
                  label="Drawing Date"
                  format="dd/MM/yyyy"
                  value={form.drawingDate}
                  onChange={handleDateChange("drawingDate")}
                  inputVariant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </MuiPickersUtilsProvider>    
              <TextField
               variant="outlined"
               required
               label="TR No"
               className="w-1 mr-10 ml-10"
               value={form.trNo}
               onChange={handleChange("trNo")}
              />

             <FormControl variant="outlined">
              <InputLabel id="demo-simple-select-outlined-label" required>
                Revision
              </InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={form.revision}
                disabled={form.drawingNo === ''? true : false}
                onChange={handleChange("revision")}
                label="Revision"
              >
                {revisions.map((rev)=>(
                  <MenuItem value={rev.value} onClick={()=> setRId(rev.id)}>
                    <Typography>{rev.value}</Typography>
                  </MenuItem>
                ))}
              </Select>
             </FormControl>
            </div>

            <div class="grid grid-cols-3 divide-x divide-gray-400">
             

             <FormControl variant="outlined">
              <InputLabel id="demo-simple-select-outlined-label">
                Issued For
              </InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={form.issuedFor}
                onChange={handleChange("issuedFor")}
                label="Issued For"
              >
                <MenuItem value="GFC">GFC</MenuItem>
                <MenuItem value="Advance Copy">Advance Copy</MenuItem>
                <MenuItem value="For Aprroval">For Aprroval</MenuItem>
              </Select>
             </FormControl>

             <FormControl variant="outlined">
               <InputLabel id="demo-simple-select-outlined-label"  className="w-1 mr-10 ml-10">
                 No of Copies
               </InputLabel>
               <Select
                 labelId="demo-simple-select-outlined-label"
                 id="demo-simple-select-outlined"
                 value={form.copies}
                 className="w-1 mr-10 ml-10"
                 onChange={handleChange("copies")}
                 label="No of Copies"
               >
                  <MenuItem value="1 Set">1 Set</MenuItem>
                  <MenuItem value="2 Set">2 Set</MenuItem>
               </Select>
             </FormControl>
             <FormControl variant="outlined">
              <InputLabel id="demo-simple-select-outlined-label">
                Media
              </InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={form.media}
                onChange={handleChange("media")}
                label="Media"
              >
                <MenuItem value="E">Email</MenuItem>
                <MenuItem value="H">Hard Copy</MenuItem>
                <MenuItem value="E+H">Email + Hard Copy</MenuItem>
                <MenuItem value="IIT approved">IIT approved</MenuItem>
              </Select>
             </FormControl>
            </div>

            {/* <div class="grid grid-cols-2 divide-x divide-gray-400">
             
            </div> */}

            <div class="grid grid-cols-2 divide-x divide-gray-400">
              <TextField
                label='CF Ref. No'
                variant='outlined'
                value={form.refNo}
                className="w-1 mr-10"
                onChange={handleChange('refNo')}
              />
             <FormControl variant="outlined">
              <InputLabel id="demo-simple-select-outlined-label">
                Drawing Status
              </InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={form.drawingStatus}
                onChange={handleChange("drawingStatus")}
                label="Drawing Status"
              >
                <MenuItem value="Reviewed and no comments">Reviewed and no comments</MenuItem>
                <MenuItem value="Reviewed with comments">Reviewed with comments</MenuItem>
                <MenuItem value="Under Review">Under Review</MenuItem>
              </Select>
             </FormControl>
            </div>

            <TextField
              label='Remarks'
              variant='outlined'
              multiline
              rows={3}
              value={form.remarks}
              onChange={handleChange('remarks')}
            />

            <FormControlLabel
              label="Drawing Issue to Site ?"
              control={
               <Checkbox
                 checked={form.issuedSite}
                 onChange={handleChange('issuedSite')}
                 inputProps={{ 'aria-label': 'controlled' }}
               />
              }
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
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default DrawingDialog;