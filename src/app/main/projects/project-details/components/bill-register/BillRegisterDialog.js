import React, { useState, useCallback, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import CircularProgress from "@material-ui/core/CircularProgress";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import FormControl from "@material-ui/core/FormControl";
import {
    TextField,
    Typography,
    Button,
    Backdrop,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    IconButton,
    Grid,
  } from "@material-ui/core";
import { addbill, billUpdate, closeEditDialog, closeNewDialog, routes} from "app/main/projects/store/projectsSlice";
import Dropzone from "react-dropzone";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import clsx from "clsx";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import DialogActions from "@material-ui/core/DialogActions";
import FuseUtils from "@fuse/utils";
import { Icon } from "@material-ui/core";
import { dispatchWarningMessage } from "app/utils/MessageDispatcher";
import moment from "moment/moment";
import CancelIcon from "@material-ui/icons/Cancel";
import Link from "@material-ui/core/Link";
import ReactFileViewer from "react-file-viewer";
import PrismaZoom from "react-prismazoom";
import VisibilityIcon from '@material-ui/icons/Visibility';

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 3,
    color: '#fff',
  },
  dropzone: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    height: "200px",
    width: "500px",
    border: "3px dashed #eeeeee",
    backgroundColor: "#fafafa",
    color: "#bdbdbd",
    marginBottom: "20px",
  },
}));

let initialValues = {
  invoiceNo: "",
  invoiceDate: new Date(),
  po:'',
  poId:'',
  quantity:'',
  inventory:'',
  supplier:'',
  supplierId:'',
  transport: 0,
  transportgst: '',
  tdsamount: '',
};

let initialstate = {
  inventory:"",
  challan:"",
  quantity:0,
  rate:"",
  gst:"",
  grade:""
};

