import React, { useState, useCallback, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import CircularProgress from "@material-ui/core/CircularProgress";
import { MuiPickersUtilsProvider, DatePicker, KeyboardDatePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import FormControl from "@material-ui/core/FormControl";
import FuseUtils from "@fuse/utils";
import moment from "moment/moment";
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    TextField,
    Typography,
    Button,
    Backdrop,
    Icon,
    IconButton,
    Grid,
  } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import { updateSample,addCubeRegister,closeEditDialog, closeNewDialog, routes} from "app/main/projects/store/projectsSlice";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Link from "@material-ui/core/Link";
import CancelIcon from "@material-ui/icons/Cancel";
import Autocomplete from '@material-ui/lab/Autocomplete';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 3,
    color: '#fff',
  },
  appBar: {
    position: 'relative',
  },
}));

let initialValues = {
  sampleNo: "",
  structural_members: "",
  location: "",
  supplierId: "",
  supplier: "",
  quantity: 0,
  rejectedQuantity: 0,
  grade: "",
  remarks: "",
  pourcardNo: "",
  sampleDate: null,
};

let initialstate = {
  weight:"",
  maxLoad:"",
  strength:"",
  length: 150,
  breadth: 150,
};

function CubeRegisterDialog(props) {
    const classes = useStyles(props);
    const dispatch = useDispatch();
    const projectId = useSelector(({ projects }) => projects.details._id);
    const details = useSelector(({ organizations }) => organizations.organization);
    const sampleDetails = useSelector(({ projects }) => projects.cubeRegister.detailSample);
    const projectDialog = useSelector(({ projects }) => projects.projectDialog);
    const loading = useSelector(({ projects }) => projects.loading);
    const role = useSelector(({ auth }) => auth.user);
    const projects = useSelector(({ projects }) => projects);
    const team = useSelector(({ projects }) => projects.details.team);
    const [addOpenFirst, setAddOpenFirst] = useState(false);
    const [addOpenSecond, setAddOpenSecond] = useState(false);
    const [values, setValues] = useState(initialValues);
    const [open, setOpen] = useState(false);
    const [showFirst, setShowFirst] = useState(false);
    const [showSecond, setShowSecond] = useState(false);
    const [firstTest, setFirstTest] = useState(initialstate);
    const [firstTestData, setFirstTestData] = useState([]);
    const [secondTest, setSecondTest] = useState(initialstate);
    const [secondTestData, setSecondTestData] = useState([]);
    const [type, setType] = useState('');
    const vendors = useSelector(({ projects }) => projects.vendors);
    const gradeType = useSelector(({ dataStructure }) => dataStructure.gradeType);
    const ssaGradeType = useSelector(({ sites }) => sites.dataStructure.gradeType);
    const [hide, setHide] = useState(false)
    let gradeList = [];
    if(details === undefined || details === null){
      gradeList = gradeType;
    }else{
      if(details.orgType === 'SSA'){
        gradeList = ssaGradeType;
      }else if(details.orgType === undefined || details.orgType === null){
        gradeList = gradeType;
      }else{
        gradeList = gradeType;
      }
    }

    const [firstlist, setFirstList] = useState({
      id: "",
      weight: "",
      maxLoad: "",
      strength: "",
    });

    const [secondlist, setSecondList] = useState({
      id: "",
      weight: "",
      maxLoad: "",
      strength: "",
    });

    let today = new Date()
    var currentDate = moment(today).format("DD/MM/YYYY");
    let vendorsName = [];

    vendors.vendorsList.forEach((item) => {
      if(item.agencyType === 'Supplier'){
        vendorsName.push(item.name);
      }
    });

    useEffect(() => {
      team.forEach((t)=>{
        if(t._id === role.data.id && t.role === "CIDCO Official"){
          setHide(true)
         }
      })
    }, [role.data.id, team]);

    const initprojectDialog = useCallback(() => {
      setOpen(true);
       if (projectDialog.Dialogtype === 'edit') {
         setType('edit');
       }
 
       if (projectDialog.Dialogtype === "edit" && projectDialog.data) {
         if (sampleDetails !== '') {
           let first = moment(sampleDetails.First_Test_Date).format("DD/MM/YYYY");
           let second = moment(sampleDetails.Second_Test_Date).format("DD/MM/YYYY");

           if(process(first) <= process(currentDate))
           {
              setShowFirst(true);
           }

           if(process(second) <= process(currentDate))
           {
              setShowSecond(true);
           }
           
           if(sampleDetails.supplierId === undefined)
           {
            setValues({
              sampleNo: sampleDetails.sampleNo,
              grade: sampleDetails.grade === undefined ? '' : sampleDetails.grade,
              sampleDate: sampleDetails.sampleDate,
              structural_members: sampleDetails.structural_members === undefined ? '' : sampleDetails.structural_members,
              location: sampleDetails.location === undefined ? '' : sampleDetails.location,
              remarks: sampleDetails.remarks === undefined ? '' : sampleDetails.remarks,
              pourcardNo: sampleDetails.pourcardNo === undefined ? '' : sampleDetails.pourcardNo,
              supplierId: sampleDetails.supplierId === undefined ? '' : sampleDetails.supplierId,
              supplier: sampleDetails.supplier === undefined ? '' : sampleDetails.supplier,
              quantity: sampleDetails.quantity === undefined ? 0 : sampleDetails.quantity,
              rejectedQuantity: sampleDetails.rejectedQuantity === undefined ? 0 : sampleDetails.rejectedQuantity
            });
           }else{
            let newSupplier = vendors.vendorsList.filter((ven)=>ven._id === sampleDetails.supplierId);
            setValues({
              sampleNo: sampleDetails.sampleNo,
              grade: sampleDetails.grade === undefined ? '' : sampleDetails.grade,
              sampleDate: sampleDetails.sampleDate,
              structural_members: sampleDetails.structural_members === undefined ? '' : sampleDetails.structural_members,
              location: sampleDetails.location === undefined ? '' : sampleDetails.location,
              remarks: sampleDetails.remarks === undefined ? '' : sampleDetails.remarks,
              pourcardNo: sampleDetails.pourcardNo === undefined ? '' : sampleDetails.pourcardNo,
              supplierId: sampleDetails.supplierId === undefined ? '' : sampleDetails.supplierId,
              supplier: newSupplier[0] === undefined ? '' : newSupplier[0].name,
              quantity: sampleDetails.quantity === undefined ? 0 : sampleDetails.quantity,
              rejectedQuantity: sampleDetails.rejectedQuantity === undefined ? 0 : sampleDetails.rejectedQuantity
            });
           }
           
           setFirstTestData(sampleDetails.FirstTestData[0].data)
           setSecondTestData(sampleDetails.SecondTestData[0].data)
         }
       }
 
       if (projectDialog.Dialogtype === "new") {
         setValues(initialValues);
         setFirstTest(initialstate);
         setSecondTest(initialstate);
       }
     }, [projectDialog.data, projectDialog.Dialogtype, sampleDetails]);

    useEffect(() => {
      if (projectDialog.props.open) {
        initprojectDialog();
      }
    }, [projectDialog.props.open, initprojectDialog]);

    const handleChange = (prop) => (event) => {
      setValues({ ...values, [prop]: event.target.value });
    };

    const changeRoleOptionBaseOnValue = (value) => {
      let supp = vendors.vendorsList.filter((ven) => ven.name === value && ven.agencyType === 'Supplier');
      if(supp.length > 0)
      {
        setValues({ ...values, "supplier": value, "supplierId": supp[0]._id });
      }else{
        setValues({ ...values, "supplier": value, "supplierId": '' });
      } 
    }
    
    function process(date){
      var parts = date.split("/");
      return new Date(parts[2], parts[1] - 1, parts[0]);
    }

    function closeComposeDialog() {
      projectDialog.Dialogtype === "edit"
      ? dispatch(closeEditDialog())
      : dispatch(closeNewDialog());

      setValues(initialValues);
      setFirstTest(initialstate);
      setFirstTestData([]);
      setSecondTest(initialstate);
      setSecondTestData([]);
      setShowFirst(false);
      setShowSecond(false);
    }

    const handleDateChange = (date) => {
      setValues({ ...values, sampleDate: date });

      let first = moment(date).add(7, 'day').format("DD/MM/YYYY");
      let second = moment(date).add(28, 'day').format("DD/MM/YYYY");
    
      if(process(first) <= process(currentDate))
      {
        setShowFirst(true);
      }else{
        setFirstTest(initialstate);
        setFirstTestData([]);
        setShowFirst(false);
      }
  
      if(process(second) <= process(currentDate))
      {
        setShowSecond(true);
      } else{
        setSecondTest(initialstate);
        setSecondTestData([]);
        setShowSecond(false);
      }
    };

    const handleFirstChange = (prop) => (event) => {
      setFirstTest({ ...firstTest, [prop]: event.target.value });
    };
    
    const handleSecondChange = (prop) => (event) => {
      setSecondTest({ ...secondTest, [prop]: event.target.value });
    };
 
    const addFirstData = () => {
      let tempValue = (firstTest.length * firstTest.breadth) / 1000;

      let data = {
        _id: FuseUtils.generateGUID(24),
        weight: firstTest.weight,
        maxLoad: firstTest.maxLoad,
        strength: (firstTest.maxLoad / tempValue).toFixed(2),
        length: firstTest.length,
        breadth: firstTest.breadth,
      };
      setFirstTestData([...firstTestData, data]);
      setAddOpenFirst(false);
      setFirstTest(initialstate);
    }
    
    const addSecondData = () => {
      let tempValue = (secondTest.length * secondTest.breadth) / 1000;

      let data = {
        _id: FuseUtils.generateGUID(),
        weight: secondTest.weight,
        maxLoad: secondTest.maxLoad,
        strength: (secondTest.maxLoad / tempValue).toFixed(2),
        length: secondTest.length,
        breadth: secondTest.breadth,
      };
      setSecondTestData([...secondTestData, data]);
      setAddOpenSecond(false);
      setSecondTest(initialstate);
    }
 
    const handleCloseFirst = () => {
      setAddOpenFirst(false);
    };
    
    const handleCloseSecond = () => {
      setAddOpenSecond(false);
    };
    
    function deleteFirstData(id) {
      let data = JSON.parse(JSON.stringify(firstTestData));
      let deletedData = data.filter((item) => item._id !== id);
      setFirstTestData(deletedData);
    }
    
    function deleteSecondData(id) {
      let data = JSON.parse(JSON.stringify(secondTestData));
      let deletedData = data.filter((item) => item._id !== id);
      setSecondTestData(deletedData);
    }

    function handleOpenFirst( id, weight,  maxLoad, strength, length, breadth) {
      setType("Edit");
      setAddOpenFirst(true)
      setFirstTest({ weight, maxLoad, strength, length, breadth });
      setFirstList({ id,  weight, maxLoad, strength, length, breadth });
    }

    function handleOpenSecond(
      id,
      weight,
      maxLoad,
      strength,
      length, breadth
    ) {
      setType("Edit");
      setAddOpenSecond(true)
      setSecondTest({ weight, maxLoad, strength, length, breadth });
      setSecondList({ id,  weight, maxLoad, strength, length, breadth });
    }

    function listChange() {
      let data = JSON.parse(JSON.stringify(firstTestData));
      if (firstTest.weight === "" && firstTest.maxLoad === "") {
        setAddOpenFirst(false);
      } else {
        data.forEach((item) => {
          if (item._id === firstlist.id) {
            let tempValue = (firstTest.length * firstTest.breadth) / 1000;

            item.weight = firstTest.weight;
            item.maxLoad = firstTest.maxLoad;
            item.strength = (firstTest.maxLoad / tempValue).toFixed(2);
            item.length = firstTest.length;
            item.breadth = firstTest.breadth;
          }
        });
        setFirstTestData(data);
        setAddOpenFirst(false);
        setFirstTest(initialstate);
      }
    }

    function listChangeSecond() {
      let data = JSON.parse(JSON.stringify(secondTestData));
      if (secondTest.weight === "" && secondTest.maxLoad === "") {
        setAddOpenFirst(false);
      } else {
        data.forEach((item) => {
          if (item._id === secondlist.id) {
            let tempValue = (secondTest.length * secondTest.breadth) / 1000;

            item.weight = secondTest.weight;
            item.maxLoad = secondTest.maxLoad;
            item.strength = (secondTest.maxLoad / tempValue).toFixed(2);
            item.length = secondTest.length;
            item.breadth = secondTest.breadth;
          }
        });
        setSecondTestData(data);
        setAddOpenSecond(false);
        setSecondTest(initialstate);
      }
    }
    
    const disableButton = () => {
      return (
        values.sampleNo.length > 0 &&
        values.grade.length && 
        values.supplier.length > 0 
      );
    };
 
    const handleUpdate = () => {
      let FirstTest = [];
      let SecondTest = [];
      let firstTestDate = moment(values.sampleDate).add(7, 'day');
      let secondTestDate = moment(values.sampleDate).add(28, 'day');
      let testingReminderDate = moment(values.sampleDate).add(1, 'day');
      let firstResultReminderDate =moment(values.sampleDate).add(7, 'day');
      let secondResultReminderDate = moment(values.sampleDate).add(28, 'day');
      let status = 0;

      FirstTest = JSON.parse(JSON.stringify(firstTestData));
      FirstTest.forEach((item) => {
        delete item._id;
      });
      SecondTest = JSON.parse(JSON.stringify(secondTestData));
      SecondTest.forEach((item) => {
        delete item._id;
      });

      var count1 = 0, sumStrength1 = 0, avg1 = 0;
      for (var key in firstTestData) {
        if (firstTestData.hasOwnProperty(key)) {
          if (firstTestData[key].hasOwnProperty("strength")) {
            sumStrength1 += parseFloat(firstTestData[key].strength);
            count1 += 1;
          }
        }
      }
        avg1 = sumStrength1/count1;
    
      var count2 = 0, sumStrength2 = 0, avg2 = 0;
      for (var key in secondTestData) {
        if (secondTestData.hasOwnProperty(key)) {
          if (secondTestData[key].hasOwnProperty("strength")) {
            sumStrength2 += parseFloat(secondTestData[key].strength);
            count2 += 1;
          }
        }
      }
        avg2 = sumStrength2/count2;

        if(FirstTest.length > 0){
          if(SecondTest.length > 0){
            status = 3;
          }else{
            status = 2;
          }
        }else {
          status = 1;
        }

      let finalData = {
        "sampleNo" : values.sampleNo,
        "structural_members" : values.structural_members,
        "location" : values.location,
        "remarks" : values.remarks,
        "pourcardNo" : values.pourcardNo,
       // "supplierId" : values.supplierId,
        "supplier" : values.supplier,
        "quantity" : Number(values.quantity),
        "rejectedQuantity" : Number(values.rejectedQuantity),
        "sampleDate" : values.sampleDate,
        "grade" : values.grade,
        "First_Test_Date" : new Date(firstTestDate),
        "Second_Test_Date" : new Date(secondTestDate),
        "Testing_Reminder_Date" : new Date(testingReminderDate),
        "Testing_Notified" : values.sampleDate !== sampleDetails.sampleDate ? "No" :sampleDetails.Testing_Notified,  
        "FirstResult_Reminder_Date" : new Date(firstResultReminderDate),
        "First_Reminder_Notified" : values.sampleDate !== sampleDetails.sampleDate ? "No" : sampleDetails.First_Reminder_Notified,
        "SecondResult_Reminder_Date" : new Date(secondResultReminderDate),
        "Second_Reminder_Notified" : values.sampleDate !== sampleDetails.sampleDate ? "No" : sampleDetails.Second_Reminder_Notified,
        "FirstTestData" : [{
          "age" : 7,
          "avg" : avg1,
          "data" : FirstTest
        }],
        "SecondTestData" : [{
          "age" : 28,
          "avg" : avg2,
          "data" : SecondTest
        }],
        "userId" : sampleDetails.userId,
        "userIds" : sampleDetails.userIds,
        "projectId" : sampleDetails.projectId,
        "projectName" : sampleDetails.projectName,
        "status" : status,
      }

      var sampleId = sampleDetails._id;

      dispatch(updateSample({ projectId, sampleId, finalData })).then((response) => {
        closeComposeDialog();
      });
    };

    const handleSubmit = () => {
      let FirstTest = [];
      let SecondTest = [];
      let firstTestDate = moment(values.sampleDate).add(7, 'day');
      let secondTestDate = moment(values.sampleDate).add(28, 'day');
      let testingReminderDate = moment(values.sampleDate).add(1, 'day');
      let firstResultReminderDate =moment(values.sampleDate).add(7, 'day');
      let secondResultReminderDate = moment(values.sampleDate).add(28, 'day');
            
      FirstTest = JSON.parse(JSON.stringify(firstTestData));
      FirstTest.forEach((item) => {
        delete item._id;
      });
      SecondTest = JSON.parse(JSON.stringify(secondTestData));
      SecondTest.forEach((item) => {
        delete item._id;
      });
    
      var count1 = 0, sumStrength1 = 0, avg1 = 0;
      for (var key in firstTestData) {
        if (firstTestData.hasOwnProperty(key)) {
          if (firstTestData[key].hasOwnProperty("strength")) {
            sumStrength1 += parseFloat(firstTestData[key].strength);
            count1 += 1;
          }
        }
      }
        avg1 = sumStrength1/count1;
    
      var count2 = 0, sumStrength2 = 0, avg2 = 0;
      for (var key in secondTestData) {
        if (secondTestData.hasOwnProperty(key)) {
          if (secondTestData[key].hasOwnProperty("strength")) {
            sumStrength2 += parseFloat(secondTestData[key].strength);
            count2 += 1;
          }
        }
      }
        avg2 = sumStrength2/count2;
    
        var userIds=[];
    
      if(role!=='owner')
      {
        userIds.push(role.data.id)
      }
        
      team.map((team)=>{
        if(team.role === "owner")
        {
          userIds.push(team._id)
        }
      })
      let unique = userIds.filter((item, i, ar) => ar.indexOf(item) === i);
    
      let finalData = {
        "sampleNo" : values.sampleNo,
        "structural_members" : values.structural_members,
        "location" : values.location,
        "remarks" : values.remarks,
        "pourcardNo" : values.pourcardNo,
        //"supplierId" : values.supplierId,
        "supplier" : values.supplier,
        "quantity" : Number(values.quantity),
        "rejectedQuantity" : Number(values.rejectedQuantity),
        "sampleDate" : values.sampleDate,
        "grade" : values.grade,
        "First_Test_Date" : new Date(firstTestDate),
        "Second_Test_Date" : new Date(secondTestDate),
        "Testing_Reminder_Date" : new Date(testingReminderDate),
        "Testing_Notified" : "No",  
        "FirstResult_Reminder_Date" : new Date(firstResultReminderDate),
        "First_Reminder_Notified" : "No",
        "SecondResult_Reminder_Date" : new Date(secondResultReminderDate),
        "Second_Reminder_Notified" : "No",
        "FirstTestData" : [{
          "age" : 7,
          "avg" : avg1,
          "data" : FirstTest
        }],
        "SecondTestData" : [{
          "age" : 28,
          "avg" : avg2,
          "data" : SecondTest
        }],
        "userId" : role.data.id,
        "userIds" : unique,
        "projectId" : projectId,
        "projectName" : projects.details.title,
        "status": 1,
      }
    
      dispatch(addCubeRegister({ projectId, finalData })).then((response) => {
        closeComposeDialog();
      });
    };


  return (
    <div className='flex flex-1 w-full'>
      <Dialog open={open} {...projectDialog.props} fullWidth maxWidth="sm"> 
        <Backdrop className={classes.backdrop} open={loading}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <Typography className="w-full mr-10"  variant='subtitle1' color='inherit'>
              {projectDialog.Dialogtype === 'new' ? 'Add Sample' : 'Update Sample'}
            </Typography>
            <IconButton onClick={() => closeComposeDialog()}>
              <CancelIcon style={{ color: "red" }} />
            </IconButton>
          </Toolbar>
        </AppBar>

        <DialogContent>
         

          <div className="grid grid-cols-2 divide-x divide-gray-400">   
          <TextField
            value={values.sampleNo}
            required
            className="w-1 mr-10 my-10 mx-5"
            fullWidth
            onChange={handleChange("sampleNo")}
            id="outlined-basic"
            label="Sample No."
            variant="outlined"
          /> 
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                required
                disableToolbar
                label="Date of Casting"
                className="w-1 ml-10 my-10 mx-5"
                format="dd/MM/yyyy"
                maxDate={today}
                value={values.sampleDate}
                onChange={handleDateChange}
                inputVariant="outlined"
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </MuiPickersUtilsProvider>   
          </div>

          <div className="grid grid-cols-2 divide-x divide-gray-400">   
            <TextField
              value={values.quantity}
              className="w-1 mr-10 my-10 mx-5"
              onChange={handleChange("quantity")}
              id="outlined-basic"
              label="Recieved Quantity"
              type="Number"
              fullWidth
              variant="outlined"
            />  
             <TextField
              value={values.rejectedQuantity}
              className="w-1 ml-10 my-10 mx-5"
              onChange={handleChange("rejectedQuantity")}
              id="outlined-basic"
              label="Rejected Quantity"
              type="Number"
              variant="outlined"
            />  
            {/* <TextField
              value={values.pourcardNo}
              className="w-1 ml-10 my-10 mx-5"
              onChange={handleChange("pourcardNo")}
              id="outlined-basic"
              label="Pour Card No"
              variant="outlined"
            />   */}
          </div>

          <div className="grid grid-cols-2">  
            <FormControl variant="outlined" className="mt-8">
              <InputLabel id="demo-simple-select-outlined-label" fullWidth required>
                Select Grade
              </InputLabel>
              <Select
                required
                fullWidth
                className="w-1 mr-10 mx-5"
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={values.grade}
                onChange={handleChange("grade")}
                label="Grade"
              >
                {gradeList.map((wo) => (
                  <MenuItem value={wo}>
                    <Typography>{wo}</Typography>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Autocomplete
              id="supplier"
              required
              freeSolo
              className="w-1 ml-10 my-10"
              options={vendorsName}
              value={values.supplier}
              onInputChange={(event, value) => {
                changeRoleOptionBaseOnValue(value);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Supplier"
                  required
                  onChange={handleChange("supplier")}
                  variant="outlined"
                />
              )}
            />
          </div>

          <div className="grid grid-cols-2 divide-x divide-gray-400">   
            <TextField
              className="w-1 mr-10 my-10 mx-5"
              value={values.location}
              fullWidth
              onChange={handleChange("location")}
              id="outlined-basic"
              label="Location/Floor"
              variant="outlined"
            />  
             <TextField
              value={values.remarks}
              className="w-1 ml-10 my-10 mx-5"
              onChange={handleChange("remarks")}
              id="outlined-basic"
              label="Remarks"
              variant="outlined"
            />  
          </div>
         
          <TextField
            value={values.structural_members}
            className="my-10"
            multiline
            rows="3"
            fullWidth
            onChange={handleChange("structural_members")}
            id="outlined-basic"
            label="Structural Members"
            variant="outlined"
          /> 


           <>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography color="textSecondary">First Testing Data</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <div className="flex flex-col w-full">
                    <List
                      component="nav"
                      aria-label="mailbox folders"
                    >
                      {firstTestData.map((item) => (
                        <React.Fragment>
                          <Grid container alignItems="center" direction="row">
                            <Grid item xs={11}>
                              <ListItem
                                button
                                key={item._id}
                                onClick={(ev) => {
                                  handleOpenFirst(
                                    item._id,
                                    item.weight,
                                    item.maxLoad,
                                    item.strength,
                                    item.length ? item.length : 150,
                                    item.breadth ? item.breadth : 150,
                                  );
                                }}
                              >
                                 <ListItemText
                                   primary={"Weight-"+item.weight+", Max Load-"+item.maxLoad+", Strength-"+item.strength}
                                   />
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
                        disabled={showFirst === true ? false :true}
                        onClick={() =>{
                          setAddOpenFirst(true)
                          setType("new")
                          setFirstTest(initialstate);}}
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                </AccordionDetails>
              </Accordion>
              
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography color="textSecondary">Second Testing Data</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <div className="flex flex-col w-full">
                    <List
                      component="nav"
                      // className={classes.root}
                      aria-label="mailbox folders"
                    >
                      {secondTestData.map((item) => (
                        <React.Fragment>
                          <Grid container alignItems="center" direction="row">
                            <Grid item xs={11}>
                              <ListItem
                                button
                                key={item._id}
                                onClick={(ev) => {
                                  handleOpenSecond(
                                    item._id,
                                    item.weight,
                                    item.maxLoad,
                                    item.strength,
                                    item.length ? item.length : 150,
                                    item.breadth ? item.breadth : 150,
                                 );
                               }}
                              >
                                 <ListItemText
                                    primary={"Weight-"+item.weight+", Max Load-"+item.maxLoad+", Strength-"+item.strength}
                                 />
                              </ListItem>
                            </Grid>
                            <Grid item xs={1}>
                              <IconButton
                                onClick={() => deleteSecondData(item._id)}
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
                        disabled={showSecond === true ? false :true}
                        onClick={() =>{
                         setAddOpenSecond(true)
                         setType("new")
                         setSecondTest(initialstate)
                        }}
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                </AccordionDetails>
              </Accordion>
           </>

            
          <div className="flex flex-1 flex-row gap-10 my-12">
            {projectDialog.Dialogtype === 'new' ? (
              <Button
                disabled={!disableButton()}
                onClick={()=>handleSubmit()}
                variant="contained"
                color="primary"
              >
                Save
              </Button>  
            ) :
            (hide === true ? null :
              <Button
                disabled={!disableButton()}
                onClick={()=>handleUpdate()}
                variant="contained"
                color="primary"
              >
                Update
              </Button>
            )}
              <Button onClick={()=>closeComposeDialog()} variant="contained">
                Cancel
              </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={addOpenFirst}
        onClose={()=>handleCloseFirst()}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
       {type === "Edit" ? (
           <DialogTitle id="alert-dialog-title">{"Edit Data"}</DialogTitle>
         ) : (
           <DialogTitle id="alert-dialog-title">{"Add Data"}</DialogTitle>
       )}
         <DialogContent>
            <div class="w-auto">
              <FormControl variant="outlined">
                <div className="grid grid-cols-2 divide-x divide-gray-400">   
                 <TextField
                   className="w-1 mr-10 mx-5 my-10"
                   defaultValue={firstTest.length}
                   onChange={handleFirstChange("length")}
                   id="outlined-basic"
                   label="Length (In mm)"
                   type="Number"
                   variant="outlined"
                 />  
                 <TextField
                   className="w-1 ml-10 mx-5 my-10"
                   defaultValue={firstTest.breadth}
                   onChange={handleFirstChange("breadth")}
                   id="outlined-basic"
                   label="Breadth (In mm)"
                   type="Number"
                   variant="outlined"
                 /> 
                </div>

                <div className="grid grid-cols-2 divide-x divide-gray-400">  
                  <TextField
                    variant="outlined"
                    label="Weights In Kgs"
                    className="w-1 mr-10 mx-5 my-10"
                    defaultValue={firstTest.weight}
                    type="Number"
                    onChange={handleFirstChange("weight")}
                  />
                  <TextField
                    variant="outlined"
                    className="w-1 ml-10 mx-5 my-10"
                    label="Max Load"
                    type="Number"
                    defaultValue={firstTest.maxLoad}
                    onChange={handleFirstChange("maxLoad")}
                  />
                </div>
               
                {/* <TextField
                  fullWidth
                  variant="outlined"
                  label="Strength In N/MM Sq."
                  className="my-12"
                  defaultValue={firstTest.strength}
                  onChange={handleFirstChange("strength")}
                /> */}
              </FormControl>
            </div>
         </DialogContent>
         
         <DialogActions>
           <Button onClick={()=>handleCloseFirst()} color="primary">
            CANCEL
           </Button>
           {type === "Edit" ? (
            <Button onClick={() => listChange()} color="primary" autoFocus>
               OK
            </Button>
            ) : (
            <Button onClick={() => addFirstData()} color="primary" autoFocus>
               OK
            </Button>
           )}
         </DialogActions>
      </Dialog>

      <Dialog
         open={addOpenSecond}
         onClose={()=>handleCloseSecond()}
         aria-labelledby="alert-dialog-title"
         aria-describedby="alert-dialog-description"
      >
        {type === "Edit" ? (
          <DialogTitle id="alert-dialog-title">{"Edit Data"}</DialogTitle>
           ) : (
          <DialogTitle id="alert-dialog-title">{"Add Data"}</DialogTitle>
        )}
         <DialogContent>
           <div class="w-auto">
              <FormControl variant="outlined">
                <div className="grid grid-cols-2 divide-x divide-gray-400">   
                  <TextField
                    className="w-1 mr-10 mx-5 my-10"
                    defaultValue={secondTest.length}
                    onChange={handleSecondChange("length")}
                    id="outlined-basic"
                    label="Length (In mm)"
                    type="Number"
                    variant="outlined"
                  />  
                  <TextField
                    className="w-1 ml-10 mx-5 my-10"
                    defaultValue={secondTest.breadth}
                    onChange={handleSecondChange("breadth")}
                    id="outlined-basic"
                    label="Breadth (In mm)"
                    type="Number"
                    variant="outlined"
                 />
                </div>

                <div className="grid grid-cols-2 divide-x divide-gray-400">  
                  <TextField
                    variant="outlined"
                    label="Weights In Kgs"
                    className="w-1 mr-10 mx-5 my-10"
                    type="Number"
                    defaultValue={secondTest.weight}
                    onChange={handleSecondChange("weight")}
                  />
                  <TextField
                    variant="outlined"
                    label="Max Load"
                    type="Number"
                    className="w-1 ml-10 mx-5 my-10"
                    defaultValue={secondTest.maxLoad}
                    onChange={handleSecondChange("maxLoad")}
                  />
                </div>

                {/* <TextField
                  fullWidth
                  variant="outlined"
                  label="Strength In N/MM Sq."
                  className="my-12"
                  defaultValue={secondTest.strength}
                  onChange={handleSecondChange("strength")}
                /> */}
              </FormControl>
           </div>
         </DialogContent>
         
         <DialogActions>
            <Button onClick={()=>handleCloseSecond()} color="primary">
               CANCEL
            </Button>
           {type === "Edit" ? (
             <Button onClick={() => listChangeSecond()} color="primary" autoFocus>
               OK
             </Button>
              ) : (
            <Button onClick={() => addSecondData()} color="primary" autoFocus>
              OK
            </Button>
          )}
         </DialogActions>
      </Dialog>

    </div>
  );
}

export default CubeRegisterDialog;
