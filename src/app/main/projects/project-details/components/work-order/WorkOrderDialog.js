import React, { useState, useCallback, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Icon } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import CircularProgress from "@material-ui/core/CircularProgress";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import FormControl from "@material-ui/core/FormControl";
import FuseUtils from "@fuse/utils";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Typography,
  Button,
  Backdrop,
  Grid,
} from "@material-ui/core";

import { ExpandMore as ExpandMoreIcon, Delete as DeleteIcon } from '@material-ui/icons';
import { updateworkOrder, createWorkOrder, closeEditDialog, closeNewDialog, routes } from "app/main/projects/store/projectsSlice";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { dispatchWarningMessage } from "app/utils/MessageDispatcher";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CancelIcon from "@material-ui/icons/Cancel";
import IconButton from '@material-ui/core/IconButton';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Link from "@material-ui/core/Link";



const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 3,
    color: '#fff',
  },
  delete: {
    color: "red",
  },
  appBar: {
    position: 'relative',
  },
  customTextField: {
    width: '100%', 
    fontSize: '20px',
    minHeight: '100px', 
  },
}));


const initialScopeOfWorkState = {
  description: "",
  estimatedTime: "",
};

const initialTermOfWorkState = {
  description: "",
  estimatedTime: "",
};


let initialValues = {
  orderDate: new Date(),
  quotation: "Verbal",
  quotationDate: new Date(),
  expiryDate: new Date(),
  contractor: "",
  contractorId: "",
  subject: "",
  termsAndConditions: [],
  scopeOfWorkItems: [],
};

let initialstate = {
  work: "",
  unit: "",
  quantity: "",
  rate: 0,
  totalAmount: 0,
};

