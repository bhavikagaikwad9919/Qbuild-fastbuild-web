import FuseAnimateGroup from "@fuse/core/FuseAnimateGroup";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { downloadEquipmentExcelReport } from "app/main/organization/organization-details/sites/store/sitesSlice";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import clsx from "clsx";
import Button from "@material-ui/core/Button";
import {
  Dialog, ListItemText, FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@material-ui/core";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import InventoryDialogReport from "./InventoryReportDialog";
import { DatePicker } from "@material-ui/pickers";
import moment from "moment";
import { dispatchWarningMessage } from "app/utils/MessageDispatcher";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxHeight: "60vh",
    position: "relative",
    backgroundColor: theme.palette.background.paper,
  },
  listItemText: {
    marginLeft: "20px",
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

function SiteReport(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const loading = useSelector(({ projects }) => projects.loading);
  const [open, setOpen] = useState({
    inventory: false,
    labour: false,
    equipment: false,
    hindrance:false,
    sitevisitor:false,
    attachment:false,
    notes:false,
    workProgress: false,
    daily_data:false,
    cube_register:false,
    consumption: false
  });
  const [selectedDate, setSelectedDate] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });
  const details = useSelector(({ sites }) => sites.details);
  const userId = useSelector(({ auth }) => auth.user.data.id);
  const [equipmentdateformat, setEquipmentDateFormat] = useState("");
  const [workProgressdateformat, setWorkProgressDateFormat] = useState("");
  const [format, setFormat] = useState("");

  const handleClose = () => {
    setOpen({ ...open, inventory: false });
  };

  const handleDateChange = (prop) => (date) => {
    setSelectedDate({ ...selectedDate, [prop]: date });
  };

  const equipmentSubmit = () => {
    let filters;
    if (equipmentdateformat === "") {
      dispatchWarningMessage(dispatch, "Please Select Period.");
    } else {
      if (equipmentdateformat === "Custom") {
        filters = {
          startDate: moment(selectedDate.startDate).format("YYYY-MM-DD"),
          endDate: moment(selectedDate.endDate).format("YYYY-MM-DD"),
        };
      }
      if (equipmentdateformat === "Since Inception") {
        var today = new Date();
        filters = {
          startDate: "Since Inception",
          endDate: moment(today).format("YYYY-MM-DD"),
        };
      }
      if (equipmentdateformat === "Last Month") {
        var date = new Date();
        var firstDay = new Date(date.getFullYear(), date.getMonth() - 1, 1);
        var lastDay = new Date(date.getFullYear(), date.getMonth(), 0);

        filters = {
          startDate: moment(firstDay).format("YYYY-MM-DD"),
          endDate: moment(lastDay).format("YYYY-MM-DD"),
        };
      }

      dispatch(
        downloadEquipmentExcelReport({
         organizationId: props.organizationId,
         siteId: details._id,
         userId : userId,
         siteName: details.name,
         filters,
        })
      );
      setOpen({ ...open, equipment: false });
      setEquipmentDateFormat("");
      setSelectedDate({ ...selectedDate, startDate: new Date(), endDate:new Date() });
    }
  }

  const workProgressSubmit = () => {
    let filters;
    if (workProgressdateformat === "" && format === 'Format1') {
      dispatchWarningMessage(dispatch, "Please Select Period.");
    }else if(format === '')
    {
      dispatchWarningMessage(dispatch, "Please Select Format.");
    } else {
      if (workProgressdateformat === "Custom") {
        filters = {
          startDate: moment(selectedDate.startDate).format("YYYY-MM-DD"),
          endDate: moment(selectedDate.endDate).format("YYYY-MM-DD"),
        };
      }
      if (workProgressdateformat === "Since Inception") {
        var today = new Date();
        filters = {
          startDate: "Since Inception",
          endDate: moment(today).format("YYYY-MM-DD"),
        };
      }
      if (workProgressdateformat === "Last Month") {
        var date = new Date();
        var firstDay = new Date(date.getFullYear(), date.getMonth() - 1, 1);
        var lastDay = new Date(date.getFullYear(), date.getMonth(), 0);

        filters = {
          startDate: moment(firstDay).format("YYYY-MM-DD"),
          endDate: moment(lastDay).format("YYYY-MM-DD"),
        };
      }

      if(format === 'Format2')
      {
        filters = {
          startDate: moment(selectedDate.startDate).format("YYYY-MM-DD"),
          endDate: moment(selectedDate.startDate).format("YYYY-MM-DD"),
        };
      }

      filters.format = format;

    //   dispatch(
    //     downloadWorkProgressExcelReport({
    //       projectId,
    //       projectName,
    //       filters,
    //     })
    //   );
      setOpen({ ...open, workProgress: false });
      setWorkProgressDateFormat("");
      setFormat('');
      setSelectedDate({ ...selectedDate, startDate: new Date(), endDate:new Date() });
    }
  }

  const equipmentformatting = (value) => {
    setEquipmentDateFormat(value)
  }

  const workProgressformatting = (value) => {
    setWorkProgressDateFormat(value)
  }

  return (
    <>
      <div>
        <List className={clsx(classes.root)}>
          <FuseAnimateGroup
            enter={{
              animation: "transition.slideUpBigIn",
            }}
          >
             <ListItem
              className="border-solid border-b-1 py-16 px-0 sm:px-8"
              onClick={() => {
                setOpen({ ...open, consumption: true });
              }}
              button
            >
              <ListItemIcon>
                <img src="assets/icons/xls.svg" alt="logo" />
              </ListItemIcon>
              <ListItemText
                className={classes.listItemText}
                primary="Consumptiom Report"
                secondary={"Click to download Consumption Report"}
              />
            </ListItem>
       
            {/* <ListItem
              className="border-solid border-b-1 py-16 px-0 sm:px-8"
              onClick={() => {
                setOpen({ ...open, equipment: true });
              }}
              button
            >
              <ListItemIcon>
                <img src="assets/icons/xls.svg" alt="logo" />
              </ListItemIcon>
              <ListItemText
                className={classes.listItemText}
                primary="Equipment Report"
                secondary={"Click to download Equipment Report"}
              />
            </ListItem> */}

          </FuseAnimateGroup>
        </List>
        <Backdrop className={classes.backdrop} open={loading}>
          <CircularProgress color="inherit" />
        </Backdrop>

        {open.inventory ? (
          <>
            <InventoryDialogReport open={true} type="inventory" close={handleClose} />
          </>
        ) : null}

        {open.consumption ? (
          <>
            <InventoryDialogReport open={true} type="consumption" organizationId = {props.organizationId} close={handleClose} />
          </>
        ) : null}
      </div>

      {open.equipment ? (
        <Dialog
          open={open.equipment}
          onClose={() => setOpen({ ...open, equipment: false })}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Download Equipment Report</DialogTitle>
          <DialogContent>
            <div className="mt-10 mb-16 w-full">
              <FormControl fullWidth variant="outlined">
                <InputLabel id="demo-simple-select-outlined-label">
                  Select Period
                </InputLabel>
                <Select
                  id="date format"
                  value={equipmentdateformat}
                  label="Select Period"
                >
                  <MenuItem value="Since Inception" onClick={() => equipmentformatting("Since Inception")}>Since Inception</MenuItem>
                  <MenuItem value="Last Month" onClick={() => equipmentformatting("Last Month")}>Last Month</MenuItem>
                  <MenuItem value="Custom" onClick={() => equipmentformatting("Custom")}>Custom</MenuItem>
                </Select>
              </FormControl>
            </div>
            {equipmentdateformat === "Custom" ? (
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
            <Button
              onClick={() => setOpen({ ...open, equipment: false })}
              color="primary"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                equipmentSubmit();
              }}
              color="primary"
            >
              Download
            </Button>
          </DialogActions>
        </Dialog>
      ) : null}


    </>
  );
}

export default React.memo(SiteReport);
