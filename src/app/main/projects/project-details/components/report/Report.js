import FuseAnimateGroup from "@fuse/core/FuseAnimateGroup";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  downloadTaskExcelReport,
  downloadPOReport,
  downloadTaskPdfReport,
  downloadLabourExcelReport,
  downloadDrawingExcelReport,
  downloadSafetyNcrExcelReport,
  downloadQualityNcrExcelReport,
  downloadEquipmentExcelReport,
  downloadHindranceExcelReport,
  downloadSitevisitorExcelReport,
  downloadStaffExcelReport,
  downloadAttachmentExcelReport,
  downloadNotesExcelReport,
  downloadWorkProgressExcelReport,
  addEntryToSummary,
} from "app/main/projects/store/projectsSlice";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import clsx from "clsx";
import Button from "@material-ui/core/Button";
import {
  Dialog,
  ListItemText,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@material-ui/core";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import InventoryDialogReport from "./InventoryReportDilaog";
import CubeReportDialog from "./CubeReportDialog";
import BillRegsiterDialog from "./BillRegsiterDialog";
import PurchaseOrderReportDialog from "./PurchaseOrderReportDialog";
import IrReportDialog from "./IrReportDialog";
import RfiReportDialog from "./RfiReportDialog";
import GfcReportDialog from "./GfcReportDialog";
import { navigateTo } from "app/utils/Navigator";
import { DatePicker } from "@material-ui/pickers";
import moment from "moment";
import { dispatchWarningMessage } from "app/utils/MessageDispatcher";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%", //maxWidth: 360,
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

function Report(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const projectId = useSelector(({ projects }) => projects.details._id);
  const projectName = useSelector(({ projects }) => projects.details.title);
  const drawingFolders = useSelector(({ projects }) => projects.drawingFolders);
  const modulesPr = useSelector(({ projects }) => projects.details.module);
  const plans = useSelector(({ projects }) => projects.details.plans);
  const projectType = useSelector(
    ({ projects }) => projects.details.projectType
  );
  const loading = useSelector(({ projects }) => projects.loading);
  const [open, setOpen] = useState({
    inventory: false,
    labour: false,
    equipment: false,
    hindrance: false,
    sitevisitor: false,
    staff: false,
    attachment: false,
    notes: false,
    consumption: false,
    workProgress: false,
    daily_data: false,
    cube_register: false,
    bill_register: false,
    purchase_register: false,
    drawing: false,
    ncr: false,
    qncr: false,
    ir: false,
    rfi: false,
    gfc: false,
  });
  const [selectedDate, setSelectedDate] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });
  const projectDetails = useSelector(({ projects }) => projects.details);
  const [labourdateformat, setLabourDateFormat] = useState("");
  const [equipmentdateformat, setEquipmentDateFormat] = useState("");
  const [hindrancedateformat, setHindranceDateFormat] = useState("");
  const [sitevisitordateformat, setSitevisitorDateFormat] = useState("");
  const [staffdateformat, setStaffDateFormat] = useState("");
  const [attachmentdateformat, setAttachmentDateFormat] = useState("");
  const [notesdateformat, setNotesDateFormat] = useState("");
  const [workProgressdateformat, setWorkProgressDateFormat] = useState("");
  const [drawingdateformat, setDrawingDateFormat] = useState("");
  const [ncrdateformat, setNcrDateFormat] = useState("");
  const [qncrdateformat, setQNcrDateFormat] = useState("");
  const [type, setType] = useState("");
  const userId = useSelector(({ auth }) => auth.user.data.id);
  const team = useSelector(({ projects }) => projects.details.team);
  const user = useSelector(({ auth }) => auth.user);
  const [modules, setModules] = useState([]);
  const [prOwner, setPrOwner] = useState(false);
  const vendors = useSelector(({ projects }) => projects.vendors.vendorsList);
  const details = useSelector(
    ({ organizations }) => organizations.organization
  );
  const [vendor, setVendor] = useState({
    _id: "",
    name: "all",
  });
  const [drawing, setDrawing] = useState({
    _id: "",
    name: "all",
  });
  //const [format, setFormat] = useState("");
  const [access, setAccess] = useState(false);
  const [saccess, setSAccess] = useState(false);
  const [qaccess, setQAccess] = useState(false);
  const [iaccess, setIAccess] = useState(false);
  const [raccess, setRAccess] = useState(false);

  useEffect(() => {
    team.forEach((t) => {
      if (
        (t._id === user.data.id && t.role === "owner") ||
        user.role === "admin"
      ) {
        setAccess(true);
        setSAccess(true);
        setQAccess(true);
        setIAccess(true);
        setRAccess(true);
        setModules(modulesPr);
      } else if (t._id === user.data.id && t.role !== "owner") {
        console.log("t", t.tab_access);
        const member = t.tab_access.filter((i) => i === "Drawing Register");
        const member1 = t.tab_access.filter((i) => i === "Safety NCR");
        const member2 = t.tab_access.filter((i) => i === "Quality NCR");
        const member3 = t.tab_access.filter((i) => i === "Inspection Request");
        const member4 = t.tab_access.filter((i) => i === "RFI Register");

        setModules(t.tab_access);

        if (member[0] === "Drawing Register") {
          setAccess(true);
        }
        if (member1[0] === "Safety NCR") {
          setSAccess(true);
        }
        if (member2[0] === "Quality NCR") {
          setQAccess(true);
        }
        if (member3[0] === "Inspection Request") {
          setIAccess(true);
        }
        if (member4[0] === "RFI Register") {
          setRAccess(true);
        }
      }
    });
  }, [
    access,
    saccess,
    qaccess,
    iaccess,
    raccess,
    user.data.id,
    user.role,
    team,
  ]);

  let vendorsName = [];
  let orgType = "";
  if (details === undefined || details === null) {
    orgType = "";
  } else {
    orgType =
      details.orgType === undefined || details.orgType === null
        ? ""
        : details.orgType;
  }

  vendors.forEach((item) => {
    if (
      item.agencyType === "Sub-Contractor" ||
      item.agencyType === "Hirer" ||
      item.agencyType === "Contractor"
    ) {
      vendorsName.push(item);
    }
  });



  const handleChangeVendor = (id) => {
    let selectedVendor = vendorsName.find((vname) => vname._id === id);
    if (selectedVendor) {
        setVendor({ ...vendor, _id: selectedVendor._id, name: selectedVendor.name });
    }
  };

  const handleChangeDrawing = (id) => {
    let selectedDrawing = drawingFolders.find((vname) => vname._id === id);
    setDrawing({
      _id: selectedDrawing._id,
      name: selectedDrawing.folderName,
      type: selectedDrawing.folderType,
    });
  };

  const handleClose = () => {
    setOpen({ ...open, inventory: false, consumption: false });
  };

  const handleCloseCube = () => {
    setOpen({ ...open, cube_register: false });
  };

  const handleCloseBill = () => {
    setOpen({ ...open, bill_register: false });
  };

  const handleClosePO = () => {
    setOpen({ ...open, purchase_register: false });
  };

  const handleCloseIr = () => {
    setOpen({ ...open, ir: false });
  };

  const handleCloseRfi = () => {
    setOpen({ ...open, rfi: false });
  };

  const handleCloseGfc = () => {
    setOpen({ ...open, gfc: false });
  };

  const handleDateChange = (prop) => (date) => {
    setSelectedDate({ ...selectedDate, [prop]: date });
  };

  const labourSubmit = () => {
    let filters;
    if (labourdateformat === "") {
      dispatchWarningMessage(dispatch, "Please Select Period.");
    } else {
      if (labourdateformat === "Custom") {
        filters = {
          startDate: moment(selectedDate.startDate).format("YYYY-MM-DD"),
          endDate: moment(selectedDate.endDate).format("YYYY-MM-DD"),
        };
      }
      if (labourdateformat === "Since Inception") {
        var today = new Date();
        filters = {
          startDate: "Since Inception",
          endDate: moment(today).format("YYYY-MM-DD"),
        };
      }
      if (labourdateformat === "Last Month") {
        var date = new Date();
        var firstDay = new Date(date.getFullYear(), date.getMonth() - 1, 1);
        var lastDay = new Date(date.getFullYear(), date.getMonth(), 0);

        filters = {
          startDate: moment(firstDay).format("YYYY-MM-DD"),
          endDate: moment(lastDay).format("YYYY-MM-DD"),
        };
      }

      if (vendor.name !== "all") {
        filters.vendorName = vendor.name;
      }
      if (vendor.name === "all") {
        filters.vendorName = "all";
      }

      filters.userId = userId;

      dispatch(
        downloadLabourExcelReport({
          projectId,
          projectName,
          filters,
        })
      );
      setOpen({ ...open, labour: false });
      setLabourDateFormat("");
      setVendor({ _id: "", name: "all" });
      setSelectedDate({
        ...selectedDate,
        startDate: new Date(),
        endDate: new Date(),
      });
    }
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

      filters.userId = userId;

      dispatch(
        downloadEquipmentExcelReport({
          projectId,
          projectName,
          filters,
        })
      );
      setOpen({ ...open, equipment: false });
      setEquipmentDateFormat("");
      setSelectedDate({
        ...selectedDate,
        startDate: new Date(),
        endDate: new Date(),
      });
    }
  };

  const hindranceSubmit = () => {
    let filters;
    if (hindrancedateformat === "") {
      dispatchWarningMessage(dispatch, "Please Select Period.");
    } else {
      if (hindrancedateformat === "Custom") {
        filters = {
          startDate: moment(selectedDate.startDate).format("YYYY-MM-DD"),
          endDate: moment(selectedDate.endDate).format("YYYY-MM-DD"),
        };
      }
      if (hindrancedateformat === "Since Inception") {
        var today = new Date();
        filters = {
          startDate: "Since Inception",
          endDate: moment(today).format("YYYY-MM-DD"),
        };
      }
      if (hindrancedateformat === "Last Month") {
        var date = new Date();
        var firstDay = new Date(date.getFullYear(), date.getMonth() - 1, 1);
        var lastDay = new Date(date.getFullYear(), date.getMonth(), 0);

        filters = {
          startDate: moment(firstDay).format("YYYY-MM-DD"),
          endDate: moment(lastDay).format("YYYY-MM-DD"),
        };
      }

      filters.userId = userId;

      dispatch(
        downloadHindranceExcelReport({
          projectId,
          projectName,
          filters,
        })
      );
      setOpen({ ...open, hindrance: false });
      setHindranceDateFormat("");
      setSelectedDate({
        ...selectedDate,
        startDate: new Date(),
        endDate: new Date(),
      });
    }
  };

  const sitevisitorSubmit = () => {
    let filters;
    if (sitevisitordateformat === "") {
      dispatchWarningMessage(dispatch, "Please Select Period.");
    } else {
      if (sitevisitordateformat === "Custom") {
        filters = {
          startDate: moment(selectedDate.startDate).format("YYYY-MM-DD"),
          endDate: moment(selectedDate.endDate).format("YYYY-MM-DD"),
        };
      }
      if (sitevisitordateformat === "Since Inception") {
        var today = new Date();
        filters = {
          startDate: "Since Inception",
          endDate: moment(today).format("YYYY-MM-DD"),
        };
      }
      if (sitevisitordateformat === "Last Month") {
        var date = new Date();
        var firstDay = new Date(date.getFullYear(), date.getMonth() - 1, 1);
        var lastDay = new Date(date.getFullYear(), date.getMonth(), 0);

        filters = {
          startDate: moment(firstDay).format("YYYY-MM-DD"),
          endDate: moment(lastDay).format("YYYY-MM-DD"),
        };
      }

      filters.userId = userId;

      dispatch(
        downloadSitevisitorExcelReport({
          projectId,
          projectName,
          filters,
        })
      );
      setOpen({ ...open, sitevisitor: false });
      setSitevisitorDateFormat("");
      setSelectedDate({
        ...selectedDate,
        startDate: new Date(),
        endDate: new Date(),
      });
    }
  };

  const staffSubmit = () => {
    let filters;
    if (staffdateformat === "") {
      dispatchWarningMessage(dispatch, "Please Select Period.");
    } else {
      if (staffdateformat === "Custom") {
        filters = {
          startDate: moment(selectedDate.startDate).format("YYYY-MM-DD"),
          endDate: moment(selectedDate.endDate).format("YYYY-MM-DD"),
        };
      }
      if (staffdateformat === "Since Inception") {
        var today = new Date();
        filters = {
          startDate: "Since Inception",
          endDate: moment(today).format("YYYY-MM-DD"),
        };
      }
      if (staffdateformat === "Last Month") {
        var date = new Date();
        var firstDay = new Date(date.getFullYear(), date.getMonth() - 1, 1);
        var lastDay = new Date(date.getFullYear(), date.getMonth(), 0);

        filters = {
          startDate: moment(firstDay).format("YYYY-MM-DD"),
          endDate: moment(lastDay).format("YYYY-MM-DD"),
        };
      }

      filters.userId = userId;

      dispatch(
        downloadStaffExcelReport({
          projectId,
          projectName,
          filters,
        })
      );
      setOpen({ ...open, staff: false });
      setStaffDateFormat("");
      setSelectedDate({
        ...selectedDate,
        startDate: new Date(),
        endDate: new Date(),
      });
    }
  };

  const attachmentSubmit = () => {
    let filters;
    if (attachmentdateformat === "") {
      dispatchWarningMessage(dispatch, "Please Select Period.");
    } else {
      if (attachmentdateformat === "Custom") {
        filters = {
          startDate: moment(selectedDate.startDate).format("YYYY-MM-DD"),
          endDate: moment(selectedDate.endDate).format("YYYY-MM-DD"),
        };
      }
      if (attachmentdateformat === "Since Inception") {
        var today = new Date();
        filters = {
          startDate: "Since Inception",
          endDate: moment(today).format("YYYY-MM-DD"),
        };
      }
      if (attachmentdateformat === "Last Month") {
        var date = new Date();
        var firstDay = new Date(date.getFullYear(), date.getMonth() - 1, 1);
        var lastDay = new Date(date.getFullYear(), date.getMonth(), 0);

        filters = {
          startDate: moment(firstDay).format("YYYY-MM-DD"),
          endDate: moment(lastDay).format("YYYY-MM-DD"),
        };
      }

      filters.userId = userId;

      dispatch(
        downloadAttachmentExcelReport({
          projectId,
          projectName,
          filters,
        })
      );
      setOpen({ ...open, attachment: false });
      setAttachmentDateFormat("");
      setSelectedDate({
        ...selectedDate,
        startDate: new Date(),
        endDate: new Date(),
      });
    }
  };

  const notesSubmit = () => {
    let filters;
    if (notesdateformat === "") {
      dispatchWarningMessage(dispatch, "Please Select Period.");
    } else {
      if (notesdateformat === "Custom") {
        filters = {
          startDate: moment(selectedDate.startDate).format("YYYY-MM-DD"),
          endDate: moment(selectedDate.endDate).format("YYYY-MM-DD"),
        };
      }
      if (notesdateformat === "Since Inception") {
        var today = new Date();
        filters = {
          startDate: "Since Inception",
          endDate: moment(today).format("YYYY-MM-DD"),
        };
      }
      if (notesdateformat === "Last Month") {
        var date = new Date();
        var firstDay = new Date(date.getFullYear(), date.getMonth() - 1, 1);
        var lastDay = new Date(date.getFullYear(), date.getMonth(), 0);

        filters = {
          startDate: moment(firstDay).format("YYYY-MM-DD"),
          endDate: moment(lastDay).format("YYYY-MM-DD"),
        };
      }

      filters.userId = userId;
      filters.orgType = orgType;

      dispatch(
        downloadNotesExcelReport({
          projectId,
          projectName,
          filters,
        })
      );
      setOpen({ ...open, notes: false });
      setNotesDateFormat("");
      setSelectedDate({
        ...selectedDate,
        startDate: new Date(),
        endDate: new Date(),
      });
    }
  };

  const workProgressSubmit = () => {
    let filters;
    if (workProgressdateformat === "") {
      dispatchWarningMessage(dispatch, "Please Select Period.");
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

      filters.userId = userId;

      dispatch(
        downloadWorkProgressExcelReport({
          projectId,
          projectName,
          filters,
        })
      );
      setOpen({ ...open, workProgress: false });
      setWorkProgressDateFormat("");
      setSelectedDate({
        ...selectedDate,
        startDate: new Date(),
        endDate: new Date(),
      });
    }
  };

  const drawingSubmit = () => {
    let filters;
    if (drawingdateformat === "") {
      dispatchWarningMessage(dispatch, "Please Select Period.");
    } else {
      if (drawingdateformat === "Custom") {
        filters = {
          startDate: moment(selectedDate.startDate).format("YYYY-MM-DD"),
          endDate: moment(selectedDate.endDate).format("YYYY-MM-DD"),
        };
      }
      if (drawingdateformat === "Since Inception") {
        var today = new Date();
        filters = {
          startDate: "Since Inception",
          endDate: moment(today).format("YYYY-MM-DD"),
        };
      }
      if (drawingdateformat === "Last Month") {
        var date = new Date();
        var firstDay = new Date(date.getFullYear(), date.getMonth() - 1, 1);
        var lastDay = new Date(date.getFullYear(), date.getMonth(), 0);

        filters = {
          startDate: moment(firstDay).format("YYYY-MM-DD"),
          endDate: moment(lastDay).format("YYYY-MM-DD"),
        };
      }

      if (drawing.name !== "all" && drawing.name !== "latest") {
        filters.drawingName = drawing.name;
        filters.drawingType = drawing.type;
        filters.drawingId = drawing._id;
      }
      if (drawing.name === "all") {
        filters.drawingName = "All";
        filters.drawingType = "all";
        filters.drawingId = "all";
      }

      if (drawing.name === "latest") {
        filters.drawingName = "Latest";
        filters.drawingType = "latest";
        filters.drawingId = "latest";
      }

      if (drawing.name === "summary") {
        filters.drawingName = "Summary";
        filters.drawingType = "summary";
      }

      filters.userId = userId;

      dispatch(
        downloadDrawingExcelReport({
          projectId,
          projectName,
          filters,
        })
      );
      setOpen({ ...open, drawing: false });
      setDrawingDateFormat("");
      setDrawing({ _id: "", name: "all" });
      setSelectedDate({
        ...selectedDate,
        startDate: new Date(),
        endDate: new Date(),
      });
    }
  };

  const ncrSubmit = () => {
    let filters;
    if (ncrdateformat === "") {
      dispatchWarningMessage(dispatch, "Please Select Period.");
    } else {
      if (ncrdateformat === "Custom") {
        filters = {
          startDate: moment(selectedDate.startDate).format("YYYY-MM-DD"),
          endDate: moment(selectedDate.endDate).format("YYYY-MM-DD"),
        };
      }
      if (ncrdateformat === "Since Inception") {
        var today = new Date();
        filters = {
          startDate: "Since Inception",
          endDate: moment(today).format("YYYY-MM-DD"),
        };
      }
      if (ncrdateformat === "Last Month") {
        var date = new Date();
        var firstDay = new Date(date.getFullYear(), date.getMonth() - 1, 1);
        var lastDay = new Date(date.getFullYear(), date.getMonth(), 0);

        filters = {
          startDate: moment(firstDay).format("YYYY-MM-DD"),
          endDate: moment(lastDay).format("YYYY-MM-DD"),
        };
      }

      filters.userId = userId;
      filters.reportName = "Safety";

      dispatch(
        downloadSafetyNcrExcelReport({
          projectId,
          projectName,
          filters,
        })
      );
      setOpen({ ...open, ncr: false });
      setNcrDateFormat("");
      setSelectedDate({
        ...selectedDate,
        startDate: new Date(),
        endDate: new Date(),
      });
    }
  };

  const qncrSubmit = () => {
    let filters;
    if (qncrdateformat === "") {
      dispatchWarningMessage(dispatch, "Please Select Period.");
    } else {
      if (qncrdateformat === "Custom") {
        filters = {
          startDate: moment(selectedDate.startDate).format("YYYY-MM-DD"),
          endDate: moment(selectedDate.endDate).format("YYYY-MM-DD"),
        };
      }
      if (qncrdateformat === "Since Inception") {
        var today = new Date();
        filters = {
          startDate: "Since Inception",
          endDate: moment(today).format("YYYY-MM-DD"),
        };
      }
      if (qncrdateformat === "Last Month") {
        var date = new Date();
        var firstDay = new Date(date.getFullYear(), date.getMonth() - 1, 1);
        var lastDay = new Date(date.getFullYear(), date.getMonth(), 0);

        filters = {
          startDate: moment(firstDay).format("YYYY-MM-DD"),
          endDate: moment(lastDay).format("YYYY-MM-DD"),
        };
      }

      filters.userId = userId;
      filters.reportName = "Quality";

      dispatch(
        downloadQualityNcrExcelReport({
          projectId,
          projectName,
          filters,
        })
      );
      setOpen({ ...open, qncr: false });
      setQNcrDateFormat("");
      setSelectedDate({
        ...selectedDate,
        startDate: new Date(),
        endDate: new Date(),
      });
    }
  };

  const cancel = () => {
    setOpen({ ...open, daily_data: false });
    setType("");
  };

  let today = moment(new Date()).format("DD-MM-YYYY");

  const equipmentformatting = (value) => {
    setEquipmentDateFormat(value);
  };

  const labourformatting = (value) => {
    setLabourDateFormat(value);
  };

  const hindranceformatting = (value) => {
    setHindranceDateFormat(value);
  };

  const sitevisitorformatting = (value) => {
    setSitevisitorDateFormat(value);
  };

  const staffformatting = (value) => {
    setStaffDateFormat(value);
  };

  const attachmentformatting = (value) => {
    setAttachmentDateFormat(value);
  };

  const notesformatting = (value) => {
    setNotesDateFormat(value);
  };

  const workProgressformatting = (value) => {
    setWorkProgressDateFormat(value);
  };

  const drawingformatting = (value) => {
    setDrawingDateFormat(value);
  };

  const ncrformatting = (value) => {
    setNcrDateFormat(value);
  };

  const qncrformatting = (value) => {
    setQNcrDateFormat(value);
  };

  function navigateToplansummary() {
    if (plans.length === 0) {
      dispatchWarningMessage(dispatch, "Please add Plans first.");
    } else {
      let reportName = "Plan PDF",
        actionType = "View",
        title = "Plan PDF Report";

      dispatch(
        addEntryToSummary({ projectId, userId, reportName, actionType, title })
      );

      navigateTo(`/projects/${projectId}/plan summary`);
    }
  }

  function navigateToStructuralAudit() {
    let reportName = "Structural Audit",
      actionType = "View",
      title = "Structural Audit Report";

    dispatch(
      addEntryToSummary({ projectId, userId, reportName, actionType, title })
    );
    navigateTo(`/projects/${projectId}/structural audit`);
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
            {modules.includes("Tasks") ||
            modules.length === 0 ||
            modules.includes("Tasks Excel Reports") ? (
              <>
                <ListItem
                  className="border-solid border-b-1 py-16 px-0 sm:px-8"
                  onClick={() => {
                    dispatch(
                      downloadTaskExcelReport({
                        projectId: projectDetails._id,
                        projectName: projectDetails.title,
                        today,
                        userId,
                      })
                    );
                  }}
                  button
                >
                  <ListItemIcon>
                    <img src="assets/icons/xls.svg" alt="logo" />
                  </ListItemIcon>
                  <ListItemText
                    className={classes.listItemText}
                    primary="Tasks Excel Report"
                    secondary={"Click to download Tasks Excel Report"}
                  />
                </ListItem>

                <ListItem
                  className="border-solid border-b-1 py-16 px-0 sm:px-8"
                  button
                  onClick={() => {
                    dispatch(
                      downloadTaskPdfReport({
                        projectId: projectDetails._id,
                        projectName: projectDetails.title,
                        today,
                        userId,
                      })
                    );
                  }}
                >
                  <ListItemIcon>
                    <img src="assets/icons/pdf.svg" alt="logo" />
                  </ListItemIcon>
                  <ListItemText
                    className={classes.listItemText}
                    primary="Tasks PDF Report"
                    secondary={"Click to download Tasks PDF Report"}
                  />
                </ListItem>
              </>
            ) : null}


                {/* <>
                <ListItem
                  className="border-solid border-b-1 py-16 px-0 sm:px-8"
                  onClick={() => {
                    dispatch(
                      downloadBillRegisterExcelReport,
                      ({
                        projectId,
                        projectName,
                      
                      })
                    );
                  }}
                  button
                >
                  <ListItemIcon>
                    <img src="assets/icons/xls.svg" alt="logo" />
                  </ListItemIcon>
                  <ListItemText
                    className={classes.listItemText}
                    primary="Bill-Register Excel Report"
                    secondary={"Click to download Bill Excel Report"}
                  />
                </ListItem>

              </> */}

            <>
              <ListItem
                className="border-solid border-b-1 py-16 px-0 sm:px-8"
                onClick={() => setOpen({ ...open, purchase_register: true })}
                button
              >
                <ListItemIcon>
                  <img src="assets/icons/xls.svg" alt="logo" />
                </ListItemIcon>
                <ListItemText
                  className={classes.listItemText}
                  primary="Purchase Order Excel Report"
                  secondary={"Click to download Purchase Order Excel Report"}
                />
              </ListItem>
            </>

            {modules.includes("Cube-Register") ||
            modules.length === 0 ||
            modules.includes("Cube Register Excel Reports") ? (
              <ListItem
                className="border-solid border-b-1 py-16 px-0 sm:px-8"
                onClick={() => setOpen({ ...open, cube_register: true })}
                button
              >
                <ListItemIcon>
                  <img src="assets/icons/xls.svg" alt="logo" />
                </ListItemIcon>
                <ListItemText
                  className={classes.listItemText}
                  primary="Cube Register Excel Report"
                  secondary={"Click to download Cube Register Excel Report"}
                />
              </ListItem>
            ) : null}

<>
              <ListItem
                className="border-solid border-b-1 py-16 px-0 sm:px-8"
                onClick={() => setOpen({ ...open, bill_register: true })}
                button
              >
                <ListItemIcon>
                  <img src="assets/icons/xls.svg" alt="logo" />
                </ListItemIcon>
                <ListItemText
                  className={classes.listItemText}
                  primary="Bill Register Excel Report"
                  secondary={"Click to download Bill Register Excel Report"}
                />
              </ListItem>
              </>

            {orgType === "SSA" ? (
              <>
                <ListItem
                  className="border-solid border-b-1 py-16 px-0 sm:px-8"
                  onClick={
                    access
                      ? () => setOpen({ ...open, drawing: true })
                      : () =>
                          dispatchWarningMessage(
                            dispatch,
                            "You don't have an access to download a report."
                          )
                  }
                  button
                >
                  <ListItemIcon>
                    <img src="assets/icons/xls.svg" alt="logo" />
                  </ListItemIcon>
                  <ListItemText
                    className={classes.listItemText}
                    primary="Drawing Register Excel Report"
                    secondary={
                      "Click to download Drawing Register Excel Report"
                    }
                  />
                </ListItem>

                <>
                  <ListItem
                    className="border-solid border-b-1 py-16 px-0 sm:px-8"
                    onClick={
                      saccess
                        ? () => setOpen({ ...open, ncr: true })
                        : () =>
                            dispatchWarningMessage(
                              dispatch,
                              "You don't have an access to download a report."
                            )
                    }
                    button
                  >
                    <ListItemIcon>
                      <img src="assets/icons/xls.svg" alt="logo" />
                    </ListItemIcon>
                    <ListItemText
                      className={classes.listItemText}
                      primary="Safety NCR Excel Report"
                      secondary={"Click to download Safety NCR Excel Report"}
                    />
                  </ListItem>

                  <ListItem
                    className="border-solid border-b-1 py-16 px-0 sm:px-8"
                    onClick={
                      qaccess
                        ? () => setOpen({ ...open, qncr: true })
                        : () =>
                            dispatchWarningMessage(
                              dispatch,
                              "You don't have an access to download a report."
                            )
                    }
                    button
                  >
                    <ListItemIcon>
                      <img src="assets/icons/xls.svg" alt="logo" />
                    </ListItemIcon>
                    <ListItemText
                      className={classes.listItemText}
                      primary="Quality NCR Excel Report"
                      secondary={"Click to download Quality NCR Excel Report"}
                    />
                  </ListItem>
                </>
                <ListItem
                  className="border-solid border-b-1 py-16 px-0 sm:px-8"
                  onClick={
                    iaccess
                      ? () => setOpen({ ...open, ir: true })
                      : () =>
                          dispatchWarningMessage(
                            dispatch,
                            "You don't have an access to download a report."
                          )
                  }
                  button
                >
                  <ListItemIcon>
                    <img src="assets/icons/xls.svg" alt="logo" />
                  </ListItemIcon>
                  <ListItemText
                    className={classes.listItemText}
                    primary="Inspection Request Excel Report"
                    secondary={
                      "Click to download Inspection Request Excel Report"
                    }
                  />
                </ListItem>

                <ListItem
                  className="border-solid border-b-1 py-16 px-0 sm:px-8"
                  onClick={
                    raccess
                      ? () => setOpen({ ...open, rfi: true })
                      : () =>
                          dispatchWarningMessage(
                            dispatch,
                            "You don't have an access to download a report."
                          )
                  }
                  button
                >
                  <ListItemIcon>
                    <img src="assets/icons/xls.svg" alt="logo" />
                  </ListItemIcon>
                  <ListItemText
                    className={classes.listItemText}
                    primary="RFI Excel Report"
                    secondary={"Click to download RFI Excel Report"}
                  />
                </ListItem>

                {/* <ListItem
                  className="border-solid border-b-1 py-16 px-0 sm:px-8"
                  onClick={() => setOpen({ ...open, gfc: true})}
                  button
               >
                 <ListItemIcon>
                   <img src="assets/icons/xls.svg" alt="logo" />
                 </ListItemIcon>
                 <ListItemText
                   className={classes.listItemText}
                   primary="GFC Excel Report"
                   secondary={"Click to download GFC Excel Report"}
                 />
               </ListItem> */}
              </>
            ) : null}

            {projectType === "structuralAudit" ? (
              <>
                {/* <ListItem
                  className="border-solid border-b-1 py-16 px-0 sm:px-8"
                  onClick={() => {
                    dispatch(
                      downloadStructuralAuditReport({
                        projectId,
                        filter: "html",
                      })
                    );
                  }}
                  button
                >
                  <ListItemIcon>
                    <img src="assets/icons/html.svg" alt="logo" />
                  </ListItemIcon>
                  <ListItemText
                    className={classes.listItemText}
                    primary="Structural Audit Report"
                    secondary={"Click to view the Structural Audit Report"}
                  />
                </ListItem> */}
                <ListItem
                  className="border-solid border-b-1 py-16 px-0 sm:px-8"
                  onClick={() => {
                    navigateToStructuralAudit();
                  }}
                  button
                >
                  <ListItemIcon>
                    <img src="assets/icons/html.svg" alt="logo" />
                  </ListItemIcon>
                  <ListItemText
                    className={classes.listItemText}
                    primary="Structural Audit Report"
                    secondary={"Click to view the Structural Audit Report"}
                  />
                </ListItem>
              </>
            ) : null}

            {modules.includes("Plans") ||
            modules.length === 0 ||
            modules.includes("Plan Summary Reports") ? (
              <ListItem
                className="border-solid border-b-1 py-16 px-0 sm:px-8"
                onClick={() => {
                  navigateToplansummary();
                }}
                button
              >
                <ListItemIcon>
                  <img src="assets/icons/html.svg" alt="logo" />
                </ListItemIcon>
                <ListItemText
                  className={classes.listItemText}
                  primary="Plan Summary Report"
                  secondary={"Click to view the Plan Summary Report"}
                />
              </ListItem>
            ) : null}

            {modules.includes("Daily Data") ||
            modules.length === 0 ||
            modules.includes("Daily Data Reports") ? (
              <ListItem
                className="border-solid border-b-1 py-16 px-0 sm:px-8"
                onClick={() => {
                  setOpen({ ...open, daily_data: true });
                }}
                button
              >
                <ListItemIcon>
                  <img src="assets/icons/xls.svg" alt="logo" />
                </ListItemIcon>
                <ListItemText
                  className={classes.listItemText}
                  primary="Daily Data Reports"
                  secondary={"Click here to explore Daily Data Reports"}
                />
              </ListItem>
            ) : null}
            {/*     <ListItem
              className="border-solid border-b-1 py-16 px-0 sm:px-8"
              onClick={() => {
                setOpen({ ...open, inventory: true });
              }}
              button
            >
              <ListItemIcon>
                <img src="assets/icons/xls.svg" alt="logo" />
              </ListItemIcon>
              <ListItemText
                className={classes.listItemText}
                primary="Inventory Report"
                secondary={"Click to download Inventory Report"}
              />
            </ListItem>
          
            <ListItem
              className="border-solid border-b-1 py-16 px-0 sm:px-8"
              onClick={() => {
                setOpen({ ...open, labour: true });
              }}
              button
            >
              <ListItemIcon>
                <img src="assets/icons/xls.svg" alt="logo" />
              </ListItemIcon>
              <ListItemText
                className={classes.listItemText}
                primary="Labour Report"
                secondary={"Click to download Labour Report"}
              />
            </ListItem>

            <ListItem
              className="border-solid border-b-1 py-16 px-0 sm:px-8"
              onClick={() => {
                setOpen({ ...open, equipment: true });
              }}
              
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
            <InventoryDialogReport
              open={true}
              type="inventory"
              close={handleClose}
            />
          </>
        ) : null}

        {open.consumption ? (
          <>
            <InventoryDialogReport
              open={true}
              type="consumption"
              close={handleClose}
            />
          </>
        ) : null}
      </div>

      {open.labour ? (
        <Dialog
          open={open.labour}
          onClose={() => setOpen({ ...open, labour: false })}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            Download Labor Report
          </DialogTitle>
          <DialogContent>
            <div className="flex flex-1 flex-col mt-10 w-full">
              <div className="mt-10 mb-16 w-full">
                {vendorsName.length ? (
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="demo-simple-select-outlined-label">
                      Select Vendor
                    </InputLabel>
                    <Select
                      fullWidth
                      labelId="demo-simple-select-outlined-label"
                      id="demo-simple-select-outlined"
                      value={vendor.name}
                      label="Select Vendor"
                    >
                      <MenuItem
                        value="all"
                        onClick={() => setVendor({ _id: "", name: "all" })}
                      >
                        All
                      </MenuItem>
                      <MenuItem
                        value="Departmental"
                        onClick={() =>
                          setVendor({ _id: "", name: "Departmental" })
                        }
                      >
                        Departmental
                      </MenuItem>
                      {vendorsName.map((vname) => (
                        <MenuItem
                          key={vname.id}
                          value={vname.name}
                          onClick={() => handleChangeVendor(vname._id)}
                        >
                          <Typography>{vname.name}</Typography>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ) : (
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="demo-simple-select-outlined-label">
                      Select Vendor
                    </InputLabel>
                    <Select
                      fullWidth
                      labelId="demo-simple-select-outlined-label"
                      id="demo-simple-select-outlined"
                      value={vendor.name}
                      label="Select Vendor"
                    >
                      <MenuItem
                        value="Departmental"
                        onClick={() =>
                          setVendor({ _id: "", name: "Departmental" })
                        }
                      >
                        Departmental
                      </MenuItem>
                    </Select>
                  </FormControl>
                )}
              </div>
              <div className="mt-10 mb-16 w-full">
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="demo-simple-select-outlined-label">
                    Select Period
                  </InputLabel>
                  <Select
                    id="date format"
                    value={labourdateformat}
                    label="Select Period"
                  >
                    <MenuItem
                      value="Since Inception"
                      onClick={() => labourformatting("Since Inception")}
                    >
                      Since Inception
                    </MenuItem>
                    <MenuItem
                      value="Last Month"
                      onClick={() => labourformatting("Last Month")}
                    >
                      Last Month
                    </MenuItem>
                    <MenuItem
                      value="Custom"
                      onClick={() => labourformatting("Custom")}
                    >
                      Custom
                    </MenuItem>
                  </Select>
                </FormControl>
              </div>
              {labourdateformat === "Custom" ? (
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
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setOpen({ ...open, labour: false })}
              color="primary"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                labourSubmit();
              }}
              // onClick={() => setOpen({ ...open, labour: false })}
              color="primary"
            >
              Download
            </Button>
          </DialogActions>
        </Dialog>
      ) : null}

      {open.equipment ? (
        <Dialog
          open={open.equipment}
          onClose={() => setOpen({ ...open, equipment: false })}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            Download Equipment Report
          </DialogTitle>
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
                  <MenuItem
                    value="Since Inception"
                    onClick={() => equipmentformatting("Since Inception")}
                  >
                    Since Inception
                  </MenuItem>
                  <MenuItem
                    value="Last Month"
                    onClick={() => equipmentformatting("Last Month")}
                  >
                    Last Month
                  </MenuItem>
                  <MenuItem
                    value="Custom"
                    onClick={() => equipmentformatting("Custom")}
                  >
                    Custom
                  </MenuItem>
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

      {open.hindrance ? (
        <Dialog
          open={open.hindrance}
          onClose={() => setOpen({ ...open, hindrance: false })}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            Download Hindrance Report
          </DialogTitle>
          <DialogContent>
            <div className="mt-10 mb-16 w-full">
              <FormControl fullWidth variant="outlined">
                <InputLabel id="demo-simple-select-outlined-label">
                  Select Period
                </InputLabel>
                <Select
                  id="date format"
                  value={hindrancedateformat}
                  label="Select Period"
                >
                  <MenuItem
                    value="Since Inception"
                    onClick={() => hindranceformatting("Since Inception")}
                  >
                    Since Inception
                  </MenuItem>
                  <MenuItem
                    value="Last Month"
                    onClick={() => hindranceformatting("Last Month")}
                  >
                    Last Month
                  </MenuItem>
                  <MenuItem
                    value="Custom"
                    onClick={() => hindranceformatting("Custom")}
                  >
                    Custom
                  </MenuItem>
                </Select>
              </FormControl>
            </div>
            {hindrancedateformat === "Custom" ? (
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
              onClick={() => setOpen({ ...open, hindrance: false })}
              color="primary"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                hindranceSubmit();
              }}
              color="primary"
            >
              Download
            </Button>
          </DialogActions>
        </Dialog>
      ) : null}

      {open.sitevisitor ? (
        <Dialog
          open={open.sitevisitor}
          onClose={() => setOpen({ ...open, sitevisitor: false })}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            Download Site-Visitor Report
          </DialogTitle>
          <DialogContent>
            <div className="mt-10 mb-16 w-full">
              <FormControl fullWidth variant="outlined">
                <InputLabel id="demo-simple-select-outlined-label">
                  Select Period
                </InputLabel>
                <Select
                  id="date format"
                  value={sitevisitordateformat}
                  label="Select Period"
                >
                  <MenuItem
                    value="Since Inception"
                    onClick={() => sitevisitorformatting("Since Inception")}
                  >
                    Since Inception
                  </MenuItem>
                  <MenuItem
                    value="Last Month"
                    onClick={() => sitevisitorformatting("Last Month")}
                  >
                    Last Month
                  </MenuItem>
                  <MenuItem
                    value="Custom"
                    onClick={() => sitevisitorformatting("Custom")}
                  >
                    Custom
                  </MenuItem>
                </Select>
              </FormControl>
            </div>
            {sitevisitordateformat === "Custom" ? (
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
              onClick={() => setOpen({ ...open, sitevisitor: false })}
              color="primary"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                sitevisitorSubmit();
              }}
              color="primary"
            >
              Download
            </Button>
          </DialogActions>
        </Dialog>
      ) : null}

      {open.staff ? (
        <Dialog
          open={open.staff}
          onClose={() => setOpen({ ...open, staff: false })}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            Download Staff Report
          </DialogTitle>
          <DialogContent>
            <div className="mt-10 mb-16 w-full">
              <FormControl fullWidth variant="outlined">
                <InputLabel id="demo-simple-select-outlined-label">
                  Select Period
                </InputLabel>
                <Select
                  id="date format"
                  value={staffdateformat}
                  label="Select Period"
                >
                  <MenuItem
                    value="Since Inception"
                    onClick={() => staffformatting("Since Inception")}
                  >
                    Since Inception
                  </MenuItem>
                  <MenuItem
                    value="Last Month"
                    onClick={() => staffformatting("Last Month")}
                  >
                    Last Month
                  </MenuItem>
                  <MenuItem
                    value="Custom"
                    onClick={() => staffformatting("Custom")}
                  >
                    Custom
                  </MenuItem>
                </Select>
              </FormControl>
            </div>
            {staffdateformat === "Custom" ? (
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
              onClick={() => setOpen({ ...open, staff: false })}
              color="primary"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                staffSubmit();
              }}
              color="primary"
            >
              Download
            </Button>
          </DialogActions>
        </Dialog>
      ) : null}

      {open.attachment ? (
        <Dialog
          open={open.attachment}
          onClose={() => setOpen({ ...open, attachment: false })}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            Download Attachment Report
          </DialogTitle>
          <DialogContent>
            <div className="mt-10 mb-16 w-full">
              <FormControl fullWidth variant="outlined">
                <InputLabel id="demo-simple-select-outlined-label">
                  Select Period
                </InputLabel>
                <Select
                  id="date format"
                  value={attachmentdateformat}
                  label="Select Period"
                >
                  <MenuItem
                    value="Since Inception"
                    onClick={() => attachmentformatting("Since Inception")}
                  >
                    Since Inception
                  </MenuItem>
                  <MenuItem
                    value="Last Month"
                    onClick={() => attachmentformatting("Last Month")}
                  >
                    Last Month
                  </MenuItem>
                  <MenuItem
                    value="Custom"
                    onClick={() => attachmentformatting("Custom")}
                  >
                    Custom
                  </MenuItem>
                </Select>
              </FormControl>
            </div>
            {attachmentdateformat === "Custom" ? (
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
              onClick={() => setOpen({ ...open, attachment: false })}
              color="primary"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                attachmentSubmit();
              }}
              color="primary"
            >
              Download
            </Button>
          </DialogActions>
        </Dialog>
      ) : null}

      {open.notes ? (
        <Dialog
          open={open.notes}
          onClose={() => setOpen({ ...open, notes: false })}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            {orgType === "SSA"
              ? "Download Work Progress Report"
              : "Download Notes Report"}
          </DialogTitle>
          <DialogContent>
            <div className="mt-10 mb-16 w-full">
              <FormControl fullWidth variant="outlined">
                <InputLabel id="demo-simple-select-outlined-label">
                  Select Period
                </InputLabel>
                <Select
                  id="date format"
                  value={notesdateformat}
                  label="Select Period"
                >
                  <MenuItem
                    value="Since Inception"
                    onClick={() => notesformatting("Since Inception")}
                  >
                    Since Inception
                  </MenuItem>
                  <MenuItem
                    value="Last Month"
                    onClick={() => notesformatting("Last Month")}
                  >
                    Last Month
                  </MenuItem>
                  <MenuItem
                    value="Custom"
                    onClick={() => notesformatting("Custom")}
                  >
                    Custom
                  </MenuItem>
                </Select>
              </FormControl>
            </div>
            {notesdateformat === "Custom" ? (
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
              onClick={() => setOpen({ ...open, notes: false })}
              color="primary"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                notesSubmit();
              }}
              color="primary"
            >
              Download
            </Button>
          </DialogActions>
        </Dialog>
      ) : null}

      {open.workProgress ? (
        <Dialog
          open={open.workProgress}
          onClose={() => setOpen({ ...open, workProgress: false })}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            Download Work Activity Report
          </DialogTitle>
          <DialogContent>
            <div className="mt-10 mb-16 w-full">
              <FormControl fullWidth variant="outlined">
                <InputLabel id="demo-simple-select-outlined-label">
                  Select Period
                </InputLabel>
                <Select
                  id="date format"
                  value={workProgressdateformat}
                  label="Select Period"
                >
                  <MenuItem
                    value="Since Inception"
                    onClick={() => workProgressformatting("Since Inception")}
                  >
                    Since Inception
                  </MenuItem>
                  <MenuItem
                    value="Last Month"
                    onClick={() => workProgressformatting("Last Month")}
                  >
                    Last Month
                  </MenuItem>
                  <MenuItem
                    value="Custom"
                    onClick={() => workProgressformatting("Custom")}
                  >
                    Custom
                  </MenuItem>
                </Select>
              </FormControl>
            </div>
            {workProgressdateformat === "Custom" ? (
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
              onClick={() => setOpen({ ...open, workProgress: false })}
              color="primary"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                workProgressSubmit();
              }}
              color="primary"
            >
              Download
            </Button>
          </DialogActions>
        </Dialog>
      ) : null}

      {open.daily_data ? (
        <Dialog
          open={open.daily_data}
          onClose={() => setOpen({ ...open, daily_data: false })}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Daily Data Reports</DialogTitle>
          <DialogContent>
            <div className="mb-10 w-full">
              <FormControl fullWidth variant="outlined">
                <InputLabel id="demo-simple-select-outlined-label">
                  Select Report Type
                </InputLabel>
                <Select id="type" value={type} label="Select Report Type">
                  <MenuItem
                    value="Inventory"
                    onClick={() =>
                      setOpen({ ...open, inventory: true, daily_data: false })
                    }
                  >
                    Inventory
                  </MenuItem>
                  <MenuItem
                    value="Equipment"
                    onClick={() =>
                      setOpen({ ...open, equipment: true, daily_data: false })
                    }
                  >
                    Equipment
                  </MenuItem>
                  <MenuItem
                    value="Labour"
                    onClick={() =>
                      setOpen({ ...open, labour: true, daily_data: false })
                    }
                  >
                    Labor
                  </MenuItem>
                  {orgType !== "SSA" ? (
                    <>
                      <MenuItem
                        value="Hindrance"
                        onClick={() =>
                          setOpen({
                            ...open,
                            hindrance: true,
                            daily_data: false,
                          })
                        }
                      >
                        Hindrance
                      </MenuItem>
                      <MenuItem
                        value="SiteVisitor"
                        onClick={() =>
                          setOpen({
                            ...open,
                            sitevisitor: true,
                            daily_data: false,
                          })
                        }
                      >
                        SiteVisitor
                      </MenuItem>
                      <MenuItem
                        value="Staff"
                        onClick={() =>
                          setOpen({ ...open, staff: true, daily_data: false })
                        }
                      >
                        Staff
                      </MenuItem>
                      <MenuItem
                        value="Attachments"
                        onClick={() =>
                          setOpen({
                            ...open,
                            attachment: true,
                            daily_data: false,
                          })
                        }
                      >
                        Attachments
                      </MenuItem>
                    </>
                  ) : null}
                  {orgType === "SSA" ? (
                    <MenuItem
                      value="Notes"
                      onClick={() =>
                        setOpen({ ...open, notes: true, daily_data: false })
                      }
                    >
                      Work Progress
                    </MenuItem>
                  ) : (
                    <MenuItem
                      value="Notes"
                      onClick={() =>
                        setOpen({ ...open, notes: true, daily_data: false })
                      }
                    >
                      Notes
                    </MenuItem>
                  )}
                  {orgType === "SSA" ? (
                    <MenuItem
                      value="consumption"
                      onClick={() =>
                        setOpen({
                          ...open,
                          consumption: true,
                          daily_data: false,
                        })
                      }
                    >
                      Consumption
                    </MenuItem>
                  ) : null}
                  {orgType !== "SSA" ? (
                    <MenuItem
                      value="Work Activity"
                      onClick={() =>
                        setOpen({
                          ...open,
                          workProgress: true,
                          daily_data: false,
                        })
                      }
                    >
                      Work Activity
                    </MenuItem>
                  ) : null}
                </Select>
              </FormControl>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => cancel()} color="primary">
              Cancel
            </Button>
            {/* <Button
              onClick={() => {
                Submit();
              }}
              color="primary"
            >
              Ok
            </Button> */}
          </DialogActions>
        </Dialog>
      ) : null}

      {open.cube_register ? (
        <>
          <CubeReportDialog open={true} close={handleCloseCube} />
        </>
      ) : null}

