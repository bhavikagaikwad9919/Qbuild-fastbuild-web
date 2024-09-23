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
  InputAdornment,
  Icon,
  List,
  Grid
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ListItemText from "@material-ui/core/ListItemText";
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

function AreaOfConcern(props) {
  const classes = useStyles(props);
  const dispatch = useDispatch();
  const details = useSelector(({ organizations }) => organizations.organization);
  
  const milestones = useSelector(({ organizations }) => organizations.dataStructure.milestones);
  const wayForward = useSelector(({ organizations }) => organizations.dataStructure.wayForward);
  const areaOfConcern = useSelector(({ organizations }) => organizations.dataStructure.concernAreas);
  const manHours = useSelector(({ organizations }) => organizations.dataStructure.manHours);
  const cashFlow = useSelector(({ organizations }) => organizations.dataStructure.cashFlow);

  const staffs = useSelector(({ organizations }) => organizations.dataStructure.staffs);
  const sites = useSelector( ({ organizations }) => organizations.sites);

  const [pageLoading, setPageLoading] = useState(false); 
  const [openDelete, setOpenDelete] = useState(false);
  const [type, setType] = useState('New');
  const [openArea, setOpenArea] = useState(false);

  const [open,setOpen] = useState(false);
  const [concernAreas, setConcernAreas] = useState([]);
  const [concernArea, setConcernArea] = useState({
    site: '',
    description : []
  })
  const [concernDate, setConcernDate] = React.useState(new Date());
  const [concernId, setConcernId] = useState(''); 

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
    if(areaOfConcern !== undefined){
      let temp = [];
      areaOfConcern.map(wf =>{
        let descData = [];
        let tempData = JSON.parse(JSON.stringify(wf.description));

        tempData.map((tmp)=>{
          descData.push(tmp.description)
        })
        
        temp.push({
          _id: wf._id,
          site: wf.site,
          description: JSON.parse(JSON.stringify(wf.description)),
          concernDate: wf.concernDate,
          formatDate: wf.formatDate,
          descriptionData: descData
        })
      })
      setConcernAreas(temp);
    }

    let member = members.filter((t)=> t._id === user.data.id && t.designation === "CIDCO Official");

    if(member.length > 0){
      setHide(true)
    }else{
      setHide(false)
    }
  }, [areaOfConcern]);

  const handleAdd =()=>{
    let match = false;
    let data = JSON.parse(JSON.stringify(concernAreas));

    data.forEach((dt)=>{
      if(moment(dt.concernDate).format("DD-MM-YYYY") === moment(concernDate).format("DD-MM-YYYY")){
        match = true;
      }
    })
       
    if(match === true){
      dispatchWarningMessage(dispatch, "Date Already Exists. Please Check.");
    }else{  
      let temp = {
        _id: FuseUtils.generateGUID(),
        site: concernArea.site,
        description: concernArea.description,
        concernDate: moment(concernDate).format('YYYY-MM-DD') + "T00:00:00.000Z",
        formatDate: moment(concernDate).format('DD-MM-YYYY')
      }

      data.push(temp);
      data.sort(function(a, b) {
        return new Date(b.concernDate) - new Date(a.concernDate);
      })
      updateContent(data);
      setConcernAreas(data);
      setConcernId('');
      setConcernDate(new Date());
      setOpen(false);
      setType('New');
    }
  }

  const handleDateChange = (date) => {
    setConcernDate(date)
  };

  const handleChange = (prop) => (event) => {
    setConcernArea({...concernArea, [prop]: event.target.value})
  };

  const handleUpdate = () =>{
    let mat2 = JSON.parse(JSON.stringify(concernAreas));
    mat2.forEach((mt) => {
      if(mt._id === concernId){
        mt.site = concernArea.site;
        mt.formatDate = moment(concernDate).format('DD-MM-YYYY');
        mt.concernDate = moment(concernDate).format('YYYY-MM-DD') + "T00:00:00.000Z";
        mt.description = concernArea.description;
      }
    })

    mat2.sort(function(a, b) {
      return new Date(b.concernDate) - new Date(a.concernDate);
    })

    updateContent(mat2);
    setConcernAreas(mat2);
    setType('new');
    setConcernDate(new Date()); 
    setConcernId('');
    setOpen(false);  
  }

  function closeComposeDialog(){
    setOpenArea(false);
    setConcernId('');
    setOpen(false);
    setType('New');
    setConcernDate(new Date());
    setConcernArea({
      site: '',
      description : []
    })
  }

  function openDialog(data){
    setType('Edit');
    setOpen(true);
    setConcernDate(data.concernDate);
    setConcernId(data._id)
    let temp = [];
    if(typeof(data.description) === 'string'){
      temp.push(data.description)
    }else{
      temp = data.description
    }
    setConcernArea({
      site: data.site,
      description : temp 
    })
  }

  const handleDeleteArea = () =>{
    let mat2 = JSON.parse(JSON.stringify(concernAreas));
    let filterData = mat2.filter((mat) => mat._id !== concernId);
    setConcernAreas(filterData);
    updateContent(filterData)
    setOpenDelete(false)
    setOpen(false)
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
    let description = JSON.parse(JSON.stringify(concernArea.description));
    description.push(data);
    setConcernArea({...concernArea, description: description}); 
    setOpenDescription(false);
    setData({ _id: '', description: ''})
  }
  
  function handleUpdateData() {
    let description = JSON.parse(JSON.stringify(concernArea.description));
  
    description.forEach((desc) => {
      if(desc._id === dataId){
        desc.description = data.description;
      }
    })
  
    setConcernArea({...concernArea, description: description}); 
    setOpenDescription(false);
    setData({ _id: '', description: ''}) 
  }
  
  const deleteDescription = (id) =>{
    let description = JSON.parse(JSON.stringify(concernArea.description));
    description = description.filter((item) => item._id !== id);
    setConcernArea({...concernArea, description: description});  
  }
  
  const disableDataButton = () => {
    return (
      data.description.length > 0
    );
  };

  const updateContent = (data) =>{
    let values = { staffs, manHours, cashFlow, concernAreas: data, wayForward, milestones };
    setPageLoading(true);
    let id = details._id;
    dispatch(updateDataStructure({ id, values })).then((response) => {
      setPageLoading(false);
      closeComposeDialog();
    });
  }

  const disableButton = () => {
    return (
      concernArea.site.length > 0 &&
      concernArea.description.length > 0
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
            <ListItemText  className="font-bold"  primary="Area Of Concern"/>
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
                  data ={concernAreas}
                  columns={[
                    {
                      Header: 'Date',
                      style: { 'white-space': 'unset', 'text-align':'center' },
                      accessor: 'concernDate',
                      className: 'justify-center',
                      width: 200,
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
          <Button  color="primary"
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
                value={concernDate}
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
                value={concernArea.site}
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
                    {concernArea.description.map((item) => (
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
            onClick={() => {handleDeleteArea()}}
            color="primary"
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default AreaOfConcern;