function BillRegisterDialog(props) {
    const classes = useStyles(props);
    const dispatch = useDispatch();
    const projectId = useSelector(({ projects }) => projects.details._id);
    const bill = useSelector(({ projects }) => projects.bills.billsList);
    const sampleDetails = useSelector(({ projects }) => projects.bills.detailBill);
    const projectDialog = useSelector(({ projects }) => projects.projectDialog);
    const inventories = useSelector(({ projects }) => projects.inventories);
    const loading = useSelector(({ projects }) => projects.loading);
    const [values, setValues] = useState(initialValues);
    const [open, setOpen] = useState(false);
    const [type, setType] = useState('new');
    const vendors = useSelector(({ projects }) => projects.vendors.vendorsList);
    const purchaseOrders = useSelector(({ projects }) => projects.purchaseOrders.purchaseOrderList);
    const [inventoryList, setInventoryList] = useState([]);
    const [supplier, setSupplier] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [po, setPo] = useState([]);
    const [data, setData] = useState(initialstate);
    const projectDetails = useSelector(({ projects }) => projects.details);
    const [image, setImage] = useState({
        name: "",
        file: "",
        url: "",
    });
    const [addOpen, setAddOpen] = useState(false);
    const [orderData, setOrderData] = useState([]);
    const [list, setList] = useState({
      inventory:"",
      challan:"",
      quantity:"",
      grade:""
    });
    const [rate, setRate] = useState('');
    const [gst, setGst] = useState('');
    const [challanNo, setChallanNo] = React.useState([]);
    const modules = useSelector(({ projects }) => projects.details.module);
    const user = useSelector(({ auth }) => auth.user);
    const team = useSelector(({ projects }) => projects.details.team);
    const [access, setAccess] = useState();
    const gradeType = useSelector(({ dataStructure }) => dataStructure.gradeType);
    const [viewOpen, setViewOpen] = useState();
    const [file, setFile] = useState("");
    const [fileType, setFileType] = useState("");
    const [title, setTitle] = useState("");
    const inputfile = useRef(null);
    const onButtonClick = () => {
      inputfile.current.click();
    };

    useEffect(() => {
      let suppliers = [];
      purchaseOrders.forEach((po)=>{
        suppliers.push(po.supplier)
      })
      let uniqueSupplier = suppliers.filter((s, idx) => suppliers.indexOf(s) === idx);
      
      let filteredSupplier = [];
      vendors.forEach((ven) => {
        uniqueSupplier.forEach((us) => {
          if (us === ven.name && ven.agencyType === "Supplier") {
            filteredSupplier.push(ven)
          }
        })
      })

      setSupplier(filteredSupplier);
    }, []);

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

    const initprojectDialog = useCallback(() => {
      setOpen(true);
       if (projectDialog.Dialogtype === 'edit') {
         setType('edit');
       }
 
       if (projectDialog.Dialogtype === "edit" && projectDialog.data) {
         if (sampleDetails !== '') {
           let poInfo = purchaseOrders.filter((po)=> po.id === sampleDetails.poId);
           let suppliers = [];
           purchaseOrders.forEach((po)=>{
             suppliers.push(po.supplier)
           })
           let uniqueSupplier = suppliers.filter((s, idx) => suppliers.indexOf(s) === idx);
      
           let filteredSupplier = [];
           vendors.forEach((ven)=>{
             uniqueSupplier.forEach((us)=>{
               if(us === ven.name){
                 filteredSupplier.push(ven)
                }
              })
           })

           setSupplier(filteredSupplier);
           let orderData = [];
           let existingOrderData = poInfo[0].orderData;

           existingOrderData.map((order)=>{
            orderData.push({
              gst: order.gst,
              inventory : order.inventory,
              inventoryId : order.inventoryId,
              quantity : order.quantity,
              rate : order.rate,
              totalAmount : order.totalAmount,
              transport: order.transport,
              unit: order.unit,
              _id: order._id,
              grade: order.grade ? order.grade :""
            })
           })

           setInventoryList(existingOrderData);
           setOrderData(sampleDetails.orderData);

           vendors.forEach((ven)=>{
            if(ven.agencyType === 'Supplier' && ven._id === sampleDetails.supplierId)
            {
              setValues({
                invoiceNo: sampleDetails.invoiceNo,
                transport: sampleDetails.transport,
                transportgst: sampleDetails.transportgst,
                tdsamount: sampleDetails.tdsamount,
                invoiceDate: sampleDetails.invoiceDate,
                supplierId: sampleDetails.supplierId,
                poId: sampleDetails.poId,
                supplier:ven.name,
                po: poInfo[0].orderNo,
              });
              let pos= purchaseOrders.filter((pod)=> pod.supplier === ven.name)
              setPo(pos);
            }
           })
          
           if(sampleDetails.billImage === undefined)
           {
            setImage({
              name: "",
              file: "",
              url: "",
            }); 
           }else{
            setImage(sampleDetails.billImage); 
           }
              
         }
       }
 
       if (projectDialog.Dialogtype === "new") {
         setValues(initialValues);
       }
    }, [projectDialog.data, projectDialog.Dialogtype, sampleDetails]);

    useEffect(() => {
      if (projectDialog.props.open) {
        initprojectDialog();
      }
    }, [projectDialog.props.open, initprojectDialog]);

    const handleClose = () => {
     setAddOpen(false);
    };

    const handleUploadChange = (event) => {
      const choosedFiles = Array.from(event.target.files);
      setImage({
        ...image,
        file: choosedFiles[0],
        name: choosedFiles[0].name
        // url: `data:${acceptedFiles[0].type};base64,${btoa(reader.result)}`,
      });
    }

    const handleChange = (prop) => (event) => {
      if(projectDialog.Dialogtype === 'edit')
      {
        if(prop === 'supplier' && event.target.value !== undefined)
        {
          let venInfo = vendors.filter((ven)=> ven._id === sampleDetails.supplierId && ven.agencyType === 'Supplier');
          if(event.target.value === venInfo[0].name)
          {
            let poInfo = purchaseOrders.filter((po)=> po.id === sampleDetails.poId);
            let supplierInfo = supplier.filter((supp)=>supp.name === event.target.value);

            let orderData = [];
            let existingOrderData = poInfo[0].orderData;

            existingOrderData.map((order)=>{
            orderData.push({
              gst: order.gst,
              inventory : order.inventory,
              inventoryId : order.inventoryId,
              quantity : order.quantity,
              rate : order.rate,
              totalAmount : order.totalAmount,
              transport: order.transport,
              unit: order.unit,
              _id: order._id,
              grade: order.grade ? order.grade :""
            })
            })

            setInventoryList(existingOrderData);
            setOrderData(sampleDetails.orderData);
            setValues({ ...values, [prop]: event.target.value,'po':poInfo[0].orderNo ,'poId':sampleDetails.poId,'supplierId': supplierInfo[0]._id });  
          }else{
            let supplierInfo = supplier.filter((supp)=>supp.name === event.target.value);
            setValues({ ...values, [prop]: event.target.value,'po':'','poId':'','supplierId': supplierInfo[0]._id });
          }
        }else if(prop === 'po' && event.target.value !== undefined)
        {
          let poInfo = purchaseOrders.filter((por)=>por.id === sampleDetails.poId);
          if(event.target.value === poInfo[0].orderNo)
          {
            let orderData = [];
            let existingOrderData = poInfo[0].orderData;

            existingOrderData.map((order)=>{
              orderData.push({
                gst: order.gst,
                inventory : order.inventory,
                inventoryId : order.inventoryId,
                quantity : order.quantity,
                rate : order.rate,
                totalAmount : order.totalAmount,
                transport: order.transport,
                unit: order.unit,
                _id: order._id,
                grade: order.grade ? order.grade :""
              })
            })

            setInventoryList(existingOrderData);
            setOrderData(sampleDetails.orderData);
            setValues({ ...values, 'po':poInfo[0].orderNo ,'poId':sampleDetails.poId });  
          }else{
            let poIn = purchaseOrders.filter((por)=>por.orderNo === event.target.value);
            setValues({ ...values, [prop]: event.target.value,'poId': poIn[0].id });
            setOrderData([]);
          }
        }else if(event.target.value !== undefined){
          setValues({ ...values, [prop]: event.target.value });
        }
      }else{
        if(prop === 'supplier' && event.target.value !== undefined)
        {
          let supplierInfo = supplier.filter((supp)=>supp.name === event.target.value);
          setValues({ ...values, [prop]: event.target.value,'supplierId': supplierInfo[0]._id });
        }else if(prop === 'po' && event.target.value !== undefined)
        {
          let poInfo = purchaseOrders.filter((por)=>por.orderNo === event.target.value);
          setValues({ ...values, [prop]: event.target.value,'poId': poInfo[0].id });
        }else if(event.target.value !== undefined){
          setValues({ ...values, [prop]: event.target.value });
        }
      }
    };

    
    const handleChangeData = (prop) => (event) => {
      setData({ ...data, [prop]: event.target.value });
    };

    const handleChangeChallan = (event) => {
     const {
      target: { value },
     } = event;
     setChallanNo(
      typeof value === 'string' ? value.split(',') : value,
     );
    };

    const handleDrop = (acceptedFiles) => {
      const reader = new FileReader();
      reader.readAsBinaryString(acceptedFiles[0]);
      reader.onload = () => {
        setImage({
          ...image,
          file: acceptedFiles[0],
         // url: `data:${acceptedFiles[0].type};base64,${btoa(reader.result)}`,
        });
      };
      reader.onerror = () => {
        console.log("error on load image");
      };
    };

    function process(date){
      var parts = date.split("/");
      return new Date(parts[2], parts[1] - 1, parts[0]);
   }

   const onError = e => {
    console.log(e, "error in file-viewer");
  };

  const viewDocument = (details) =>{
    setFileType(details.url.split('.').pop().toLowerCase())
    setFile(details.url)
    setTitle(details.name)
    setViewOpen(true)
  }
      
    function filterInventory(pos) {
      let orderData = [];
      let existingOrderData = pos.orderData;

      existingOrderData.map((order)=>{
        orderData.push({
          gst: order.gst,
          inventory : order.inventory,
          inventoryId : order.inventoryId,
          quantity : order.quantity,
          rate : order.rate,
          totalAmount : order.totalAmount,
          transport: order.transport,
          unit: order.unit,
          _id: order._id,
          grade: order.grade ? order.grade :""
        })
      })

      setInventoryList(existingOrderData);
    }

    function filterPo(supplierName) { 
      let today = new Date();
      var currentDate = moment(today).format("DD/MM/YYYY");
      let pos = [];
      for(var i = 0;i<purchaseOrders.length;i++)
      {  
         let expiryDate =purchaseOrders[i].expiryDate;
         if(purchaseOrders[i].supplier === supplierName && (process(expiryDate) >= process(currentDate)))
         {
            pos.push(purchaseOrders[i]);
         }
       }
        setPo(pos);
        setOrderData([]);
    }

    function filterChallan(inventory) {
      setRate(inventory.rate);
      setGst(inventory.gst);
      setData({ ...data, inventory: inventory.inventory, grade:inventory.grade});
      let filteredInv = inventories.filter((inv)=> inv._id === inventory.inventoryId);
      let newTransactions = filteredInv[0].transactions;
      let transactions = [];
      newTransactions.map((transaction)=>{
        transactions.push({
          'amount': transaction.amount,
          'brand': transaction.brand,
          'challan_no':transaction.challan_no,
          'description':transaction.description,
          'grade' : transaction.grade == null || transaction.grade == 'null'? '' : transaction.grade,
          'orderNo': transaction.orderNo,
          'purchaseOrderId': transaction.purchaseOrderId,
          'quantity' : transaction.quantity,
          'rate' : transaction.rate,
          'status': transaction.status,
          'supplier': transaction.supplier,
          'supplierId' : transaction.supplierId,
          'transactionDate': transaction.transactionDate,
          'transactionType': transaction.transactionType,
          'userId': transaction.userId,
          '_id': transaction._id
        })
      })

      let sortBill = [];

      if(projectDialog.Dialogtype === 'new'){
        sortBill = bill.filter((bl) => bl.supplierId === values.supplierId);
      }else if(projectDialog.Dialogtype === 'edit'){
        sortBill = bill.filter((bl) => bl.supplierId === values.supplierId && bl._id !== sampleDetails._id);
      }

      //Filter and Sort Challan No.

      if(sortBill.length > 0)
      {
        sortBill.forEach((srtBill)=>{
          let sortInv  = srtBill.orderData.filter((od)=> od.inventory === inventory.inventory && od.grade === inventory.grade);
          if(sortInv.length > 0){

            let sortChallan = sortInv[0].challanNo, inwardTrans = [];
            let sortGrade = sortInv[0].grade ? sortInv[0].grade : '';
            transactions = transactions.filter((trans) => trans.transactionType !== 'out');
console.log(sortGrade, "kdkkkd")
            for(var i = 0;i < sortChallan.length;i++)
            {
              for(var j = 0;j < transactions.length;j++)
              {
                console.log( transactions[j].grade === sortGrade,  transactions[j].grade , sortGrade)
                if(transactions[j].transactionType === 'in' && sortChallan[i] === transactions[j].challan_no && transactions[j].status === 1 && transactions[j].grade === sortGrade)
                {
                  transactions.splice(j, 1);
                }
              }
            }  

            inwardTrans = transactions.filter((trans) => trans.supplier === values.supplier && trans.status === 1  && trans.grade === inventory.grade);
            setTransactions(inwardTrans);
          }else{
            let inwardTrans = transactions.filter((trans) => trans.transactionType === 'in' && trans.supplier === values.supplier && trans.status === 1  && trans.grade === inventory.grade);
            setTransactions(inwardTrans);
          }
        })
      }else{
        let inwardTrans = transactions.filter((trans) => trans.transactionType === 'in' && trans.supplier === values.supplier && trans.status === 1  && trans.grade === inventory.grade);
        setTransactions(inwardTrans);
      }
    }

    const addOrderData = () => {
      let quantity = 0;
      for(var i = 0; i< transactions.length; i++){
        for(var j = 0; j< challanNo.length; j++){
          if(challanNo[j] === transactions[i].challan_no){
            quantity = quantity + transactions[i].quantity;
          }
        }
      }

      let tempdata = {
        _id: FuseUtils.generateGUID(24),
        rate : rate,
        gst : gst,
        challanNo : challanNo,
        quantity : quantity,
        inventory : data.inventory,
        grade: data.grade
      };

      let sortInv = orderData.filter((od) => od.inventory === data.inventory && od.grade === data.grade);
      if(sortInv.length > 0)
      {
        dispatchWarningMessage(dispatch, " Data against inventory already exits.");
      }else{
        setOrderData([...orderData, tempdata]);
        setAddOpen(false);
        setData(initialstate);
        setRate('');
        setGst('');
      }
    }

    function listChange() {
      let tempData = JSON.parse(JSON.stringify(orderData));
      if (data.inventory === "" && data.quantity === "") {
        setAddOpen(false);
      } else {
        let quantity = 0;
        for(var i = 0; i< transactions.length; i++){
          for(var j = 0; j< challanNo.length; j++){
            if(challanNo[j] === transactions[i].challan_no){
              quantity = quantity + transactions[i].quantity;
            }
          }
        }
        tempData.forEach((item) => {
          if (item._id === list.id) {
            item.inventory = data.inventory;
            item.quantity = quantity;
            item.challanNo = challanNo;
            item.rate = rate;
            item.gst = gst;
          }
        });
        setOrderData(tempData);
        setAddOpen(false);
        setData(initialstate);
        setRate('');
        setGst('');
      }
    }

    function deleteFirstData(id) {
      let data = JSON.parse(JSON.stringify(orderData));
      let deletedData = data.filter((item) => item._id !== id);
      setOrderData(deletedData);
    }

    function handleOpenFirst(id, inventory, quantity, challan_no, rate, gst, grade) {
      setType("Edit");
      setAddOpen(true)
      setData({ inventory, quantity, grade});
      setList({ id, inventory,quantity, grade});
      setChallanNo(challan_no)
      setRate(rate);
      setGst(gst);
      let sortBill = [], poBill = [];

      if(projectDialog.Dialogtype === 'new'){
        sortBill = bill.filter((bl) => bl.supplierId === values.supplierId);
      }else if(projectDialog.Dialogtype === 'edit'){
        sortBill = bill.filter((bl) => bl.supplierId === values.supplierId && bl._id !== sampleDetails._id);
      }

      let filteredInv = inventories.filter((inv)=> inv.type === inventory);
      let transactions = filteredInv[0].transactions;
      if(sortBill.length > 0)
      {
        sortBill.forEach((srtBill)=>{
          let sortInv  = srtBill.orderData.filter((od)=> od.inventory === inventory && od.grade === inventory.grade);
          if(sortInv.length > 0){
            let sortChallan = sortInv[0].challanNo, inwardTrans = [];
            let sortGrade = sortInv[0].grade ? sortInv[0].grade : "";
            transactions = transactions.filter((trans) => trans.transactionType !== 'out');
            for(var i = 0;i<sortChallan.length;i++)
            {
              for(var j = 0;j<transactions.length;j++)
              {
                if(transactions[j].transactionType === 'in' && sortChallan[i] === transactions[j].challan_no && transactions[j].status === 1 && transactions[j].grade === sortGrade)
                {
                  transactions.splice(j, 1);
                }
              }
            }  
            inwardTrans = transactions.filter((trans) => trans.supplier === values.supplier);
            setTransactions(inwardTrans);
          }else{
            let inwardTrans = transactions.filter((trans) => trans.transactionType === 'in' && trans.supplier === values.supplier && trans.status === 1  && (trans.grade === grade || trans.grade === null));
            setTransactions(inwardTrans);
          }
        })
      }else{
        let inwardTrans = transactions.filter((trans) => trans.transactionType === 'in' && trans.supplier === values.supplier && trans.status === 1 && (trans.grade === grade || trans.grade === null));
        setTransactions(inwardTrans);
      }
    }

    function closeComposeDialog() {
      projectDialog.Dialogtype === "edit"
      ? dispatch(closeEditDialog())
      : dispatch(closeNewDialog());
      setInventoryList([]);
      setImage({
        name: "",
        file: "",
        url: "",
        size:""
      });
      setValues(initialValues);
      setOrderData([]);
    }

    const handleDateChange = (date) => {
      setValues({ ...values, invoiceDate: date });
    };
  
    const disableButton = () => {
      return (
        values.invoiceNo.length > 0 &&
        values.supplierId.length > 0 &&
        values.po.length > 0 &&
        orderData.length > 0 &&
        values.transport > -1 &&
        values.transportgst > -1 &&
        values.tdsamount > -1

      );
    };

    const disableDataButton = () => {
      return (
        data.inventory.length > 0 &&
        challanNo.length > 0 
      );
    };

    const handleUpdateSubmit = () => {
      
      
      let form = new FormData();
      form.set("invoiceNo",values.invoiceNo);
      form.set("transport", Number(values.transport));
      form.set("transportgst", Number(values.transportgst));
      form.set("tdsamount", Number(values.tdsamount));
      form.set("invoiceDate", values.invoiceDate);
      form.set("supplierId", values.supplierId);
      form.set("poId", values.poId);
      form.set("orderData",JSON.stringify(orderData));
      form.set("organizationId", projectDetails.organizationId);
      if(sampleDetails.billImage !== undefined){
        if(sampleDetails.billImage.url !== image.url)
        {
          form.set('Update','Yes');
          form.append("bill",image.file);
          form.set('DeleteFile', JSON.stringify(sampleDetails.billImage));
        }else{
          form.set('Update','No');
          form.set('billImage',JSON.stringify(image));
        }
      }else{
        form.set('Update','Yes');
        form.append("bill",image.file);
      } 
      dispatch(billUpdate({ projectId, billId:sampleDetails._id, form})).then((respone) => {
        closeComposeDialog();
      }) 
    };

    const handleAddSubmit = () => {
      let form = new FormData();
      form.set("invoiceNo",values.invoiceNo);
      form.set("transport", Number(values.transport));
      form.set("transportgst", Number(values.transportgst));
      form.set("tdsamount", Number(values.tdsamount));
      form.set("invoiceDate", values.invoiceDate);
      form.set("supplierId", values.supplierId);
      form.set("poId", values.poId);
      form.set("orderData",JSON.stringify(orderData));
      form.set("organizationId", projectDetails.organizationId);
      form.append("bill",image.file);

      dispatch(addbill({ projectId, form})).then((respone) => {
         closeComposeDialog();
      }) 
    };

    function redirectToAgency(){
      if(modules.length === 0 || modules.includes("Agency")){
        if(access === true){
          sessionStorage.setItem("link", 'link');
          dispatch(routes("Vendors"));
          closeComposeDialog();
        }else{
          dispatchWarningMessage(dispatch, "You don't have access to add a Supplier from Agency.")
        }
      }else{
        dispatchWarningMessage(dispatch, "Please include Agency module from Settings to Add Suppliers.")
      }
    }

    function formatOrderNumber(orderNo) {
      const orderSegments = orderNo.split('/');
      const formattedOrderNo = (orderSegments.length >= 2) ? orderSegments.slice(-2).join('/') : "";
      return formattedOrderNo;
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
              {projectDialog.Dialogtype === 'new' ? 'Create Bill' : 'Edit Bill'}
            </Typography>
            <IconButton onClick={() => closeComposeDialog()}>
              <CancelIcon style={{ color: "red" }} />
            </IconButton>
          </Toolbar>
        </AppBar>
          <DialogContent>
          <Accordion variant="outlined">
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography color="textPrimary">Attachment</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div className="flex flex-col w-full"> 
                {image.file === ''?
                   <div className="mt-10">
                   <input
                     accept='image/*,application/pdf'
                     ref={inputfile}
                     multiple={true}
                     className='hidden'
                     id='button-file'
                     type='file'
                     onChange={handleUploadChange}
                   />
                   <Button
                     variant="contained"
                     color="primary"
                     onClick={onButtonClick}
                   >
                     Upload
                   </Button>
                 </div>
              : 
              <List
              component="nav"
              // className={classes.root}
              aria-label="mailbox folders"
            >
              <React.Fragment>
                  <Grid container alignItems="center" direction="row">
                    <Grid item xs={10}>
                      <ListItem
                        button
                      >
                        <ListItemText
                          primary={image.name}
                        />
                      </ListItem>
                    </Grid>

                    <Grid item xs={1}>
                      {projectDialog.Dialogtype === 'edit' && image.url?
                        <IconButton
                         onClick={() => viewDocument(image)}
                         className={classes.productListImageView}
                        >
                          <VisibilityIcon /> 
                        </IconButton>
                      :null}
                     
                    </Grid>
                    <Grid item xs={1}>
                      <IconButton
                         onClick={() => setImage({ ...image, url: "", file: "",name:"",size:"" })}
                        variant="containedhandleUploadChange"
                      >
                        <Icon className={classes.delete}>delete</Icon>
                      </IconButton>
                    </Grid>
                  </Grid>
              </React.Fragment>
            </List>
              
              }
             
              </div>
            </AccordionDetails>
          </Accordion>

          <div className="grid grid-cols-3 divide-x divide-gray-400">
            <TextField
              value={values.invoiceNo}
              required
              className="w-1 my-10 mr-10"
              onChange={handleChange("invoiceNo")}
              id="outlined-basic"
              label="Invoice No."
              variant="outlined"
            />
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <DatePicker
                required
                label="Invoice Date"
                className="w-1 my-10"
                format="dd/MM/yyyy"
                value={values.invoiceDate}
                onChange={handleDateChange}
                inputVariant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </MuiPickersUtilsProvider>

             <TextField
              value={values.transport}
              className="w-1 my-10 mr-10 ml-10"
              type="Number"
              onChange={handleChange("transport")}
              id="outlined-basic"
              label="Transport Amount"
              variant="outlined"
            />    
            <TextField
              value={values.transportgst}
              className="w-1 my-10 mr-10"
              onChange={handleChange("transportgst")}
              id="outlined-basic"
              label="Transport Gst"
              variant="outlined"
            />    
            <TextField
              value={values.tdsamount}
              className="w-1 my-10 mr-10 ml-10"
              onChange={handleChange("tdsamount")}
              id="outlined-basic"
              label="TDS Amount"
              variant="outlined"
            />    
          </div>

          {supplier.length ? (
            <FormControl fullWidth variant="outlined"  className=" my-10">
             <InputLabel id="demo-simple-select-outlined-label">
               Select Supplier
             </InputLabel>
             <Select
               fullWidth
               label="Select Supplier"
               value={values.supplier}
               onChange={handleChange("supplier")}
             >
              {supplier.map((sp) => (
                <MenuItem value={sp.name} onClick={() => filterPo(sp.name)}>
                 {sp.name}
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
          ):(
            <Typography>Purchase Order against supplier not Found. Please Create.</Typography>
          )} 

          {values.supplier !== ''?
            po.length ? (
             <FormControl fullWidth variant="outlined"  className=" my-10">
               <InputLabel id="demo-simple-select-outlined-label">
                 Select Purchase Order
               </InputLabel>
          
                <Select
                fullWidth
                 label="Select Purchase Order"
                value={values.po} 
                onChange={handleChange("po")}
                 >
    {po.map((pos) => (
        <MenuItem value={pos.orderNo} onClick={() => filterInventory(pos)}>
            {formatOrderNumber(pos.orderNo)} 
        </MenuItem>
    ))}
      </Select>


              </FormControl>
            ):(
             <Typography>Purchase Order not Found. Please Create.</Typography>
            ):null}

           {values.po!== '' ?
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
                                 item.quantity,
                                 item.challanNo,
                                 item.rate,
                                 item.gst,
                                 item.grade
                              );
                            }}
                          >
                          <ListItemText
                            primary={"Inventory-"+item.inventory +" -"+item.grade +" Quantity-"+item.quantity}
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
                       setType("new")
                       setData(initialstate);
                       setChallanNo([]);
                     }}
                    >
                     Add
                    </Button>
                 </div>
               </div>
              </AccordionDetails>
           </Accordion> 
           :null} 
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
                 onClick={()=>handleUpdateSubmit()}
                 variant="contained"
                 color="primary"
                >
                 Update
                </Button>}
                <Button onClick={()=>closeComposeDialog()} variant="contained">
                  Cancel
                </Button>
              </div>
              
            </DialogContent>
          </Dialog>

      <Dialog
        open={addOpen}
        onClose={()=>handleClose()}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="sm"
      >
        {type === "Edit" ? (
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
                value={data.inventory + data.grade}
                //onChange={handleChangeData("inventory")}
              >
                {inventoryList.map((inv) => (
                  <MenuItem value={inv.inventory + inv.grade} onClick={() => filterChallan(inv)}>
                    {inv.inventory + inv.grade}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {data.inventory === 'RMC' || data.inventory === 'rmc' || data.inventory === 'Rmc' ?
              <FormControl variant="outlined" className="mt-8 w-full">
                <InputLabel id="demo-simple-select-outlined-label">
                 Grade
                </InputLabel>
                <Select
                  required
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  value={data.grade}
                  onChange={handleChangeData("grade")}
                  label="Grade"
                  readOnly
                >
                  {gradeType.map((wo) => (
                    <MenuItem value={wo}>
                      <Typography>{wo}</Typography>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              : null}
            {data.inventory !== '' ?
              <FormControl variant="outlined">
                <InputLabel id="demo-simple-select-outlined-label">
                  Select Challan
                </InputLabel>
                <Select
                  labelId="demo-multiple-name-label"
                  id="demo-multiple-name"
                  label="Select Challan"
                  multiple
                  value={challanNo}
                  onChange={handleChangeChallan}
                >
                  {transactions.map((trans) => (
                    <MenuItem value={trans.challan_no}>
                      {trans.challan_no}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              : null}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>handleClose()} color="primary">
           CANCEL
          </Button>
         {type === "Edit" ? (
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

      <Dialog
          fullScreen
          open={viewOpen}
        >
          <DialogTitle id="alert-dialog-title">{title}</DialogTitle>: 
          <DialogContent className="items-center justify-center">
            <div>
              {fileType === 'pdf'|| fileType === 'PDF'?
               <PrismaZoom className={classes.zoom} maxZoom={20} topBoundary={120}>
                 <ReactFileViewer key={Math.random()} fileType={fileType} filePath={file} onError={onError} />
               </PrismaZoom>
              :fileType === 'png'  || fileType === 'jpeg' || fileType === 'PNG'|| fileType === 'jpg'  ?
               <PrismaZoom className={classes.zoom} maxZoom={20} topBoundary={120}>
                 <img alt="viewFile" src={file} />
               </PrismaZoom>
              :null}  
            </div> 
          </DialogContent>
          <DialogActions>
           <Button 
              onClick={() => 
                {
                  setViewOpen(false)
                  setFileType('')
                  setFile('')
                  setTitle('')
                }}
              variant="contained" 
              color="primary"
           >
             CLOSE
           </Button>
          </DialogActions>
      </Dialog>
    </div> 
  );
}

export default BillRegisterDialog;
