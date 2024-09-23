import React, { useEffect, useRef, useCallback, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import {  Button, TextField, IconButton, Accordion, InputLabel, AccordionSummary, AccordionDetails, Grid, Icon } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { DatePicker1 } from "@material-ui/pickers";
import { addRfi, updateRfi, closeEditDialog, closeNewDialog, } from 'app/main/projects/store/projectsSlice';
import moment from "moment";
import List from "@material-ui/core/List";
import CancelIcon from "@material-ui/icons/Cancel";
import { dispatchWarningMessage } from "app/utils/MessageDispatcher";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import DatePicker from "react-multi-date-picker";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";


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
  rfiNo: '',
  status: 'OPEN',
  remarks: ''
};

function RfiDialog(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const projectId = useSelector(({ projects }) => projects.details._id);
  const loading = useSelector(({ projects }) => projects.loading);
  const rfiDetails = useSelector(({ projects }) => projects.rfis.detailRfi);
  const userId = useSelector(({ auth }) => auth.user.data.id)
  const [open, setOpen] = useState(false);
  const [type, setType] = useState('new');
  const [form, setForm] = useState(initialState);
  const projectDialog = useSelector(({ projects }) => projects.projectDialog);
  const [fromSpcpl, setFromSpcpl] = useState([]);
  const [fromAhc, setFromAhc] = useState([]);
  const [toAhc, setToAhc] = useState([]);
  const [toSpcpl, setToSpcpl] = useState([]);
  const [architectural, setArchitectural] = useState({total: 0, resolved: 0});
  const [structural, setStructural] = useState({total: 0, resolved: 0});
  const [mep, setMep] = useState({total: 0, resolved: 0});
  const [hide, setHide] = useState(false);
  const team = useSelector(({ projects }) => projects.details.team);
  const user = useSelector(({ auth }) => auth.user);

  let today = new Date();

  const initprojectDialog = useCallback(() => {
     setOpen(true);
      if (projectDialog.Dialogtype === 'edit') {
        setType('edit');
      }

      if (projectDialog.Dialogtype === "edit" && projectDialog.data) {
        if (rfiDetails !== '') {
          setForm(rfiDetails);
          setFromSpcpl(rfiDetails.fromSpcpldates);
          setFromAhc(rfiDetails.fromAhcdates);
          setToAhc(rfiDetails.toAhcdates);
          setToSpcpl(rfiDetails.toSpcpldates);

          setArchitectural(rfiDetails.queries.architectural)
          setStructural(rfiDetails.queries.structural)
          setMep(rfiDetails.queries.mep)
        }
      }
      if (projectDialog.Dialogtype === "new") {
       setType('new');
       setForm(initialState);
      }
  }, [projectDialog.data, projectDialog.Dialogtype, rfiDetails, setForm]);

  useEffect(() => {
    team.forEach((t)=>{
      if(t._id === user.data.id && t.role === "CIDCO Official"){
        setHide(true)
      }
   })
  }, [user.data.id, team])

  useEffect(() => {
    let tempMem = [];
    if (projectDialog.props.open) {
      initprojectDialog();
    }

    if (projectDialog.Dialogtype === 'new') {
    }
  }, [projectDialog.props.open, initprojectDialog]);


  function closeComposeDialog() {
    setForm(initialState);
    setArchitectural({total: 0, resolved: 0});
    setStructural({total: 0, resolved: 0});
    setMep({total: 0, resolved: 0});
    setFromSpcpl([]);
    setFromAhc([]);
    setToAhc([]);
    setToSpcpl([]);
    props.close();

    projectDialog.Dialogtype === "edit" ? dispatch(closeEditDialog()) : dispatch(closeNewDialog());
  }

  const handleChange = (prop) => (event) => {
    setForm({ ...form, [prop]: event.target.value });
  };

  const handleChangeArchitectural = (prop) => (event) => {
    setArchitectural({ ...architectural, [prop]: event.target.value });
  };

  const handleChangeStructural = (prop) => (event) => {
    setStructural({ ...structural, [prop]: event.target.value });
  };

  const handleChangeMep = (prop) => (event) => {
    setMep({ ...mep, [prop]: event.target.value });
  };

  const disableButton = () => {
    return (
        form.rfiNo.length > 0 &&
        architectural.total > -1 &&
        architectural.resolved > -1 &&
        structural.total > -1 &&
        structural.resolved > -1 &&
        mep.total > -1 &&
        mep.resolved > -1 &&
        fromSpcpl.length > 0
    );
  };

  const handleSubmit = () =>{
    let fromSpcpldates = [], fromAhcdates = [], toSpcpldates = [], toAhcdates = [];

   fromSpcpl.forEach((vl)=>{
    fromSpcpldates.push(vl.format())
   })

   fromAhc.forEach((vl)=>{
    fromAhcdates.push(vl.format())
   })

   toAhc.forEach((vl)=>{
    toAhcdates.push(vl.format())
   })

   toSpcpl.forEach((vl)=>{
     toSpcpldates.push(vl.format())
   })

   if(architectural.total < architectural.resolved || structural.total < structural.resolved || mep.total< mep.resolved){
     dispatchWarningMessage(dispatch, "Please check, total queries value should not be less than resolved queries.");
   }else if(architectural.total === '' || architectural.resolved === '' || structural.total === '' || structural.resolved === '' || mep.total === '' || mep.resolved === ''){
     dispatchWarningMessage(dispatch, "Please check, queries value should not be empty. By default 0");
   }else{

    let queries = {architectural, structural, mep};
    let data = {
       rfiNo: form.rfiNo,
       remarks: form.remarks,
       status: form.status,
       fromSpcpldates,
       fromAhcdates,
       toSpcpldates,
       toAhcdates,
       queries,
       addedBy: userId,
       addedDate: new Date(),
       projectId
    }

    dispatch(addRfi({ projectId,  data })).then((response) => {
        closeComposeDialog();
    })
   }
  }

  const handleUpdate = () =>{
    let fromSpcpldates = [], fromAhcdates = [], toSpcpldates = [], toAhcdates = [];

    fromSpcpl.forEach((vl)=>{
      if(typeof(vl) === 'string'){
        fromSpcpldates.push(vl)
      }else{
        fromSpcpldates.push(vl.format())
      }
    })
 
    fromAhc.forEach((vl)=>{
      if(typeof(vl) === 'string'){
        fromAhcdates.push(vl)
      }else{
        fromAhcdates.push(vl.format())
      }
    })
 
    toAhc.forEach((vl)=>{
      if(typeof(vl) === 'string'){
        toAhcdates.push(vl)
      }else{
        toAhcdates.push(vl.format())
      }
    })
 
    toSpcpl.forEach((vl)=>{
      if(typeof(vl) === 'string'){
        toSpcpldates.push(vl)
      }else{
        toSpcpldates.push(vl.format())
      }
    })
 
    if(architectural.total < architectural.resolved || structural.total < structural.resolved || mep.total< mep.resolved){
      dispatchWarningMessage(dispatch, "Please check, total queries value should not be less than resolved queries.");
    }else if(architectural.total === '' || architectural.resolved === '' || structural.total === '' || structural.resolved === '' || mep.total === '' || mep.resolved === ''){
      dispatchWarningMessage(dispatch, "Please check, queries value should not be empty. By default 0");
    }else{
 
     let queries = {architectural, structural, mep};
     let data = {
        rfiNo: form.rfiNo,
        remarks: form.remarks,
        status: form.status,
        fromSpcpldates,
        fromAhcdates,
        toSpcpldates,
        toAhcdates,
        queries,
        updatedBy: userId,
        updatedDate: new Date(),
        projectId
     }

     dispatch(updateRfi({ projectId, rfiId: rfiDetails._id, data })).then((response) => {
      setForm(initialState);
      closeComposeDialog();
    })
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
            <div className="grid grid-cols-2">
               <TextField
                 required
                 label='RFI No.'
                 variant='outlined'
                 value={form.rfiNo}
                 onChange={handleChange('rfiNo')}
               />
               <FormControl variant="outlined"  className="w-1">
               <InputLabel id="demo-simple-select-outlined-label"  className="w-1 mr-10 ml-10">
                 Status
               </InputLabel>
               <Select
                 labelId="demo-simple-select-outlined-label"
                 id="demo-simple-select-outlined"
                 value={form.status}
                 className="w-1 mr-10 ml-10"
                 onChange={handleChange("status")}
                 label="Status"
               >
                  <MenuItem value="OPEN">OPEN</MenuItem>
                  <MenuItem value="CLOSED">CLOSED</MenuItem>
                  <MenuItem value="REJECTED">REJECTED</MenuItem>
               </Select>
             </FormControl>
            </div> 

           <Accordion variant="outlined">
             <AccordionSummary
               expandIcon={<ExpandMoreIcon />}
               aria-controls="panel1a-content"
               id="panel1a-header"
             >
               <Typography color="textPrimary">Queries</Typography>
             </AccordionSummary>
             <AccordionDetails>
               <div className="flex flex-col w-full">
                 <List
                   component="nav"
                   // className={classes.root}
                   aria-label="mailbox folders"
                 >
                     <React.Fragment>
                       <span className="mt-10">Architectural</span>
                       <div className="grid grid-cols-2  mt-10 mb-20">
                         <TextField
                            label='Total Queries'
                            variant='outlined'
                            className="mr-10"
                            value={architectural.total}
                            type="number"
                            onChange={handleChangeArchitectural('total')}
                         />
                         <TextField
                            label='Resolution Received'
                            variant='outlined'
                            className="ml-10"
                            value={architectural.resolved}
                            type="number"
                            onChange={handleChangeArchitectural('resolved')}
                         />
                       </div> 

                       <span className="mt-10">Structural</span>
                       <div className="grid grid-cols-2  mt-10 mb-20">
                         <TextField
                            label='Total Queries'
                            variant='outlined'
                            className="mr-10"
                            value={structural.total}
                            type="number"
                            onChange={handleChangeStructural('total')}
                         />
                         <TextField
                            label='Resolution Received'
                            variant='outlined'
                            className="ml-10"
                            value={structural.resolved}
                            type="number"
                            onChange={handleChangeStructural('resolved')}
                         />
                       </div> 

                       <span className="mt-10">MEP</span>
                       <div className="grid grid-cols-2  mt-8">
                         <TextField
                            label='Total Queries'
                            variant='outlined'
                            className="mr-10"
                            value={mep.total}
                            type="number"
                            onChange={handleChangeMep('total')}
                         />
                         <TextField
                            label='Resolution Received'
                            variant='outlined'
                            className="ml-10"
                            value={mep.resolved}
                            type="number"
                            onChange={handleChangeMep('resolved')}
                         />
                       </div> 
                     </React.Fragment>
                </List>
              </div>
            </AccordionDetails>
           </Accordion>

            <TextField
              label='Remarks'
              multiline
              rows={3}
              variant='outlined'
              value={form.remarks}
              onChange={handleChange('remarks')}
            />

            <div className="grid grid-cols-2  mt-8">
              <span>RFI Date (From SPCPL) *</span>
              <span>RFI Date (To AHC)</span>
            </div> 

            <div className="grid grid-cols-2  mt-8">
               <DatePicker    
                    style={{
                      //backgroundColor: "aliceblue",
                      height: "55px",
                      width:"260px", 
                      borderRadius: "8px",
                      fontSize: "14px",
                      padding: "3px 10px"
                   }}
                   value={fromSpcpl}
                   maxDate={today}
                   onChange={setFromSpcpl}
                   multiple
                   sort
                   format="DD/MM/YYYY"
                   calendarPosition="top-center"
               />
               <DatePicker    
                    style={{
                      //backgroundColor: "aliceblue",
                      height: "55px",
                      width:"260px", 
                      borderRadius: "8px",
                      fontSize: "14px",
                      padding: "3px 10px"
                   }}
                   value={toAhc}
                   maxDate={today}
                   onChange={setToAhc}
                   multiple
                   sort
                   format="DD/MM/YYYY"
                   calendarPosition="top-center"
               />
            </div> 

            <div className="grid grid-cols-2  mt-8">
              <span>RFI Response Date (From AHC)</span>
              <span>RFI Response Date (To SPCPL)</span>
            </div> 

            <div className="grid grid-cols-2  mt-8">
                <DatePicker    
                    style={{
                      //backgroundColor: "aliceblue",
                      height: "55px",
                      width:"260px", 
                      borderRadius: "8px",
                      fontSize: "14px",
                      padding: "3px 10px"
                   }}
                   value={fromAhc}
                   maxDate={today}
                   onChange={setFromAhc}
                   multiple
                   sort
                   format="DD/MM/YYYY"
                   calendarPosition="top-center"
               />
                <DatePicker    
                    style={{
                      //backgroundColor: "aliceblue",
                      height: "55px",
                      width:"260px", 
                      borderRadius: "8px",
                      fontSize: "14px",
                      padding: "3px 10px"
                   }}
                   value={toSpcpl}
                   maxDate={today}
                   onChange={setToSpcpl}
                   multiple
                   sort
                   format="DD/MM/YYYY"
                   calendarPosition="top-center"
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

export default RfiDialog;
