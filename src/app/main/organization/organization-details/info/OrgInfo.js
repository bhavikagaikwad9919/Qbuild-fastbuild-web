import React, { useRef, useEffect, useState } from "react";
import FuseAnimate from "@fuse/core/FuseAnimate";
import { useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "react-redux";
import {
  Divider,
  Typography,
  Button,
  CircularProgress,
  Backdrop,
  Dialog,
  DialogActions,
  Toolbar,
  DialogContent,
  AppBar,
  Accordion,
  InputLabel,
  AccordionSummary,
  AccordionDetails,
  TextField,
  InputAdornment,
  DialogTitle,
  List
} from "@material-ui/core";
import "react-table-6/react-table.css";
import {  TextFieldFormsy } from "@fuse/core/formsy";
import Formsy from "formsy-react";
import CancelIcon from "@material-ui/icons/Cancel";
import IconButton from "@material-ui/core/IconButton";
import FuseAnimateGroup from '@fuse/core/FuseAnimateGroup';
import { updateOrganization } from "app/main/organization/store/organizationSlice";
import moment from "moment";
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import {  dispatchWarningMessage } from "app/utils/MessageDispatcher";
import FuseUtils from "@fuse/utils";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import DeleteIcon from "@material-ui/icons/Delete";
 
const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
  appBar: {
    position: 'relative',
  },
}));

let summaryState = {
  launch_date: new Date(),
  contractual_start: new Date(),
  contractual_finish: new Date(),
  revised_start: new Date(),
  revised_finish: new Date(),
  startTitle: '',
  finishTitle: ''
}

let initialState = {
  _id:'',
  name: '',
  address: '',
  contact: '',
  gstIn:'',
  cIn: '',
  pan: '',
  tan: '',
  total_drawings:0,
  //safeManHours:0
}

