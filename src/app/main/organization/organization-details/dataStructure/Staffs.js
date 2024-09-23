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
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ListItemText from "@material-ui/core/ListItemText";
import DeleteIcon from "@material-ui/icons/Delete";

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
  root: {
    maxHeight: "68vh",
  },
}));

function Staffs(props) {
  const classes = useStyles(props);
  const dispatch = useDispatch();
  const details = useSelector(({ organizations }) => organizations.organization);
  
  const wayForward = useSelector(({ organizations }) => organizations.dataStructure.wayForward);
  const milestones = useSelector(({ organizations }) => organizations.dataStructure.milestones);
  const concernAreas = useSelector(({ organizations }) => organizations.dataStructure.concernAreas);
  const manHours = useSelector(({ organizations }) => organizations.dataStructure.manHours);
  const cashFlow = useSelector(({ organizations }) => organizations.dataStructure.cashFlow);
  const staffData = useSelector(({ organizations }) => organizations.dataStructure.staffs);

  const [openDelete, setOpenDelete] = useState(false);
  const [type, setType] = useState('New');
  const [openArea, setOpenArea] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [staffs, setStaffs] = useState([]);
  const [staff, setStaff] = useState({ name:'', role:''});
  const [staffId, setStaffId] = useState('');  

  const [hide, setHide] = useState();
  const members = useSelector( ({ organizations }) => organizations.members);
  const user = useSelector(({ auth }) => auth.user);
  
  useEffect(() => {
    if(staffData !== undefined){
      setStaffs(staffData);
    }

    let member = members.filter((t)=> t._id === user.data.id && t.designation === "CIDCO Official");

    if(member.length > 0){
      setHide(true)
    }else{
      setHide(false)
    }
  }, []);

  const handleAddStaff = () =>{
    let mat = JSON.parse(JSON.stringify(staffs));
    
    let filterMat = mat.filter((mt)=> mt.name.toLowerCase() === staff.name.toLowerCase());

    if(filterMat.length > 0){
      dispatchWarningMessage(dispatch, "Building with same name is already there. Please Check.");
    }else {
      let temp = {
        _id: FuseUtils.generateGUID(),
        name : staff.name,
        role : staff.role
      }
      mat.push(temp);
      updateContent(mat);
      setStaffs(mat);
      setStaff({ name:'', role:''});
      setOpenArea(false);
      setStaffId('');
      setType('New');
    }
  }

  const staffDetail = (bl) =>{
    setType('Edit')
    setStaffId(bl._id)
    setStaff(bl);
    setOpenArea(true)
  }

  const handleDeleteStaff = () =>{
    let mat = JSON.parse(JSON.stringify(staffs));
    let newMat = mat.filter((mt)=> mt._id !== staffId);

    updateContent(newMat);
    setStaffs(newMat);
    setOpenDelete(false)
  }

  const handleUpdateStaff = () =>{
    let mat = JSON.parse(JSON.stringify(staffs));
    
    mat.forEach((mt)=>{
      if(mt._id === staffId){
        mt.name = staff.name;
        mt.role = staff.role;
      }
    })

    updateContent(mat);
    setStaffs(mat);
    setStaff({ name:'', role:''});
    setStaffId('');
    setOpenArea(false);
    setType('New');
  }

  const handleChange = (prop) => (event) => {
    setStaff({ ...staff, [prop]: event.target.value });
  };

  function closeComposeDialog(){
    setOpenArea(false);
    setStaff({ name:'', role:''});
    setStaffId('');
    setType('New');
  }

  const updateContent = (data) =>{
    let values = { staffs: data, manHours, cashFlow, concernAreas, wayForward, milestones };
    setPageLoading(true);
    let id = details._id;
    dispatch(updateDataStructure({ id, values })).then((response) => {
      setPageLoading(false);
      closeComposeDialog();
    });
  }

  
  return (
    <React.Fragment>     
      <div>
        <Backdrop className={classes.backdrop} open={pageLoading}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <Accordion variant="outlined" className="mb-20 ml-10 mr-10">
            <ListItem>
              <ListItemText  className="font-bold" variant="subtitle1" primary="Staff"/>
              {hide === false ?
                <Button
                  variant="contained"
                  color='primary'
                  onClick={() => {setOpenArea(true)}}
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
             <div className="grid grid-cols-3">
              {staffs.map((bl)=>(
                <ListItem>
                 <Typography 
                   role='button' 
                   className= "cursor-pointer font-bold" 
                   onClick={() => {staffDetail(bl)}}
                   variant="subtitle1"
                 >
                    {bl.name + " - "  + bl.role}
                 </Typography>   
                 <InputAdornment position="end">
                    <IconButton
                      color="primary"
                      onClick={() => {
                        setOpenDelete(true)
                        setStaffId(bl._id)
                      }}
                      className={classes.delete}
                    >
                      <DeleteIcon />
                    </IconButton>
                 </InputAdornment>
                </ListItem>
              ))}
            </div>
          </AccordionDetails>
          </Accordion>        
      </div>
              
      <Dialog open={openArea} fullWidth maxWidth='sm'>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <Typography variant='subtitle1' color='inherit'>
            {type === 'New' ? 'Add Data' : 'Update Data'}
          </Typography>
        </Toolbar>
      </AppBar>
      <DialogContent>
         <div className='flex flex-1 flex-col gap-12 w-full mt-10'>
           <TextField
             className="w-full"
             type="text"
             name="name"
             value={staff.name}
             label="Enter Name"
             onChange={handleChange("name")}
             variant="outlined"
             required
           />
            <TextField
             className="w-full"
             type="text"
             name="role"
             value={staff.role}
             label="Enter Role"
             onChange={handleChange("role")}
             variant="outlined"
             required
           />
           <div className='flex flex-row gap-10 mb-20 mt-10'> 
           {type === 'New' ?
            <Button
             variant='contained'
             color='primary'
             onClick={() => handleAddStaff()}
            >
             SAVE
            </Button> 
           :
            <Button
             variant='contained'
             color='primary'
             onClick={() => handleUpdateStaff()}
            >
             SAVE
            </Button>
           }
             
             <Button variant='contained' onClick={() => {closeComposeDialog()}}>
               Cancel
             </Button>
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
            onClick={() => {handleDeleteStaff()}}
            color="primary"
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default Staffs;