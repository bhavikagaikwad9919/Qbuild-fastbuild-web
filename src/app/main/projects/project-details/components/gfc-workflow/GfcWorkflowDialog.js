import React, { useEffect, useCallback, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { Button, TextField, Accordion, InputLabel, AccordionSummary, AccordionDetails, Grid, Icon } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import DateFnsUtils from "@date-io/date-fns";
import { addGfc, updateGfc,  closeEditDialog, closeNewDialog } from 'app/main/projects/store/projectsSlice';
import CancelIcon from "@material-ui/icons/Cancel";
import IconButton from '@material-ui/core/IconButton';
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import FuseUtils from "@fuse/utils";
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
  delete: {
    color: "red",
  },
}));

const initialState = {
  trNo: '',
  drawings: 0,
  cidcoDate: new Date(),
  ssaDate: new Date(),
  remarks: '',
  status: '',
};

const reviewState = {
  reviewDate: new Date(),
  cfNo: '',
  drawings: 0,
  outcome: '',
  ahcDate: null,
  remarks: '',
  status: 'Open',
};

function GfcDialog(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const projectId = useSelector(({ projects }) => projects.details._id);
  const loading = useSelector(({ projects }) => projects.loading);
  const gfcDetails = useSelector(({ projects }) => projects.gfcs.detailGfc);
  const [open, setOpen] = useState(false);
  const [type, setType] = useState('new');
  const [reviewType, setReviewType] = useState('new');
  const [form, setForm] = useState(initialState);
  const [review, setReview] = useState(reviewState);
  const [addOpen, setAddOpen] = useState(false);
  const [reviewData, setReviewData] = useState([])
  const projectDialog = useSelector(({ projects }) => projects.projectDialog); 
  const userId = useSelector(({ auth }) => auth.user.data.id)
  const [list, setList] = useState(reviewState);
  let today = new Date()
  
  const initprojectDialog = useCallback(() => {
    setOpen(true);
    if (projectDialog.Dialogtype === 'edit') {
      setType('edit');
    }

    if (projectDialog.Dialogtype === "edit" && projectDialog.data) {
      if (gfcDetails !== '') {
        setForm(gfcDetails);  
        setReviewData(gfcDetails.review)   
      }
    }
    if (projectDialog.Dialogtype === "new") {
      setType('new');
      setForm(initialState);
      setReview(reviewState)
    }
  }, [projectDialog.data, projectDialog.Dialogtype, gfcDetails, setForm]);

  useEffect(() => {
    if (projectDialog.props.open) {
      initprojectDialog();
    }
  }, [projectDialog.props.open, initprojectDialog]);

  function closeComposeDialog() {
    setForm(initialState);
    setReviewData([]);
    setReview(reviewState);
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

  const handleReviewChange = (prop) => (event) => {
    setReview({ ...review, [prop]: event.target.value });
  };

  const handleReviewDateChange = (prop) => (date) => {
     setReview({ ...review, [prop]: date });
  };

  function handleOpenFirst(id, reviewDate, cfNo, drawings, outcome, ahcDate, remarks, status,) {
    setReviewType("Edit");
    setAddOpen(true)
    setReview({ reviewDate, cfNo, drawings, outcome, ahcDate, remarks, status});
    setList({ id, reviewDate, cfNo, drawings, outcome, ahcDate, remarks, status});
  }

  const addReviewData = () => {
    let tempdata = {};
    tempdata = {
        _id: FuseUtils.generateGUID(24),
        reviewDate: review.reviewDate,
        drawings: review.drawings,
        cfNo: review.cfNo,
        outcome: review.outcome,
        ahcDate: review.ahcDate,
        remarks: review.remarks,
        status: review.status
    };
    setReviewData([...reviewData, tempdata]);
    setAddOpen(false);
    setReview(reviewState);
  }

  function deleteFirstData(id) {
    let data = JSON.parse(JSON.stringify(reviewData));
    let deletedData = data.filter((item) => item._id !== id);
    setReviewData(deletedData);
  }

  function listChange() {
    let tempData = JSON.parse(JSON.stringify(reviewData));
    tempData.forEach((item) => {
        if (item._id === list.id) {
            item.reviewDate = review.reviewDate;
            item.drawings = review.drawings;
            item.cfNo = review.cfNo;
            item.outcome = review.outcome;
            item.ahcDate = review.ahcDate;
            item.remarks = review.remarks;
            item.status = review.status;
        }
    });

    setReviewData(tempData);
    setAddOpen(false);
    setReview(reviewState);
  }

  const disableButton = () => {
    return (
      form.trNo.length > 0 
    );
  };

  const disableDataButton = () => {
    return (
      review.drawings > 0 
    );
  };

  const handleSubmit = () =>{
    let tempData = [];
    tempData = JSON.parse(JSON.stringify(reviewData));
      tempData.forEach((item) => {
        delete item._id;
    });

    let data = { 
      trNo: form.trNo,
      cidcoDate: form.cidcoDate,
      ssaDate: form.ssaDate,
      drawings: form.drawings,
      review: tempData,
      status: form.status,
      remarks: form.remarks,
      projectId: projectId,
      folderId : props.data._id,
      addedBy: userId,
      addedDate: new Date()
    }

    dispatch(addGfc({ projectId, folderId : props.data._id,  data })).then((response) => {
      setForm(initialState);
      closeComposeDialog();
    })
  }

  const handleUpdate = () =>{
    let tempData = [];
    tempData = JSON.parse(JSON.stringify(reviewData));
      tempData.forEach((item) => {
        delete item._id;
    });

    let data = { 
        trNo: form.trNo,
        cidcoDate: form.cidcoDate,
        ssaDate: form.ssaDate,
        drawings: form.drawings,
        review: tempData,
        status: form.status,
        remarks: form.remarks,
        projectId: projectId,
        folderId : props.data._id,
        updatedBy: userId,
        updatedDate: new Date()
    }

    dispatch(updateGfc({ projectId, gfcId: gfcDetails._id, data, folderId: props.data._id })).then((response) => {
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
              {type === 'new' ? 'Add GFC' : 'Edit GFC'}
            </Typography>
            <IconButton onClick={() => closeComposeDialog()}>
              <CancelIcon style={{ color: "red" }} />
            </IconButton>
          </Toolbar>
        </AppBar>
        <DialogContent>
          <div className='flex flex-1 flex-col gap-12 w-full mt-10'>
            <div className="grid grid-cols-2 divide-x divide-gray-400 mt-8">
              <TextField
                required
                label='TR No'
                variant='outlined'
                value={form.trNo}
                onChange={handleChange('trNo')}
              />
              <TextField
                variant="outlined"
                required
                label="Drawings Recieved"
                className="w-1 mr-10 ml-10"
                type="Number"
                value={form.drawings}
                onChange={handleChange("drawings")}
              />
            </div>
            
            <div className="grid grid-cols-2 divide-x divide-gray-400 mt-8">
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <DatePicker
                  required
                  label="Drawings to CIDCO issued on "
                  className="w-1 mr-10"
                  format="dd/MM/yyyy"
                  maxDate={today}
                  value={form.cidcoDate}
                  onChange={handleDateChange("cidcoDate")}
                  inputVariant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </MuiPickersUtilsProvider>    
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <DatePicker
                  required
                  label="Drawings to SSA issued on "
                  className="w-1 mr-10"
                  format="dd/MM/yyyy"
                  maxDate={today}
                  value={form.ssaDate}
                  onChange={handleDateChange("ssaDate")}
                  inputVariant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </MuiPickersUtilsProvider> 
            </div>

            <TextField
              label='Remarks'
              variant='outlined'
              multiline
              rows={2}
              value={form.remarks}
              onChange={handleChange('remarks')}
            />

            <Accordion variant="outlined">
             <ListItem>
               <ListItemText className="font-bold" variant="subtitle1" primary="COMMENTS FROM STATUS "/>
                <FormControl variant="outlined"  className="w-1/3">
                  <InputLabel id="demo-simple-select-outlined-label">
                    Select Option
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={form.status}
                    onChange={handleChange("status")}
                    label="Select Option"
                  >
                    <MenuItem value="Reference Only">Reference Only</MenuItem>
                    <MenuItem value="Approved by IIT">Approved by IIT</MenuItem>
                    <MenuItem value="Review">Review</MenuItem>
                  </Select>
                </FormControl>
                {form.status === 'Review' ?
                  <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header"> </AccordionSummary>
                :null}
                
              </ListItem>
              {form.status === 'Review' ?
                <AccordionDetails>
                 <div className="flex flex-col w-full">
                    <List component="nav" aria-label="mailbox folders">
                      {reviewData.map((item) => (
                        <React.Fragment>
                          <Grid container alignItems="center" direction="row">
                            <Grid item xs={11}>
                              <ListItem
                                button
                                key={item._id}
                                onClick={(ev) => {
                                  handleOpenFirst(
                                    item._id,
                                    item.reviewDate,
                                    item.cfNo,
                                    item.drawings,
                                    item.outcome,
                                    item.ahcDate,
                                    item.remarks,
                                    item.status
                                  );
                                }}
                              >
                                <ListItemText primary={ item.cfNo +" - " + item.drawings + " - " + item.status }/>
                              </ListItem>
                            </Grid>
                            <Grid item xs={1}>
                              <IconButton
                                onClick={() => deleteFirstData(item._id)}
                                variant="contained"
                              >
                                <Icon className={classes.delete}>delete</Icon>
                              </IconButton>
                            </Grid>
                          </Grid>
                        </React.Fragment>
                      ))}
                    </List>
                   <div className="mt-10">
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() =>{
                          setAddOpen(true)
                          setReviewType("new")
                          setReview(reviewState);
                        }}
                      >
                        Add
                      </Button>
                   </div>
                 </div>
                </AccordionDetails>
              :null}
            </Accordion>
           
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
                  SAVE
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
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={addOpen}
        onClose= {()=> setAddOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {reviewType === "Edit" ? (
          <DialogTitle id="alert-dialog-title">{"Edit Data"}</DialogTitle>
        ) : (
          <DialogTitle id="alert-dialog-title">{"Add Data"}</DialogTitle>
        )}

        <DialogContent>
          <div className="grid grid-cols-3  mt-10 mb-20">
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <DatePicker
                required
                label="Review Date"
                className="w-1 mr-10"
                format="dd/MM/yyyy"
                maxDate={today}
                value={review.reviewDate}
                onChange={handleReviewDateChange("reviewDate")}
                inputVariant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </MuiPickersUtilsProvider>
            <TextField
              variant="outlined"
              required
              label="Drawings Recieved"
              className="w-1 mr-10 ml-10"
              type="Number"
              value={review.drawings}
              onChange={handleReviewChange("drawings")}
            />
            <FormControl variant="outlined"  className="w-1">
              <InputLabel id="demo-simple-select-outlined-label"  className="w-1 mr-10 ml-10">
                Status
              </InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={review.status}
                className="w-1 mr-10 ml-10"
                onChange={handleReviewChange("status")}
                label="Status"
              >
                <MenuItem value="Open">Open</MenuItem>
                <MenuItem value="Closed">Closed</MenuItem>
                <MenuItem value="Discarded">Discarded</MenuItem>
              </Select>
            </FormControl>
          </div> 

          <TextField
            variant="outlined"
            required
            label="CF No."
            className="w-full"
            value={review.cfNo}
            onChange={handleReviewChange("cfNo")}
          />

          <div className="grid grid-cols-2  mt-10 mb-20">
            <TextField
              variant="outlined"
              required
              label="Review Outcome"
              className="w-1 mr-10"
              value={review.outcome}
              onChange={handleReviewChange("outcome")}
            />
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <DatePicker
                required
                label="AHC Reply on CF"
                className="w-1 mr-10"
                format="dd/MM/yyyy"
                maxDate={today}
                value={review.ahcDate}
                onChange={handleReviewDateChange("ahcDate")}
                inputVariant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </MuiPickersUtilsProvider>
          </div> 

          <TextField
            label='Remarks'
            variant='outlined'
            className="w-full"
            multiline
            rows={2}
            value={review.remarks}
            onChange={handleReviewChange('remarks')}
          />
        </DialogContent>
 
        <DialogActions>
          <Button onClick={()=> setAddOpen(false)} color="primary"> CANCEL </Button>
          {reviewType === "Edit" ? (
            <Button disabled={!disableDataButton()} onClick={() => listChange()} color="primary" autoFocus>
              Update
            </Button>
          ) : (
            <Button disabled={!disableDataButton()} onClick={() => addReviewData()} color="primary" autoFocus>
              Add
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default GfcDialog;