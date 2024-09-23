import React, { useEffect,useCallback, useState } from 'react';
import { makeStyles,ThemeProvider } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { Button, TextField } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { addbilling, updateBill,getInvoiceId, closeEditDialog, closeNewDialog, } from 'app/main/projects/store/projectsSlice';
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import moment from "moment/moment";
import Dropzone from "react-dropzone";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import clsx from "clsx";
import * as XLSX from "xlsx";
import CloudDoneIcon from '@material-ui/icons/CloudDone';
import { dispatchWarningMessage } from "app/utils/MessageDispatcher";
import { selectMainTheme } from "app/store/fuse/settingsSlice";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  IconButton
} from "@material-ui/core";
import CancelIcon from "@material-ui/icons/Cancel";
import { Autocomplete } from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
    input: {
        color: "white",
      },
    dropzone: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        height: "200px",
        border: "3px dashed #eeeeee",
        backgroundColor: "#fafafa",
        color: "#bdbdbd",
        marginBottom: "20px",
      },
  appBar: {
    position: 'relative',
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 3,
    color: '#fff',
  },
}));

const initialState = {
  billType:'',
  previousBillId:'',
  previousBillHolder:'',
  previousBillQty:[],
  previousBillAmount:0,
  billholder_name:'',
  billingDate: new Date(),
  address: '',
  site_address: '',
  work_order_date: new Date(),
  work_order_no: '',
  contact: '',
  pan: '',
  gstin: '',
  hsncode: '',
  bank_name:'',
  branch_name:'',
  account_no:'',
  ifsc_code:'',
  billed_to:'',
  invoiceDetails:{
    invoice_no:'',
    invoiceId:'',
  },
  BOQdata:'',
  Boq_File:'',
  billContactPerson: "",

};

