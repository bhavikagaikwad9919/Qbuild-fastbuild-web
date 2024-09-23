import React, { useEffect, useCallback, useState } from "react";
import {
  TextField,
  Button,
  Dialog,
  Divider,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  List,
  ListItem,
  ListItemText,
  AppBar,
  Backdrop,
  CircularProgress,
  IconButton,
  Icon,
  InputLabel,
  Select,
  FormControl,
  MenuItem,
} from "@material-ui/core";
import CancelIcon from "@material-ui/icons/Cancel";
import moment from "moment";
import { makeStyles } from "@material-ui/core/styles";
import {
  closeEditDialog,
  closeNewDialog,
  updateInventory,
  downloadSingleInventoryExcelReport,
  deleteTransaction,
 /// importTransactions
} from "app/main/projects/store/projectsSlice";
import { useDispatch, useSelector } from "react-redux";
import FuseLoading from "@fuse/core/FuseLoading";
import InventoryUpdateDialog from "./InventoryUpdateDialog";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { dispatchWarningMessage } from "app/utils/MessageDispatcher";
// import clsx from "clsx";
// import CloudUploadIcon from "@material-ui/icons/CloudUpload";
// import FuseAnimate from "@fuse/core/FuseAnimate";
// import Dropzone from "react-dropzone";

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
  cancelButton: {
    position: "relative",
    right: 12,
    bottom: 12,
    zIndex: 99,
  },
  delete: {
    color: "red",
  },
  // dropzone: {
  //   display: "flex",
  //   flexDirection: "column",
  //   alignItems: "center",
  //   justifyContent: "center",
  //   padding: "20px",
  //   height: "200px",
  //   border: "3px dashed #eeeeee",
  //   color: "#bdbdbd",
  //   marginBottom: "20px",
  // },
}));

let initialValues = {
  quantity: "",
  description: "",
  supplier:"",
  brand:"",
  transactionType:"out",
  transactionDate: new Date(),
  challan_no:"",
  grade:"",
  rate: 0,
  amount: 0,
};

