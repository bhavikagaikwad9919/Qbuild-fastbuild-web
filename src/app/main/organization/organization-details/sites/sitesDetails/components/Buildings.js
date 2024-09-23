import React, { useRef, useEffect, useState } from "react";
import Typography from "@material-ui/core/Typography";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import { updateDataStructure } from "../../store/sitesSlice";
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
import List from "@material-ui/core/List";
import ChipInput from "material-ui-chip-input";
import AddCircleIcon from "@material-ui/icons/AddCircle";

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
  root: {
    maxHeight: "68vh",
  },
}));



const initialState ={
    buildingStatus: '',
    statusDate: new Date(),
}

function Buildings(props) {
    const classes = useStyles(props);
    const dispatch = useDispatch();
    const details = useSelector(({ organizations }) => organizations.organization);
    const siteDetails = useSelector(({ sites }) => sites.details);
    const build = useSelector(({ sites }) => sites.dataStructure.buildings);
    const laborRole = useSelector(({ sites }) => sites.dataStructure.laborRole);
    const equipmentType = useSelector(({ sites }) => sites.dataStructure.equipmentType);
    const gradeType = useSelector(({ sites }) => sites.dataStructure.gradeType);

    const [pageLoading, setPageLoading] = useState(false); 
    const [openDelete, setOpenDelete] = useState(false);
    const [type, setType] = useState('New');
    const [form, setForm] = useState(initialState);
    const [dialogType, setDialogType] = useState('New');
    const [buildingData, setBuildingData] = useState([]);
    const [buildings, setBuildings] = useState([]);
    const [buildingId, setBuildingId] = useState('');
    const [building, setBuilding] = useState({
       name:'',
       status: '',
       floors: [],
       element: []
    });
    const[bldg, setBldg]= useState(false);
    const [openBuildingStatus, setOpenBuildingStatus]= useState(false);

    const [hide, setHide] = useState();
    const members = useSelector( ({ organizations }) => organizations.members);
    const user = useSelector(({ auth }) => auth.user);

    useEffect(() => {
        if(build !== undefined){
            let buildData = [];
            build.forEach((bl)=>{
                buildData.push({
                   "_id": bl._id,
                   "name": bl.name,
                   "floors": bl.floors,
                   "element": bl.element,
                   "status": bl.status === undefined || bl.status === null || bl.status ==='' ? "Unable To Start" : bl.status ,
                   "buildingData": bl.buildingData
                })
            })
            setBuildings(buildData);
        } 
      
      let member = members.filter((t)=> t._id === user.data.id && t.designation === "CIDCO Official");

      if(member.length > 0){
        setHide(true)
      }else{
        setHide(false)
      }
    }, [build]);

    //Buildings
    const handleAddBuilding = () =>{
        let mat = JSON.parse(JSON.stringify(buildings));
        let filterMat = mat.filter((mt)=> mt.name.toLowerCase() === building.name.toLowerCase());

        if(filterMat.length > 0){
           dispatchWarningMessage(dispatch, "Building with same name is already there. Please Check.");
        }else {
            let temp = {
              _id: FuseUtils.generateGUID(),
              name : building.name,
              floors : building.floors,
              element: building.element,
              status: building.status,
              buildingData: buildingData 
            }
   
           mat.push(temp)
           updateContent(mat);
           setBuildings(mat);
           closeDialog();
        }
    }
 
    const handleChangeBuilding = () => {
        let mat = JSON.parse(JSON.stringify(buildings));

        mat.map((mt)=>{
            if(mt._id === buildingId){
              mt.name = building.name;
              mt.floors = building.floors;
              mt.element = building.element;
              mt.status = buildingData.length === 0 ? 'Unable to Start' :buildingData[buildingData.length - 1].buildingStatus;
              mt.buildingData = buildingData;
            }
        })
        updateContent(mat);
        setBuildings(mat);
        closeDialog()
    }

    const handleDeleteBuilding = () =>{
        let mat = JSON.parse(JSON.stringify(buildings));
        let newMat = mat.filter((mt)=> mt._id !== buildingId);
        setBldg(false);
        setOpenDelete(false);
        updateContent(newMat);
        setBuildings(newMat);
    }

    function closeDialog(){
        setBuilding({
            name:'',
            status: '',
            floors: [],
            element: []
        });
        setBldg(false);
        setType('New');
        setForm(initialState);
        setBuildingData([])
    }
 
    // Floors

    function handleAddFloor(value) {
        let floors = building.floors;
        floors.push(value);
        setBuilding({...building, floors: floors});   
    }

    function handleDeleteFloor(role, id) {
        let floors = building.floors;
        floors = floors.filter((item) => item !== role);
        setBuilding({...building, floors: floors});   
    } 

    // Element

    function handleAddElement(value, id) {
       let elements = building.element;
       elements.push(value);
       setBuilding({...building,element: elements});   
    }

    
    function handleDeleteElement(role, id) {
        let elements = building.element;
        elements = elements.filter((item) => item !== role);
        setBuilding({...building, element: elements});   
    }

    function isFormValid() {
        return (
            building.name.length > 0 
        );
    }


    const handleSubmitBuildingStatus =()=>{
        let mat = JSON.parse(JSON.stringify(buildingData));
        let data = {
          _id: FuseUtils.generateGUID(),
          buildingStatus: form.buildingStatus,
          statusDate: form.statusDate
        }

        mat.push(data)
        setBuilding({...building, status: form.buildingStatus})
        setBuildingData(mat);
        setForm(initialState);
        setOpenBuildingStatus(false)
    }

    const handleUpdateBuildingStatus =()=>{
        let mat2 = JSON.parse(JSON.stringify(buildingData));
        mat2.map(build =>{
            if(build._id === form._id){
               build.buildingStatus = form.buildingStatus;
               build.statusDate = form.statusDate;
            }
        })
        setBuildingData(mat2);
        if(mat2.length > 0){
          setBuilding({...building, status: mat2[mat2.length - 1].buildingStatus})
        }else{
          setBuilding({...building, status: 'Unable to Start'})
        }
        setOpenBuildingStatus(false)
        setForm(initialState)
    }

    const deleteBuildingData = (id) =>{
       let mat2 = JSON.parse(JSON.stringify(buildingData));
       let filterData = mat2.filter((mat) => mat._id !== id);
       setBuildingData(filterData);
    }

    const handleDateChangeBuildingStatus =(prop)=>(date)=>{
      setForm({ ...form, [prop]: date });
    }

    const handleChangeBuildingStatus =(prop)=>(event)=>{
      setForm({ ...form, [prop]: event.target.value });
    }

    function closeComposeDialog(){
        setBldg(false);
        setBuildingData([]);
        setBuilding({
          name:'',
          floors: [],
          element: []
        })
    }

    function handleOpenFirst(_id, statusDate, buildingStatus){
        setForm({ _id, statusDate, buildingStatus})
        setDialogType('edit');
        setOpenBuildingStatus(true)
    }

    function openDialog(data){
        setBuildingId(data._id)
        setType('Edit');
        setBldg(true);
        setBuilding(data);
        if(data.buildingData === undefined){
           setBuildingData([])
        }else{
           setBuildingData(data.buildingData)
        }
    }

    const updateContent = (data) =>{
        let values = { laborRole, equipmentType, gradeType, buildings : data};

        setPageLoading(true);
        dispatch(updateDataStructure({ 
           organizationId: details._id,
           siteId: siteDetails._id,
           values
        })).then((response) => {
           setPageLoading(false); 
        });
    }

    const disableButton = () => {
        return (
           form.buildingStatus.length > 0 
        );
    };
    function handleClose(){
      setForm(initialState)
      setOpenBuildingStatus(false)
    }
  
  return (
    <React.Fragment>     
      <div>
        <Backdrop className={classes.backdrop} open={pageLoading}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <Accordion variant="outlined" className="mb-20 ml-10 mr-10">
            <ListItem>
              <ListItemText  className="font-bold" variant="subtitle1" primary="Building Status"/>
              {hide === false ? 
                <Button
                  variant="contained"
                  color='primary'
                  onClick={() => {
                    setBldg(true)
                    setType('New')
                  }}
                >
                  Add
                </Button>
              : null}
              
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
                    data ={buildings}
                    columns={[
                      {
                        Header: 'Building Name',
                        style: { 'white-space': 'unset', 'text-align':'center' },
                        accessor: 'name',
                        className: 'justify-center',
                        Cell: ({ row }) => (
                         
                          <a
                          className='cursor-pointer'
                          onClick={hide === false ? () => openDialog(row._original): null}
                        >
                          {row.name}
                        </a>
                        )
                      },
                      {
                        Header: 'Building Status',
                        style: { 'white-space': 'unset', 'text-align':'center' },
                        accessor: 'status',
                        className: 'justify-center',
                        Cell: ({ row }) => (
                          <Typography> {row.status} </Typography>
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
              
      <Dialog open={bldg} fullWidth maxWidth='xs' contentStyle={{ margin: 0, padding: 0 }}>
        <AppBar position="static" elevation={1}>
          <Toolbar>
            <Typography variant='subtitle1' color='inherit'>
              {type === 'New' ? 'Add Building Details' : 'Update Building Details'}
           </Typography>
          </Toolbar>
        </AppBar>
        <DialogContent>
          <div className='flex flex-1 flex-col gap-12 w-full mt-10'>
            <TextField 
              type="text" 
              name="name" 
              variant="outlined" 
              label="Building Name"                     
              value={building.name}
              onChange={(event) =>
                setBuilding({...building, name: event.target.value})
              }
            /> 
            <Accordion variant="outlined">   
              <AccordionSummary
               expandIcon={<ExpandMoreIcon />}
               aria-controls="panel1a-content"
               id="panel1a-header"
              >
               <Typography color="textPrimary">Building Status</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div className="flex flex-col w-full">
                  <List
                    component="nav"
                    // className={classes.root}
                    aria-label="mailbox folders"
                  >
                    {buildingData.map((item) => (
                      <React.Fragment>
                        <Grid container alignItems="center" direction="row">
                          <Grid item xs={11}>
                            <ListItem
                              button
                              key={item._id}
                                  onClick={(ev) => {
                                    handleOpenFirst(
                                      item._id,
                                      item.statusDate,
                                      item.buildingStatus
                                    );
                                  }}
                            >
                              <ListItemText
                                primary={"Date - "+moment(item.statusDate).format("DD-MM-YYYY")+" Status - "+item.buildingStatus}
                              />
                            </ListItem>
                          </Grid>
                          <Grid item xs={1}>
                            <IconButton
                              onClick={() => deleteBuildingData(item._id)}
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
                        setOpenBuildingStatus(true)
                        setDialogType('New')
                      }}
                    >
                      Add
                    </Button>
                  </div>
                </div>
               
              </AccordionDetails>
            </Accordion>
            
            <div className="flex flex-col w-full">
              <div className="p-10 sm:p-10">
                <div className="flex flex-1 w-full mb-12">
                  <Typography className= "font-bold" variant="subtitle1">Floors:</Typography>
                </div>
                <div className="flex flex-1 w-full mb-12">
                  <ChipInput
                    id="floors"
                    value={building.floors}
                    className = "w-full"
                    onAdd={(title) => handleAddFloor(title)}
                    onDelete={(title) => handleDeleteFloor(title)}
                    variant="outlined"
                  />
                </div>
              </div> 
              <div className="p-10 sm:p-10">
                <div className="flex flex-1 w-full mb-12">
                  <Typography className= "font-bold" variant="subtitle1">Element:</Typography>
                </div>
                <div className="flex flex-1 w-full mb-12">
                  <ChipInput
                    id="element"
                    value={building.element}
                    className = "w-full"
                    onAdd={(title) => handleAddElement(title)}
                    onDelete={(title) => handleDeleteElement(title)}
                    variant="outlined"
                  />
                </div>
            </div> 
               </div>
           <div className='flex flex-row gap-10 mb-20 mt-10'> 
           {type === 'New' ?
            <Button
             variant='contained'
             color='primary'
             disabled={!isFormValid()}
             onClick={() => handleAddBuilding()}
              >
             SAVE
            </Button> 
           :
            <Button
             variant='contained'
             color='primary'
             disabled={!isFormValid()}
             onClick={() => handleChangeBuilding()}
            >
             Update
            </Button>
           }
             
            <Button variant='contained' onClick={()=> closeComposeDialog()}>
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

        <Dialog open={openBuildingStatus} className={classes.dialog}>
            <AppBar position="static" elevation={1}>
                <Toolbar>
                    <Typography variant='subtitle1' color='inherit'>
                       {dialogType === 'New' ? 'Add Building Status' : 'Update Building Status'}
                    </Typography>
                </Toolbar>
            </AppBar>
            <DialogContent>
                <div className="grid grid-cols-2 divide-x divide-gray-400">
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <DatePicker
                            required
                            format="dd/MM/yyyy"
                            label="Select Date"
                            className="w-full mt-10"
                            value={form.statusDate}
                            onChange={handleDateChangeBuildingStatus('statusDate')}
                            inputVariant="outlined"
                            InputLabelProps={{
                              shrink: true,
                            }}
                        />
                    </MuiPickersUtilsProvider>
                    <FormControl variant="outlined"  className="w-1">
                        <InputLabel id="demo-simple-select-outlined-label"  className="w-1  ml-10 mt-10">
                            Building Status
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-outlined-label"
                          id="demo-simple-select-outlined"
                          value={form.buildingStatus}
                          className="w-1 ml-10 mt-10"
                          onChange={handleChangeBuildingStatus("buildingStatus")}
                          label="Status"                
                        >
                          <MenuItem value="Unable To Start">Unable To Start</MenuItem>
                          <MenuItem value="To Commence Shortly">To Commence Shortly</MenuItem>
                          <MenuItem value="In Progress">In Progress</MenuItem>
                          <MenuItem value="Completed">Completed</MenuItem>
                        </Select>
                    </FormControl>   
                </div>
            </DialogContent>
            <DialogActions>
                <Button  color="primary" onClick={() => handleClose()}>
                   CANCEL
                </Button>
                {dialogType === "edit" ? (
                    <Button color="primary" disabled={!disableButton()} onClick={()=> handleUpdateBuildingStatus()} autoFocus>
                        OK
                    </Button>
                ) : (
                    <Button   color="primary" disabled={!disableButton()} onClick={()=> handleSubmitBuildingStatus()} autoFocus>
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
            onClick={() => {handleDeleteBuilding()}}
            color="primary"
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>     
    </React.Fragment>
  );
}

export default Buildings;