import React, { useRef, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import FuseAnimate from "@fuse/core/FuseAnimate";
import FuseLoading from "@fuse/core/FuseLoading";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import RoomIcon from "@material-ui/icons/Room";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { navigateTo } from "app/utils/Navigator";
import {
  uploadPlan,
  assignPlan,
  updatePlan,
  revisePlan,
  deletePlans,
  supersedePlan,
  openEditDialog,
  taskDetails,
  openNewDialog,
  closeNewDialog,
  addEntryToSummary,
} from "app/main/projects/store/projectsSlice";
import TaskDialog from "../task/TaskDialog";
import Upload from "../../Upload";
import PlanPdf from "../../../plan-view/PlanPdf";
import ReactTable from "react-table-6";
import Dialog from "@material-ui/core/Dialog";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import CloseIcon from "@material-ui/icons/Close";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import { DialogContent } from "@material-ui/core";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import Fab from "@material-ui/core/Fab";
import DoneIcon from "@material-ui/icons/Done";
import PrintIcon from "@material-ui/icons/Print";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import Checkbox from "@material-ui/core/Checkbox";
import Slide from "@material-ui/core/Slide";
import ImageMarker from "react-image-marker";
import PrismaZoom from "react-prismazoom";
import clsx from "clsx";
import EditIcon from "@material-ui/icons/Edit";
import CancelIcon from "@material-ui/icons/Cancel";
import CheckIcon from "@material-ui/icons/Check";
import { dispatchWarningMessage } from "app/utils/MessageDispatcher";
//import _ from '@lodash';
import Dropzone from 'react-dropzone';
import FuseAnimateGroup from '@fuse/core/FuseAnimateGroup';
import CloudDoneIcon from '@material-ui/icons/CloudDone';
import Autocomplete from '@material-ui/lab/Autocomplete';
import ReactFileViewer from "react-file-viewer";


const useStyles = makeStyles((theme) => ({
  dropzone: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    height: '100px',
    border: '3px dashed #eeeeee',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    marginBottom: '20px',
  },
  appBar: {
    position: "relative",
    width: "100%",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  root: {
    maxHeight: "68vh",
  },
  details: {
    display: "flex",
    flexDirection: "column",
  },
  content: {
    flex: "1 0 auto",
  },
  cover: {
    width: 300,
    height: 300,
  },
  svgs: {
    display: "inline-block",
    width: "100%",
    maxWidth: "640px",
  },
  addButton: {
    display: "flex",
    position: "fixed",
    right: 40,
    bottom: 5,
    zIndex: 99,
    columnGap: "10px",
  },
  deleteButton: {
    position: "fixed",
    right: 90,
    bottom: 12,
    zIndex: 99,
  },
  printButton: {
    position: "fixed",
    right: 150,
    bottom: 12,
    zIndex: 99,
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
  delete: {
    color: "red",
  },
  supersede: {
    color: "red",
  },
  viewPort: {
    display: "flex",
    height: "calc(100vh - 120px)",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  footer: {
    position: "fixed",
    bottom: 0,
    textAlign: "center",
    width: "100%",
  },
  indicator: {
    backgroundColor: "#222",
    display: "inline-block",
    padding: "10px",
    color: "#fff",
    borderRadius: "8px 8px 0 0",
  },
  zoom: {
    display: "inline-block",
    width: "100%",
    maxWidth: "640px",
  },
  button: {
    display: "inline-block",
    margin: "0 5px",
    width: "24px",
    height: "24px",
    textAlign: "center",
    border: "1px solid #fff",
    borderRadius: "50%",
    outline: "none",
    background: "none",
    color: "#fff",
    fontSize: "0.75rem",
    cursor: "pointer",
  },
  img: {
    width: "5px",
    height: "5px",
    display: "inline-block",
  },
  textField: {
    alignItems: "center",
    fontWeight: 900,
    backgroundColor: "white",
    color: "black",
    borderRadius: "5%",
  },
  input: {
    color: "white",
  },
}));
let initialState = {
  planId: "",
  planName: "",
  planType:"",
  refNo: "",
  building: "",
  wing: "",
  floor: "",
  flat: "",
};

let openState = {
  plan: false,
  upload: false,
  building: false,
  edit: false,
  delete: false,
  message: false,
  pdf: false,
  details: false,
  supersede: false,
};

let loadingState = {
  image: false,
  upload: false,
  details: false,
  plandetails: false
};


function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function Plans(props) {
  const dispatch = useDispatch();
  const plans = useSelector(({ projects }) => projects.details.plans);
  const projectId = useSelector(({ projects }) => projects.details._id);
  const apiLoading = useSelector(({ projects }) => projects.loading);
  const classes = useStyles();
  const [plansTable, setPlansTable] = useState([]);
  const [markerVisible, setMarkerVisible] = useState(false);
  const [markers, setMarkers] = useState([]);
  const [croppedImageUrl, setCroppedImageUrl] = useState();
  //const [cropFile, setCropFile] = useState();
  const [selectedIds, setSelectedIds] = useState([]);
  const [values, setValues] = useState(initialState);
  const [form, setForm] = useState(initialState);
  const [file, setFile] = useState({});
  const [open, setOpen] = useState(openState);
  const projectDialog = useSelector(({ projects }) => projects.projectDialog);
  const modules = useSelector(({ projects }) => projects.details.module);
  const [loading, setLoading] = useState(loadingState);
  const [details, setDetails] = useState({
    name: "",
  });
  const [planData, setPlanData] = useState({});
  const [update, setUpdate] = useState(false);
  //const inputFile = useRef(null);
  const childRef = useRef();
  const [state, setState] = useState({
    svg: null
  });
  const [sSvg, setsSvg] = useState({
    showSvg: ""
  })
  const team = useSelector(({ projects }) => projects.details.team);
  const [uploadAccess, setUploadAccess] = useState();
  const [viewAccess, setViewAccess] = useState();
  const [addAccess, setAddAccess] = useState();
  const [deleteAccess, setDeleteAccess] = useState();
  const [taskAccess, setTaskAccess] = useState();
  const role = useSelector(({ auth }) => auth.user);
  const userId = useSelector(({ auth }) => auth.user.data.id)
  const [planInfo, setPlanInfo] = useState({
    type: '',
    file: [],
  });
  const plansType = useSelector(({ dataStructure }) => dataStructure.plansType);
  const [fileUrl, setFileUrl] = useState('');
  const [fileType, setFileType] = useState(null);


  useEffect(() => {
    team.forEach((t)=>{
      if((t._id === role.data.id && t.role === "owner") || role.role === 'admin')
      {
        setUploadAccess(true);
        setViewAccess(true);
        setAddAccess(true);
        setTaskAccess(true);
        setDeleteAccess(true);
      }else if(t._id === role.data.id && t.role !== "owner")
      {
        setUploadAccess(t.tab_access.includes("Plans") || t.tab_access.includes("Upload Plan"));
        setDeleteAccess(t.tab_access.includes("Plans") || t.tab_access.includes("Remove Plan"));
        setViewAccess(t.tab_access.includes("Plans") || t.tab_access.includes("View Plan"))
        setAddAccess(t.tab_access.includes("Plans") || t.tab_access.includes("Mark On Plan"))
        setTaskAccess(t.tab_access.includes("Tasks"));
      }
   })
  }, [role.data.id, role.role, team]);

  useEffect(() => {

    if (plans) {
      let newPlans = JSON.parse(JSON.stringify(plans));
      newPlans.forEach((plan) => {
        if (plan.uploadDate) {
          plan.uploadDate = moment(plan.uploadDate).format(
            "DD-MM-YYYY, hh:mm A"
          );
        } else {
          plan.uploadDate = "-";
        }
      });
      setPlansTable(newPlans);
    }
  }, [plans]);


  useEffect(() => {
    if (values.building._id) {
      let data = {
        buildingId: values.building._id,
        buildgName: values.building.name,
      };
      if (values.wing._id) {
        data.wingName = values.wing.name;
        data.wingId = values.wing._id;
      }
      if (values.floor._id) {
        data.floorName = values.floor.name;
        data.floorId = values.floor._id;
      }
      if (values.flat._id) {
        data.flatName = values.flat.name;
        data.flatId = values.flat._id;
      }
      if (values.wing === "all") {
        data.wingName = values.wing;
      }
      if (values.floor === "all") {
        data.floorName = values.floor;
      }
      if (values.flat === "all") {
        data.flatName = values.flat;
      }
      dispatch(assignPlan({ projectId, planId: values.planId, data }));
    }
  }, [values.building, dispatch, projectId, values.flat, values.floor, values.planId, values.wing]);

  // function handleDokaConfirm(output) {
  //   const newFile = new File([output.file], values.planName, {
  //     type: "image/jpeg",
  //   });
  //   setCropFile(newFile);
  //   setCroppedImageUrl(URL.createObjectURL(output.file));
  //   setOpen({ ...open, edit: false });
  // }

  const handleChangeInfo = (prop) => (event) => {
    setPlanInfo({ ...planInfo, [prop]: event.target.value });
  };

  const handleChangeValues = (prop) => (event) =>{
    setForm({...form, [prop]: event.target.value })
  }

  const handleDrop = (acceptedFiles) => { 
    setPlanInfo({ ...planInfo, file: acceptedFiles });
  };

  const changeTypeOptionBaseOnValue = (value) => {
    setForm({...form, 'planType': value })
  }

  const changeTypeOption = (value) => {
    setPlanInfo({ ...planInfo, 'type': value });
  }

  function closeComposeDialog() {
    dispatch(closeNewDialog());
    setPlanInfo({
      type: '',
      file: [],
    })
 }

 const disableButton = () => {
  return (
    planInfo.type.length > 0 &&
    planInfo.file.length > 0
  );
};

const disableButton1 = () => {
  return (
    form.planType.length > 0 &&
    form.planName.length
  );
};

const handleSubmitPlan = () => {
  closeComposeDialog()
  setOpen({ ...open, message: true });
  setLoading({ ...loading, image: true });
  let payload = new FormData();
  planInfo.file.forEach((file) => {
    payload.append("plan", file);
    payload.set("type",planInfo.type)
  });

  dispatch(uploadPlan({ projectId, payload })).then((response) => {
    setLoading({ ...loading, image: false });
    setOpen({ ...open, message: false });
    clearStates();
   
  });
};

  const handleChange = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((_id) => _id !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const selectAllIds = () => {
    if (selectedIds.length === plans.length) {
      setSelectedIds([]);
    } else {
      let ids = [];
      plans.forEach((item) => {
        ids.push(item._id);
      });
      setSelectedIds(ids);
    }
  };

 
  
  async function openDialog(details) {
    var fileName = details.file;
    var fileExtension = fileName.split('.').pop();
    setFileType(fileExtension);
    setFile({ url: details.file });
    setPlanData(details);
    setLoading({ ...loading, plandetails: true });
    setOpen({ ...open, plan: true });
    setValues({
      ...values,
      planId: details._id,
      planName: details.name,
      planType: details.planType,
    });
    setForm({
      ...form,
      planId: details._id,
      planName: details.name,
      planType: details.planType,
    });
    if (fileExtension === "svg") {
      setsSvg({ showSvg: true });
      await fetch(details.file)
        .then((res) => res.text())
        .then((text) => setState({ svg: text }));
    }  
    

    else {
      setsSvg({ showSvg: false });

    }
    setLoading({ ...loading, plandetails: false });
  
    if (details.tasks.length) {
      let markersArray = [];
      details.tasks.forEach((task) => {
        if (task.markertype === undefined) {
          markersArray.push({
            id: task.taskId,
            index: task.index,
            top: task.marker.y,
            left: task.marker.x,
            status: task.status,
          });
        } else {
          markersArray.push({
            id: task.taskId,
            index: task.index,
            top: task.marker.y,
            left: task.marker.x,
            name: task.markertype.name,
            url: task.markertype.url,
            status: task.status,
          });
        }
      });
      setMarkers(markersArray);
    }

  }

 
  const show_Marker = () =>{
    setLoading({ ...loading, plandetails: true });
    plans.forEach((plan) => {
      if(plan._id === planData._id)
      {
        if(plan.tasks.length > planData.tasks.length){
            let markersArray = [];
              plan.tasks.forEach((task) => {
                if (task.markertype === undefined) {
                    markersArray.push({
                    id: task.taskId,
                    index: task.index,
                    top: task.marker.y,
                    left: task.marker.x,
                    status: task.status,
                   });
                }else{
                    markersArray.push({
                    id: task.taskId,
                    index: task.index,
                    top: task.marker.y,
                    left: task.marker.x,
                    name: task.markertype.name,
                    url: task.markertype.url,
                    status: task.status,
                   });
                } 
              });
           setMarkers(markersArray);
           setLoading({ ...loading, plandetails: false });
           setMarkerVisible(true)
        }else{
          let markersArray = [];
              plan.tasks.forEach((task) => {
                if (task.markertype === undefined) {
                  markersArray.push({
                    id: task.taskId,
                    index: task.index,
                    top: task.marker.y,
                    left: task.marker.x,
                    status: task.status,
                  });
                }else{
                  markersArray.push({
                    id: task.taskId,
                    index: task.index,
                    top: task.marker.y,
                    left: task.marker.x,
                    name: task.markertype.name,
                    url: task.markertype.url,
                    status: task.status,
                  });
                } 
              });
          setMarkers(markersArray);
          setLoading({ ...loading, plandetails: false });
          setMarkerVisible(true)
        }
      }
    });
  }

  const CustomMarker = (props) => {
    return (
      <>
       {props.name === undefined || props.name === "dot marker" ?
        <div className="flex flex-row">
          <img
            className={classes.img}
            src="assets/icons/dot marker.png"
            alt="marker"
            onClick={taskAccess ?() => {
              setMarkerVisible(false)
              dispatch(taskDetails({ projectId, taskId: props.id })).then(
                (response) => {
                  dispatch(openEditDialog({"payload":response.payload,"index":props.itemNumber + 1,"type":"planTask"}));
                }
              );
            }:null}
          />
         { props.status !== 3 ?
            <Typography
              style={{
              fontSize: "14px",
              fontWeight: 900,
              color: "red",
              marginLeft: "1px",
             }}
            >
              {props.itemNumber + 1}
            </Typography>
             :
          props.status === 3 ?
            <Typography
              style={{
              fontSize: "14px",
              fontWeight: 900,
              color: "green",
              marginLeft: "1px",
             }}
            >
             {props.itemNumber + 1}
            </Typography>
          : null
        }
        </div>
      :
      <div className="flex flex-row">
      <img
         style={{ height: "15px", width: "15px" }}
        src={`assets/icons/${props.url}`}
        alt="marker"
        onClick={taskAccess ?() => {
          setMarkerVisible(false)
          dispatch(taskDetails({ projectId, taskId: props.id })).then(
            (response) => {
              dispatch(openEditDialog({"payload":response.payload,"index":props.itemNumber + 1,"type":"planTask"}));
            }
          );
        }:null}
      />
    { props.status !== 3 ?
            <Typography
              style={{
              fontSize: "14px",
              fontWeight: 900,
              color: "red",
              marginLeft: "1px",
             }}
            >
              {props.itemNumber + 1}
            </Typography>
             :
          props.status === 3 ?
            <Typography
              style={{
              fontSize: "14px",
              fontWeight: 900,
              color: "green",
              marginLeft: "1px",
             }}
            >
             {props.itemNumber + 1}
            </Typography>
          : null
        }
    </div>
     }
      </>
    );
  };

  const clearStates = () => {
    setCroppedImageUrl();
    setFile();
    setValues(initialState);
    setForm(initialState);
    setOpen(openState);
    setLoading(loadingState);
    setMarkers([]);
    setMarkerVisible(false);
    setState({ svg: null });
    setsSvg({ showSvg: null })
  };

  const handleClose = () => {
    setOpen({ ...open, upload: false, edit: false, plan: false });
  };

  const handleBuildingClose = () => {
    setOpen({ ...open, building: false });
  };

  const setBuilding = (value) => {
    setValues({
      ...values,
      building: value.building,
      wing: value.wing,
      floor: value.floor,
      flat: value.flat,
    });
  };

  const handleUploadChange = (event) => {
    setOpen({ ...open, message: true });
    setLoading({ ...loading, image: true });

    const choosedFile = Array.from(event.target.files);
    if (!choosedFile) {
      return;
    } else {
      let payload = new FormData();
      choosedFile.forEach((file) => {
        payload.append("plan", file);
      });

      dispatch(uploadPlan({ projectId, payload })).then((response) => {
        setLoading({ ...loading, image: false });
        setOpen({ ...open, message: false });
        clearStates();
      });
    }
  };

  // const handleSubmit = async (event) => {
  //   let payload = new FormData();
  //   if (cropFile) {
  //     payload.append("plan", cropFile);

  //     dispatch(revisePlan({ projectId, planId: values.planId, payload })).then(
  //       (response) => {
  //         setLoading({ ...loading, upload: false });
  //         setOpen({ ...open, plan: false });
  //         clearStates();
  //       }
  //     );
  //   }
  // };

  const updateDetails = () => {
    setUpdate(false);
    setLoading({ ...loadingState, details: true });
    dispatch(updatePlan({ projectId, planId: values.planId, form })).then(
      (response) => {
        if (response.payload.code === 200) {
         setValues({ ...values, planName: form.planName, planType: form.planType });
         setOpen({ ...open, details: false });
        }
          setLoading({ ...loadingState, details: false });
      }
    );
  };

  // const createForm = async (file) => {
  //   const payload = new FormData();
  //   payload.append("plan", file);
  //   payload.set("name", values.planName);
  //   payload.set("refNo", values.refNo);
  //   payload.set("buildingName", values.building.name);
  //   payload.set("buildingId", values.building._id);
  //   if (values.wing._id) {
  //     payload.set("wingName", values.wing.name);
  //     payload.set("wingId", values.wing._id);
  //   }
  //   if (values.floor._id) {
  //     payload.set("floorName", values.floor.name);
  //     payload.set("floorId", values.floor._id);
  //   }
  //   if (values.flat._id) {
  //     payload.set("flatName", values.flat.name);
  //     payload.set("flatId", values.flat._id);
  //   }
  //   if (values.wing === "all") {
  //     payload.set("wingName", values.wing);
  //   }
  //   if (values.floor === "all") {
  //     payload.set("floorName", values.floor);
  //   }
  //   if (values.flat === "all") {
  //     payload.set("flatName", values.flat);
  //   }
  //   return payload;
  // };

  const callTask = () => {
    if(modules.length === 0 || modules.includes("Tasks")){
      setMarkerVisible(false)
      dispatch(openNewDialog(planData));
    }else {
      dispatchWarningMessage(dispatch, "Please include Tasks module from Settings to Add Tasks.")
    }
  }
  
  // const uploadDisabled = () => {
  //   return open.edit === false && cropFile;
  // };

  if (!plans) {
    return <FuseLoading />;
  }

  function filterCaseInsensitive(filter, row) {
    const id = filter.pivotId || filter.id;
    return (
      row[id] !== undefined && id !== 'status' ?
        String(row[id].toLowerCase()).startsWith(filter.value.toLowerCase())
      :
        false
    );
  }

  const downloadPlan = async (plan_name) =>{
    let reportName = "Plan", actionType = "Download", title = plan_name; 
    await dispatch(addEntryToSummary ({ projectId, userId, reportName, actionType, title }));
  }

  return (
    <React.Fragment>
      <Backdrop className={classes.backdrop} open={loading.image}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Snackbar
        open={open.message}
        anchorOrigin={{ vertical: "middle", horizontal: "center" }}
      >
        <Alert severity="success">Plan is Uploading... Please Wait...!</Alert>
      </Snackbar>
      <Paper className="w-full rounded-8 shadow-1">
        <div className="flex items-center justify-between px-16 h-64 border-b-1">
          <Typography className="text-16 font-bold">Plans</Typography>
          {addAccess?
            <Button color="primary" onClick={() => dispatch(openNewDialog())} variant="contained" className="mb-8" style={{padding:'3px 16px'}} nowrap="true">Add Plans</Button> 
          :null}
          </div>
        <FuseAnimate animation="transition.slideUpIn" delay={100}>
          <ReactTable
            filterable
            sortable
            className={classes.root}
            getTrProps={(state, rowInfo, column) => {
              return {
                className: "items-center justify-center",
              };
            }}
            data={plansTable}
            defaultFilterMethod={(filter, row) => filterCaseInsensitive(filter, row) }
            columns={[
              {
                Header: () => (
                  <Checkbox
                    onClick={deleteAccess?(event) => {
                      event.stopPropagation();
                      selectAllIds();
                    }:null}
                    checked={
                      selectedIds.length === Object.keys(plans).length &&
                      selectedIds.length > 0
                    }
                  />
                ),
                accessor: "",
                Cell: (row) => {
                  return (
                    <Checkbox
                      onClick={deleteAccess?(event) => {
                        event.stopPropagation();
                        handleChange(row.value._id);
                      }:null}
                      checked={selectedIds.includes(row.value._id)}
                    />
                  );
                },
                className: "justify-center",
                sortable: false,
                filterable: false,
                width: 55,
              },
              {
                Header: "Plan Name",
                accessor: "name",
                style: { 'white-space': 'unset' },
                className: "cursor-pointer",
                Cell: ({ row }) => (
                  <a onClick={viewAccess || addAccess?() => openDialog(row._original):() => dispatchWarningMessage(dispatch, "You don't have access to View or Mark on a plan.")}>{row.name}</a>
                ),
                Filter: ({ filter, onChange }) => {
                  return (
                    <div style={{ position: "relative" }}>
                      <input
                        onChange={(event) => onChange(event.target.value)}
                        value={filter ? filter.value : ""}
                        style={{
                          width: "100%",
                          backgroundColor: "#DCDCDC",
                          color: "#222222",
                        }}
                      />
                      <Icon
                        style={{
                          position: "absolute",
                          right: "10px",
                          lineHeight: "30px",
                        }}
                      >
                        search
                      </Icon>
                    </div>
                  );
                },
              },
              {
                Header: "Plan Type",
                accessor: "planType",
                Filter: ({ filter, onChange }) => {
                  return (
                    <div style={{ position: "relative" }}>
                      <input
                        onChange={(event) => onChange(event.target.value)}
                        value={filter ? filter.value : ""}
                        style={{
                          width: "100%",
                          backgroundColor: "#DCDCDC",
                          color: "#222222",
                        }}
                      />
                      <Icon
                        style={{
                          position: "absolute",
                          right: "10px",
                          lineHeight: "30px",
                        }}
                      >
                        search
                      </Icon>
                    </div>
                  );
                },
              },
              {
                Header: "Uploaded By",
                id: "uploadedBy",
                accessor: (d) => d.uploadedBy.name,
                Filter: ({ filter, onChange }) => {
                  return (
                    <div style={{ position: "relative" }}>
                      <input
                        onChange={(event) => onChange(event.target.value)}
                        value={filter ? filter.value : ""}
                        style={{
                          width: "100%",
                          backgroundColor: "#DCDCDC",
                          color: "#222222",
                        }}
                      />
                      <Icon
                        style={{
                          position: "absolute",
                          right: "10px",
                          lineHeight: "30px",
                        }}
                      >
                        search
                      </Icon>
                    </div>
                  );
                },
              },
              {
                Header: "Uploaded Date",
                accessor: "uploadDate",
                Filter: ({ filter, onChange }) => {
                  return (
                    <div style={{ position: "relative" }}>
                      <input
                        onChange={(event) => onChange(event.target.value)}
                        value={filter ? filter.value : ""}
                        style={{
                          width: "100%",
                          backgroundColor: "#DCDCDC",
                          color: "#222222",
                        }}
                      />
                      <Icon
                        style={{
                          position: "absolute",
                          right: "10px",
                          lineHeight: "30px",
                        }}
                      >
                        search
                      </Icon>
                    </div>
                  );
                },
              },
              {
                Header: "Status",
                id: "status",
                accessor: (d) => (
                  <Typography
                    className={
                      d.status === 'Supersede'
                        ? 'bg-yellow-700 text-white inline p-4 rounded truncate'
                        : d.status === 'Active'
                        ? 'bg-blue  -700 text-white inline p-4 rounded truncate'
                        : 'bg-purple-700 text-white inline p-4 rounded truncate '
                    }
                  >
                    {d.status}
                  </Typography>
                ),
                Filter: ({ filter, onChange }) => {
                  return (
                    <div style={{ position: "relative" }}>
                      <input
                        onChange={(event) => onChange(event.target.value)}
                        value={filter ? filter.value : ""}
                        style={{
                          width: "100%",
                          backgroundColor: "#DCDCDC",
                          color: "#222222",
                        }}
                      />
                      <Icon
                        style={{
                          position: "absolute",
                          right: "10px",
                          lineHeight: "30px",
                        }}
                      >
                        search
                      </Icon>
                    </div>
                  );
                },
              },
              {
                Header: 'Download',
                style: { textAlign:"center",'white-space': 'unset' },
                id:'download',
                accessor: "download",
                Filter: ({ filter, onChange }) => {
                  return (
                    <div style={{ position: "relative" }}>
                      <input
                        onChange={(event) => onChange(event.target.value)}
                        value={filter ? filter.value : ""}
                        style={{
                          width: "100%",
                          backgroundColor: "#DCDCDC",
                          color: "#222222",
                        }}
                      />
                      <Icon
                        style={{
                          position: "absolute",
                          right: "10px",
                          lineHeight: "30px",
                        }}
                      >
                        search
                      </Icon>
                    </div>
                  );
                },
                Cell: ({ row }) => (
                  <>
                    <a 
                      className="cursor-pointer"
                      href={row._original.file}
                      onClick={(event) => {
                        downloadPlan(row._original.name)
                      }}
                    >
                      Download 
                    </a>
                  </>
                ),
                className: 'font-bold',
              }
            ]}
            defaultPageSize={10}
            noDataText="No Plans found"
          />
        </FuseAnimate>
      </Paper>

      <Dialog fullScreen open={open.upload || open.plan} onClose={handleClose}>
        <Backdrop className={classes.backdrop} open={apiLoading}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <div className="flex w-full items-center justify-start gap-10">
              <IconButton
                edge="start"
                color="inherit"
                onClick={() => {
                  handleClose();
                  clearStates();
                }}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
              {open.details ? (
                <TextField
                  className={classes.textField}
                  type="text"
                  name="name"
                  defaultValue={values.planName}
                  value={details.name}
                  label="Plan Name"
                  // variant="outlined"
                  onChange={(event) => setDetails({ name: event.target.value })}
                  required
                // InputProps={{
                //   className: classes.input,
                // }}
                />
              ) : (
                <Typography variant="h6">{values.planName}</Typography>
              )}
              {open.details ? (
                <div className="flex gap-6">
                  <IconButton
                    edge="end"
                    color="inherit"
                    onClick={() => setOpen({ ...open, details: false })}
                    aria-label="close"
                  >
                    <CancelIcon />
                  </IconButton>
                  {loading.details ? (
                    <CircularProgress color="secondary" size={20} />
                  ) : (
                    <IconButton
                      disabled={details.name.length > 0 ? false : true}
                      edge="end"
                      color="inherit"
                      onClick={() => updateDetails()}
                      aria-label="close"
                    >
                      <CheckIcon />
                    </IconButton>
                  )}
                </div>
              ) : (
                <IconButton
                  edge="end"
                  color="inherit"
                  onClick={() => {
                    setUpdate(true)
                    setForm({ ...form, planId: values.planId, planName: values.planName, planType: values.planType })
                  }}
                  aria-label="close"
                >
                  <EditIcon />
                </IconButton>
              )}
            </div>
            
            {open.plan === true ? (
              <div className="flex w-full items-center justify-end gap-10 ">
                {loading.upload === false ? (
                  open.edit === false ? (
                    <>
                     {loading.upload === false && planData.status === 'Active' && addAccess && !(file && file.url && fileType === 'pdf') ? (
  <Button
    size="small"
    variant="contained"
    color="secondary"
    onClick={() => { callTask() }}
  >
    Add Task
  </Button>
) : null}
{markerVisible && !(file && file.url && fileType === 'pdf') ? (
  <Button
    size="small"
    variant="contained"
    color="secondary"
    startIcon={<RoomIcon />}
    onClick={() => setMarkerVisible(false)}
  >
    Hide Markers
  </Button>
) : (
  !(file && file.url && fileType === 'pdf') && (
    <Button
      size="small"
      variant="contained"
      color="secondary"
      startIcon={<RoomIcon />}
      onClick={() => show_Marker()}
    >
      Show Markers
    </Button>
))}
  
     </>

                  ) : (
                    <Button
                      size="small"
                      variant="contained"
                      color="secondary"
                      startIcon={<DoneIcon />}
                      onClick={() => {
                        setOpen({ ...open, edit: false });
                        setCroppedImageUrl(croppedImageUrl);
                      }}
                    >
                      Done
                    </Button>
                  )
                ) : null}
                {/* {loading.upload === false ? (
                  <Button
                    size="small"
                    //hidden={loading.upload === true ? true : false}
                    variant="contained"
                    color="secondary"
                    // startIcon={<CropIcon />}
                    onClick={() => setOpen({ ...open, building: true })}
                  >
                    Assign
                  </Button>
                ) : null} */}

                {loading.upload === true ? (
                  <CircularProgress color="secondary" />
                ) : null}
                {loading.upload === true ? (
                  <Typography>Please Wait Your Plan Is Uploading...</Typography>
                 ):planData.status === 'Active' && addAccess ?
                (
                  <Button
                    size="small"
                    variant="contained"
                    color="secondary"
                   // startIcon={<Icon>supersede</Icon>}
                    onClick={() => {
                      setOpen({ ...open, supersede: true });
                    }}
                  >
                    supersede Plan
                  </Button>
                ):null
                 //(
                //   <Button
                //     disabled={open.edit === true ? true : false}
                //     variant="contained"
                //     color="secondary"
                //     startIcon={<CloudUploadIcon />}
                //     onClick={() => {
                //       handleSubmit();
                //       setLoading({ ...loading, upload: true });
                //     }}
                //     disabled={!uploadDisabled()}
                //   >
                //     Save
                //   </Button>
                // )
              }
              </div>
            ) : null}
          </Toolbar>
        </AppBar>
        <DialogContent>
          {open.upload === true ? (
            <div className="flex flex-1 w-1/2 pt-12 pb-16 gap-10">
              <TextField
                className="w-1/2"
                variant="outlined"
                label="Plan Name"
                onChange={(event) =>
                  setValues({ ...values, planName: event.target.value })
                }
              />
              <TextField
                className="w-1/2"
                variant="outlined"
                label="Reference Number"
                onChange={(event) =>
                  setValues({ ...values, refNo: event.target.value })
                }
              />
            </div>
          ) : null}
          {loading.plandetails === true ? (
            <Backdrop className={classes.backdrop} open={loading.plandetails}>
              <CircularProgress color="inherit" />
            </Backdrop>
          ) :
            (open.edit === true ? null : (
              // <DokaModal
              //   utils={["crop", "filter", "color", "markup", "resize", "sticker"]}
              //   src={file.url !== null ? file.url : null}
              //   outputQuality="100"
              //   stickers={[
              //     // emoji
              //     "👍",
              //     "🗨",
              //     "🧍‍♂️",
              //     "🧍‍♀️",
              //     "🔍",
              //     "📍",
              //     "🔒",
              //     "🪑",
              //     "🚾",
              //     "🚫",
              //     "🔆",
              //     "❓",
              //     "✔",
              //     "❌",

              //     // url
              //   ]}
              //   onConfirm={handleDokaConfirm}
              //   onCancel={() => {
              //     setOpen({ ...open, edit: false });
              //   }}
              // />

              <div className="flex flex-1 item-center justify-center">
                {markerVisible ? (
                  sSvg.showSvg === true ? (
                    <PrismaZoom className={classes.zoom} maxZoom={20} topBoundary={120}>
                      <ImageMarker
                        src={`data:image/svg+xml;utf8,${encodeURIComponent(state.svg)}`} alt=""
                        markers={markers}
                        markerComponent={CustomMarker}
                      />
                    </PrismaZoom>
                  ) : (
                    <PrismaZoom className={classes.zoom} maxZoom={20} topBoundary={120}>
                      <ImageMarker
                        src={
                          croppedImageUrl && open.edit === false
                            ? croppedImageUrl
                            : file && file.url
                              ? file.url
                              : null
                        }
                        markers={markers}
                        markerComponent={CustomMarker}
                      />
                    </PrismaZoom>
                  )
                ) : (
                  sSvg.showSvg === true ? (
                    <img src={`data:image/svg+xml;utf8,${encodeURIComponent(state.svg)}`} alt="" />
                  ) : (
                    <img
                      src={
                        croppedImageUrl && open.edit === false
                          ? croppedImageUrl
                          : file && file.url
                            ? file.url
                            : null
                      }
                      alt=""
                    />
                  ))}
                   {file && file.url && fileType === 'pdf'? (
    <PrismaZoom className={classes.zoom} maxZoom={20} topBoundary={120}>
      <ReactFileViewer
        key={Math.random()}
        fileType={fileType}
        filePath={file.url || null}
      />
    </PrismaZoom>
  ) : null}
              </div>
            ))}
        </DialogContent>
      </Dialog>

      <Dialog
        fullWidth={true}
        maxWidth="md"
        onClose={handleBuildingClose}
        aria-labelledby="customized-dialog-title"
        open={open.building}
      >
        <DialogTitle id="customized-dialog-title" onClose={handleBuildingClose}>
          Select Building and flat
        </DialogTitle>
        <DialogContent dividers>
          <Upload onSelectedBuilding={setBuilding} ref={childRef} />
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleBuildingClose} color="primary">
            Cancel
          </Button>
          <Button
            autoFocus
            onClick={() => {
              childRef.current.assignBuilding();

              handleBuildingClose();
            }}
            color="primary"
          >
            Apply
          </Button>
        </DialogActions>
      </Dialog>

      <div className={clsx(classes.addButton)}>
        {selectedIds.length ? (
          <FuseAnimate animation="transition.expandIn" delay={300}>
            <Fab
              color="primary"
              aria-label="delete"
              onClick={() => {
                setOpen({ ...open, delete: true });
              }}
            >
              <Icon className={classes.delete}>delete</Icon>
            </Fab>
          </FuseAnimate>
        ) : null}
        <Fab
          color="primary"
          aria-label="print"
          onClick={() => {
            navigateTo(`/projects/${projectId}/plans/pdf`);
          }}
        >
          <Icon>
            <PrintIcon />
          </Icon>
        </Fab>

        <FuseAnimate animation="transition.expandIn" delay={300}>
          <Fab
            color="primary"
            aria-label="upload"
            onClick={() => dispatch(openNewDialog())}
            disabled={uploadAccess === true ? false :true}
          >
            {/* <input
              multiple
              accept="image/*,application/pdf,application/dxf"
              ref={inputFile}
              className="hidden"
              id="button-file"
              type="file"
              onChange={(event) => {
                handleUploadChange(event);
                setLoading({ ...loading, image: true });
              }}
            /> */}
              <Icon>add</Icon>
            {/* <CloudUploadIcon /> */}
          </Fab>
        </FuseAnimate>
      </div>

      <Dialog
        open={open.delete}
        TransitionComponent={Transition}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">
          Delete Selected Plans ?
        </DialogTitle>
        <DialogActions>
          <Button
            onClick={() => {
              setOpen({ ...open, delete: false });
            }}
            color="primary"
          >
            No
          </Button>
          <Button
            onClick={() => {
              setOpen({ ...open, delete: false });
              setLoading({ ...loading, image: true });
              dispatch(deletePlans({ projectId, ids: selectedIds })).then(
                (response) => {
                  setLoading({ ...loading, image: false });
                  setSelectedIds([]);
                }
              );
            }}
            color="primary"
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={open.supersede}
        TransitionComponent={Transition}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">
          Do you want to supersede plan?<br></br>
          <Typography 
             fontSize= "0.75rem">Note- Tasks linked to this plan will also be supersede.</Typography>
        </DialogTitle>
        <DialogActions>
          <Button
            onClick={() => {
              setOpen({ ...open, supersede: false });
            }}
            color="primary"
          >
            No
          </Button>
          <Button
            onClick={() => {
              setLoading({ ...loading, image: true });
              setOpen({ ...open, supersede: false });
              dispatch(supersedePlan({ projectId, id: values.planId })).then(
                (response) => {
                  setPlanData(response)
                  setLoading({ ...loading, image: false });
                }
              );
            }}
            color="primary"
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={projectDialog.props.open} {...projectDialog.props} fullWidth maxWidth='sm'>
       <Backdrop className={classes.backdrop}>
          <CircularProgress color='inherit' />
       </Backdrop>
       <FuseAnimateGroup
         enter={{
           animation: 'transition.slideUpBigIn',
         }}
         leave={{
           animation: 'transition.slideUpBigOut',
         }}
       >
         <DialogTitle id='checklist-dialog-title'>Add Plans</DialogTitle>
         <DialogContent>
           <div className='flex flex-1 flex-col w-full gap-10'>
             <Autocomplete
               id="type"
               freeSolo
               required
               options={plansType}
               value={planInfo.type}
               onInputChange={(event, value) => {
                 changeTypeOption(value);
               }}
               renderInput={(params) => (
                 <TextField
                   {...params}
                   required
                   label="Plan Type"
                   onChange={handleChangeInfo("type")}
                   variant="outlined"
                 />
               )}
             />
             <Dropzone
                onDrop={(acceptedFiles) => handleDrop(acceptedFiles)}
                accept="image/*,application/pdf"
                multiple={true}
                canCancel={false}
                inputContent='Drop A File'
                styles={{
                  dropzone: { width: 400, height: 100 },
                  dropzoneActive: { borderColor: 'green' },
                }}
              >
               {({ getRootProps, getInputProps }) => (
                 <div
                   {...getRootProps({
                     className: clsx(classes.dropzone, 'cursor-pointer'),
                   })}
                 >
                   <input {...getInputProps()} />
                   {loading === true ? (
                     <CircularProgress />
                   ) : planInfo.file.length > 0 ? (
                     <>
                       <CloudDoneIcon style={{ color: 'green' }}  fontSize='large'/>
                       <Typography variant='subtitle1'> Plan Selected </Typography> 
                     </>
                   ) : (
                     <>
                       <CloudUploadIcon fontSize='large' />
                       <Typography variant='subtitle1'> Upload File (Only image files.) </Typography> 
                     </>
                   )}
                </div>
              )}
             </Dropzone>
             <div className='flex flex-1 flex-row gap-10 my-12'>
              <Button
                disabled={!disableButton()}
                onClick={handleSubmitPlan}
                variant='contained'
                color='primary'
              >
                Add
              </Button>
              <Button onClick={() => closeComposeDialog()} variant='contained'>
                Close
              </Button>
             </div>
            </div>
         </DialogContent>
       </FuseAnimateGroup>
      </Dialog>

      <Dialog open={update}  fullWidth maxWidth='sm'>
       <Backdrop className={classes.backdrop}>
         <CircularProgress color='inherit' />
       </Backdrop>
       <FuseAnimateGroup
         enter={{ animation: 'transition.slideUpBigIn' }}
         leave={{ animation: 'transition.slideUpBigOut' }}
       >
          <DialogTitle id='checklist-dialog-title'>Update Plan Details</DialogTitle>
          <DialogContent>
            <div className='flex flex-1 flex-col w-full gap-10'>
             <TextField
                required
                value={form.planName}
                onChange={handleChangeValues('planName')}
                id='outlined-basic'
                name='name'
                label='Plan Name'
                variant='outlined'
             />
             <Autocomplete
                id="type"
                required
                freeSolo
                options={plansType}
                value={form.planType}
                onInputChange={(event, value) => {
                  changeTypeOptionBaseOnValue(value);
                }}
                renderInput={(params) => (
                  <TextField
                   {...params}
                   required
                   label="Plan Type"
                   onChange={handleChangeValues("planType")}
                   variant="outlined"
                 />
                )}
             />

              <div className='flex flex-1 flex-row gap-10 my-12'>
               <Button
                 disabled={!disableButton1()}
                 onClick={updateDetails}
                 variant='contained'
                 color='primary'
               >
                 Update
               </Button>
               <Button onClick={() => 
                 {
                   setUpdate(false);
                   setForm(initialState);
                 }} variant='contained'>
                 Close
               </Button>
              </div>
            </div>
          </DialogContent>
       </FuseAnimateGroup>
      </Dialog>

      {open.plan === true ? <TaskDialog />:null}
     
      {open.pdf ? <PlanPdf plans="plans" /> : null}
    </React.Fragment>
  );
}

export default Plans;
