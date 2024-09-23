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
    IconButton,
    Grid,
  } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { updatepurchaseOrder, createPurchaseOrder, closeEditDialog, closeNewDialog, routes} from "app/main/projects/store/projectsSlice";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { dispatchWarningMessage } from "app/utils/MessageDispatcher";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CancelIcon from "@material-ui/icons/Cancel";
import Link from "@material-ui/core/Link";
import moment from 'moment';

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
}));

let initialValues = {
  orderDate: new Date(),
  quotation: "Verbal",
  quotationDate: new Date(),
  expiryDate : new Date(),
  supplier:"",
  supplierAddress:"",
  supplierId: "",
  siteAddress:"",
  rates:"",
  delivery:"",
  quality:"",
  payment:"",
  siteContactPerson:"",
  sitePersonNo: "",
  billContactPerson: "",
  billPersonNo: "",
};

let initialstate = {
    inventoryId:"",
    inventory:"",
    unit:"",
    quantity:"",
    rate: 0,
    grade: "",
    totalAmount:0,
    transport: "",
    gst:0,
    payableAmount:0,
};

function PurchaseOrderDialog(props) {
    const classes = useStyles(props);
    const dispatch = useDispatch();
    const projectId = useSelector(({ projects }) => projects.details._id);
    const purchaseOrderDetails = useSelector(({ projects }) => projects.purchaseOrders.detailPurchaseOrder);
    const projectDialog = useSelector(({ projects }) => projects.projectDialog);
    const projectDetails = useSelector(({ projects }) => projects.details);
    const vendors = useSelector(({ projects }) => projects.vendors);
    const loading = useSelector(({ projects }) => projects.loading);
    const [addOpen, setAddOpen] = useState(false);
    const [values, setValues] = useState(initialValues);
    const inventory = useSelector(({ projects }) => projects.inventories);
    const gradeType = useSelector(({ dataStructure }) => dataStructure.gradeType);
    const purchaseOrders = useSelector(({ projects }) => projects.purchaseOrders.purchaseOrderList);
    const [open, setOpen] = useState(false);
    const [data, setData] = useState(initialstate);
    const [orderData, setOrderData] = useState([]);
    const [unit, setUnit] = useState('');
    const [type, setType] = useState('');
    const [list, setList] = useState({
      inventory:"",
      inventoryId:"",
      unit:"",
      quantity:"",
      grade: "",
      rate: "",
      totalAmount:"",
      transport: "",
      gst:0,
      payableAmount:0
    });

    const [supplierList, setSupplierList] = useState([]);
    const [inventoryList, setInventoryList] = useState([]);
    const role = useSelector(({ auth }) => auth.user);
    const team = useSelector(({ projects }) => projects.details.team);
    const roleOption = ['As and When Required'];
    const rateOption = ['Inclusive of transport','Exclusive of transport'];
    const deliveryOption = ['Free','On Site']
    const qualityOption = ['As per approved mix design']
    const paymentOption = ['Weekly Payment','Monthly Payment', '100% Advance']
    const [showPo, setShowPo] = useState(false);
    const [showList, setShowList] = useState(false);
    const [dialogType, setDialogType] = useState('');
    const modules = useSelector(({ projects }) => projects.details.module)
    const user = useSelector(({ auth }) => auth.user);
    const [access, setAccess] = useState();
    const [pos, setPos] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const inventories = useSelector(({ projects }) => projects.inventories);


    useEffect(() => {
      team.forEach((t)=>{
        if((t._id === user.data.id && t.role === "owner") || user.role === 'admin')
        {
          setAccess(true)
        }else if(t._id === user.data.id && t.role !== "owner")
        {
          const member = t.tab_access.filter((i)=> i === "Agency" || i === 'Sub-Contractors');
          console.log(member)
          if(member[0] === "Agency" || member[0] === "Sub-Contractors")
          {
            setAccess(true)
          }
        }
      })
    }, [access, user.data.id, user.role, team]);

    let vendorsName = [];

    vendors.vendorsList.forEach((item) => {
      if(item.agencyType === 'Supplier'){
        vendorsName.push(item);
      }
    });

    const initprojectDialog = useCallback(() => {
      setOpen(true);
       if (projectDialog.Dialogtype === 'edit') {
         setType('edit');
       }
 
       if (projectDialog.Dialogtype === "edit" && projectDialog.data) {
         if (purchaseOrderDetails !== '') {
          let vendor = vendorsName.filter((vname)=> vname.name === purchaseOrderDetails.supplier);
          if(purchaseOrderDetails.supplierId === undefined)
          {
            setValues({
              orderDate: purchaseOrderDetails.orderDate,
              quotation: purchaseOrderDetails.quotation,
              quotationDate: purchaseOrderDetails.quotationDate,
              expiryDate : purchaseOrderDetails.expiryDate,
              supplier: purchaseOrderDetails.supplier,
              supplierId: vendor.length > 0 ? vendor[0]._id : '',
              supplierAddress:purchaseOrderDetails.supplierAddress,
              siteAddress:purchaseOrderDetails.siteAddress,
              rates:purchaseOrderDetails.rates,
              quality:purchaseOrderDetails.quality,
              delivery:purchaseOrderDetails.delivery,
              payment:purchaseOrderDetails.payment,
              siteContactPerson: purchaseOrderDetails.siteContactPerson,
              sitePersonNo: purchaseOrderDetails.sitePersonNo,
              billContactPerson: purchaseOrderDetails.billContactPerson,
              billPersonNo: purchaseOrderDetails.billPersonNo,
            });
          }else{
            setValues({
              orderDate: purchaseOrderDetails.orderDate,
              quotation: purchaseOrderDetails.quotation,
              quotationDate: purchaseOrderDetails.quotationDate,
              expiryDate : purchaseOrderDetails.expiryDate,
              supplier: purchaseOrderDetails.supplier,
              supplierId: purchaseOrderDetails.supplierId,
              supplierAddress:purchaseOrderDetails.supplierAddress,
              siteAddress:purchaseOrderDetails.siteAddress,
              rates:purchaseOrderDetails.rates,
              quality:purchaseOrderDetails.quality,
              delivery:purchaseOrderDetails.delivery,
              payment:purchaseOrderDetails.payment,
              siteContactPerson: purchaseOrderDetails.siteContactPerson,
              sitePersonNo: purchaseOrderDetails.sitePersonNo,
              billContactPerson: purchaseOrderDetails.billContactPerson,
              billPersonNo: purchaseOrderDetails.billPersonNo,
            });
          }

           let orders = purchaseOrderDetails.orderData, tempOd = [];

           orders.forEach((od)=>{
             if(od.inventoryId === undefined)
             {
               let invData = inventory.filter((inv)=> inv.type === od.inventory);  
               tempOd.push({
                  "_id": od._id,
                  "gst": od.gst,
                  "inventory": od.inventory,
                  "inventoryId": invData.length > 0 ? invData[0]._id : '',
                  "rate": od.rate,
                  "totalAmount": od.totalAmount,
                  "transport": od.transport,
                  "unit": od.unit,
                  "quantity": od.quantity,
                  "grade": od.grade === undefined ? '' : od.grade,
                  "payableAmount": od.payableAmount === undefined || od.payableAmount === null ? 0 : od.payableAmount,
               })
              } else {
                tempOd.push({
                  "_id": od._id,
                  "gst": od.gst,
                  "inventory": od.inventory,
                  "inventoryId": od.inventoryId,
                  "rate": od.rate,
                  "totalAmount": od.totalAmount,
                  "transport": od.transport,
                  "unit": od.unit,
                  "quantity": od.quantity,
                  "grade": od.grade === undefined ? '' : od.grade,
                  "payableAmount": od.payableAmount === undefined || od.payableAmount === null ? 0 : od.payableAmount,
                })
              } 
            })
           setOrderData(tempOd);

           let inventories=[];
           if (inventory.length > 0) {
            inventory.forEach((inv)=>{
              inv.supplier.map((sup)=>{
               if(sup === purchaseOrderDetails.supplier)
               {
                 inventories.push(inv)
               }
             })
           })
           }
           setInventoryList(inventories);
         }
       }
 
       if (projectDialog.Dialogtype === "new") {
         setType('new')
         setValues(initialValues);
         setData(initialstate);
         setUnit('');
         setInventoryList([]);
         setOrderData([]);
       }
     }, [projectDialog.data, projectDialog.Dialogtype, purchaseOrderDetails]);

    useEffect(() => {
      if (projectDialog.props.open) {
        initprojectDialog();
      }
    }, [projectDialog.props.open, initprojectDialog]);

    useEffect(() => {
      let suppliers=[];
      if (inventory.length > 0) {
        inventory.forEach((inv)=>{
          inv.supplier.map((sup)=>{
            suppliers.push(sup)
          })
        })
      }
      const uniqueSupplier = suppliers.filter((x, i, a) => a.indexOf(x) == i)
      setSupplierList(uniqueSupplier)
    }, [inventory]);

    useEffect(() =>{
      let tempPo = [], today = new Date()
      let dateSelected = moment(today).format("DD/MM/YYYY");

      purchaseOrders.forEach((poData)=>{
        if(process(poData.expiryDate) >= process(dateSelected)){
          tempPo.push(poData)
        }
      })

      setPos(tempPo);
    }, [purchaseOrders])

    const handleChange = (prop) => (event) => {
      if(type === 'edit'){
        if(prop === 'supplier' && event.target.value !== undefined)
        {
          if(event.target.value !== purchaseOrderDetails.supplier)
          {
            let vendor = vendorsName.filter((vname)=> vname.name === event.target.value);
            if(vendor[0] === undefined){
              setValues({ ...values, [prop]: event.target.value ,supplierId: '',  supplierAddress: ''});
            }else{
              setValues({ ...values, [prop]: event.target.value , supplierId: vendor[0]._id, supplierAddress: vendor[0].address});
            } 
          }else{
            let vendor = vendorsName.filter((vname)=> vname.name === event.target.value);
            setValues({ ...values, [prop]: event.target.value ,supplierId: vendor[0]._id,  supplierAddress: purchaseOrderDetails.supplierAddress});
          }
        }else if(event.target.value !== undefined){
          setValues({ ...values, [prop]: event.target.value });
        }  
      } else{
        if(prop === 'supplier'  && event.target.value !== undefined)
        {
          let vendor = vendorsName.filter((vname)=> vname.name === event.target.value);
          if(vendor[0] === undefined){
            setValues({ ...values, [prop]: event.target.value ,supplierId:'', supplierAddress: ''});
          }else{
            setValues({ ...values, [prop]: event.target.value , supplierId: vendor[0]._id, supplierAddress: vendor[0].address});
          }  
        }else if(event.target.value !== undefined){
          setValues({ ...values, [prop]: event.target.value });
        }  
      }
    };

    const changeSiteContact = (value) => {
      if(value !== null && value !== undefined)
      {
        setValues({ 
          ...values,
          'siteContactPerson': value.name, 
          'sitePersonNo': (value.contact === undefined || value.contact === null) ? '' : value.contact 
        });
      }else{
        setValues({ 
          ...values,
          'siteContactPerson': '', 
          'sitePersonNo': ''
        });
      }   
    }

    const changeBillContact = (value) => {
      
      if(value !== null && value !== undefined)
      {
        setValues({ 
          ...values,
          'billContactPerson': value.name, 
          'billPersonNo': (value.contact === undefined || value.contact === null) ? '' : value.contact 
        });
      }else{
        setValues({ 
          ...values,
          'billContactPerson': '', 
          'billPersonNo': '' 
        });
      }
    }

    const changeRoleOptionBaseOnValue = (value) => {
      setData({ ...data, 'quantity': value });
    }

    const handleChangeData = (prop) => (event) => {
      if(prop === 'inventory')
      {
        let inv = inventory.filter((inv)=> inv.type === event.target.value);
        setData({ ...data, [prop]: event.target.value, 'inventoryId':inv[0]._id });
      }else if(prop === 'transport')
      {
        if(event.target.value === 'Free'){
          setData({ ...data, [prop]: event.target.value, 'payableAmount':0 });
        }else{
          setData({ ...data, [prop]: event.target.value });
        } 
      }else{
        setData({ ...data, [prop]: event.target.value });
      }
    };

    const handleDateChange = (prop) => (date) => {
      if(prop === 'orderDate'){
        setValues({ ...values, [prop]: date, 'quotationDate':date });
      }else{
        setValues({ ...values, [prop]: date });
      }
    };

    const setInventoryUnit = (inv) =>{
      setUnit(inv.unit);
    }

    const addOrderData = () => {
      let tempdata = {};
      if(data.quantity === 'As and When Required')
      {
        tempdata = {
          _id: FuseUtils.generateGUID(24),
          inventory: data.inventory,
          inventoryId: data.inventoryId,
          unit:unit,
          quantity:data.quantity,
          grade: data.grade,
          rate:data.rate,
          totalAmount: 0 + Number(data.payableAmount),
          transport:data.transport,
          gst:data.gst,
          payableAmount:data.payableAmount,
        };
      }else{
        tempdata = {
          _id: FuseUtils.generateGUID(24),
          inventory: data.inventory,
          inventoryId: data.inventoryId,
          unit:unit,
          quantity:data.quantity,
          rate:data.rate,
          grade: data.grade,
          totalAmount: (data.quantity * data.rate) + Number(data.payableAmount),
          transport:data.transport,
          gst:data.gst,
          payableAmount: data.payableAmount
        };
      }

       let sortInv = orderData.filter((od) => od.inventory === data.inventory && od.grade === data.grade);
      if(sortInv.length > 0)
      {
        dispatchWarningMessage(dispatch, " Data against inventory already exits.");
      }else{
        setOrderData([...orderData, tempdata]);
        setAddOpen(false);
        setData(initialstate);
        // setRate('');
        // setGst('');
      }
    }

    function deleteFirstData(id) {
      let data = JSON.parse(JSON.stringify(orderData));
      let deletedData = data.filter((item) => item._id !== id);
      setOrderData(deletedData);
    }

    function filterInventory(supplier) {
      let inventories=[];
      if (inventory.length > 0) {
        inventory.forEach((inv)=>{
          inv.supplier.map((sup)=>{
            if(sup === supplier)
            {
              inventories.push(inv)
            }
          })
        })
      }
      setInventoryList(inventories);
      setData(initialstate);
      setUnit('');
      
      if(type === 'edit')
      {
        if(supplier !== purchaseOrderDetails.supplier)
        {
          setOrderData([]);
        }else{
          setOrderData(purchaseOrderDetails.orderData)
        }
      }else if(type === 'new')
      {
        setOrderData([]);
      }
    }

    function handleOpenFirst(id, inventory, inventoryId, unit, quantity, rate, gst, transport, grade, payableAmount) {
      setDialogType("Edit");
      setAddOpen(true)
      setUnit(unit);
      setData({ inventory, inventoryId, unit, quantity, rate, transport, gst, grade, payableAmount});
      setList({ id, inventory, inventoryId, unit, quantity, rate, transport, gst, grade, payableAmount});
    }


    function listChange() {
      let tempData = JSON.parse(JSON.stringify(orderData));
    
      if (data.inventory === "" && data.quantity === "") {
        setAddOpen(false);
      } else {

        let sortInv = tempData.filter((od) => od.inventory === data.inventory && od.grade === data.grade);
        if (sortInv.length > 0) {
          dispatchWarningMessage(dispatch, "Data against inventory already exists.");
        } else {
          tempData.forEach((item) => {
            if (item._id === list.id) {
              if (data.quantity === 'As and When Required') {
                item.inventory = data.inventory;
                item.inventoryId = data.inventoryId;
                item.unit = unit;
                item.quantity = data.quantity;
                item.rate = data.rate;
                item.grade = data.grade;
                item.transport = data.transport;
                item.totalAmount = 0 + Number(data.payableAmount);
                item.gst = data.gst;
                item.payableAmount = data.payableAmount;
              } else {
                item.inventory = data.inventory;
                item.inventoryId = data.inventoryId;
                item.unit = unit;
                item.quantity = data.quantity;
                item.rate = data.rate;
                item.grade = data.grade;
                item.transport = data.transport;
                item.totalAmount = (data.quantity * data.rate) + Number(data.payableAmount);
                item.gst = data.gst;
                item.payableAmount = data.payableAmount;
              }
            }
          });
    
          setOrderData([...tempData]);
          setAddOpen(false);
          setData(initialstate);
        }
      }
    }
    
    

   

    function closeComposeDialog() {
      projectDialog.Dialogtype === "edit"
        ? dispatch(closeEditDialog())
      : dispatch(closeNewDialog());

      setValues(initialValues);
      setData(initialstate);
      setUnit('');
      setInventoryList([]);
      setOrderData([]);
      setShowPo(false);
      setShowList(false);
    }

    const handleClose = () => {
      setAddOpen(false);
    };
      
    const disableButton = () => {
      return (
        values.supplier.length > 0 &&
        values.supplierAddress.length > 0 &&
        values.quotation.length > 0 &&
        orderData.length > 0
      );
    };

    const disableDataButton = () => {
      return (
        data.inventory.length > 0 &&
        data.rate > -1 &&
        data.transport.length > 0 &&
        data.gst > -1 && data.gst < 101
      );
    };

    function setPoDetails(details){
      filterInventory(details.supplier);
      let tempData = {
        orderDate: new Date(),
        quotation: details.quotation,
        quotationDate: new Date(),
        expiryDate : new Date(),
        supplier: details.supplier,
        supplierAddress: details.supplierAddress,
        supplierId: details.supplierId,
        siteAddress: details.siteAddress,
        rates: details.rates,
        delivery: details.delivery,
        quality: details.quality,
        payment: details.payment,
        siteContactPerson: details.siteContactPerson,
        sitePersonNo: details.sitePersonNo,
        billContactPerson: details.billContactPerson,
        billPersonNo: details.billPersonNo,
      };

      setValues(tempData);
      setOrderData(details.orderData);
      setShowList(false);
      setShowPo(true);
    }

    const handleSubmit = () => {
      let tempData = [];
      tempData = JSON.parse(JSON.stringify(orderData));
      tempData.forEach((item) => {
        delete item._id;
      });

      let finalData = {
        "orderDate":new Date(values.orderDate),
        "quotation":values.quotation,
        "quotationDate":new Date(values.quotationDate),
        "expiryDate":new Date(values.expiryDate),
        "supplier": values.supplier,
        "supplierId": values.supplierId,
        "supplierAddress":values.supplierAddress,
        "siteAddress":values.siteAddress,
        "orderData":tempData,
        "rates":values.rates === null ? '' : values.rates,
        "delivery":values.delivery === null ? '' : values.delivery,
        "quality":values.quality === null ? '' : values.quality,
        "payment":values.payment === null ? '' : values.payment,
        "siteContactPerson": values.siteContactPerson,
        "sitePersonNo": values.sitePersonNo,
        "billContactPerson": values.billContactPerson,
        "billPersonNo": values.billPersonNo,
        "updatedBy":role.data.id,
        "updatedDate":new Date(),
        "organization": projectDetails.organizationName,
        "organizationId": projectDetails.organizationId,
      }

        var purchaseId = purchaseOrderDetails._id;

        dispatch(updatepurchaseOrder({projectId, purchaseId, finalData })).then((response) => {
        closeComposeDialog();
       });
    };

    const handleAddSubmit = () => {
      let tempData = [];
      tempData = JSON.parse(JSON.stringify(orderData));
        tempData.forEach((item) => {
          delete item._id;
        });

      let finalData = {
        "orderDate":new Date(values.orderDate),
        "quotation":values.quotation,
        "quotationDate":new Date(values.quotationDate),
        "expiryDate":new Date(values.expiryDate),
        "supplier": values.supplier,
        "supplierId": values.supplierId,
        "supplierAddress":values.supplierAddress,
        "siteAddress":values.siteAddress,
        "rates":values.rates === null ? '' : values.rates,
        "delivery":values.delivery === null ? '' : values.delivery,
        "quality":values.quality === null ? '' : values.quality,
        "payment":values.payment === null ? '' : values.payment,
        "siteContactPerson": values.siteContactPerson,
        "sitePersonNo": values.sitePersonNo,
        "billContactPerson": values.billContactPerson,
        "billPersonNo": values.billPersonNo,
        "orderData":tempData,
        "projectId":projectId,
        "createdBy":role.data.id,
        "createdDate":new Date(),
        "organization": projectDetails.organizationName,
        "organizationId": projectDetails.organizationId,
      }

      if(projectDetails.organizationName === null || projectDetails.organizationId === null || projectDetails.organizationName === undefined || projectDetails.organizationId === undefined)
      {
        dispatchWarningMessage(dispatch, "Project is not added or updated to any organization. Please contact project owner.");
      }else{
       dispatch(createPurchaseOrder({projectId, finalData })).then((response) => {
        closeComposeDialog();
       });
      } 
    };

    function redirectToAgency(){
      if(modules.length === 0 || modules.includes("Agency")){
        if(access === true){
          closeComposeDialog();
          sessionStorage.setItem("link", 'link');
          dispatch(routes("Vendors"));
        }else{
          dispatchWarningMessage(dispatch, "You don't have access to add a Supplier from Agency.")
        }
      }else{
        dispatchWarningMessage(dispatch, "Please include Agency module from Settings to Add Suppliers.")
      }
    }

    function process(date){
      var parts = date.split("/");
      return new Date(parts[2], parts[1] - 1, parts[0]);
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
              {type === 'new' ? 'Create Purchase Order' : 'Update Purchase Order'}
            </Typography>
            <IconButton onClick={() => closeComposeDialog()}>
              <CancelIcon style={{ color: "red" }} />
            </IconButton>
          </Toolbar>
        </AppBar>
        <DialogContent>
          {showList === false && showPo === false && type === 'new' && purchaseOrders.length > 0 ?
            <div className='flex flex-1 flex-row gap-12 justify-center'> 
              <Button variant="contained" color="primary" onClick={()=> setShowPo(true)}> New PO </Button>
              <Typography  variant='subtitle1'> OR </Typography>
              <Button variant="contained" color="primary" onClick={()=> setShowList(true)}> Use Existing PO </Button>  
            </div>
          :null}
        
          {showList === true && type === 'new' ?
            <div className='flex flex-1 flex-col gap-12 w-full'>  
              <FormControl variant="outlined">
                <InputLabel id="demo-simple-select-outlined-label">
                  Select Po
                </InputLabel>
                <Select label="Select Po" className="w-full">
                  {pos.map((vname) => (
                    <MenuItem value={vname.orderNo} onClick={()=> setPoDetails(vname)}> {vname.orderNo} </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          :null}

          {showPo === true || type === 'edit' || purchaseOrders.length === 0?
            <>
              <div className='flex flex-1 flex-col gap-12 w-full'>  
                {type === 'edit' ?
                  <Typography className="flex w-full font-bold justify-center mt-6 mb-10" variant='subtitle1' color='inherit'>
                    {purchaseOrderDetails.orderNo}
                  </Typography>
                :null}
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
                  maxDate={values.orderDate}
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
                Select Supplier
              </InputLabel>
              <Select
                label="Select Supplier"
                className="w-1 ml-10"
                value={values.supplier}
                onChange={handleChange("supplier")}
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
                  }}
                >
                  Click here to Add New Suppliers
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
            {values.supplier !== ''?
              <>
                {inventoryList.length > 0 ?
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
                       // className={classes.root}
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
                                      item.inventory,
                                      item.inventoryId,
                                      item.unit,
                                      item.quantity,
                                      item.rate,
                                      item.gst,
                                      item.transport,
                                      item.grade,
                                      item.payableAmount
                                    );
                                  }}
                                >
                                  <ListItemText
                                    primary={"Inventory - " + item.inventory + " " + item.grade + " Unit- "+item.unit+" Quantity-"+item.quantity}
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
                          onClick={() =>{setAddOpen(true)
                            setDialogType("new")
                            setData(initialstate);
                          }}
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  </AccordionDetails>
                </Accordion>
                :
                  <Typography className="font-bold">No inventories found against the supplier.</Typography>
                } 
              </>
            :null}

            <span className="mb-5">Delivery</span>
            <div className="grid grid-cols-2 divide-x divide-gray-400">
            <Autocomplete
              id="siteContactPerson"
              freeSolo
              className="w-1 mr-10"
              options={team}
              getOptionLabel={(option) => {
                if (typeof option === 'string') {
                  return option;
                }
                if (option.inputValue) {
                  return option.inputValue;
                }
                return option.name;
              }}
              renderOption={(option) => option.name}
              value={values.siteContactPerson}
              onChange={(event, value) => {
                changeSiteContact(value);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label='Contact Person'
                  onChange={handleChange('siteContactPerson')}
                  variant="outlined"
                />
              )}
            />
             <TextField
              className="w-1 ml-10"
              label='Contact No'
              variant='outlined'
              value={values.sitePersonNo}
              onChange={handleChange('sitePersonNo')}
            />
            </div>
            <span className="mb-5">Billing</span>
            <div class="grid grid-cols-2 divide-x divide-gray-400">
              <Autocomplete
              id="billContactPerson"
              freeSolo
              className="w-1 mr-10"
              options={team}
              getOptionLabel={(option) => {
                if (typeof option === 'string') {
                  return option;
                }
                if (option.inputValue) {
                  return option.inputValue;
                }
                return option.name;
              }}
              renderOption={(option) => option.name}
              value={values.billContactPerson}
              onChange={(event, value) => {
                changeBillContact(value);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label='Contact Person'
                  onChange={handleChange('billContactPerson')}
                  variant="outlined"
                />
              )}
            />
             <TextField
              className="w-1 ml-10"
              label='Contact No'
              variant='outlined'
              value={values.billPersonNo}
              onChange={handleChange('billPersonNo')}
            />
            </div>
            <Accordion variant="outlined">
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography color="textPrimary">Terms & Conditions</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div className="flex flex-col w-full gap-10">
                  <Autocomplete
                    id="Rates"
                    freeSolo
                    className="my-5 mx-5"
                    options={rateOption}
                    renderOption={(option) => option}
                    value={values.rates}
                    onChange={(event, value) => {
                      setValues({ ...values, 'rates': value });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label='Rates'
                        onChange={handleChange("rates")}
                        variant="outlined"
                      />
                    )} 
                  />
                  <Autocomplete
                    id="Delivery"
                    freeSolo
                    className="my-5 mx-5"
                    options={deliveryOption}
                    renderOption={(option) => option}
                    value={values.delivery}
                    onChange={(event, value) => {
                      setValues({ ...values, 'delivery': value });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label='Delivery'
                        onChange={handleChange("delivery")}
                        variant="outlined"
                      />
                    )} 
                  />
                  <Autocomplete
                    id="Quality"
                    freeSolo
                    className="my-5 mx-5"
                    options={qualityOption}
                    renderOption={(option) => option}
                    value={values.quality}
                    onChange={(event, value) => {
                      setValues({ ...values, 'quality': value });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label='Quality'
                        onChange={handleChange("quality")}
                        variant="outlined"
                      />
                    )} 
                  />
                  <Autocomplete
                    id="Payment"
                    freeSolo
                    className="my-5 mx-5"
                    options={paymentOption}
                    renderOption={(option) => option}
                    value={values.payment}
                    onChange={(event, value) => {
                      setValues({ ...values, 'payment': value });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label='Payment'
                        onChange={handleChange("payment")}
                        variant="outlined"
                      />
                    )} 
                  />
                </div>
              </AccordionDetails>
            </Accordion> 
            
          </div>
          <div className="flex flex-1 flex-row gap-10 my-12">
            {projectDialog.Dialogtype === 'new' ? (
              <Button
                disabled={!disableButton()}
                onClick={()=>handleAddSubmit()}
                variant="contained"
                color="primary"
              >
                Save
              </Button>
            ) :
              <Button
                disabled={!disableButton()}
                onClick={()=>handleSubmit()}
                variant="contained"
                color="primary"
              >
                Update
              </Button>
            }
              <Button onClick={()=>closeComposeDialog()} variant="contained">
                Cancel
              </Button>
          </div>
            </>
          :null}
        </DialogContent>
      </Dialog>

      <Dialog
        open={addOpen}
        onClose={()=>handleClose()}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
       {dialogType === "Edit" ? (
          <DialogTitle id="alert-dialog-title">{"Edit Data"}</DialogTitle>
        ) : (
          <DialogTitle id="alert-dialog-title">{"Add Data"}</DialogTitle>
       )}
        <DialogContent>
          <div className='flex flex-1 flex-col gap-12 w-full'>
            <FormControl variant="outlined">
              <InputLabel id="demo-simple-select-outlined-label">
                Select Inventory
              </InputLabel>
              <Select
                label="Select Inventory"
                value={data.inventory}
                onChange={handleChangeData("inventory")}
              >
                {inventoryList.map((inv) => (
                  <MenuItem key={inv._id} value={inv.type} onClick={() => setInventoryUnit(inv)}>
                    {inv.type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            </div>
            {data.inventory === 'RMC' || data.inventory === 'rmc' || data.inventory === 'Rmc' ? 
              <FormControl variant="outlined" className="mt-8 w-full">
                <InputLabel id="demo-simple-select-outlined-label">
                 Select Grade
                </InputLabel>
                <Select
                  required
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  value={data.grade}
                  onChange={handleChangeData("grade")}
                  label="Grade"
                >
                  {gradeType.map((wo) => (
                    <MenuItem value={wo}>
                      <Typography>{wo}</Typography>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            :null}
              
            <div className="grid grid-cols-2 divide-x divide-gray-400">
              <Autocomplete
                freeSolo
                id="free-solo-2-demo"
                disableClearable
                required
                className="w-1 mr-10 my-10"
                options={roleOption}
                value={data.quantity}
                onInputChange={(event, value) => {
                    changeRoleOptionBaseOnValue(value);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
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
            <div className="grid grid-cols-2 divide-x divide-gray-400">
            <FormControl variant="outlined">
              <InputLabel required id="demo-simple-select-outlined-label">
                Transport
              </InputLabel>
              <Select
                required
                className="w-1 mr-10 my-5"
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={data.transport}
                onChange={handleChangeData("transport")}
                label="Transport"
              >
                <MenuItem value="Free">Free</MenuItem>
                <MenuItem value="Payable">Payable</MenuItem>
              </Select>
            </FormControl>
            <TextField
                required
                className="w-1 ml-10 my-5"
                value={data.gst}
                onChange={handleChangeData("gst")}
                id="outlined-basic"
                type="number"
                label="GST %"
                variant="outlined"
             />
            </div>
            {data.transport === 'Payable' ?
              <TextField
                required
                className="w-1 mt-10"
                value={data.payableAmount}
                onChange={handleChangeData("payableAmount")}
                id="outlined-basic"
                type="number"
                label="Payable Amount"
                variant="outlined"
             />
            :null}   
          </DialogContent>
         
          <DialogActions>
           <Button onClick={()=>handleClose()} color="primary">
            CANCEL
           </Button>
           {dialogType === "Edit" ? (
            <Button disabled={!disableDataButton()} onClick={() => listChange()} color="primary" autoFocus>
               OK
            </Button>
            ) : (
            <Button disabled={!disableDataButton()} onClick={() => addOrderData()} color="primary" autoFocus>
               OK
            </Button>
           )}
         </DialogActions>
      </Dialog>
    </div>
  );
}

export default PurchaseOrderDialog;
