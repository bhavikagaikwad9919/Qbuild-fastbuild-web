import React, { useEffect, useState } from "react";
import Typography from "@material-ui/core/Typography";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import { updateDataStructure } from "app/main/organization/store/organizationSlice";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import {  dispatchWarningMessage } from "app/utils/MessageDispatcher";
import FuseUtils from "@fuse/utils";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  ListItem,
  TextField,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  AppBar,
  Toolbar,
  Icon,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ListItemText from "@material-ui/core/ListItemText";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import FuseAnimate from '@fuse/core/FuseAnimate';
import Paper from '@material-ui/core/Paper';
import ReactTable from 'react-table-6';
import moment from 'moment';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
  root: {
    maxHeight: "68vh",
  },
}));

function SafeManHours(props) {
  const classes = useStyles(props);
  const dispatch = useDispatch();
  const details = useSelector(({ organizations }) => organizations.organization);

  const milestones = useSelector(({ organizations }) => organizations.dataStructure.milestones);
  const wayForward = useSelector(({ organizations }) => organizations.dataStructure.wayForward);
  const safeManHours = useSelector(({ organizations }) => organizations.dataStructure.manHours);
  const cashFlow = useSelector(({ organizations }) => organizations.dataStructure.cashFlow);
  const concernAreas = useSelector(({ organizations }) => organizations.dataStructure.concernAreas);

  const staffs = useSelector(({ organizations }) => organizations.dataStructure.staffs);
  const [pageLoading, setPageLoading] = useState(false); 
  const [openDelete, setOpenDelete] = useState(false);
  const [type, setType] = useState('New');
  const [openArea, setOpenArea] = useState(false);



  const [open,setOpen] = useState(false);
  const [manHours,setManHours] = useState([]);
  const [hours, setHours] = useState(0)
  const [hourDate, setHourDate] = React.useState(new Date());
  const [hourId, setHourId] = useState(''); 

  const [hide, setHide] = useState();
  const members = useSelector( ({ organizations }) => organizations.members);
  const user = useSelector(({ auth }) => auth.user);

  let today = new Date(); 
  
  console.log(openArea);
  useEffect(() => {
    if(safeManHours !== undefined){
      setManHours(safeManHours);
    }

    
    let member = members.filter((t)=> t._id === user.data.id && t.designation === "CIDCO Official");

    if(member.length > 0){
      setHide(true)
    }else{
      setHide(false)
    }
  }, [details,members,safeManHours,user.data.id]);

  // useEffect(() => {
  //   if(safeManHours !== undefined){
  //     setManHours(safeManHours);
  //   }

  //   let member = members.filter((t)=> t._id === user.data.id && t.designation === "CIDCO Official");

  //   if(member.length > 0){
  //     setHide(true)
  //   }else{
  //     setHide(false)
  //   }
  // }, [details]);

  const handleChangeHours = (prop) => (event) => {
      setHours(event.target.value);
  };

  // function process(date){
  //   var parts = date.split("/");
  //   return new Date(parts[2], parts[1] - 1, parts[0]);
  // }

 const handleAddHours =()=>{
    let match = false;
    let data = JSON.parse(JSON.stringify(manHours));

    data.forEach((dt)=>{
      if(moment(dt.hourDate).format("DD-MM-YYYY") === moment(hourDate).format("DD-MM-YYYY")){
        match = true;
      }
    })
       
    if(match === true){
      dispatchWarningMessage(dispatch, "Date Already Exists. Please Check.");
    }else{  
      let temp = {
        _id: FuseUtils.generateGUID(),
        hours: Number(hours),
        hourDate: moment(hourDate).format('YYYY-MM-DD') + "T00:00:00.000Z",
        formatDate: moment(hourDate).format('DD-MM-YYYY')
      }

      data.push(temp);
      data.sort(function(a, b) {
        return new Date(b.hourDate) - new Date(a.hourDate);
      })

      updateContent(data);
      setManHours(data);
      closeComposeDialog()
    }
  }

  const handleDateChange = (date) => {
    setHourDate(date);
  };

  const handleUpdateHours = () =>{
    let mat2 = JSON.parse(JSON.stringify(manHours));
    mat2.forEach((mt) => {
      if(mt._id === hourId){
        mt.hours = Number(hours);
        mt.formatDate = moment(hourDate).format('DD-MM-YYYY');
        mt.hourDate = moment(hourDate).format('YYYY-MM-DD') + "T00:00:00.000Z";
      }
    })

    mat2.sort(function(a, b) {
      return new Date(b.hourDate) - new Date(a.hourDate);
    })

    updateContent(mat2);
    setManHours(mat2);
    closeComposeDialog(); 
  }

  function closeComposeDialog(){
    setOpenArea(false);
    setHourId('');
    setOpen(false);
    setType('New');
    setHourDate(new Date());
    setHours(0);
  }

  function openDialog(data){
    setType('Edit');
    setOpen(true);
    setHourDate(data.hourDate);
    setHourId(data._id)
    setHours(data.hours)
  }

  const handleDeleteData = () =>{
    let mat2 = JSON.parse(JSON.stringify(manHours));
    let filterData = mat2.filter((mat) => mat._id !== hourId);
    setManHours(filterData);
    updateContent(filterData);
    setOpenDelete(false);
    closeComposeDialog();
  }

  const updateContent = (data) =>{
    let values = { staffs, manHours : data, cashFlow, concernAreas, wayForward, milestones };
    setPageLoading(true);
    let id = details._id;
    dispatch(updateDataStructure({ id, values })).then((response) => {
      setPageLoading(false);
    });
  }

  const disableButton = () => {
    return (
      hours > 0
    );
  };
  
  return (
    <React.Fragment>
      <div>
        <Backdrop className={classes.backdrop} open={pageLoading}>
          <CircularProgress color="inherit" />
        </Backdrop>
           
        <div>
          <Backdrop className={classes.backdrop} open={pageLoading}>
            <CircularProgress color="inherit" />
          </Backdrop>
           <Accordion variant="outlined" className="mb-20 ml-10 mr-10">
              <ListItem>
                <ListItemText  className="font-bold"  primary="Safe Man Hours"/>
                {hide === false ?
                <Button
                  variant="contained"
                  color='primary'
                  onClick={() => {setOpen(true)}}
                >
                 Add
                </Button>
                :null}
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                </AccordionSummary>
              </ListItem>
              <AccordionDetails>
              <Paper className="w-full rounded-8 shadow-1">
                <FuseAnimate animation='transition.slideUpIn' delay={100}> 
                  <ReactTable
                    className={classes.root}
                    getTrProps={() => {
                      return {
                        className: '-striped -highlight items-center justify-center',
                      };
                    }}
                    data ={manHours}
                    columns={[
                      {
                        Header: 'Date',
                        style: { 'white-space': 'unset', 'text-align':'center' },
                        accessor: 'hourDate',
                        className: 'justify-center',
                        Cell: ({ row }) => (
                          <a
                            className='cursor-pointer'
                            onClick={hide === false ? () => openDialog(row._original) : null}
                          >
                            {row._original.formatDate}
                          </a>
                        ) 
                      },
                      {
                        Header: 'Hours',
                        style: { 'white-space': 'unset', 'text-align':'center' },
                        accessor: 'hours',
                        className: 'justify-center',
                        Cell: ({ row }) => (
                          <Typography> {row.hours} </Typography>
                        )
                      },
                    ]}
                    defaultPageSize={5}
                    noDataText='No Record found'
                  />  
                </FuseAnimate>
                </Paper>
              </AccordionDetails>
            </Accordion>         
        </div>        
      </div>
              
      <Dialog open={open} fullWidth maxWidth='xs' contentStyle={{ margin: 0, padding: 0 }}>
        <AppBar position="static" elevation={1}>
          <Toolbar>
            <Typography variant='subtitle1' color='inherit'>
              {type === 'New' ? 'Add Record' : 'Update Record'}
           </Typography>
          </Toolbar>
        </AppBar>
        <DialogContent >
         <div className='flex flex-1 flex-col gap-12 w-full mt-10'>
            
            <div className="grid grid-cols-2 divide-x divide-gray-400">
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <DatePicker
                required
                format="dd/MM/yyyy"
                label="Select Date"
                className="w-1 mr-10"
                value={hourDate}
                maxDate={today}
                onChange={handleDateChange}
                inputVariant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </MuiPickersUtilsProvider>
              <TextField
                className="w-1 ml-10"
                type="number"
                InputProps={{
                 inputProps: { min: 0 }
                }}
                onKeyPress={(event) => {
                  if (event?.key === '-' || event?.key === '+') {
                    event.preventDefault();
                  }
                }}
                name="name"
                value={hours}
                label="Hours"
                onChange={handleChangeHours("hours")}
                variant="outlined"
                required
              />
            </div>
           <div className='flex flex-row gap-10 mb-20 mt-10'> 
           {type === 'New' ?
            <Button
             variant='contained'
             color='primary'
             disabled={!disableButton()}
             onClick={() => handleAddHours()}
              >
             SAVE
            </Button> 
           :
            <Button
             variant='contained'
             color='primary'
             onClick={() => handleUpdateHours()}
            >
             Update
            </Button>
           }
             
            <Button variant='contained' onClick={() => {closeComposeDialog()}}>
              Cancel
            </Button>
            {type === 'New' ?
              null
            :
              <IconButton
                onClick={() => setOpenDelete(true)}
                variant="contained"
              >
                <Icon className={classes.delete}>delete</Icon>
              </IconButton>
            }
           </div>
         </div>
        </DialogContent>
      </Dialog>

      <Dialog open={openDelete}>
        <DialogTitle id="alert-dialog-slide-title">
          Do you want to delete entry ?
        </DialogTitle>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenDelete(false);
            }}
            color="primary"
          >
            No
          </Button>
          <Button
            onClick={() => {handleDeleteData()}}
            color="primary"
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default SafeManHours;