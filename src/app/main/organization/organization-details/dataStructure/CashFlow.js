import React, { useEffect, useState } from "react";
import Typography from "@material-ui/core/Typography";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import { updateDataStructure } from "app/main/organization/store/organizationSlice";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import { dispatchWarningMessage } from "app/utils/MessageDispatcher";
import FuseUtils from "@fuse/utils";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  ListItem,
  TextField,
  IconButton,
  Icon,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  AppBar,
  Toolbar,
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

function CashFlow(props) {
  const classes = useStyles(props);
  const dispatch = useDispatch();
  const details = useSelector(({ organizations }) => organizations.organization);
  
  const milestones = useSelector(({ organizations }) => organizations.dataStructure.milestones);
  const wayForward = useSelector(({ organizations }) => organizations.dataStructure.wayForward);
  const concernAreas = useSelector(({ organizations }) => organizations.dataStructure.concernAreas);
  const manHours = useSelector(({ organizations }) => organizations.dataStructure.manHours);
  const cashFlowData = useSelector(({ organizations }) => organizations.dataStructure.cashFlow);
  const staffs = useSelector(({ organizations }) => organizations.dataStructure.staffs);

  const [pageLoading, setPageLoading] = useState(false); 
  const [type, setType] = useState('New');
  const [cash,setCash] = useState(false);
  const [planCost, setPlanCost] = useState(0);
  const [actualCost, setActualCost] = useState(0);
  const [cashFlow,setCashFlow] = useState([]);
  const [month, setMonth] = React.useState(null);
  const [cashId, setCashId] = useState(''); 
  const [openDelete, setOpenDelete] = useState(false);

  const [hide, setHide] = useState();
  const members = useSelector( ({ organizations }) => organizations.members);
  const user = useSelector(({ auth }) => auth.user);

  let today = new Date(); 
  
  useEffect(() => {
    if(cashFlowData !== undefined){
      cashFlowData.slice().sort(function(a, b) {
        return new Date(a.month) - new Date(b.month);
      })
      setCashFlow(cashFlowData);
    }

    let member = members.filter((t)=> t._id === user.data.id && t.designation === "CIDCO Official");

    if(member.length > 0){
      setHide(true)
    }else{
      setHide(false)
    }

  }, [cashFlowData]);

  const handleChangeCost = (prop) => (event) => {
    if(prop === 'planCost'){
      setPlanCost(event.target.value);
    }else if(prop === 'actualCost'){
      setActualCost(event.target.value)
    }
  };

  function process(date){
		var parts = date.split("-");
		return new Date(parts[2], parts[1] - 1, parts[0]);
	}

  const handleAddCash =()=>{
    let match = false;
    let data = JSON.parse(JSON.stringify(cashFlow));

    data.forEach((dt)=>{
      if(moment(dt.month).format("DD-MM-YYYY") === moment(month).format("DD-MM-YYYY")){
        match = true;
      }
    })
       
    if(match === true){
      dispatchWarningMessage(dispatch, "Date Already Exists. Please Check.");
    }else{
      let tempArr = [];
      data.map((dt, id)=>{
        if(process(moment(dt.month).format("DD-MM-YYYY")) < process(moment(month).format("DD-MM-YYYY"))){
          tempArr.push(dt)
        }

        if(process(moment(dt.month).format("DD-MM-YYYY")) > process(moment(month).format("DD-MM-YYYY"))){
          dt.cumulativePlanCost = Number(planCost) + Number(dt.cumulativePlanCost);
          dt.cumulativeActualCost = Number(actualCost) + Number(dt.cumulativeActualCost);
        }
      })

      const sumPlanCost = tempArr.reduce(function(accumulator, curValue){
        return accumulator + (+curValue.planCost)
      },(+planCost))
    
      const sumActualCost =  tempArr.reduce(function(accumulator, curValue){
        return accumulator + (+curValue.actualCost)
      },(+actualCost))
  
      let temp = {
        _id: FuseUtils.generateGUID(),
        planCost: Number(planCost),
        actualCost: Number(actualCost),
        cumulativePlanCost : Number(sumPlanCost),
        cumulativeActualCost : Number(sumActualCost),
        month: moment(month).format('YYYY-MM-DD') + "T00:00:00.000Z",
        formatMonth: moment(month).format('DD-MM-YYYY')
      }
  
      data.push(temp);
      data.sort(function(a, b) {
        return new Date(a.month) - new Date(b.month);
      })

      updateContent(data);
      setCashFlow(data);
      closeComposeDialog()
    }
  }

  const handleDateChange = (date) => {
    setMonth(date);
  };

  const handleUpdateCash = () =>{
    let mat2 = JSON.parse(JSON.stringify(cashFlow));
    let tempId;

    mat2.forEach((mt, id) => {
      if(mt._id === cashId){
        if(id === 0){
          mt.cumulativePlanCost = mt.planCost;
          mt.cumulativeActualCost = mt.actualCost;
        }
        mt.planCost = Number(planCost);
        mt.actualCost = Number(actualCost);
        mt.month = moment(month).format('YYYY-MM-DD') + "T00:00:00.000Z";
        mt.formatMonth = moment(month).format('DD-MM-YYYY')
      }
    })

    mat2.sort(function(a, b) {
      return new Date(a.month) - new Date(b.month);
    })

    mat2.forEach((mt, mtId) => {
      
      if(typeof(tempId) === 'number'){
        mt.cumulativePlanCost = Number(mt.planCost) + Number(mat2[mtId -1].cumulativePlanCost);
        mt.cumulativeActualCost = Number(mt.actualCost) + Number(mat2[mtId -1].cumulativeActualCost);
      }

      if(mtId === 0){
        mt.cumulativePlanCost = mt.planCost;
        mt.cumulativeActualCost = mt.actualCost;
      }else if(typeof(tempId) !== 'number'){
        mt.cumulativePlanCost = Number(mt.planCost) + Number(mat2[mtId -1].cumulativePlanCost);
        mt.cumulativeActualCost = Number(mt.actualCost) + Number(mat2[mtId -1].cumulativeActualCost);
      }

      if(mt._id === cashId){
        tempId = mtId;
        if(mtId !== 0){
          mt.cumulativePlanCost = Number(planCost) + Number(mat2[mtId -1].cumulativePlanCost);
          mt.cumulativeActualCost = Number(actualCost) + Number(mat2[mtId -1].cumulativeActualCost);
        }
      }
    })

    setCashFlow(mat2);
    updateContent(mat2);
    closeComposeDialog();  
  }

  function closeComposeDialog(){
    setCashId('');
    setCash(false);
    setType('New');
    setMonth(null);
    setActualCost(0);
    setPlanCost(0);
  }

  function openDialog(data){
    setType('Edit');
    setCash(true);
    setPlanCost(data.planCost);
    setActualCost(data.actualCost);
    setMonth(data.month);
    setCashId(data._id)
  }

  const handleDeleteData = () =>{
    let mat2 = JSON.parse(JSON.stringify(cashFlow));
    let filterData = mat2.filter((mat) => mat._id !== cashId);

    filterData.forEach((mt, mtId) => {
      if(mtId === 0){
        mt.cumulativePlanCost = mt.planCost;
        mt.cumulativeActualCost = mt.actualCost;
      }else{
        mt.cumulativePlanCost = Number(mt.planCost) + Number(filterData[mtId -1].cumulativePlanCost);
        mt.cumulativeActualCost = Number(mt.actualCost) + Number(filterData[mtId -1].cumulativeActualCost);
      }
    })

    setCashFlow(filterData);
    updateContent(filterData)
    setOpenDelete(false)
    setCash(false)
  }

  const updateContent = (data) =>{
    let values = { staffs, manHours, cashFlow: data, concernAreas, wayForward, milestones };
    setPageLoading(true);
    let id = details._id;
    dispatch(updateDataStructure({ id, values })).then((response) => {
      setPageLoading(false);
      closeComposeDialog();
    });
  }

  const disableButton = () => {
    return (
      planCost > 0 &&
      actualCost > -1
    );
  };
  
  
  return (
    <React.Fragment>     
      <div>
        <Backdrop className={classes.backdrop} open={pageLoading}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <Accordion variant="outlined" className="mb-20 ml-10 mr-10">
          <ListItem>
            <ListItemText  className="font-bold" variant="h5" primary="Cash Flow"/>
            {hide === false ?
            <Button
              variant="contained"
              color='primary'
              onClick={() => {setCash(true)}}
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
                  getTrProps={(state, rowInfo, column) => {
                    return {
                      className: '-striped -highlight items-center justify-center',
                    };
                  }}
                  data ={cashFlow}
                  columns={[
                    {
                      Header: 'Month',
                      style: { 'white-space': 'unset', 'text-align':'center' },
                      accessor: 'formatMonth',
                      className: 'justify-center',
                      Cell: ({ row }) => (
                        <a
                          className='cursor-pointer'
                          onClick={hide === false ? () => openDialog(row._original) : null}
                        >
                          {row.formatMonth}
                        </a>
                      ) 
                    },
                    {
                      Header: 'Planned Cost',
                      style: { 'white-space': 'unset', 'text-align':'center' },
                      accessor: 'planCost',
                      className: 'justify-center',
                      Cell: ({ row }) => (
                        <Typography> {Math.round(row.planCost.toFixed(2))} </Typography>
                      )
                    },
                    {
                      Header: 'Cumm Planned Cost',
                      style: { 'white-space': 'unset' , 'text-align':'center'},
                      accessor: 'cumulativePlanCost',
                      className: 'justify-center',
                      Cell: ({ row }) => (
                        <Typography> {Math.round(row.cumulativePlanCost.toFixed(2))} </Typography>
                      )
                    },
                    {
                      Header: 'Actual Cost',
                      style: { 'white-space': 'unset', 'text-align':'center' },
                      accessor: 'actualCost',
                      className: 'justify-center',
                      Cell: ({ row }) => (
                        <Typography> {Math.round(row.actualCost.toFixed(2))} </Typography>
                      ) 
                    },
                    {
                      Header: 'Cumm Actual Cost',
                      style: { 'white-space': 'unset', 'text-align':'center' },
                      accessor: 'cumulativeActualCost',
                      className: 'justify-center',
                      Cell: ({ row }) => (
                        <Typography> {Math.round(row.cumulativeActualCost.toFixed(2))} </Typography>
                      ) 
                    }
                  ]}
                  defaultPageSize={5}
                  noDataText='No Record found'
                />  
              </FuseAnimate>
            </Paper>
          </AccordionDetails>
        </Accordion>       
      </div>
              
      <Dialog open={cash} fullWidth maxWidth='xs' contentStyle={{ margin: 0, padding: 0 }}>
        <AppBar position="static" elevation={1}>
          <Toolbar>
            <Typography variant='subtitle1' color='inherit'>
              {type === 'New' ? 'Add Record' : 'Update Record'}
           </Typography>
          </Toolbar>
        </AppBar>
        <DialogContent >
          <div className='flex flex-1 flex-col gap-12 w-full mt-10'>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <DatePicker
                required
                format="dd/MM/yyyy"
                label="Select Date"
                className="w-full"
                value={month}
                //maxDate={today}
                onChange={handleDateChange}
                inputVariant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </MuiPickersUtilsProvider>
            <div className="grid grid-cols-2 divide-x divide-gray-400">
              <TextField
                className="w-1 mr-10"
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
                value={planCost}
                label="Planned Cost"
                onChange={handleChangeCost("planCost")}
                variant="outlined"
                required
              />
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
                name="role"
                value={actualCost}
                label="Actual Cost"
                onChange={handleChangeCost("actualCost")}
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
                  onClick={() => handleAddCash()}
                >
                  SAVE
                </Button> 
              :
                <Button
                  variant='contained'
                  color='primary'
                  onClick={() => handleUpdateCash()}
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

export default CashFlow;