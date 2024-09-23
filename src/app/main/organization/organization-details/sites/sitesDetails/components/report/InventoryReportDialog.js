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
import { downloadConsumptionExcelReport } from "app/main/organization/organization-details/sites/store/sitesSlice";

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

const InventoryReportDialog = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const details = useSelector(({ sites }) => sites.details);
  const inventoryList = useSelector(({ projects }) => projects.inventories);
  const loading = useSelector(({ projects }) => projects.loading);
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("detail");
  const [inventory, setInventory] = useState([]);
  const [selected, setSelected] = useState([]);
  const [selectedDate, setSelectedDate] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });
  const [selectedIds, setSelectedIds] = useState([]);
  const userId = useSelector(({ auth }) => auth.user.data.id)
  const [format, setFormat] = useState("");

  useEffect(() => {
    if (props.open) {
      setOpen(true);
    }

    if(inventoryList.length > 0){
      let tempInv = [{  _id: "all",  type: "All"}];
      inventoryList.forEach((inv)=>{
        tempInv.push(inv)
      })
      setInventory(tempInv);
    }else{
      setInventory([]);
    }

  }, [props.open]);

  const handleDateChange = (prop) => (date) => {
    setSelectedDate({ ...selectedDate, [prop]: date });
  };

  const formatting = (value) => {
    setFormat(value)
  }

  const handleClose = () => {
    setOpen(false);
    props.close();
  };

  const handleSubmit = () => {
    let filters;
    if (format === "") {
      dispatchWarningMessage(dispatch, "Please Select Period.");
    } else {
      if (format === "Custom") {
        filters = {
          startDate: moment(selectedDate.startDate).format("YYYY-MM-DD"),
          endDate: moment(selectedDate.endDate).format("YYYY-MM-DD"),
          type,
        };
      }
      if (format === "Since Inception") {
        var today = new Date();
        filters = {
          startDate: "Since Inception",
          endDate: moment(today).format("YYYY-MM-DD"),
          type,
        };
      }
      if (format === "Last Month") {
        var date = new Date();
        var firstDay = new Date(date.getFullYear(), date.getMonth() - 1, 1);
        var lastDay = new Date(date.getFullYear(), date.getMonth(), 0);

        filters = {
          startDate: moment(firstDay).format("YYYY-MM-DD"),
          endDate: moment(lastDay).format("YYYY-MM-DD"),
          type,
        };
      }

      if (inventory.type !== "All") {
        if(selectedIds.length > 1)
        {
          filters.inventoryId = "Multiple";
          filters.inventoryIds = selectedIds;
        }else{
          filters.inventoryId = selectedIds[0];
        }
      }

      if (inventory.type === "All") {
        filters.inventoryId = "all";
      }

      filters.userId = userId;
      if(props.type === 'inventory'){
        // dispatch(
        //   downloadInventoryExcelReport({
        //     projectId: projectDetails._id,
        //     projectName: projectDetails.title,
        //     filters,
        //   })
        // );
      }else if(props.type === 'consumption'){
        console.log(props.organizationId, details, userId,filters)
        dispatch(
          downloadConsumptionExcelReport({
            organizationId: props.organizationId,
            siteId: details._id,
            userId : userId,
            siteName: details.name,
            filters,
          })
        );
      }

      setSelectedDate({ ...selectedDate, startDate: new Date(), endDate:new Date() });
      setSelected([]);
      setSelectedIds([]);
      props.close();
    }
  };

  const callInv = (newInv) =>{
    let filterInv = newInv.filter((invent)=> invent.type === "All");
    let tempInvId = [];

    if(filterInv.length > 0){
      setSelected([{ _id: "all", type: "All"}]);
      setSelectedIds(['all']);
    }else{
      newInv.forEach((inv)=>{
        tempInvId.push(inv._id);
      })
      setSelected(newInv);
      setSelectedIds(tempInvId);
    }
  }

  return (
    <div>
      <Dialog open={open} maxWidth="md">
        <Backdrop className={classes.backdrop} open={loading}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <div className="flex flex-1 items-center justify-between">
              <Typography>{props.type ==='consumption' ? 'Download Consumption Report': 'Download Inventory Report'}</Typography>
              <IconButton onClick={handleClose}>
                <CancelIcon style={{ color: "red" }} />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        <DialogContent>
          <div className="flex flex-1 flex-col mt-10 w-full">
            {/* <div className="mt-10 mb-16 w-full">
              {inventory.length ? (
                props.type === 'inventory' ?
                  <Autocomplete
                    value = {selected}
                    multiple
                    id="tags-outlined"
                    options={inventory}
                    fullWidth
                    getOptionLabel={(option) => option.type}
                    onChange={(event, newValue) => { 
                      callInv(newValue);
                    }}
                    renderOption={(option) =>{
                      if(option.supplier === undefined){
                        return option.type;
                      }else{
                        return option.type + " by " + option.supplier;
                      }
                    }}
                    filterSelectedOptions
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Inventory"
                        variant="outlined"
                      />
                    )}
                  />
                  :
                  <Autocomplete
                    value = {selected}
                    multiple
                    id="tags-outlined"
                    options={inventory}
                    fullWidth
                    getOptionLabel={(option) => option.type}
                    onChange={(event, newValue) => { 
                      callInv(newValue);
                    }}
                    renderOption={(option) =>{
                      return option.type;  
                    }}
                    filterSelectedOptions
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Inventory"
                        variant="outlined"
                      />
                    )}
                  />  
              ) : (
                <Typography>No Inventory Found</Typography>
              )}
            </div> */}
            <div className="mt-10 mb-16 w-full">
              <FormControl fullWidth variant="outlined">
                <InputLabel id="demo-simple-select-outlined-label">
                  Select Period
                </InputLabel>
                <Select
                  id="date format"
                  value={format}
                  label="Select Period"
                >
                  <MenuItem value="Since Inception" onClick={() => formatting("Since Inception")}>Since Inception</MenuItem>
                  <MenuItem value="Last Month" onClick={() => formatting("Last Month")}>Last Month</MenuItem>
                  <MenuItem value="Custom" onClick={() => formatting("Custom")}>Custom</MenuItem>
                </Select>
              </FormControl>
            </div>

            {format === "Custom" ? (
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
            ) :
              null
            }
          </div>

        </DialogContent>
        <DialogActions>
          <div className="flex flex-1 items-center justify-start gap-12">
            <Button
              color="primary"
              variant="contained"
              size="small"
              onClick={handleSubmit}
            >
              Download Excel Report
            </Button>
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default React.memo(InventoryReportDialog);
