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
import { downloadCubeRegisterExcelReport } from "app/main/projects/store/projectsSlice";

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

const CubeReportDilaog = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const cubeRegister = useSelector(({ projects }) => projects.cubeRegister.sampleList);
  const gradeType = useSelector(({ dataStructure }) => dataStructure.gradeType);
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
  const [grade, setGrade] = useState([]);
  const [grades, setGrades] = useState([]);
  const [gradeList, setGradeList] = useState([]);
  const [cube_registerdateformat, setCubeRegisterDateFormat] = useState("");
  const ssaGradeType = useSelector(({ sites }) => sites.dataStructure.gradeType);

  useEffect(() => {
    if (props.open) {
      setOpen(true);
    }
    let cubeSup = ['All'], cubeGrade = ['All'];

    cubeRegister.forEach((element) => {
      cubeSup.push(element.supplier)
    })
    let uniqueSuppliers = cubeSup.filter((item, i, ar) => ar.indexOf(item) === i);
    setSupplierList(uniqueSuppliers);

    if(details === undefined || details === null){
      gradeType.forEach((gr)=>{
        cubeGrade.push(gr);
      })
      setGradeList(cubeGrade)
    }else{
      if(details.orgType === 'SSA'){
        ssaGradeType.forEach((gr)=>{
          cubeGrade.push(gr);
        })
       setGradeList(cubeGrade)
      }else if(details.orgType === undefined || details.orgType === null){
        gradeType.forEach((gr)=>{
          cubeGrade.push(gr);
        })
        setGradeList(cubeGrade)
      }else{
        gradeType.forEach((gr)=>{
          cubeGrade.push(gr);
        })
        setGradeList(cubeGrade)
      }
    }
  }, [props.open]);

  const handleDateChange = (prop) => (date) => {
    setSelectedDate({ ...selectedDate, [prop]: date });
  };

  const cube_registerformatting = (value) => {
    setCubeRegisterDateFormat(value)
  }

  const handleClose = () => {
    setOpen(false);
    props.close();
  };

  const callSupplier = (newSupplier) =>{
    let filterSuppliers = newSupplier.filter((supp)=> supp === "All");

    if(filterSuppliers.length > 0){
      let finalSl = supplierList.filter(sl => sl !== 'All');
      setSupplier(['All']);
      setSuppliers(finalSl);
    }else{
      setSupplier(newSupplier);
      setSuppliers(newSupplier);
    }
  }

  const callGrade = (newGrade) =>{
    let filterGrades = newGrade.filter((supp)=> supp === "All");

    if(filterGrades.length > 0){
      let finalSl = gradeList.filter(sl => sl !== 'All');
      setGrade(['All']);
      setGrades(finalSl);
    }else{
      setGrade(newGrade);
      setGrades(newGrade);
    }
  }

  const disableButton = () => {
    return (
        cube_registerdateformat.length > 0 &&
        suppliers.length > 0 &&
        grades.length > 0
    );
  };

  const handleSubmit = () => {
    let filters;
    if (cube_registerdateformat === "") {
      dispatchWarningMessage(dispatch, "Please Select Period.");
    } else {
      if (cube_registerdateformat === "Custom") {
        filters = {
          startDate: moment(selectedDate.startDate).format("YYYY-MM-DD"),
          endDate: moment(selectedDate.endDate).format("YYYY-MM-DD"),
        };
      }
      if (cube_registerdateformat === "Since Inception") {
        var today = new Date();
        filters = {
          startDate: "Since Inception",
          endDate: moment(today).format("YYYY-MM-DD"),
        };
      }
      if (cube_registerdateformat === "Last Month") {
        var date = new Date();
        var firstDay = new Date(date.getFullYear(), date.getMonth() - 1, 1);
        var lastDay = new Date(date.getFullYear(), date.getMonth(), 0);

        filters = {
          startDate: moment(firstDay).format("YYYY-MM-DD"),
          endDate: moment(lastDay).format("YYYY-MM-DD"),
        };
      }

      filters.userId = userId;
      // filters.suppliers = suppliers;
      // filters.grades = grades;

      dispatch(
        downloadCubeRegisterExcelReport({
          projectId,
          projectName,
          suppliers,
          grades,
          filters,
        })
      );
      setOpen({ ...open, cube_register: false });
      setCubeRegisterDateFormat("");
      setSelectedDate({ ...selectedDate, startDate: new Date(), endDate:new Date() });
      setSuppliers([]);
      setGrades([]);
      setSupplier([]);
      setGrade([]);
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
              <Typography>Download Cube Register Report</Typography>
              <IconButton onClick={handleClose}>
                <CancelIcon style={{ color: "red" }} />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        <DialogContent>
            <div className="mt-10 mb-16 w-full">       
                <Autocomplete
                  value = {supplier}
                  multiple
                  id="tags-outlined"
                  options={supplierList}
                  fullWidth
                  getOptionLabel={(option) => option}
                  onChange={(event, newValue) => { 
                    callSupplier(newValue);
                  }}
                  filterSelectedOptions
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Supplier"
                      variant="outlined"
                    />
                  )}
                />
            </div>
            <div className="mt-10 mb-16 w-full">       
                <Autocomplete
                  value = {grade}
                  multiple
                  id="tags-outlined"
                  options={gradeList}
                  fullWidth
                  getOptionLabel={(option) => option}
                  onChange={(event, newValue) => { 
                     callGrade(newValue);
                  }}
                  filterSelectedOptions
                  renderInput={(params) => (
                     <TextField
                         {...params}
                         label="Select Grade"
                         variant="outlined"
                     />
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
                     value={cube_registerdateformat}
                     label="Select Period"
                  >
                     <MenuItem value="Since Inception" onClick={() => cube_registerformatting("Since Inception")}>Since Inception</MenuItem>
                     <MenuItem value="Last Month" onClick={() => cube_registerformatting("Last Month")}>Last Month</MenuItem>
                     <MenuItem value="Custom" onClick={() => cube_registerformatting("Custom")}>Custom</MenuItem>
                  </Select>
                </FormControl>
            </div>
            {cube_registerdateformat === "Custom" ? (
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

export default React.memo(CubeReportDilaog);