function InventoryDialog(props) {
  const dispatch = useDispatch();
  const classes = useStyles(props);
  const [open, setOpen] = React.useState({
    update: false,
    delete: false,
    updateDetails: false,
    download: false,
  });
  const [pageLoading, setPageLoading] = useState({
    download: false,
  });
  const [values, setValues] = React.useState(initialValues);
  const projectDialog = useSelector(({ projects }) => projects.projectDialog);
  const projectId = useSelector(({ projects }) => projects.details._id);
  const inventory = useSelector(({ projects }) => projects.detailInventory);
  const loading = useSelector(({ projects }) => projects.loading);
  const po = useSelector(({ projects }) => projects.purchaseOrders.purchaseOrderList);
  const gradeType = useSelector(({ dataStructure }) => dataStructure.gradeType);
  const [selectedDate, setSelectedDate] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });
  const [ rate, setRate] = useState(0);
  // const [loadingInv, setLoadingInv] = useState(false);
  // const projectDetails = useSelector(({ projects }) => projects.details);
  // const [openInv, setOpenInv] = useState(false);
  let today = new Date()

  // const handleCloseInv = () => {
  //   setOpenInv(false);
  // };

  // const handleDrop = (acceptedFiles) => {
  //   if (acceptedFiles.length) {
  //     setLoadingInv(true);
  //     let payload = new FormData();
  //     payload.append("file", acceptedFiles[0]);
  //     payload.set("quantity", inventory.quantity);
  //       // dispatch(importTransactions({ projectId: projectDetails._id, inventoryId:inventory._id, payload })).then(
  //       //   (response) => {
  //       //     setLoadingInv(false);
  //       //     handleCloseInv();
  //       //   }
  //       // );
  //   }
  // };

  let poData = [], finalPo = [];
  if(po.length > 0){
    po.forEach((item)=>{
      poData.push({
        "orderDate": moment(new Date(item.odDate)).format('YYYY/MM/DD'),
        "orderData": item.orderData
      })
    })
  
    finalPo = poData.sort(function(a, b) {
      return new Date(a.orderDate) - new Date(b.orderDate);
    });
  }

  let transactions = [];
  // let quantity;

  const initprojectDialog = useCallback(() => {
    /**
     * projectDialog type: 'edit'
     */

    if (projectDialog.Dialogtype === "edit" && projectDialog.data) {
      if (!inventory) {
        return <FuseLoading />;
      }
    }

    /**
     * projectDialog type: 'new'
     */
    if (projectDialog.Dialogtype === "new") {
    }
  }, [projectDialog.data, projectDialog.Dialogtype, inventory]);

  useEffect(() => {
    if (projectDialog.props.open) {
      initprojectDialog();
    }

    if(inventory.type !== 'RMC' && inventory.type !== 'Rmc' && inventory.type !== 'rmc'){

      if(finalPo.length > 0){
        let x = 0;
        finalPo.forEach((fp)=>{
          let data = fp.orderData;
          data.forEach((dt)=>{
            if(dt.inventory === inventory.type && x === 0){
              x++;
              setRate(dt.rate);
            }
          })
        })
      }
    }

  }, [projectDialog.props.open, initprojectDialog]);

  function closeComposeDialog() {
    projectDialog.Dialogtype === "edit"
      ? dispatch(closeEditDialog())
      : dispatch(closeNewDialog());
  }

  const handleClickOpen = () => {
    setOpen({ ...open, update: true });
  };

  const handleClose = () => {
    setOpen({ ...open, update: false });
    setValues(initialValues);
  };
  
  if (inventory) {
    inventory.transactions.forEach((item) => {
      if (item.transactionType === "in") {
        transactions.push({
          _id: item._id,
          date: moment(item.transactionDate).format("DD MMM YYYY"),
          quantity: item.quantity,
          type: "Added",
          challan_no: item.challan_no === undefined || item.challan_no === null ? "" : item.challan_no,
        });
      } else {
        transactions.push({
          _id: item._id,
          date: moment(item.transactionDate).format("DD MMM YYYY"),
          quantity: item.quantity,
          type: "Reduced",
          challan_no: item.challan_no === undefined || item.challan_no === null  ? "" : item.challan_no,
        });
      }
    });

    let name,
    quantity,
    unit = "";
    
    name = (
      <Typography
        className="font-bold"
        variant="subtitle"
      // color='inherit'
      >
        {inventory.type}
      </Typography>
    );
    quantity = (
      <Typography className="font-bold my-6" variant="h6">
        {inventory.quantity}
      </Typography>
    );
    unit = (
      <Typography className="font-bold my-8 mx-12 " variant="subtitle1">
        {inventory.unit}
      </Typography>
    );
  }

  const handleChange = (prop) => (event) => {
    if (prop === "quantity") {
      let re = /[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)/;
      if (re.test(event.target.value) || event.target.value === "") {
        setValues({ ...values, [prop]: event.target.value });
      }
    }else if(prop === 'grade'){
      setRate(0);
      if(finalPo.length > 0){
        let x = 0;
        finalPo.forEach((fp)=>{
          let data = fp.orderData;
          data.forEach((dt)=>{
            if(dt.inventory === inventory.type && dt.grade === event.target.value && x === 0){
              x++;
              setRate(dt.rate);
            }
          })
        })
      }

      setValues({ ...values, [prop]: event.target.value });
    }  else {
      setValues({ ...values, [prop]: event.target.value });
    }
  };

  function updateInv(projectId, inventoryId, type, values) {
    let transact = transactions, newTrans = [];

    transact.map((tan)=>{
      if(tan.type === "Added")
      {
        newTrans.push({
          "_id": tan._id,
          "challan_no": tan.challan_no === undefined || tan.challan_no === null ? "" : tan.challan_no,
        })
      }
    })
    let filterTran = newTrans.filter((tran)=> tran.challan_no.toLowerCase() === values.challan_no.toLowerCase() && type === "in")

    if (inventory.quantity === 0 && type === "out") {
      dispatchWarningMessage(dispatch, "Sorry!! Entered quantity is not available. Please Add Quantity.");
    } else if (values.quantity > inventory.quantity && type === "out") {
      dispatchWarningMessage(dispatch, "Sorry!! Entered quantity is greater than available quantity.");
    } else if(filterTran.length > 0) {
      dispatchWarningMessage(dispatch, `Entered Challan No is already used. Please check.`);
    } else{
      handleClose();
      values.transactionDate = moment(values.transactionDate).format("YYYY-MM-DD");
      values.challan_no = values.transactionType === 'out'? 0 : values.challan_no;
      values.rate = values.transactionType === 'out'? 0 : rate;
      values.amount = values.transactionType === 'out'? 0 : rate * Number(values.quantity);

      dispatch(updateInventory({ projectId, inventoryId, type, values }));
      setValues(initialValues);
    }

  }

  const handleDateChange = (prop) => (date) => {
    setSelectedDate({ ...selectedDate, [prop]: date });
  };

  const downloadReport = () => {
    setPageLoading({ ...pageLoading, download: true });
    let filters = {
      startDate: moment(selectedDate.startDate).format("YYYY-MM-DD"),
      endDate: moment(selectedDate.endDate).format("YYYY-MM-DD"),
    };
    dispatch(
      downloadSingleInventoryExcelReport({
        projectId,
        inventoryId: inventory._id,
        filters,
      })
    ).then(() => {
      setPageLoading({ ...pageLoading, download: false });
      setOpen({ ...open, download: false });
    });
  };

  const buttonDisabled = () => {
    if(values.transactionType === 'in'){
      return values.quantity >= 0.01 && values.supplier.length > 1 && values.quantity.length < 9 && values.challan_no.length > 0;
    }else{
      return values.quantity >= 0.01 && values.supplier.length > 1 && values.quantity.length < 9;
    }
  };

  function deleteList(transactionId,inventoryId){
    dispatch(deleteTransaction({ projectId, inventoryId, transactionId }));
  }

  return (
    <>
      <Dialog
        contentStyle={{ margin: 0, padding: 0 }}
        classes={{
          paper: "m-24",
        }}
        {...projectDialog.props}
        onClose={closeComposeDialog}
        scroll="paper"
        fullWidth
        maxWidth="xs"
      >
        <AppBar position="static" elevation={1}>
          <IconButton className="justify-end pb-0" onClick={closeComposeDialog}>
            <CancelIcon style={{ color: "red" }} />
          </IconButton>
          <div className="flex flex-col items-center justify-center pb-12">
            <div className="flex flex-row items-center">
              <Typography className="font-bold mb-6" variant="h6">
                {inventory.quantity} {inventory.unit}
              </Typography>
              <IconButton
                onClick={() => setOpen({ ...open, updateDetails: true })}
              >
                <Icon color="secondary">edit</Icon>
              </IconButton>
            </div>
            <Typography
              className="font-bold "
              variant="subtitle1"
              align="center"
            >
              {inventory.type}
            </Typography>
            
            {/* <Typography
              className="font-bold "
              variant="subtitle1"
            // color='inherit'
            >
            </Typography> */}
           
            {/* <Button
              className="mt-12 mb-6"
              variant="contained"
              onClick={handleClickOpen}
              color="secondary"
            >
              Update
            </Button> */}

            {/* <Button
              className="mt-12 mb-6"
              variant="contained"
              onClick={() => setOpenInv(true)}
              color="secondary"
            >
              Upload
            </Button> */}

          </div>
        </AppBar>
        <div className="flex items-center justify-between mx-20 my-6">
          <Typography color="primary">Transactions</Typography>
        </div>
        <Divider />
        <DialogContent
          style={{
            paddingLeft: 0,
            paddingRight: 0,
            paddingTop: 0,
            paddingBottom: 0,
          }}
          dividers="paper"
        >
          {transactions.length ? (
            <List component="nav">
              {transactions.map((item) => (
                <React.Fragment>
                  <ListItem button key={item._id}>
                    <ListItemText
                      primary={item.date}
                      secondary={
                        <Typography
                          style={
                            item.type === "Added"
                              ? { color: "green" }
                              : { color: "red" }
                          }
                        >
                          {item.type + " " + item.quantity}
                        </Typography>
                        
                      }
                    />
                    {item.quantity===undefined?(
                     <IconButton
                        edge="end"
                         onClick={() => deleteList(item._id,inventory._id)}
                        variant="contained"
                      >
                        <Icon className={classes.delete}>delete</Icon>
                      </IconButton>):null}
                  </ListItem>
                 
                   
                </React.Fragment>
              ))}
            </List>
          ) : (
            <Typography variant="h6" style={{ textAlign: "center" }}>
              No Transactions Available
            </Typography>
          )}

          <Backdrop className={classes.backdrop} open={loading}>
            <CircularProgress color="inherit" />
          </Backdrop>
        </DialogContent>
      </Dialog>

      <Dialog
        open={open.update}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Update Quantity"}</DialogTitle>
        <DialogContent>
          <div className="flex flex-col gap-8">
            <TextField
              required
              onChange={handleChange("quantity")}
              value={values.quantity}
              variant="outlined"
              label="Please enter quantity"
              autoFocus
            />
             
             <FormControl variant="outlined" className="mt-8">
              <InputLabel id="demo-simple-select-outlined-label">
                Transaction Type
              </InputLabel>
              <Select
                required
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={values.transactionType}
                onChange={handleChange("transactionType")}
                label="Transaction Type"
              >
                <MenuItem value="in">Added</MenuItem>
                <MenuItem value="out">Consumed</MenuItem>
              </Select>
             </FormControl>

            {inventory.supplier!==undefined? 
              <FormControl variant="outlined" className="mt-8">
              <InputLabel  id="demo-simple-select-outlined-label">
                Supplier
              </InputLabel>
              <Select
                required
                label="Supplier"
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={values.supplier}
                onChange={handleChange("supplier")}
              >
                  {inventory.supplier.map((sname) => (
                      <MenuItem key={sname} value={sname}>
                       {sname}
                      </MenuItem>
                  ))}
              </Select>
              </FormControl>
            :null}  

              {values.supplier!=='' && inventory.brand.length>0?
                 <FormControl variant="outlined" className="mt-8">
                 <InputLabel  id="demo-simple-select-outlined-label">
                   Brand
                 </InputLabel>
                 <Select
                    required
                    label="Brand"
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={values.brand}
                    onChange={handleChange("brand")}
                  >
                      {inventory.brand.map((bname) => (
                         <MenuItem key={bname} value={bname}>
                          {bname}
                        </MenuItem>
                   ))}
                  </Select>
               </FormControl>
              :null}

            {values.transactionType === "in" ?
              <TextField
                className="mt-8"
                variant="outlined"
                // error={error}
                // helperText="enter quantity within range of avialble quantity"
                id="challan-number"
                label="Challan No."
                value={values.challan_no}
                onChange={handleChange("challan_no")}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              : null}
              
             {inventory.type==="RMC" || inventory.type === "Rmc" || inventory.type==="rmc"?
              //  <TextField
              //    className="mt-8"
              //    variant="outlined"
              //    label="Grade"
              //    defaultValue={values.grade}
              //    onChange={handleChange("grade")}
              //    InputLabelProps={{
              //      shrink: true,
              //    }}
              //   />
              <FormControl variant="outlined" className="mt-8">
                <InputLabel id="demo-simple-select-outlined-label">
                 Select Grade
                </InputLabel>
                <Select
                  required
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  value={values.grade}
                  onChange={handleChange("grade")}
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

            <TextField
              onChange={handleChange("description")}
              value={values.description}
              variant="outlined"
              label="Description"
            />
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <DatePicker
                inputVariant="outlined"
                id="date-picker-dialog"
                label="Select date"
                format="dd/MM/yyyy"
                maxDate={today}
                value={values.transactionDate}
                onChange={(date) =>
                  setValues({ ...values, transactionDate: date })
                }
              />
            </MuiPickersUtilsProvider>
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            disabled={!buttonDisabled()}
            onClick={() => {
              updateInv(projectId, inventory._id, values.transactionType, values);
            }}
            color="primary"
          >
            Ok
          </Button>
          {/* <Button
            disabled={!buttonDisabled()}
            onClick={() => {
              updateInv(projectId, inventory._id, "out", values);
            }}
            color="primary"
          >
            REDUCE
          </Button> */}
        </DialogActions>
      </Dialog>
      {open.updateDetails ? (
        <InventoryUpdateDialog
          open={open}
          close={() => {
            setOpen({ ...open, updateDetails: false });
            dispatch(closeEditDialog());
          }}
        />
      ) : null}

     {/* <Dialog open={openInv} maxWidth="sm" onClose={handleCloseInv}>
       <FuseAnimate animation="transition.expandIn" delay={300}>
         <div className="m-32">
           <Dropzone
             onDrop={(acceptedFiles) => handleDrop(acceptedFiles)}
             // acceptedFiles={[
             //   '.csv, text/csv, application/csv, text/x-csv, application/x-csv',
             // ]}
             accept=".csv"
             maxFiles={1}
             multiple={false}
             canCancel={false}
             inputContent="Drop A File"
             styles={{
                dropzone: { width: 400, height: 200 },
                dropzoneActive: { borderColor: "green" },
             }}
            >
             {({ getRootProps, getInputProps }) => (
               <div
                {...getRootProps({
                 className: clsx(classes.dropzone, "cursor-pointer"),
                })}
               >
                 <input {...getInputProps()} />
                 {loadingInv === false ? (
                   <CloudUploadIcon fontSize="large" />
                 ) : (
                   <CircularProgress color="secondary" />
                 )}
               <>
               <Typography variant="subtitle1">
                Import Excel (.csv) for Inventory Transaction
               </Typography>
               <Typography variant="subtitle1">
                (File Items will append on exisiting Inventory Transaction)
               </Typography>
              </>
            </div>
          )}
        </Dropzone>
      </div>
    </FuseAnimate>
   </Dialog> */}
  </>
  );
}

export default InventoryDialog;