{open.bill_register ? (
        <>
          <BillRegsiterDialog open={true} close={handleCloseBill} />
        </>
      ) : null}


{open.purchase_register ? (
        <>
          <PurchaseOrderReportDialog open={true} close={handleClosePO} />
        </>
      ) : null}

      {open.ir ? (
        <>
          <IrReportDialog open={true} close={handleCloseIr} />
        </>
      ) : null}

      {open.rfi ? (
        <>
          <RfiReportDialog open={true} close={handleCloseRfi} />
        </>
      ) : null}

      {open.gfc ? (
        <>
          <GfcReportDialog open={true} close={handleCloseGfc} />
        </>
      ) : null}

      {open.drawing ? (
        <Dialog
          open={open.drawing}
          onClose={() => setOpen({ ...open, drawing: false })}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            Download Drawing Register Report
          </DialogTitle>
          <DialogContent>
            <div className="mt-10 mb-16 w-full">
              {drawingFolders.length ? (
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="demo-simple-select-outlined-label">
                    Select Drawing Folder
                  </InputLabel>
                  <Select
                    fullWidth
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={drawing.name}
                    label="Select Drawing Folder"
                  >
                    <MenuItem
                      value="latest"
                      onClick={() => setDrawing({ _id: "", name: "latest" })}
                    >
                      Latest Drawings
                    </MenuItem>
                    <MenuItem
                      value="summary"
                      onClick={() => setDrawing({ _id: "", name: "summary" })}
                    >
                      Summary
                    </MenuItem>
                    {drawingFolders.map((vname) => (
                      <MenuItem
                        key={vname.id}
                        value={vname.folderName}
                        onClick={() => handleChangeDrawing(vname._id)}
                      >
                        <Typography>{vname.folderName}</Typography>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : (
                <Typography>No Drawing Folders Found.</Typography>
              )}
            </div>
            <div className="mt-10 mb-16 w-full">
              <FormControl fullWidth variant="outlined">
                <InputLabel id="demo-simple-select-outlined-label">
                  Select Period
                </InputLabel>
                <Select
                  id="date format"
                  value={drawingdateformat}
                  label="Select Period"
                >
                  <MenuItem
                    value="Since Inception"
                    onClick={() => drawingformatting("Since Inception")}
                  >
                    Since Inception
                  </MenuItem>
                  <MenuItem
                    value="Last Month"
                    onClick={() => drawingformatting("Last Month")}
                  >
                    Last Month
                  </MenuItem>
                  <MenuItem
                    value="Custom"
                    onClick={() => drawingformatting("Custom")}
                  >
                    Custom
                  </MenuItem>
                </Select>
              </FormControl>
            </div>
            {drawingdateformat === "Custom" ? (
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
              onClick={() => setOpen({ ...open, drawing: false })}
              color="primary"
            >
              CLOSE
            </Button>
            <Button
              onClick={() => {
                drawingSubmit();
              }}
              color="primary"
            >
              Download
            </Button>
          </DialogActions>
        </Dialog>
      ) : null}

      {open.ncr ? (
        <Dialog
          open={open.ncr}
          onClose={() => setOpen({ ...open, ncr: false })}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            Download Safety NCR Report
          </DialogTitle>
          <DialogContent>
            <div className="mt-10 mb-16 w-full">
              <FormControl fullWidth variant="outlined">
                <InputLabel id="demo-simple-select-outlined-label">
                  Select Period
                </InputLabel>
                <Select
                  id="date format"
                  value={ncrdateformat}
                  label="Select Period"
                >
                  <MenuItem
                    value="Since Inception"
                    onClick={() => ncrformatting("Since Inception")}
                  >
                    Since Inception
                  </MenuItem>
                  <MenuItem
                    value="Last Month"
                    onClick={() => ncrformatting("Last Month")}
                  >
                    Last Month
                  </MenuItem>
                  <MenuItem
                    value="Custom"
                    onClick={() => ncrformatting("Custom")}
                  >
                    Custom
                  </MenuItem>
                </Select>
              </FormControl>
            </div>
            {ncrdateformat === "Custom" ? (
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
              onClick={() => setOpen({ ...open, ncr: false })}
              color="primary"
            >
              CLOSE
            </Button>
            <Button
              onClick={() => {
                ncrSubmit();
              }}
              color="primary"
            >
              Download
            </Button>
          </DialogActions>
        </Dialog>
      ) : null}

      {open.qncr ? (
        <Dialog
          open={open.qncr}
          onClose={() => setOpen({ ...open, qncr: false })}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            Download Quality NCR Report
          </DialogTitle>
          <DialogContent>
            <div className="mt-10 mb-16 w-full">
              <FormControl fullWidth variant="outlined">
                <InputLabel id="demo-simple-select-outlined-label">
                  Select Period
                </InputLabel>
                <Select
                  id="date format"
                  value={qncrdateformat}
                  label="Select Period"
                >
                  <MenuItem
                    value="Since Inception"
                    onClick={() => qncrformatting("Since Inception")}
                  >
                    Since Inception
                  </MenuItem>
                  <MenuItem
                    value="Last Month"
                    onClick={() => qncrformatting("Last Month")}
                  >
                    Last Month
                  </MenuItem>
                  <MenuItem
                    value="Custom"
                    onClick={() => qncrformatting("Custom")}
                  >
                    Custom
                  </MenuItem>
                </Select>
              </FormControl>
            </div>
            {qncrdateformat === "Custom" ? (
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
              onClick={() => setOpen({ ...open, qncr: false })}
              color="primary"
            >
              CLOSE
            </Button>
            <Button
              onClick={() => {
                qncrSubmit();
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

export default React.memo(Report);