function WorkOrderDialog(props) {
  const classes = useStyles(props);
  const dispatch = useDispatch();
  const projectId = useSelector(({ projects }) => projects.details._id);
  const workOrderDetails = useSelector(({ projects }) => projects.workOrders.detailWorkOrder);
  const projectDialog = useSelector(({ projects }) => projects.projectDialog);
  const projectDetails = useSelector(({ projects }) => projects.details);
  const vendors = useSelector(({ projects }) => projects.vendors);
  const loading = useSelector(({ projects }) => projects.loading);
  const [addOpen, setAddOpen] = useState(false);
  const [addOpenScope, setAddOpenScope] = useState(false);
  const [addOpenTerms, setAddOpenTerms] = useState(false);
  const [values, setValues] = useState(initialValues);
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(initialstate);
  const [orderData, setOrderData] = useState([]);
  const [unit, setUnit] = useState('');
  const [type, setType] = useState('');
  const [list, setList] = useState({
    work: "",
    unit: "",
    quantity: "",
    rate: "",
    totalAmount: "",
  });
  const roleOption = ['As and When Required'];
  const role = useSelector(({ auth }) => auth.user);
  const modules = useSelector(({ projects }) => projects.details.module);
  const user = useSelector(({ auth }) => auth.user);
  const team = useSelector(({ projects }) => projects.details.team);
  const [access, setAccess] = useState();
  const [scopeOfWorkDialogOpen, setScopeOfWorkDialogOpen] = useState(false);
  const [scopeOfWorkValues, setScopeOfWorkValues] = useState({
    description: '',
    estimatedTime: ''
  });
  const [scopeOfWorkItems, setScopeOfWorkItems] = useState([]);
  const [scopeOfWorkDescription, setScopeOfWorkDescription] = useState('');
  const [termsAndConditions, setTermsAndConditions] = useState([]);
  const [termsAndConditionsDialogOpen, setTermsAndConditionsDialogOpen] = useState(false);
  const [termsAndConditionsText, setTermsAndConditionsText] = useState('');
  const [scopeOfWork, setScopeOfWork] = useState("");
  const [scopeOfWorkData, setScopeOfWorkData] = useState(initialScopeOfWorkState);
  const [termOfWorkData, setTermOfWorkData] = useState(initialTermOfWorkState);
  const [addScopeOfWorkOpen, setAddScopeOfWorkOpen] = useState(false);
  const [scopeOfWorkList, setScopeOfWorkList] = useState(null);
  const [termAndConditionList, settermAndConditionList] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [scopeData, setScopeData] = useState([]);
  const [description, setDescription] = useState('');
  const [scopeMode, setScopeMode] = useState('new');
  const [scopeId, setScopeId] = useState('');
  const [termData, setTermData] = useState([]);
  const [descriptionTerm, setDescriptionTerm] = useState('');
  const [termMode, setTermMode] = useState('new');
  const [termId, setTermId] = useState('');

  useEffect(() => {
  }, [termsAndConditions, scopeOfWorkItems]);

  useEffect(() => {
    team.forEach((t) => {
      if ((t._id === user.data.id && t.role === "owner") || user.role === 'admin') {
        setAccess(true)
      } else if (t._id === user.data.id && t.role !== "owner") {
        const member = t.tab_access.filter((i) => i === "Agency" || i === 'Sub-Contractors');
        if (member[0] === "Agency" || member[0] === "Sub-Contractors") {
          setAccess(true)
        }
      }
    })
  }, [access, user.data.id, user.role, team]);

  let vendorsName = [];

  vendors.vendorsList.forEach((item) => {
    if (item.agencyType === 'Sub-Contractor' || item.agencyType === 'Contractor') {
      vendorsName.push(item);
    }
  });


  const initprojectDialog = useCallback(() => {
    setOpen(true);
    if (projectDialog.Dialogtype === 'edit') {
      setType('edit');
    }
    if (projectDialog.Dialogtype === "edit" && projectDialog.data) {
      if (workOrderDetails !== '') {
        setValues({
          orderDate: workOrderDetails.orderDate,
          quotation: workOrderDetails.quotation,
          quotationDate: workOrderDetails.quotationDate,
          expiryDate: workOrderDetails.expiryDate,
          contractor: workOrderDetails.contractor,
          subject: workOrderDetails.subject,
          contractorId: workOrderDetails.contractorId,
        });
       
        if(workOrderDetails.scopeOfWork){
          setScopeData(workOrderDetails.scopeOfWork)
          }
          
          if(workOrderDetails.termsAndConditions){
           setTermData(workOrderDetails.termsAndConditions)
          }

        let orders = workOrderDetails.orderData, tempOd = [];
        if (workOrderDetails.orderData !== undefined) {
          orders.forEach((od) => {
            tempOd.push({
              "_id": od._id,
              "work": od.work,
              "rate": od.rate,
              "totalAmount": od.totalAmount,
              "unit": od.unit,
              "quantity": od.quantity
            })
          })
          setOrderData(tempOd);
        }
      }
    }

    if (projectDialog.Dialogtype === "new") {
      setType('new')
      setValues(initialValues);
      setData(initialstate);
      setUnit('');
      setOrderData([]);
    }
  }, [projectDialog.data, projectDialog.Dialogtype, workOrderDetails]);

  useEffect(() => {
    if (projectDialog.props.open) {
      initprojectDialog();
    }
  }, [projectDialog.props.open, initprojectDialog]);

  useEffect(() => {
  }, [scopeData]);
  
  const handleChange = (prop) => (event) => {
    if (type === 'edit') {
      if (prop === 'contractor' && event.target.value !== undefined) {
        if (event.target.value !== workOrderDetails.contractor) {
          let vendor = vendorsName.filter((vname) => vname.name === event.target.value);
          if (vendor[0] === undefined) {
            setValues({ ...values, [prop]: event.target.value, contractorId: '' });
          } else {
            setValues({ ...values, [prop]: event.target.value, contractorId: vendor[0]._id });
          }
        } else {
          let vendor = vendorsName.filter((vname) => vname.name === event.target.value);
          setValues({ ...values, [prop]: event.target.value, contractorId: vendor[0]._id });
        }
      } else if (event.target.value !== undefined) {
        setValues({ ...values, [prop]: event.target.value });
      }
    } else {
      if (prop === 'contractor' && event.target.value !== undefined) {
        let vendor = vendorsName.filter((vname) => vname.name === event.target.value);
        if (vendor[0] === undefined) {
          setValues({ ...values, [prop]: event.target.value, contractorId: '' });
        } else {
          setValues({ ...values, [prop]: event.target.value, contractorId: vendor[0]._id, });
        }
      } else if (event.target.value !== undefined) {
        setValues({ ...values, [prop]: event.target.value });
      }
    }
  };


  const handleChangeData = (prop) => (event) => {
    setData({ ...data, [prop]: event.target.value });
  };

  const handleChangeScope = (prop) => (event) => {
    setDescription(event.target.value)
    setData({ ...data, [prop]: event.target.value });
  };

  const handleChangeTerm = (prop) => (event) => {
    setDescription(event.target.value)
    setData({ ...data, [prop]: event.target.value });
  };
  

  const handleDateChange = (prop) => (date) => {
    setValues({ ...values, [prop]: date });
  };

  const addOrderData = () => {
    let tempdata = {};

    if (data.quantity === 'As and When Required') {
      tempdata = {
        _id: FuseUtils.generateGUID(24),
        work: data.work,
        unit: data.unit,
        quantity: data.quantity,
        rate: Number(data.rate),
        totalAmount: 0,
      };
    } else {
      tempdata = {
        _id: FuseUtils.generateGUID(24),
        work: data.work,
        unit: data.unit,
        quantity: Number(data.quantity),
        rate: Number(data.rate),
        totalAmount: data.quantity * data.rate,
      };
    }

    setOrderData([...orderData, tempdata]);
    setAddOpen(false);
    setData(initialstate);
  }


  const addScope = () => {
    console.log("Current description:", description);
  
    const trimmedDescription = description.trim();
  
    if (trimmedDescription === '') {
      dispatchWarningMessage(dispatch, "Description cannot be empty.")
      
      return; 
    }
  
    const newScopeItem = {
      _id: FuseUtils.generateGUID(24),
      description: trimmedDescription
    };
  
    setScopeData(previousScopeData => [...previousScopeData, newScopeItem]);
  
    setAddOpenScope(false);
    setDescription('');
  }
  
  

  const updateScope = () => {
    const updatedScopes = scopeData.map(item => 
      item._id === scopeId ? { ...item, description: description } : item
    );
  
    setScopeData(updatedScopes);  
    setAddOpenScope(false);   
    setDescription('');          
    setScopeId(null);             
  };
  
  const addTerm = () => {
    const trimmedDescription = description.trim();
  
    if (trimmedDescription === '') {
      dispatchWarningMessage(dispatch, "Description cannot be empty.")
      return; 
    }
  
    let temp = {
      _id: FuseUtils.generateGUID(24),
      description: trimmedDescription
    };
  
    setTermData(termData => [...termData, temp]);
  
    setAddOpenTerms(false);
    setDescription('');
  }
  

  function updateTerm() {
    let tempData = JSON.parse(JSON.stringify(termData));

    tempData.forEach((item) => {
      if (item._id === termId) {
        item.description = description;
      }
    });

    setTermData(tempData);
    setAddOpenTerms(false)
    setDescription('');
    setTermId(null);             
  }

  const changeRoleOptionBaseOnValue = (value) => {
    setData({ ...data, 'quantity': value });
  }

  function deleteFirstData(id) {
    let data = JSON.parse(JSON.stringify(orderData));
    let deletedData = data.filter((item) => item._id !== id);
    setOrderData(deletedData);
  }

  function handleDeleteScopeOfWorkItem(_id) {

    setScopeData(prevScopeData => {
      const deletedData = prevScopeData.filter(item => item._id !== _id);
      return deletedData;
    });
  }

  function handleDeleteTermsItem(_id) {

    let data = JSON.parse(JSON.stringify(termData));
    let deletedData = data.filter((item) => item._id !== _id);

    setTermData(deletedData);
  }

  function filterInventory(contractor) {

    setData(initialstate);
    setUnit('');

    if (type === 'edit') {
      if (contractor !== workOrderDetails.contractor) {
        setOrderData([]);
      } else {
        setOrderData(workOrderDetails.orderData)
      }
    } else if (type === 'new') {
      setOrderData([]);
    }
  }

  function handleOpenFirst(id, work, unit, quant, rate) {

    let quantity;
    if (typeof (quant) === 'number') {
      quantity = quant.toString();
    } else {
      quantity = quant;
    }

    setType("Edit");
    setAddOpen(true)
    setUnit(unit);
    setData({ work, unit, quantity, rate });
    setList({ id, work, unit, quantity, rate });
  }

  function listChange() {
    let tempData = JSON.parse(JSON.stringify(orderData));
    if (data.work === "" && data.quantity === "") {
      setAddOpen(false);
    } else {
      tempData.forEach((item) => {
        if (item._id === list.id) {
          if (data.quantity === 'As and When Required') {
            item.work = data.work;
            item.unit = unit;
            item.quantity = data.quantity;
            item.rate = data.rate;
            item.totalAmount = 0;
            item.gst = data.gst;
          } else {
            item.work = data.work;
            item.unit = unit;
            item.quantity = Number(data.quantity);
            item.rate = data.rate;
            item.totalAmount = data.quantity * data.rate;
            item.gst = data.gst;
          }
        }
      });

      setOrderData(tempData);
      setAddOpen(false);
      setData(initialstate);
    }
  }

  function closeComposeDialog() {
    projectDialog.Dialogtype === "edit"
      ? dispatch(closeEditDialog())
      : dispatch(closeNewDialog());

    setValues(initialValues);
    setData(initialstate);
    setUnit('');
    setOrderData([]);
  }

  const handleClose = () => {
    setAddOpen(false);
  };

  const handleCloseScope = () => {
    setAddOpenScope(false);
  };
  const handleCloseTerms = () => {
    setAddOpenTerms(false);
  };

  const disableButton = () => {
    if (values.contractor === undefined) {
      return false;
    } else {
      return (
        values.contractor.length > 0 &&
        values.quotation.length > 0 &&
        orderData.length > 0
      );
    }
  };

  const handleSubmit = () => {
    let tempData = [];
    tempData = JSON.parse(JSON.stringify(orderData));
    tempData.forEach((item) => {
      delete item._id;
    });

    let tempData1 = [];
    tempData1 = JSON.parse(JSON.stringify(scopeData));
    tempData1.forEach((item) => {
      delete item._id;
    });
    let tempData2= [];
    tempData2 = JSON.parse(JSON.stringify(termData));
    tempData2.forEach((item) => {
      delete item._id;
    });


    let finalData = {
      "orderDate": new Date(values.orderDate),
      "quotation": values.quotation,
      "quotationDate": new Date(values.quotationDate),
      "expiryDate": new Date(values.expiryDate),
      "contractor": values.contractor,
      "contractorId": values.contractorId,
      "siteAddress": values.siteAddress,
      "orderData": tempData,
      "updatedBy": role.data.id,
      "updatedDate": new Date(),
      "organization": projectDetails.organizationName,
      "organizationId": projectDetails.organizationId,
      "subject": values.subject,
      "scopeOfWork": tempData1,
      "termsAndConditions": tempData2,

    }

    var workId = workOrderDetails._id;
    dispatch(updateworkOrder({ projectId, workId, finalData })).then((response) => {
      setTermData([]);
      setScopeData([]);
      setScopeOfWorkItems([]);
      closeComposeDialog();
    });
  };

  const handleAddSubmit = () => {
    let tempData = [];
    tempData = JSON.parse(JSON.stringify(orderData));
    tempData.forEach((item) => {
      delete item._id;
    });

    let tempData1 = [];
    tempData1 = JSON.parse(JSON.stringify(scopeData));
    tempData1.forEach((item) => {
      delete item._id;
    });

    let tempData2= [];
    tempData2 = JSON.parse(JSON.stringify(termData));
    tempData2.forEach((item) => {
      delete item._id;
    });
    let finalData = {
      "orderDate": new Date(values.orderDate),
      "quotation": values.quotation,
      "quotationDate": new Date(values.quotationDate),
      "expiryDate": new Date(values.expiryDate),
      "contractor": values.contractor,
      "contractorId": values.contractorId,
      "orderData": tempData,
      "createdBy": role.data.id,
      "createdDate": new Date(),
      "organization": projectDetails.organizationName,
      "organizationId": projectDetails.organizationId,
      "subject": values.subject,
      "scopeOfWork": tempData1,
      "termsAndConditions": tempData2,
    }

    if (projectDetails.organizationName === null || projectDetails.organizationId === null || projectDetails.organizationName === undefined || projectDetails.organizationId === undefined) {
      dispatchWarningMessage(dispatch, "Project is not added or updated to any organization. Please contact project owner.");
    } else {
      dispatch(createWorkOrder({ projectId, finalData })).then((response) => {
        setTermData([]);
        setScopeData([]);
        closeComposeDialog();
      });
    }
  };

  const handleInputChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };
  
  const handleOpenEditScope = (data) => {

    setScopeMode("Edit")
    setDescription(data.description);
    setScopeId(data._id);

    setEditMode(true);
    setScopeOfWorkData({ data });
    setAddOpenScope(true);
  };

  const handleOpenEditTerm = (data) => {

    setTermMode("Edit")
    setDescription(data.description);
    setTermId(data._id);

    setEditMode(true);
    setTermOfWorkData({ data });
    setAddOpenTerms(true);
  };

  useEffect(() => {
  }, [scopeData]);
  

  function redirectToAgency() {

    if (modules.length === 0 || modules.includes("Agency")) {
      if (access === true) {
        sessionStorage.setItem("link", 'link');
        dispatch(routes("Vendors"));
        closeComposeDialog();
      } else {
        dispatchWarningMessage(dispatch, "You don't have access to add a Contractor from Agency.")
      }
    } else {
      dispatchWarningMessage(dispatch, "Please include Agency module from Settings to Add Contractor.")
    }
  }

  return (
    <div className='flex flex-1 w-full'>
      <Dialog open={open} {...projectDialog.props} fullWidth maxWidth="sm">
        <Backdrop className={classes.backdrop} open={loading}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <Typography className="w-full mr-10" variant='subtitle1' color='inherit'>
              {type === 'new' ? 'Create Work Order' : 'Update Work Order'}
            </Typography>
            <Typography className="flex w-full justify-end " variant='subtitle1' color='inherit'>
              {type === 'edit' ? workOrderDetails.orderNo : ''}
            </Typography>
            <IconButton onClick={() => closeComposeDialog()}>
              <CancelIcon style={{ color: "red" }} />
            </IconButton>
          </Toolbar>
        </AppBar>
        <DialogContent>
          <div className='flex flex-1 flex-col gap-12 w-full'>
            <div className="grid grid-cols-2 divide-x divide-gray-400 mt-8">
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <DatePicker
                  required
                  label="Order Date"
                  className="w-1 mr-10"
                  format="dd/MM/yyyy"
                  value={values.orderDate}
                  onChange={handleDateChange("orderDate")}
                  inputVariant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </MuiPickersUtilsProvider>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <DatePicker
                  required
                  label="Quotation Date"
                  className="w-1 ml-10"
                  format="dd/MM/yyyy"
                  value={values.quotationDate}
                  onChange={handleDateChange("quotationDate")}
                  inputVariant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </MuiPickersUtilsProvider>
            </div>

            <div className="grid grid-cols-2">
              <TextField
                value={values.quotation}
                required
                className="w-1 mr-10"
                onChange={handleChange("quotation")}
                id="outlined-basic"
                label="Quotation"
                variant="outlined"
              />
              <FormControl variant="outlined">
                <InputLabel id="demo-simple-select-outlined-label" className="ml-10">
                  Select Vendor
                </InputLabel>
                <Select
                  label="Select Vendor"
                  className="w-1 ml-10"
                  value={values.contractor}
                  onChange={handleChange("contractor")}
                >
                  {vendorsName.map((vname) => (
                    <MenuItem value={vname.name} onClick={() => filterInventory(vname.name)}>
                      {vname.name}
                    </MenuItem>
                  ))}
                  <Link
                    className="cursor-pointer ml-10 mt-10"
                    onClick={() => {
                      redirectToAgency();
                      setValues({ ...values, contractor: '' });
                    }}
                  >
                    Click here to Add New Sub-Contractor or Contractor
                  </Link>
                </Select>
              </FormControl>
            </div>


            <div className="grid grid-cols-2 divide-x divide-gray-400 mt-8">
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <DatePicker
                  required
                  label="Expiry Date"
                  className="w-1 mr-10"
                  minDate={values.orderDate}
                  format="dd/MM/yyyy"
                  value={values.expiryDate}
                  onChange={handleDateChange("expiryDate")}
                  inputVariant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </MuiPickersUtilsProvider>
            </div>
            <div className="grid grid-cols-1">
              <TextField
                value={values.subject}
                required
                className="w-full my-4"
                onChange={handleInputChange("subject")}
                id="outlined-basic"
                label="Subject"
                variant="outlined"
              />
            </div>
            {values.contractor !== '' ?
              <>
                <Accordion variant="outlined">
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography color="textPrimary">Order Data</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <div className="flex flex-col w-full">
                      <List
                        component="nav"
                        aria-label="mailbox folders"
                      >
                        {orderData.map((item) => (
                          <React.Fragment>
                            <Grid container alignItems="center" direction="row">
                              <Grid item xs={11}>
                                <ListItem
                                  button
                                  key={item._id}
                                  onClick={(ev) => {
                                    handleOpenFirst(
                                      item._id,
                                      item.work,
                                      item.unit,
                                      item.quantity,
                                      item.rate
                                    );
                                  }}
                                >
                                  <ListItemText
                                    primary={"Work- " + item.work + " Unit- " + item.unit + " Quantity- " + item.quantity}
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
                          onClick={() => {
                            setAddOpen(true)
                            setType("new")
                            setData(initialstate);
                          }}
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  </AccordionDetails>
                </Accordion>
              </>
              : null}
            <div className="mt-4">

              <div className="mt-4">

                <Accordion variant="outlined">
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel3a-content"
                    id="panel3a-header"
                  >
                    <Typography color="textPrimary">Scope of Work</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <div className="flex flex-col w-full">
                      <List component="nav" aria-label="terms and conditions list">
                        {scopeData.map((data, index) => (
                          <React.Fragment key={index}>
                            <Grid container alignItems="center" direction="row">
                              <Grid item xs={11}>
                                <ListItem button onClick={() => handleOpenEditScope(data)}>
                                  <ListItemText primary={`${data.description}`} />
                                </ListItem>
                              </Grid>
                              <Grid item xs={1}>
                                <IconButton
                                  onClick={() => {
                                    handleDeleteScopeOfWorkItem(data._id);
                                  }}
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
                          onClick={() => {
                            setAddOpenScope(true)
                            setScopeMode('new')
                            setData(initialstate);
                          }}

                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  </AccordionDetails>
                </Accordion>

              </div>
            </div>

            <Accordion variant="outlined">
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel3a-content"
                id="panel3a-header"
              >
                <Typography color="textPrimary">Terms and Conditions</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div className="flex flex-col w-full">
                  <List component="nav" aria-label="terms and conditions list">
                    {termData.map((data, index) => (
                      <React.Fragment key={index}>
                        <Grid container alignItems="center" direction="row">
                          <Grid item xs={11}>
                            <ListItem button onClick={() => handleOpenEditTerm(data)}>
                              <ListItemText primary={`${data.description}`} />
                            </ListItem>
                          </Grid>
                          <Grid item xs={1}>
                            <IconButton
                              onClick={() => handleDeleteTermsItem(data._id)}
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
                      onClick={() => {
                        setAddOpenTerms(true)
                        setTermMode('new')
                        setData(initialstate);
                      }}
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </AccordionDetails>
            </Accordion>


          </div>
          <div className="flex flex-1 flex-row gap-10 my-12">
            {projectDialog.Dialogtype === 'new' ? (
              <Button
                disabled={!disableButton()}
                onClick={() => handleAddSubmit()}
                variant="contained"
                color="primary"
              >
                Save
              </Button>
            ) :
              <Button
                disabled={!disableButton()}
                onClick={() => handleSubmit()}
                variant="contained"
                color="primary"
              >
                Update
              </Button>
            }
            <Button onClick={() => closeComposeDialog()} variant="contained">
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={addOpen}
        onClose={() => handleClose()}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {type === "Edit" ? (
          <DialogTitle id="alert-dialog-title">{"Edit Data"}</DialogTitle>
        ) : (
          <DialogTitle id="alert-dialog-title">{"Add Data"}</DialogTitle>
        )}
        <DialogContent>
          <div className='flex flex-1 flex-col gap-12 w-full'>
            <TextField
              label='Description of Work'
              multiline
              rows={2}
              variant='outlined'
              value={data.work}
              onChange={handleChangeData('work')}
            />

            <Autocomplete
              freeSolo
              id="free-solo-2-demo"
              disableClearable
              required
              options={roleOption}
              value={data.quantity}
              onInputChange={(event, value) => {
                changeRoleOptionBaseOnValue(value);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  type="number"
                  label="Quantity"
                  onChange={handleChangeData("quantity")}
                  variant="outlined"
                  InputProps={{
                    ...params.InputProps,
                    type: 'search',
                  }}
                />
              )}
            />

            <div className="grid grid-cols-2 divide-x divide-gray-400">
              <TextField
                required
                className="w-1 mr-10 my-10"
                value={data.unit}
                onChange={handleChangeData("unit")}
                id="outlined-basic"
                label="Unit"
                variant="outlined"
              />
              <TextField
                required
                className="w-1 ml-10 my-10"
                value={data.rate}
                onChange={handleChangeData("rate")}
                id="outlined-basic"
                type="number"
                label="Rate"
                variant="outlined"
              />
            </div>

          </div>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => handleClose()} color="primary">
            CANCEL
          </Button>
          {type === "Edit" ? (
            <Button onClick={() => listChange()} color="primary" autoFocus>
              OK
            </Button>
          ) : (
            <Button onClick={() => addOrderData()} color="primary" autoFocus>
              OK
            </Button>
          )}
        </DialogActions>
      </Dialog>



      <Dialog
        open={addOpenScope}
        onClose={() => handleCloseScope()}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{ style: { width: '380px' } }}
        >

        {scopeMode === "Edit" ? (
          <DialogTitle>Edit Scope of Work</DialogTitle>
        ) : (
          <DialogTitle>Add Scope of Work</DialogTitle>
        )}
        <DialogContent>
          <TextField
            value={description}
            label="Description"
            variant="outlined"
            multiline
            style={{ width: "310px" }}
              rows={2}         
              onChange={(e) => setDescription(e.target.value)}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => handleCloseScope()} color="primary">
            Cancel
          </Button>
          {scopeMode === "Edit" ? (
            <Button onClick={() => updateScope()} color="primary" autoFocus>
              OK
            </Button>
          ) : (
            <Button onClick={() => addScope()} color="primary" autoFocus>
              OK
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <Dialog
        open={addOpenTerms}
        onClose={() => handleCloseTerms()}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{ style: { width: '380px' } }}

      >
        {termMode === "Edit" ? (
          <DialogTitle>Edit Term and Condition</DialogTitle>
        ) : (
          <DialogTitle>Add Term and Condition</DialogTitle>
        )}
        <DialogContent>
          <TextField
            value={description}
            label="Description"
            variant="outlined"
            multiline
            style={{ width: "310px" }}
            rows={2}
            onChange={handleChangeTerm('description')}
          />
        </DialogContent>

        <DialogActions>

          <Button onClick={() => handleCloseTerms()} color="primary">
            Cancel
          </Button>
          {termMode === "Edit" ? (
            <Button onClick={() => updateTerm()} color="primary" autoFocus>
              OK
            </Button>
          ) : (
            <Button onClick={() => addTerm()} color="primary" autoFocus>
              OK
            </Button>
          )}
        </DialogActions>
      </Dialog>

    </div>
  );
}

export default WorkOrderDialog;
