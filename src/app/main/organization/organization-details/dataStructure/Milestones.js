import React, { useRef, useEffect, useState } from "react";
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
  List,
  Grid
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ListItemText from "@material-ui/core/ListItemText";
import DeleteIcon from "@material-ui/icons/Delete";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import FuseAnimate from '@fuse/core/FuseAnimate';
import Paper from '@material-ui/core/Paper';
import ReactTable from 'react-table-6';
import moment from 'moment';
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
  root: {
    maxHeight: "68vh",
  },
}));

function Milestones(props) {
  const classes = useStyles(props);
  const dispatch = useDispatch();
  const details = useSelector(({ organizations }) => organizations.organization);
  
  const wayForward = useSelector(({ organizations }) => organizations.dataStructure.wayForward);
  const milestones = useSelector(({ organizations }) => organizations.dataStructure.milestones);
  const concernAreas = useSelector(({ organizations }) => organizations.dataStructure.concernAreas);
  const manHours = useSelector(({ organizations }) => organizations.dataStructure.manHours);
  const cashFlow = useSelector(({ organizations }) => organizations.dataStructure.cashFlow);

  const sites = useSelector( ({ organizations }) => organizations.sites);
  const staffs = useSelector(({ organizations }) => organizations.dataStructure.staffs);

  const [pageLoading, setPageLoading] = useState(false); 
  const [openDelete, setOpenDelete] = useState(false);
  const [type, setType] = useState('New');
  const [openArea, setOpenArea] = useState(false);

  const [open,setOpen] = useState(false);
  const [milestoneData, setMilestoneData] = useState([]);
  const [milestone, setMilestone] = useState({
    site: '',
    description : []
  })
  const [milestoneDate, setMilestoneDate] = React.useState(new Date());
  const [milestoneId, setMilestoneId] = useState(''); 

  const [openDescription, setOpenDescription] = useState(false);
  const [data, setData] = useState({
    _id:'',
    description: ''
  });
  const [dialogType, setDialogType] = useState('New');
  const [dataId, setDataId] = useState('');

  const [hide, setHide] = useState();
  const members = useSelector( ({ organizations }) => organizations.members);
  const user = useSelector(({ auth }) => auth.user);

  let today = new Date(); 
  
  useEffect(() => {
    if(milestones !== undefined){
      let temp = [];
      milestones.map(wf =>{
        let descData = [];
        let tempData = JSON.parse(JSON.stringify(wf.description));

        tempData.map((tmp)=>{
          descData.push(tmp.description)
        })
        
        temp.push({
          _id: wf._id,
          site: wf.site,
          description: JSON.parse(JSON.stringify(wf.description)),
          milestoneDate: wf.milestoneDate,
          formatDate: wf.formatDate,
          descriptionData: descData
        })
      })
      setMilestoneData(temp);
    }

    let member = members.filter((t)=> t._id === user.data.id && t.designation === "CIDCO Official");

    if(member.length > 0){
      setHide(true)
    }else{
      setHide(false)
    }
  }, [milestones]);

  const handleAdd =()=>{
    let match = false;
    let data = JSON.parse(JSON.stringify(milestoneData));

    data.forEach((dt)=>{
      if(moment(dt.milestoneDate).format("DD-MM-YYYY") === moment(milestoneDate).format("DD-MM-YYYY")){
        match = true;
      }
    })
       
    if(match === true){
      dispatchWarningMessage(dispatch, "Date Already Exists. Please Check.");
    }else{  
      let temp = {
        _id: FuseUtils.generateGUID(),
        site: milestone.site,
        description: milestone.description,
        milestoneDate: moment(milestoneDate).format('YYYY-MM-DD') + "T00:00:00.000Z",
        formatDate: moment(milestoneDate).format('DD-MM-YYYY')
      }

      data.push(temp);
      data.sort(function(a, b) {
        return new Date(b.milestoneDate) - new Date(a.milestoneDate);
      })
      updateContent(data);
      setMilestoneData(data);
      closeComposeDialog();
    }
  }

  const handleDateChange = (date) => {
    setMilestoneDate(date)
  };

  const handleChange = (prop) => (event) => {
    setMilestone({...milestone, [prop]: event.target.value})
  };

  const handleDeleteMilestone = () =>{
    let mat2 = JSON.parse(JSON.stringify(milestoneData));
    let filterData = mat2.filter((mat) => mat._id !== milestoneId);
    setMilestoneData(filterData);
    updateContent(filterData)
    setOpenDelete(false)
    setOpen(false)
  }

  const handleUpdate = () =>{
    let mat2 = JSON.parse(JSON.stringify(milestoneData));
    mat2.forEach((mt) => {
      if(mt._id === milestoneId){
        mt.site = milestone.site;
        mt.formatDate = moment(milestoneDate).format('DD-MM-YYYY');
        mt.milestoneDate = moment(milestoneDate).format('YYYY-MM-DD') + "T00:00:00.000Z";
        mt.description = milestone.description;
      }
    })

    mat2.sort(function(a, b) {
      return new Date(b.milestoneDate) - new Date(a.milestoneDate);
    })

    updateContent(mat2);
    setMilestoneData(mat2); 
    closeComposeDialog();
  }

  function closeComposeDialog(){
    setOpenArea(false);
    setMilestoneId('');
    setOpen(false);
    setType('New');
    setMilestoneDate(new Date()); 
    setMilestone({
      site: '',
      description : []
    })
  }

  function openDialog(data){
    setType('Edit');
    setOpen(true);
    setMilestoneDate(data.milestoneDate);
    setMilestoneId(data._id)
    let temp = [];
    if(typeof(data.description) === 'string'){
      temp.push(data.description)
    }else{
      temp = data.description
    }
    setMilestone({
      site: data.site,
      description: temp
    })
  }

  // For Description 
  const handleChangeData = (prop) => (event) =>{
    let temp ={
      _id: FuseUtils.generateGUID(),
      description: event.target.value
    }
    setData(temp)
  }

  function handleOpenFirst(_id, description){
    setOpenDescription(true);
    setDataId(_id)
    setData({ _id, description })
    setDialogType('Edit')
  }

  function handleAddData(){
    let description = JSON.parse(JSON.stringify(milestone.description));
    description.push(data);
    setMilestone({...milestone, description: description}); 
    setOpenDescription(false);
    setData({ _id: '', description: ''})
  }

  function handleUpdateData() {
    let description = JSON.parse(JSON.stringify(milestone.description));

    description.forEach((desc) => {
      if(desc._id === dataId){
        desc.description = data.description;
      }
    })

    setMilestone({...milestone, description: description}); 
    setOpenDescription(false);
    setData({ _id: '', description: ''}) 
  }

  const deleteDescription = (id) =>{
    let description = JSON.parse(JSON.stringify(milestone.description));
    description = description.filter((item) => item._id !== id);
    setMilestone({...milestone, description: description});  
  }

  const disableDataButton = () => {
    return (
      data.description.length > 0
    );
  };


  const updateContent = (data) =>{
    let values = { staffs, manHours, cashFlow, concernAreas, wayForward, milestones: data };
    setPageLoading(true);
    let id = details._id;
    dispatch(updateDataStructure({ id, values })).then((response) => {
      setPageLoading(false);
      closeComposeDialog();
    });
  }

  const disableButton = () => {
    return (
      milestone.site.length > 0 &&
      milestone.description.length > 0
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
            <ListItemText  className="font-bold"  primary="Milestones"/>
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
                  getTrProps={(state, rowInfo, column) => {
                    return {
                      className: '-striped -highlight items-center justify-center',
                    };
                  }}
                  data ={milestoneData}
                  columns={[
                    {
                      Header: 'Date',
                      style: { 'white-space': 'unset', 'text-align':'center' },
                      accessor: 'milestoneDate',
                      className: 'justify-center',
                      width: 200,
                      Cell: ({ row }) => (
                        <a
                          className='cursor-pointer'
                          onClick={hide === false ? () => openDialog(row._original): null}
                        >
                          {row._original.formatDate}
                        </a>
                      ) 
                    },
                    {
                      Header: 'Site',
                      style: { 'white-space': 'unset', 'text-align':'center' },
                      accessor: 'site',
                      className: 'justify-center',
                      width: 200,
                    },
                    {
                      Header: 'Description',
                      id: 'descriptionData',
                      style: { 'white-space': 'unset', 'text-align':'center' },
                      accessor: (i) => (
                        <Typography>
                          {i.descriptionData +" "}
                        </Typography>
                      ),
                      className: 'justify-center',
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
                  value={milestoneDate}
                  maxDate={today}
                  onChange={handleDateChange}
                  inputVariant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </MuiPickersUtilsProvider>
              <FormControl variant="outlined">
                <InputLabel id="demo-simple-select-outlined-label">
                  Select Site
                </InputLabel>
                <Select
                  labelId="demo-simple-select-outlined-label"
                  required
                  className="w-1 mr-10"
                  id="demo-simple-select-outlined"
                  value={milestone.site}
                  onChange={handleChange("site")}
                  label="Select Site"
                >
                  <MenuItem key="none" value="All">All</MenuItem>
                    {sites.map((site) => (
                      <MenuItem key={site._id} value={site.name}> {site.name} </MenuItem>
                    ))}
                  </Select>
                </FormControl>
            </div>
            <Accordion variant="outlined">   
              <AccordionSummary
               expandIcon={<ExpandMoreIcon />}
               aria-controls="panel1a-content"
               id="panel1a-header"
              >
               <Typography color="textPrimary">Items</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div className="flex flex-col w-full">
                  <List
                    component="nav"
                    // className={classes.root}
                    aria-label="mailbox folders"
                  >
                    {milestone.description.map((item) => (
                      <React.Fragment>
                        <Grid container alignItems="center" direction="row">
                          <Grid item xs={11}>
                            <ListItem
                              button
                              key={item._id}
                                  onClick={(ev) => {
                                    handleOpenFirst(
                                      item._id,
                                      item.description
                                    );
                                  }}
                            >
                              <ListItemText
                                primary={item.description}
                              />
                            </ListItem>
                          </Grid>
                          <Grid item xs={1}>
                            <IconButton
                              onClick={() => deleteDescription(item._id)}
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
                        setOpenDescription(true)
                        setDialogType('New');
                        setData({ _id: '', description: ''})
                      }}
                    >
                      Add
                    </Button>
                  </div>
                </div>
               
              </AccordionDetails>
            </Accordion>
            <div className='flex flex-row gap-10 mb-20 mt-10'> 
              {type === 'New' ?
                <Button
                  variant='contained'
                  color='primary'
                  disabled={!disableButton()}
                  onClick={() => handleAdd()}
                >
                  SAVE
                </Button> 
              :
                <Button
                  variant='contained'
                  color='primary'
                  onClick={() => handleUpdate()}
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

      <Dialog open={openDescription} className={classes.dialog}>
        <AppBar position="static" elevation={1}>
          <Toolbar>
            <Typography variant='subtitle1' color='inherit'>
              {dialogType === 'New' ? 'Add Item' : 'Update Item'}
            </Typography>
          </Toolbar>
        </AppBar>
        <DialogContent>
            <TextField
              style={{width:"300px"}}
              rows={3}
              multiline
              InputProps={{
                inputProps: { min: 0 }
              }}
              onKeyPress={(event) => {
                if (event?.key === '-' || event?.key === '+') {
                  event.preventDefault();
                }
              }}
              name="name"
              value={data.description}
              label="Description"
              onChange={handleChangeData("description")}
              variant="outlined"
              required
            />
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            onClick={() =>{
              setData({ _id: '', description: ''}) 
              setOpenDescription(false)
            }}
          >
            CANCEL
          </Button>
          {dialogType === "Edit" ? (
            <Button color="primary" disabled={!disableDataButton()} onClick={()=> handleUpdateData()} autoFocus>
              OK
            </Button>
          ) : (
            <Button   color="primary" disabled={!disableDataButton()} onClick={()=> handleAddData()} autoFocus>
              OK
            </Button>
          )}
        </DialogActions>
      </Dialog >

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
            onClick={() => {handleDeleteMilestone()}}
            color="primary"
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default Milestones;