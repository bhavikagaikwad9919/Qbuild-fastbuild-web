import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import { dispatchWarningMessage } from "app/utils/MessageDispatcher";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import {
  Button,
  DialogActions,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  TextField,
} from "@material-ui/core";
import CancelIcon from "@material-ui/icons/Cancel";
import { DatePicker } from "@material-ui/pickers";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import Autocomplete from '@material-ui/lab/Autocomplete';
import { downloadPOReport } from "app/main/projects/store/projectsSlice";

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
  indeterminateColor: {
    color: "#f50057"
  },
  selectAllText: {
    fontWeight: 500
  },
  selectedAll: {
    backgroundColor: "rgba(0, 0, 0, 0.08)",
    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.08)"
    }
  }
}));

const PurchaseOrderReportDialog = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const cubeRegister = useSelector(({ projects }) => projects.cubeRegister.sampleList);
  const details = useSelector(({ organizations }) => organizations.organization);
  const userId = useSelector(({ auth }) => auth.user.data.id)
  const projectId = useSelector(({ projects }) => projects.details._id);
  const projectName = useSelector(({ projects }) => projects.details.title);
  const loading = useSelector(({ projects }) => projects.loading);
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState({ startDate: new Date(), endDate: new Date() });
  const [supplier, setSupplier] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [supplierList, setSupplierList] = useState([]);
  const [po_registerdateformat, setPORegisterDateFormat] = useState("");
  const projectDetails = useSelector(({ projects }) => projects.details);
  const purchaseOrders = useSelector(({ projects }) => projects.purchaseOrders.purchaseOrderList);
  const vendors = useSelector(({ projects }) => projects.vendors.vendorsList);


   useEffect(() => {
     
    console.log("supplier",supplier)

  }, [supplier]);

    useEffect(() => {

      if (props.open) {
            setOpen(true);
          }
      let suppliers = ['All'];
      console.log("purchaseOrders", purchaseOrders);
    
      purchaseOrders.forEach((po) => {
        suppliers.push({
          name: po.supplier,
          id: po.supplierId,
        });
      });
  
      let uniqueSuppliers =suppliers.filter(
        (s, idx) => suppliers.findIndex((ss) => ss.name === s.name) === idx
      );
      setSupplierList(uniqueSuppliers);
      console.log("uniqueSuppliers12345",uniqueSuppliers)

      let filteredSupplier = [];
      vendors.forEach((ven) => {
        uniqueSuppliers.forEach((us) => {
          if (us.name === ven.name && ven.agencyType === "Supplier") {
            filteredSupplier.push({
              name: ven.name,
              _id: ven._id,
            });
          }
        });
      });
      
      // setSupplier(filteredSupplier);
      // console.log(filteredSupplier, "filteredSupplier");
      
    
     
    }, [props.open]);

  const handleDateChange = (prop) => (date) => {
    setSelectedDate({ ...selectedDate, [prop]: date });
  };

  const po_registerformatting = (value) => {
    setPORegisterDateFormat(value)

  }

  const handleClose = () => {
    setOpen(false);
    props.close();
  };

  const callSupplier = (newSupplier) => {

    const selectedSupplierIds = newSupplier.map((selected) => selected.value);

    console.log('Sending to backend:', selectedSupplierIds);
  

    let filterSuppliers = newSupplier.filter((supp) => supp.label === 'All');
    console.log(filterSuppliers, "filterSuppliers");
  
    if (filterSuppliers.length > 0) {
      let finalSl = supplierList.filter((sl) => sl.name !== 'All');
      console.log(finalSl, "finalSl");
  
      setSupplier([{ label: 'All', value: 'All' }]);
      setSuppliers(finalSl);
    } else {
      setSupplier(newSupplier);
      setSuppliers(newSupplier);
    }
  };
  
  const disableButton = () => {
    return (
        po_registerdateformat.length > 0 &&
        suppliers.length > 0 
    );
  };

  const handleSubmit = () => {
    let filters;
    if (po_registerdateformat === "") {
      dispatchWarningMessage(dispatch, "Please Select Period.");
    } else {
      if (po_registerdateformat === "Custom") {
        filters = {
          startDate: moment(selectedDate.startDate).format("YYYY-MM-DD"),
          endDate: moment(selectedDate.endDate).format("YYYY-MM-DD"),
        };
      }
      if (po_registerdateformat === "Since Inception") {
        var today = new Date();
        filters = {
          startDate: "Since Inception",
          endDate: moment(today).format("YYYY-MM-DD"),
        };
      }
      if (po_registerdateformat === "Last Month") {
        var date = new Date();
        var firstDay = new Date(date.getFullYear(), date.getMonth() - 1, 1);
        var lastDay = new Date(date.getFullYear(), date.getMonth(), 0);

        filters = {
          startDate: moment(firstDay).format("YYYY-MM-DD"),
          endDate: moment(lastDay).format("YYYY-MM-DD"),
        };
      }

      // filters.userId = userId;
      const selectedSupplierIds = supplier.map((selected) => selected.value);

      console.log('Sending to backend:', selectedSupplierIds);
      console.log("filter",filters)
      dispatch(
        downloadPOReport({
          projectId: projectDetails._id,
          projectName: projectDetails.title,
          supplier:selectedSupplierIds,
          ...filters,
        }),
      );
     
      setOpen({ ...open, purchase_register: false });
      setPORegisterDateFormat("");
      setSelectedDate({ ...selectedDate, startDate: new Date(), endDate:new Date() });
      setSuppliers([]);
      setSupplier([]);

    }
  };

  return (
    <div>
      <Dialog open={open} maxWidth="sm">
        <Backdrop className={classes.backdrop} open={loading}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <div className="flex flex-1 items-center justify-between">
              <Typography>Download Purchase Order Report</Typography>
              <IconButton onClick={handleClose}>
                <CancelIcon style={{ color: "red" }} />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        <DialogContent>
            <div className="mt-10 mb-16 w-full">       
            <Autocomplete
  value={supplier}
  multiple
  id="tags-outlined"
  options={supplierList.slice(1).map((supplier) => ({
    label: supplier.name,
    value: supplier.id,
  }))}
  fullWidth
  getOptionLabel={(option) => option.label}
  onChange={(event, newValue) => {
    // setSupplier(newValue);
    callSupplier(newValue);
  }}
  filterSelectedOptions
  renderInput={(params) => (
    <TextField {...params} label="Select Supplier" variant="outlined" />
  )}
/>
            </div>
            <div className="mt-10 mb-16 w-full">
               <FormControl fullWidth variant="outlined">
                 <InputLabel id="demo-simple-select-outlined-label">
                     Select Period
                  </InputLabel>
                  <Select
                     id="date format"
                     value={po_registerdateformat}
                     label="Select Period"
                  >
                     <MenuItem value="Since Inception" onClick={() => po_registerformatting("Since Inception")}>Since Inception</MenuItem>
                     <MenuItem value="Last Month" onClick={() => po_registerformatting("Last Month")}>Last Month</MenuItem>
                     <MenuItem value="Custom" onClick={() => po_registerformatting("Custom")}>Custom</MenuItem>
                  </Select>
                </FormControl>
            </div>
            {po_registerdateformat === "Custom" ? (
              <>
                 <InputLabel>Select Date</InputLabel>
                 <div className="flex flex-row mt-24 mb-10 gap-10">
                         <DatePicker
                             inputVariant="outlined"
                             label="Start Date"
                             format="DD MMM yyyy"
                             maxDate={selectedDate.endDate}
                             value={selectedDate.startDate}
                             onChange={handleDateChange("startDate")}
                             KeyboardButtonProps={{
                                 "aria-label": "change date",
                             }}
                          />
                          <DatePicker
                             inputVariant="outlined"
                             label="End Date"
                             format="DD MMM yyyy"
                             minDate={selectedDate.startDate}
                             value={selectedDate.endDate}
                             onChange={handleDateChange("endDate")}
                             KeyboardButtonProps={{
                                "aria-label": "change date",
                             }}
                          />
                 </div>
              </>
            ) : null}
        </DialogContent>
        <DialogActions>
          <div className="flex flex-1 items-center justify-start gap-12">
            <Button
              color="primary"
              variant="contained"
              size="small"
              disabled={!disableButton()}
              onClick={handleSubmit}
            >
              Download
            </Button>
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default React.memo(PurchaseOrderReportDialog);
