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
import { downloadRfiExcelReport } from "app/main/projects/store/projectsSlice";

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

const RfiReportDilaog = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const userId = useSelector(({ auth }) => auth.user.data.id)
  const projectId = useSelector(({ projects }) => projects.details._id);
  const projectName = useSelector(({ projects }) => projects.details.title);
  const loading = useSelector(({ projects }) => projects.loading);
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState({ startDate: new Date(), endDate: new Date() });
  const [rfidateformat, setRfiDateFormat] = useState("");
  const [reportType, setReportType] = useState("");

  useEffect(() => {
    if (props.open) {
      setOpen(true);
    }
  }, [props.open]);

  const handleDateChange = (prop) => (date) => {
    setSelectedDate({ ...selectedDate, [prop]: date });
  };

  const rfiformatting = (value) => {
    setRfiDateFormat(value)
  }

  const handleClose = () => {
    setOpen(false);
    props.close();
  };

  const disableButton = () => {
    return (
      rfidateformat.length > 0 
    );
  };

  const handleSubmit = () => {
    let filters;
    if (rfidateformat === "") {
      dispatchWarningMessage(dispatch, "Please Select Period.");
    } else {
      if (rfidateformat === "Custom") {
        filters = {
          startDate: moment(selectedDate.startDate).format("YYYY-MM-DD"),
          endDate: moment(selectedDate.endDate).format("YYYY-MM-DD"),
        };
      }
      if (rfidateformat === "Since Inception") {
        var today = new Date();
        filters = {
          startDate: "Since Inception",
          endDate: moment(today).format("YYYY-MM-DD"),
        };
      }
      if (rfidateformat === "Last Month") {
        var date = new Date();
        var firstDay = new Date(date.getFullYear(), date.getMonth() - 1, 1);
        var lastDay = new Date(date.getFullYear(), date.getMonth(), 0);

        filters = {
          startDate: moment(firstDay).format("YYYY-MM-DD"),
          endDate: moment(lastDay).format("YYYY-MM-DD"),
        };
      }

      filters.userId = userId;
      filters.rfiType = reportType;
  
      dispatch(
        downloadRfiExcelReport({
          projectId,
          projectName,
          filters,
        })
      );
      setOpen({ ...open, rfi: false });
      setRfiDateFormat("");
      setSelectedDate({ ...selectedDate, startDate: new Date(), endDate:new Date() });
    }
  }

  return (
    <div>
      <Dialog open={open} maxWidth="sm">
        <Backdrop className={classes.backdrop} open={loading}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <div className="flex flex-1 items-center justify-between">
              <Typography>Download RFI Report</Typography>
              <IconButton onClick={handleClose}>
                <CancelIcon style={{ color: "red" }} />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        <DialogContent>
          <div className="mt-10 mb-16 w-full">
              <FormControl fullWidth variant="outlined">
                <InputLabel id="demo-simple-select-outlined-label">
                  Select Type
                </InputLabel>
                <Select
                  fullWidth
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  value={reportType}
                  label="Select Sub-Contractor"
                >
                  <MenuItem value="All" onClick={() => setReportType("All")}> All </MenuItem>
                  <MenuItem value="Summary" onClick={() => setReportType("Summary")}> Summary </MenuItem>
                </Select>
              </FormControl>
          </div>
          <div className="mt-10 mb-16 w-full">
          <FormControl fullWidth variant="outlined">
            <InputLabel id="demo-simple-select-outlined-label">
              Select Period
            </InputLabel>
            <Select
              id="date format"
              value={rfidateformat}
              label="Select Period"
            >
              <MenuItem value="Since Inception" onClick={() => rfiformatting("Since Inception")}>Since Inception</MenuItem>
              <MenuItem value="Last Month" onClick={() => rfiformatting("Last Month")}>Last Month</MenuItem>
              <MenuItem value="Custom" onClick={() => rfiformatting("Custom")}>Custom</MenuItem>
            </Select>
          </FormControl>
          </div>
         {rfidateformat === "Custom" ? (
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

export default React.memo(RfiReportDilaog);