function OrgInfo(props) {
  const classes = useStyles(props);
  const dispatch = useDispatch();
  const details = useSelector(({ organizations }) => organizations.organization);
  const members = useSelector( ({ organizations }) => organizations.members);
  const selectedRoutes = useSelector(({ organizations }) => organizations.routes);
  const userId = useSelector(({ auth }) => auth.user.data.id);
  const [access, setAccess] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [loading, setLoading] = useState(false)
  const formRef = useRef(null);
  const [values, setValues] = useState(initialState);
  const user = useSelector(({ auth }) => auth.user);
  const [summary, setSummary] = useState(summaryState);
  const [wayForwards, setWayForwards] = useState([]);
  const [wayForward, setWayForward] = useState('');
  const [wayForwardId, setWayForwardId] = useState('');
  const [openDelete, setOpenDelete] = useState(false);
  const [type, setType] = useState('New');
  const [openArea, setOpenArea] = useState(false);
  const [hide, setHide] = useState(false);
  
  let day = 24 * 60 * 60 * 1000;
  let date = new Date();
  let today = moment(date).format("DD-MM-YYYY");
  let reportDate = moment(date).subtract(1, 'day').format("DD-MM-YYYY");

  useEffect(() => {
    if((userId === details.createdBy) || user.role === 'admin')
    {
      setAccess(true)
    }else{
      members.forEach((t)=>{  
        if(t._id === user.data.id && t.role !== "owner")
       {
         const member = t.access.filter((i)=>i === selectedRoutes);
         if(member.length > 0)
         {
           setAccess(true)
         }
       }

        if(t._id === user.data.id && t.designation === "CIDCO Official"){
			  	setHide(true)
			  }
      })
    }
  }, [access, members]);

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  function editOrganization(data){
    setEditOpen(true)
    setValues({
      _id:data._id,
      name:data.name,
      address:data.address,
      contact:data.contact,
      gstIn:data.gstIn,
      cIn: data.cIn,
      pan: data.pan,
      tan: data.tan,
      total_drawings: data.total_drawings,
      //safeManHours: data.safeManHours
    });
    setSummary(data.summary);
    setWayForwards(data.wayForward)
  }

  const handleDateChange = (prop) => (date) => {
    setSummary({ ...summary, [prop]: date });
  };

  
  const handleChangeSummary = (prop) => (event) => {
    setSummary({ ...summary, [prop]:  event.target.value });
  };

  function disableButton() {
    setIsFormValid(false);
  }
  
  function enableButton() {
    setIsFormValid(true);
  }
  
  function handleSubmit () {
    setLoading(true);
    setEditOpen(false);

    values.summary = summary;
    values.wayForward = wayForwards;
    dispatch(updateOrganization({values, organizationId : details._id})).then(
      (response) => {
        setValues(initialState)
        setSummary(summaryState);
        setLoading(false)
      }
    );
  }

  const handleAddWayForward = () =>{
    let mat = JSON.parse(JSON.stringify(wayForwards));
    let filterMat = mat.filter((mt)=> mt.name.toLowerCase() === wayForward.toLowerCase());

    if(filterMat.length > 0){
      dispatchWarningMessage(dispatch, "Building with same name is already there. Please Check.");
    }else {
      let temp = {
        _id: FuseUtils.generateGUID(),
        name : wayForward,
      }
   
      mat.push(temp)
      setWayForwards(mat);
      setWayForward('');
      setOpenArea(false);
      setWayForwardId('');
      setType('New');
    }
  }

  const handleChangeWay = (prop) => (event) => {
    setWayForward(event.target.value);
  };

  const concernDetail = (bl) =>{
    setType('Edit')
    setWayForwardId(bl._id)
    setWayForward(bl.name);
    setOpenArea(true)
  }

  const handleDeleteEntry = () =>{
    let mat = JSON.parse(JSON.stringify(wayForwards));
    let newMat = mat.filter((mt)=> mt._id !== wayForwardId);
    setWayForwards(newMat);
    setOpenDelete(false)
  }

  const handleUpdateWayForward = () =>{
    let mat = JSON.parse(JSON.stringify(wayForwards));
    
    mat.forEach((mt)=>{
      if(mt._id === wayForwardId){
        mt.name = wayForward;
      }
    })
    setWayForwards(mat);
    setWayForward('');
    setWayForwardId('');
    setOpenArea(false);
    setType('New');
  }


  function closeComposeDialog(){
    setOpenArea(false);
    setWayForward('');
    setType('New');
    setWayForwardId('')
  }

  function process(date){
    var parts = date.split("-");
    return new Date(parts[2], parts[1] - 1, parts[0]);
  }

  return (
    <React.Fragment>
      <Backdrop className={classes.backdrop} open={loading}>
          <CircularProgress color='inherit' />
       </Backdrop>
      <FuseAnimate animation="transition.slideUpIn">
       <>
          <div className="p-16 sm:p-24">
            <div className="flex flex-1 w-full mb-12">
              <div className="mr-10">
                <Typography className= "font-bold">Name:</Typography>
                <Typography variant="subtitle2">
                  {details.name}
                </Typography>
              </div>
              <div className="sm:mr-10 mr-26">
                <Typography className= "font-bold">Contact:</Typography>
                <Typography variant="subtitle2">{details.contact}</Typography>
              </div>
            </div>
            <Divider />
            <div className="flex flex-1 w-full mb-12">
              <div className="sm:mr-10 mr-26">
                <Typography className= "font-bold">Address:</Typography>
                <Typography variant="subtitle2" className="pt-4">
                  {details.address}
                </Typography>
              </div>
            </div>
            <Divider />
            <div className="flex flex-1 w-full my-12">
              <div className="mr-10">
                <Typography className= "font-bold">GSTIN:</Typography>
                <Typography variant="subtitle2">{details.gstIn}</Typography>
              </div>
              <div className="mr-10">
                <Typography className= "font-bold">CIN:</Typography>
                <Typography variant="subtitle2">{details.cIn}</Typography>
              </div>
            </div> 
            <Divider />
            <div className="flex flex-1 w-full my-12">
              <div className="mr-10">
                <Typography className= "font-bold">PAN No:</Typography>
                <Typography variant="subtitle2">{details.pan}</Typography>
              </div>
              <div className="mr-10">
                <Typography className= "font-bold">TAN No:</Typography>
                <Typography variant="subtitle2">{details.tan}</Typography>
              </div>
            </div> 
            <Divider />

            {details.orgType === 'SSA' ?
              <>
                <Typography className= "font-bold">Summary Timeline</Typography>
                <div className="flex flex-1 w-full my-12">
                  <div className="mr-10">
                    <Typography>Launch Date:</Typography>
                    <Typography variant="subtitle2" className= "font-bold">{moment(details.summary.launch_date).format("DD-MM-YYYY")}</Typography>
                  </div>
                  <div className="mr-10">
                    <Typography>Contractual Start:</Typography>
                    <Typography variant="subtitle2" className= "font-bold">{moment(details.summary.contractual_start).format("DD-MM-YYYY")}</Typography>
                  </div>
                  <div className="mr-10">
                    <Typography>Contractual Finish:</Typography>
                    <Typography variant="subtitle2" className= "font-bold">{moment(details.summary.contractual_finish).format("DD-MM-YYYY")}</Typography>
                  </div>
                </div> 
                <Divider />

                <div className="flex flex-1 w-full my-12">
                 <div className="mr-10">
                   <Typography>{details.summary.startTitle} :</Typography>
                   <Typography variant="subtitle2" className="font-bold">{moment(details.summary.revised_start).format("DD-MM-YYYY")}</Typography>
                 </div>
                 <div className="mr-10">
                   <Typography>{details.summary.finishTitle} :</Typography>
                   <Typography variant="subtitle2" className= "font-bold">{moment(details.summary.revised_finish).format("DD-MM-YYYY")}</Typography>
                 </div>
                </div>  
                <Divider />

                <div className="flex flex-1 w-full my-12">
                  <div className="mr-10">
                   <Typography>Time Lapsed in Days:</Typography>
                    <Typography variant="subtitle2" className= "font-bold">{Math.round(Math.abs((process(today) - process(moment(details.summary.contractual_start).format("DD-MM-YYYY"))) / day))}</Typography>
                  </div>
                  <div className="mr-10">
                    <Typography>Time to Complete in Days:</Typography>
                    <Typography className= "font-bold" variant="subtitle2">{Math.round(Math.abs((process(moment(details.summary.revised_finish).format("DD-MM-YYYY")) - process(reportDate)) / day))}</Typography>
                  </div>
                </div> 
                <Divider />

                <div className="flex flex-1 w-full my-12">
                  <div className="mr-10">
                   <Typography>Total Drawings:</Typography>
                    <Typography variant="subtitle2" className= "font-bold">{details.total_drawings}</Typography>
                  </div>
                  {/* <div className="mr-10">
                    <Typography>Safe Man Hours:</Typography>
                    <Typography className= "font-bold" variant="subtitle2">{details.safeManHours}</Typography>
                  </div> */}
                </div> 
                <Divider />

              </>
            :null}
          </div>
          {access && hide === false ?
            <div className="flex w-full items-end justify-start ml-20 mb-25">
              <>
                <Button
                  style={{ backgroundColor: "orange" }}
                  variant="contained"
                  onClick={() => editOrganization(details)}
                >
                  Update Info
                </Button>
              </> 
            </div>
          :null }
       </>
      </FuseAnimate>

      <Formsy
        onValid={enableButton}
        onInvalid={disableButton}
        ref={formRef}
      >
       <Dialog open={editOpen} className={classes.dialog}  fullWidth maxWidth='sm'>
         <FuseAnimateGroup
           enter={{ animation: 'transition.slideUpBigIn' }}
           leave={{ animation: 'transition.slideUpBigOut' }}
         >
            <AppBar className={classes.appBar}>
              <Toolbar>
                <Typography variant='subtitle1' className="flex w-full items-center justify-start gap-10" color='inherit'>
                  {'Update Organization'}
                </Typography>
                <div className="flex w-full items-center justify-end gap-10 ">
                  <IconButton onClick={() => setEditOpen(false)}>
                    <CancelIcon style={{ color: "red" }} />
                  </IconButton>
                </div>
              </Toolbar>
            </AppBar>
            <DialogContent>
             <div className="flex flex-1 flex-col">
               <TextFieldFormsy
                 className="mb-24 mt-10"
                 label="Name"
                 autoFocus
                 id="name"
                 name="name"
                 value={values.name}
                 onChange={handleChange("name")}
                 variant="outlined"
                 required
               />
               <TextFieldFormsy
                 validations={{ matchRegexp: /^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/  }}
                 validationErrors={{ matchRegexp: "Enter valid contact number" }}
                 className="mb-24"
                 label="Contact"
                 id="contact"
                 name="contact"
                 onChange={handleChange("contact")}
                 value={values.contact}
                 required
                 variant="outlined"
               />
               <TextFieldFormsy
                 className="mb-24"
                 label="Address"
                 autoFocus
                 id="address"
                 name="address"
                 value={values.address}
                 onChange={handleChange("address")}
                 variant="outlined"
                 required
                 multiline
                 rows={2}
               />
               <div class="grid grid-cols-2 divide-x divide-gray-400">
                 <TextFieldFormsy
                    className="w-1 mr-10 mb-24"
                    label="PAN No."
                    autoFocus
                    id="pan"
                    name="pan"
                    value={values.pan}
                    onChange={handleChange("pan")}
                    variant="outlined"
                  />
                  <TextFieldFormsy
                    className="w-1 ml-10 mb-24"
                    label="TAN No."
                    autoFocus
                    id="tan"
                    name="tan"
                    value={values.tan}
                    onChange={handleChange("tan")}
                    variant="outlined"
                  />
               </div>
               <div class="grid grid-cols-2 divide-x divide-gray-400">
                 <TextFieldFormsy
                   className="w-1 mr-10 mb-24"
                   label="GSTIN"
                   autoFocus
                   id="gstIn"
                   name="gstIn"
                   value={values.gstIn}
                   onChange={handleChange("gstIn")}
                   variant="outlined"
                 />
                 <TextFieldFormsy
                   className="w-1 ml-10 mb-24"
                   label="CIN"
                   autoFocus
                   id="cIn"
                   name="cIn"
                   value={values.cIn}
                   onChange={handleChange("cIn")}
                   variant="outlined"
                  />
               </div>

               {details.orgType === 'SSA' ? 
                 <>
                  <Accordion variant="outlined">
                 <AccordionSummary
                   expandIcon={<ExpandMoreIcon />}
                   aria-controls="panel1a-content"
                   id="panel1a-header"
                 >
                   <Typography color="textPrimary">Summary Timeline</Typography>
                 </AccordionSummary>
                 <AccordionDetails>
                   <div className="flex flex-col w-full">
                     <div className="grid grid-cols-3 divide-x divide-gray-400 mt-8">
                       <MuiPickersUtilsProvider utils={DateFnsUtils}>
                         <DatePicker
                           required
                           label="Launch Date"
                           className="w-1 mr-10"
                           format="dd/MM/yyyy"
                           value={summary.launch_date}
                           onChange={handleDateChange("launch_date")}
                           inputVariant="outlined"
                              InputLabelProps={{
                              shrink: true,
                           }}
                         />
                        </MuiPickersUtilsProvider>
                       <MuiPickersUtilsProvider utils={DateFnsUtils}>
                         <DatePicker
                           required
                           label="Contractual Start"
                           className="w-1 mr-10"
                           format="dd/MM/yyyy"
                           value={summary.contractual_start}
                           onChange={handleDateChange("contractual_start")}
                           inputVariant="outlined"
                              InputLabelProps={{
                              shrink: true,
                           }}
                         />
                        </MuiPickersUtilsProvider>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                          <DatePicker
                           required
                           label="Contractual Finish"
                           className="w-1 ml-10"
                           format="dd/MM/yyyy"
                           minDate={summary.contractual_start}
                           value={summary.contractual_finish}
                           onChange={handleDateChange("contractual_finish")}
                           inputVariant="outlined"
                           InputLabelProps={{
                             shrink: true,
                           }}
                          />
                        </MuiPickersUtilsProvider>         
                     </div>
                      <div className="grid grid-cols-2 divide-x divide-gray-400 mt-20">
                        <TextField
                          className="w-1 mr-10"
                          name="Start Title"
                          value={summary.startTitle}
                          label="Start Title"
                          onChange={handleChangeSummary("startTitle")}
                          variant="outlined"
                          required
                        />
                        <TextField
                         className="w-1 mr-10"
                         name="Finish Title"
                         value={summary.finishTitle}
                         label="Finish Title"
                         onChange={handleChangeSummary("finishTitle")}
                         variant="outlined"
                         required
                        />       
                      </div>
                     <div className="grid grid-cols-2 divide-x divide-gray-400 mt-20">
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                         <DatePicker
                           required
                           label="Start Date"
                           className="w-1 mr-10"
                           format="dd/MM/yyyy"
                           value={summary.revised_start}
                           onChange={handleDateChange("revised_start")}
                           inputVariant="outlined"
                              InputLabelProps={{
                              shrink: true,
                           }}
                         />
                        </MuiPickersUtilsProvider>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                          <DatePicker
                           required
                           label="Finish Date"
                           className="w-1 mr-10"
                           format="dd/MM/yyyy"
                           minDate={summary.revised_start}
                           value={summary.revised_finish}
                           onChange={handleDateChange("revised_finish")}
                           inputVariant="outlined"
                           InputLabelProps={{
                             shrink: true,
                           }}
                          />
                        </MuiPickersUtilsProvider>         
                     </div>
                    </div>
                  </AccordionDetails>
                  </Accordion>


                  <div className="grid grid-cols-2 mt-10 divide-x divide-gray-400">
                    <TextField
                      className="mb-10 mr-10"
                      type="number"
                      name="Total Drawings"
                      value={values.total_drawings}
                      label="Total Drawings"
                      onChange={handleChange("total_drawings")}
                      variant="outlined"
                      required
                    />
                    {/* <TextField
                      className="mb-10 ml-10"
                      type="number"
                      name="Safe Man Hours"
                      value={values.safeManHours}
                      label="Safe Man Hours"
                      onChange={handleChange("safeManHours")}
                      variant="outlined"
                      required
                    /> */}
                  </div>
                 </>
               :null}
             </div>
            </DialogContent>
            <DialogActions className="justify-start pl-16">
              <Button
               disabled={!isFormValid}
               variant="contained"
               color="primary"
               type="submit"
               onClick={() => handleSubmit()}
              >
                save
              </Button>
              <Button onClick={() => setEditOpen(false)} variant='contained'>
               Cancel
              </Button>
            </DialogActions>
         </FuseAnimateGroup>
       </Dialog>
      </Formsy>

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
             name="Way Forward"
             multiline
             rows='3'
             value={wayForward}
             label="Enter Data"
             onChange={handleChangeWay("wayForward")}
             variant="outlined"
             required
           />
           <div className='flex flex-row gap-10 mb-20 mt-10'> 
           {type === 'New' ?
            <Button
             variant='contained'
             color='primary'
             onClick={() => handleAddWayForward()}
            >
             SAVE
            </Button> 
           :
            <Button
             variant='contained'
             color='primary'
             onClick={() => handleUpdateWayForward()}
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
            onClick={() => {handleDeleteEntry()}}
            color="primary"
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default OrgInfo;