function MomDialog(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const projectId = useSelector(({ projects }) => projects.details._id);
  const loading = useSelector(({ projects }) => projects.loading);
  const billingDetails = useSelector(({ projects }) => projects.billing.detailBilling);
  const lastRecord = useSelector(({ projects }) => projects.billing.LastRecord);
  const billings = useSelector(({ projects }) => projects.billing.billingList);
  const [open, setOpen] = useState(false);
  const [type, setType] = useState('new');
  const [form, setForm] = useState(initialState);
  const [billingDate, setBillingDate] = React.useState(new Date());
  const [work_order_date, setWork_order_date] = React.useState(new Date());
  const mainTheme = useSelector(selectMainTheme);
  const [values, setValues] = useState({
    file: '',
  });
  const [previous, setPrevious] = useState({
    previousBillId: "",
    previousBillQty: [],
    previousBillAmount: 0,
  });
  const projectDialog = useSelector(({ projects }) => projects.projectDialog);
  const [loading1, setLoading1] = useState(false);
  let BOQData = [];


  const initprojectDialog = useCallback(() => {
 
    if (projectDialog.Dialogtype === "edit" && projectDialog.data) {
      setType('edit');
      if (billingDetails !== '') {
        let previousBillId = billingDetails.previousBillId;
        let previousBillQty = billingDetails.previousBillQty;
        let previousBillAmount = billingDetails.previousBillAmount;

        setPrevious({ previousBillId, previousBillQty, previousBillAmount});
        setForm(billingDetails);
      }
    }

    if (projectDialog.Dialogtype === "new") {
      setType('new');
      setOpen(true);
    }
  }, [projectDialog.data, projectDialog.Dialogtype, setForm]);

  useEffect(() => {
    if (projectDialog.props.open) {
      initprojectDialog();
    }
  }, [projectDialog.props.open, initprojectDialog]);


  function closeComposeDialog() {
    if (projectDialog.Dialogtype === "edit") {
      dispatch(closeEditDialog());
    } else if (projectDialog.Dialogtype === "new") {
      dispatch(closeNewDialog());
    }

    setForm(initialState);
    setPrevious({
      previousBillId: "",
      previousBillQty: [],
      previousBillAmount: 0,
    });
    setValues({file:''})
  }

  const handleDateChange = (date) => {
    setBillingDate(date);
    setForm({ ...form, billingDate: date });
  };

  const handleWorkOnDateChange = (date) => {
    setWork_order_date(date);
    setForm({ ...form, work_order_date: date });
  };

  const handleDrop = (acceptedFiles) => {
    setLoading1(true);
    setValues({ ...values, file: acceptedFiles[0] });
    setLoading1(false);

    var f=acceptedFiles[0];
    var name = f.name;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;  
      const wb = XLSX.read(bstr, { type: "binary" });
     
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];

      const data = XLSX.utils.sheet_to_json(ws, {defval:""});

      let rows=[];
      if(form.billType === "Current")
      {
        for(var i=2;i<data.length;i++)
        {
          let x=data[i];
          for (var key in x){
            rows.push(x[key])
            }
            BOQData.push({"Sr":rows[0],"Description":rows[1],"WO_Qty":"","Qty":rows[2],"Unit":rows[3],"Rate":rows[4],"Amount":rows[5]})
            rows=[];
        }
      }else if(form.billType === "Cumulative")
      {
        for(var i=2;i<data.length;i++)
        {
          let x=data[i];
          for (var key in x){
            rows.push(x[key])
            }
            BOQData.push({"Sr":rows[0],"Description":rows[1],"WO_Qty":rows[2],"Qty":rows[3],"Unit":rows[4],"Rate":rows[5],"Amount":rows[6]})
            rows=[];
        }
      }else{
        dispatchWarningMessage(dispatch, "Please Select Bill Type.");
      }
      setForm({ ...form, BOQdata: BOQData,Boq_File:acceptedFiles[0] });
    };
    BOQData=[];
    reader.readAsBinaryString(f);
  };
 
 function handlesetPreviousBill (bill) {
    let previousBillQty=[];
    let previousBillAmount;

    if(bill.previousBillQty.length > 0)
    {
      let previousBillId=bill._id;
      previousBillAmount=Number(bill.BOQdata[bill.BOQdata.length-1].Amount) + bill.previousBillAmount;
      for(var i=0;i<bill.BOQdata.length;i++)
      {
        if(bill.previousBillQty[i] === undefined)
        {
          previousBillQty.push({
            Qty:Number(bill.BOQdata[i].Qty),
          });
        }else
        {
          previousBillQty.push({
            Qty:Number(bill.BOQdata[i].Qty) + Number(bill.previousBillQty[i].Qty),
          });
        }  
      }
      setPrevious({ previousBillId, previousBillQty, previousBillAmount });
    }else{
      let previousBillId=bill._id;
      previousBillAmount=Number(bill.BOQdata[bill.BOQdata.length-1].Amount);
      
      for(var i=0;i<bill.BOQdata.length;i++)
      {
        previousBillQty.push({
          Qty:bill.BOQdata[i].Qty,
        });
      }
      setPrevious({ previousBillId, previousBillQty, previousBillAmount });
    }
 };

  const handleChange = (prop) => (event) => {  
    if(prop === 'billholder_name' && type === 'new'){
      let bills = billings.filter((bill)=>bill.billholder_name === event.target.value)

      if(bills.length >0){
        setForm({ ...form, [prop]: event.target.value, address: bills[0].address});
      }else{
        setForm({ ...form, [prop]: event.target.value });
      }
    }else{
      setForm({ ...form, [prop]: event.target.value });
    }
  };

  const handlepreviousBillChange = (prop) => (event) => {
    if(event.target.value === "None")
    {
      setPrevious({ 
        previousBillId: "",
        previousBillQty: [],
        previousBillAmount: 0,
      });
    }
    setForm({ ...form, [prop]: event.target.value });
  };

  const disableButton = () => {
    return (
      form.billType.length > 0 &&
      form.billed_to.length > 0 &&
      form.BOQdata.length > 0 && 
      form.billholder_name.length>0
    );
  };

  const filteredBill = billings.filter(i=> i._id !== billingDetails._id);

  const add = ()=>{
    let data = new FormData();
    data.set('billType', form.billType);
    data.set('previousBillId', previous.previousBillId);
    data.set('previousBillAmount', previous.previousBillAmount);
    data.set('previousBillQty', JSON.stringify(previous.previousBillQty));
    data.set('previousBillHolder', form.previousBillHolder);
    data.set('billholder_name', form.billholder_name);
    data.set('billingDate', form.billingDate);
    data.set('address', form.address);
    data.set('site_address', form.site_address);
    data.set('work_order_date', form.work_order_date);
    data.set('work_order_no', form.work_order_no);
    data.set('contact', form.contact);
    data.set('pan', form.pan);
    data.set('gstin', form.gstin);
    data.set('hsncode', form.hsncode);
    data.set('bank_name', form.bank_name);
    data.set('branch_name', form.branch_name);
    data.set('account_no', form.account_no);
    data.set('ifsc_code', form.ifsc_code);
    data.set('billed_to', form.billed_to);
    data.set('invoiceDetails', JSON.stringify(form.invoiceDetails));
    data.set('BOQdata', JSON.stringify(form.BOQdata));
    data.append('BOQFile', form.Boq_File);

    dispatch(addbilling({ projectId, data})).then((respone) => {
      closeComposeDialog();
    })  
  }

  const edit = () =>{
   
    let data = new FormData();
    data.set('billType', form.billType);
    data.set('previousBillId', previous.previousBillId);
    data.set('previousBillAmount', previous.previousBillAmount);
    data.set('previousBillQty', JSON.stringify(previous.previousBillQty));
    data.set('previousBillHolder', form.previousBillHolder);
    data.set('billholder_name', form.billholder_name);
    data.set('billingDate', form.billingDate);
    data.set('address', form.address);
    data.set('site_address', form.site_address);
    data.set('work_order_date', form.work_order_date);
    data.set('work_order_no', form.work_order_no);
    data.set('contact', form.contact);
    data.set('pan', form.pan);
    data.set('gstin', form.gstin);
    data.set('hsncode', form.hsncode);
    data.set('bank_name', form.bank_name);
    data.set('branch_name', form.branch_name);
    data.set('account_no', form.account_no);
    data.set('ifsc_code', form.ifsc_code);
    data.set('billed_to', form.billed_to);
    data.set('invoiceId', form.invoiceId);
    data.set('invoice_no', form.invoice_no);
    data.set('BOQdata', JSON.stringify(form.BOQdata));
    if(form.Boq_File.length !== billingDetails.Boq_File.length)
  {
    data.append('BOQFile', form.Boq_File);
    if(billingDetails.Boq_File.length>0)
    {
      if(billingDetails.Boq_File[0].url !== undefined && billingDetails.Boq_File[0].url !== null){
        data.set('DeleteBOQFile', JSON.stringify(billingDetails.Boq_File));
      }else{
        data.set('DeleteBOQFile', []);
      }
    }
    data.set('Update',"Yes")
  }else{
    data.append('BOQFile', JSON.stringify(form.Boq_File));
    data.set('Update',"No")
  }

    dispatch(updateBill({
      projectId,
      billId: billingDetails._id,
      data,
    })).then((respone) => {
      closeComposeDialog();
    })
  }
 
  return (
    <div className='flex flex-1 w-full'>
      <Dialog open={open}  {...projectDialog.props} fullWidth maxWidth='sm'>
        <Backdrop className={classes.backdrop} open={loading}>
          <CircularProgress color='inherit' />
        </Backdrop>
        <AppBar className={classes.appBar}>
        <div className="flex flex-1 items-start justify-between mx-6">
            <div>
            <ThemeProvider theme={mainTheme}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <DatePicker
                className='w-1/2'
                 margin="normal"
                 id="date-picker-dialog"
                 format="dd/MM/yyyy"
                 value={form.billingDate}
                 onChange={handleDateChange}
                 InputLabelProps={{
                    className: classes.input,
                    disableUnderline: true,
                 }}
               />
              </MuiPickersUtilsProvider>
              </ThemeProvider>
              </div>
              <div className="mt-10">
                  <Typography variant="h6">{type === 'new' ? 'Add Mom' : 'Edit Mom'}</Typography>
                </div>
            <IconButton onClick={() => closeComposeDialog()}>
              <CancelIcon style={{ color: "red" }} />
            </IconButton>
              </div>
        </AppBar>
        <DialogContent>
          <div className='flex flex-1 flex-col gap-12 w-full mt-10'>
           <div class="grid grid-cols-2 divide-x divide-gray-400">
             <FormControl
                required
                variant="outlined"
                className="w-1 mr-10 my-10"
             >
               <InputLabel id="demo-simple-select-outlined-label">
                 Team member
               </InputLabel>
               <Select
                 required
                 value={form.billType}
                 onChange={handleChange('billType')}
                 label="Bill Type"
                >
                  <MenuItem value="Current">Current</MenuItem>
                  <MenuItem value="Cumulative">Cumulative</MenuItem>
                </Select>
              </FormControl>

             <TextField
               label='Description'
               required
               className="w-1 ml-10 my-10"
               variant='outlined'
               value={form.billholder_name}
               onChange={handleChange('billholder_name')}
             />
              <FormControl
                required
                variant="outlined"
                className="w-1 mr-10 my-10"
             >
               <InputLabel id="demo-simple-select-outlined-label">
               Assigned to
               </InputLabel>
               <Select
                 required
                 value={form.billType}
                 onChange={handleChange('billType')}
                 label="Bill Type"
                >
                  <MenuItem value="Current">Current</MenuItem>
                  <MenuItem value="Cumulative">Cumulative</MenuItem>
                </Select>
              </FormControl>
               {/* <Autocomplete
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
                  label='Assigned to'
                  onChange={handleChange('billContactPerson')}
                  variant="outlined"
                />
              )}
            /> */}
            
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <DatePicker
                 required
                 label="Date Assigned"
                 className="w-1 mr-10 my-10"
                 format="dd/MM/yyyy"
                 value={form.billingDate}
                 onChange={handleDateChange}
                 inputVariant="outlined"
                 InputLabelProps={{
                    shrink: true,
                 }}
               />
              </MuiPickersUtilsProvider>  
           </div>
           </div>
             
            <div className='flex flex-row gap-10 mb-20 mt-10'>
             {type === 'new' ? (
               <Button
                 variant='contained'
                 color='primary'
                //  disabled={!disableButton()}
                 onClick={() => add() }
               >
                 ADD
               </Button>
             ) : (
               <Button
                 variant='contained'
                 color='primary'
                 onClick={() => edit()}
               >
                 Save
               </Button>
             )}

             <Button variant='contained' onClick={() => {closeComposeDialog()}}>
               Cancel
             </Button>
            </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default MomDialog;
