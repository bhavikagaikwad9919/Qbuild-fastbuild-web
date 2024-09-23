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
import { downloadIrExcelReport } from "app/main/projects/store/projectsSlice";

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

const IrReportDilaog = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const irFolders = useSelector(({ projects }) => projects.irFolders);
  const userId = useSelector(({ auth }) => auth.user.data.id)
  const projectId = useSelector(({ projects }) => projects.details._id);
  const projectName = useSelector(({ projects }) => projects.details.title);
  const loading = useSelector(({ projects }) => projects.loading);
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState({ startDate: new Date(), endDate: new Date() });
  const [irdateformat, setIrDateFormat] = useState("");
  const [ir, setIr] = useState({
    _id: "",
    name: "",
  });

  useEffect(() => {
    if (props.open) {
      setOpen(true);
    }
  }, [props.open]);

  const handleDateChange = (prop) => (date) => {
    setSelectedDate({ ...selectedDate, [prop]: date });
  };

  const irformatting = (value) => {
    setIrDateFormat(value)
  }

  const handleClose = () => {
    setOpen(false);
    props.close();
  };

  const handleChangeIr= (id) => {
    let selectedIr= irFolders.find((vname) => vname._id === id);
    setIr({ _id: selectedIr._id, name: selectedIr.folderName });
  };

  const disableButton = () => {
    return (
      irdateformat.length > 0 
    );
  };

  const handleSubmit = () => {
    let filters;
    if (irdateformat === "") {
      dispatchWarningMessage(dispatch, "Please Select Period.");
    } else {
      if (irdateformat === "Custom") {
        filters = {
          startDate: moment(selectedDate.startDate).format("YYYY-MM-DD"),
          endDate: moment(selectedDate.endDate).format("YYYY-MM-DD"),
        };
      }
      if (irdateformat === "Since Inception") {
        var today = new Date();
        filters = {
          startDate: "Since Inception",
          endDate: moment(today).format("YYYY-MM-DD"),
        };
      }
      if (irdateformat === "Last Month") {
        var date = new Date();
        var firstDay = new Date(date.getFullYear(), date.getMonth() - 1, 1);
        var lastDay = new Date(date.getFullYear(), date.getMonth(), 0);

        filters = {
          startDate: moment(firstDay).format("YYYY-MM-DD"),
          endDate: moment(lastDay).format("YYYY-MM-DD"),
        };
      }

      if (ir.name === "summary") {
        filters.irName = "Summary";
        filters.irType = 'summary';
      }else{
        filters.irType = ir.type;
        filters.irId = ir._id;
        filters.irName = ir.name;
      }

      filters.userId = userId;
  
      dispatch(
        downloadIrExcelReport({
          projectId,
          projectName,
          filters,
        })
      );
      setOpen({ ...open, ir: false });
      setIrDateFormat("");
      setIr({ _id: "", name: "all"});
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
              <Typography>Download IR Report</Typography>
              <IconButton onClick={handleClose}>
                <CancelIcon style={{ color: "red" }} />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        <DialogContent>
          <div className="mt-10 mb-16 w-full">
            {irFolders.length ? (
              <FormControl fullWidth variant="outlined">
                <InputLabel id="demo-simple-select-outlined-label">
                  Select IR Folder
                </InputLabel>
                <Select
                  fullWidth
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  value={ir.name}
                  label="Select Sub-Contractor"
                >
                  <MenuItem
                    value="summary"
                    onClick={() => setIr({ _id: "", name: "summary" })}
                  >
                    Summary
                  </MenuItem>
                  {irFolders.map((vname) => (
                    <MenuItem
                      key={vname.id}
                      value={vname.folderName}
                      onClick={() => handleChangeIr(vname._id)}
                    >
                      <Typography>{vname.folderName}</Typography>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
               <Typography>No IR Folders Found.</Typography>
            )}
          </div>
          <div className="mt-10 mb-16 w-full">
          <FormControl fullWidth variant="outlined">
            <InputLabel id="demo-simple-select-outlined-label">
              Select Period
            </InputLabel>
            <Select
              id="date format"
              value={irdateformat}
              label="Select Period"
            >
              <MenuItem value="Since Inception" onClick={() => irformatting("Since Inception")}>Since Inception</MenuItem>
              <MenuItem value="Last Month" onClick={() => irformatting("Last Month")}>Last Month</MenuItem>
              <MenuItem value="Custom" onClick={() => irformatting("Custom")}>Custom</MenuItem>
            </Select>
          </FormControl>
          </div>
         {irdateformat === "Custom" ? (
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

export default React.memo(IrReportDilaog);
