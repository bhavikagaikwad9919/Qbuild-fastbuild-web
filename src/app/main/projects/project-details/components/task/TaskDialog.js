import { useForm } from "@fuse/hooks";
import FuseUtils from "@fuse/utils";
import FuseAnimate from "@fuse/core/FuseAnimate";
import _ from "@lodash";
import AppBar from "@material-ui/core/AppBar";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import { red, grey } from "@material-ui/core/colors";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import FormControl from "@material-ui/core/FormControl";
import Link from "@material-ui/core/Link";
import Icon from "@material-ui/core/Icon";
import TextField from "@material-ui/core/TextField";
import Toolbar from "@material-ui/core/Toolbar";
import ImageMarker from "react-image-marker";
import Typography from "@material-ui/core/Typography";
import DateFnsUtils from "@date-io/date-fns";
import InputAdornment from "@material-ui/core/InputAdornment";
import { makeStyles } from "@material-ui/core/styles";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import DialogTitle from "@material-ui/core/DialogTitle";
import moment from "moment/moment";
import React, { useCallback, useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Autocomplete, {
  createFilterOptions
} from "@material-ui/lab/Autocomplete";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import {
  closeNewDialog,
  closeEditDialog,
  resolveIssue,
  addTask,
  editTask,
  deleteImageTask,
  routes,
  getPlanDetails,
  taskDetails,
} from "app/main/projects/store/projectsSlice";
import MarkOnPlan from "../plans/MarkOnPlan";
import Avatar from "@material-ui/core/Avatar";
import clsx from "clsx";
import TaskImageView from "./TaskImageView";
import Slider from "@material-ui/core/Slider";
// import { openEditDialog } from "app/main/projects/store/actions/projects.actions";
import TaskTitle from "./task_title.json"
import CancelIcon from "@material-ui/icons/Cancel";
// import { AddEntriesFromIterable } from "es-abstract/es2019";
// import RoomIcon from "@material-ui/icons/Room";
// import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';
// import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import IconButton from "@material-ui/core/IconButton";
import { dispatchWarningMessage } from "app/utils/MessageDispatcher";

const filter = createFilterOptions();

const useStyles = makeStyles((theme) => ({
  root: {
    "& > * + *": {
      marginLeft: theme.spacing(2),
    },
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  productImageDelete: {
    position: "absolute",
    top: +4,
    right: +10,
    color: grey[400],
    "&:hover": {
      color: red[400],
    },
    // color: red[400],
  },
  appBar: {
    position: "relative",
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 3,
    color: "#fff",
  },
  selectionLinks: {
    fontWeight: 600,
    fontSize: "16px",
  },
  taskCompleteButton: {
    color: "#fff",
    backgroundColor: "#4caf50",
    border: "none",
    "&:hover": {
      color: "#fff",
      backgroundColor: "#58c55c",
      border: "none",
    },
  },
  img: {
    width: "5px",
    height: "5px",
    display: "inline-block",
  }, 
}));

const defaultFormState = {
  id: "",
  title: "",
  location: "",
  assignedName: "",
  assignedId: "",
  assignedEmail:"",
  dim1: "",
  dim2: "",
  dim3: "",
  image1: {},
  image2: {},
  image3: {},
  completion: 0,
  description: "",
  startDate: new Date(),
  dueDate: new Date(),
  completed: false,
};

const initialValue = {
  building: "",
  wing: "",
  floor: "",
  flat: "",
};

const marks = [
  {
    value: 0,
    label: "0 %",
  },
  {
    value: 25,
    label: "25 %",
  },
  {
    value: 50,
    label: "50 %",
  },
  {
    value: 75,
    label: "75 %",
  },
  {
    value: 100,
    label: "100 %",
  },
];

function TaskDialog(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const projectDetails = useSelector(({ projects }) => projects.details);
  const projectDialog = useSelector(({ projects }) => projects.projectDialog);
  const team = useSelector(({ projects }) => projects.details.team);
  const taskDetails1 = useSelector(({ projects }) => projects.tasks.taskDetails);
  const buildingsState = useSelector(
    ({ projects }) => projects.details.buildings
  );
  const projectId = useSelector(({ projects }) => projects.details._id);
  const projectName = useSelector(({ projects }) => projects.details.title);
  const modules = useSelector(({ projects }) => projects.details.module);
  const { form, handleChange, setForm } = useForm({ ...defaultFormState });
  const [selectedDate, setSelectedDate] = React.useState({
    startDate: new Date(),
    dueDate: new Date(),
  });
  const [buildingOpen, setBuildingOpen] = useState(false);
  const [planOpen, setPlanOpen] = useState(false);
  const [planView, setPlanView] = useState(false);
  const [type, setType] = useState("");
  const [edit, setEdit] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [planDetails, setPlanDetails] = useState("");
  const [value, setValue] = useState(initialValue);
  const [buildings, setBuildings] = useState([]);
  const [wings, setWings] = useState([]);
  const [floors, setFloors] = useState([]);
  const [flats, setFlats] = useState([]);
  const [applied, setApplied] = useState(false);
  const [loading, setLoading] = useState({
    task: false,
    status: false,
    dialogue:false,
  });
  const [imageView, setimageView] = useState({
    open: false,
    file: "",
    name: "",
  });
  const inputFile1 = useRef(null);
  const inputFile2 = useRef(null);
  const inputFile3 = useRef(null);
  const [planInfo, setPlanInfo] = useState("");
  const [state, setState] = useState({
    svg: null
  });
  const [sSvg, setsSvg] = useState({
    showSvg: ""
  })
  const [singlePlan, setSinglePlan] = useState(false);
  const [taskList, setTaskList] = useState(TaskTitle);

  useEffect(() => {
    if (projectDialog.data !== null && projectDialog.Dialogtype === "new") {
     setSinglePlan(true);
     setSelectedPlan(projectDialog.data);
     setPlanView(true)
    }

    if(projectDialog.data!==null && projectDialog.type==="planTask")
  {
    let planId=projectDialog.data.planId;
     dispatch(getPlanDetails({ projectId, planId})).then((response) => {
      if(response.payload!==undefined)
      {
        setPlanInfo(response.payload.data);
      }
    }
  );
  }
   
  }, [projectDialog]);

  const getPlanDetails1 = async (details) => {

    var fileName = details.file;
    var fileExtension = fileName.split('.').pop();

    if (fileExtension === "svg") {
      setsSvg({ showSvg: true })
      await fetch(details.file)
        .then(res => res.text())
        .then(text => setState({ svg: text }));
    } else {
      setsSvg({ showSvg: false })
    }
    if(details.markertype.markername!=='dot marker')
    {
      setForm({ ...form, title: details.markertype.markername});
    }
    setPlanDetails(details);
    setPlanOpen(false);
    setType("Plan");
  };
 
  const next = () =>
  {
     setLoading({ ...loading, dialogue: true });
     var index = planInfo.tasks.findIndex(task => task.taskId===projectDialog.data._id);

     if(index===planInfo.tasks.length-1)
     {
      let tempTask=planInfo.tasks[0];
      dispatch(taskDetails({ projectId, taskId: tempTask.taskId })).then(
       (response) => {
         if(response.payload !== undefined){
          dispatch(closeEditDialog({"payload":response.payload, "index":1,"type":"planTask"}));
          setLoading({ ...loading, dialogue: false });
         }
       });
     }else{
      let tempTask=planInfo.tasks[index+1];
      dispatch(taskDetails({ projectId, taskId: tempTask.taskId })).then(
       (response) => {
         if(response.payload !== undefined)
         {
          dispatch(closeEditDialog({"payload":response.payload, "index":index+2,"type":"planTask"}));
          setLoading({ ...loading, dialogue: false });
         }
       });
     }  
  }
 
  const previous = () => {
    setLoading({ ...loading, dialogue: true });
    let length = planInfo.tasks.length;
    var index = planInfo.tasks.findIndex(task => task.taskId === projectDialog.data._id);

    if(index === 0)
    {
     let tempTask = planInfo.tasks[length-1];

     dispatch(taskDetails({ projectId, taskId: tempTask.taskId })).then(
      (response) => {
        if(response.payload !== undefined)
        {
          dispatch(closeEditDialog({"payload":response.payload, "index":planInfo.tasks.length,"type":"planTask"}));
          setLoading({ ...loading, dialogue: false });
        }  
      });
    }else{
     let tempTask=planInfo.tasks[index-1];

     dispatch(taskDetails({ projectId, taskId: tempTask.taskId })).then(
      (response) => {
        if(response.payload !== undefined)
        {
          dispatch(closeEditDialog({"payload":response.payload, "index":index,"type":"planTask"}));
          setLoading({ ...loading, dialogue: false });
        }
      });
    }  
  }

  const handleClosePlan = () => {
    if (projectDialog.Dialogtype === "new") {
      setSelectedPlan("");
    }
    setPlanView(false);
  };

  const callPlans = () => {
    if(modules.length === 0 || modules.includes("Plans")){
      dispatch(routes("Plans"));
      closeTaskDialog();
    }else {
      dispatchWarningMessage(dispatch, "Please include Plans module from Settings to Add Plans.")
    }
  }

  const handleDateChange = (prop) => (date) => {
    setSelectedDate({ ...selectedDate, [prop]: date });
  };

  const CustomMarker = (props) => {

    if (projectDialog.Dialogtype === "new") {
      return (
        <>
          {planDetails.markertype.markername !== "dot marker" ?
            <div className="flex flex-row">
              <img
                style={{ height: "15px", width: "15px" }}
                //src="assets/icons/dot marker.png"
                src={`assets/icons/${planDetails.markertype.markerUrl}`}
                alt="marker"
              />
              <Typography
                style={{ fontSize: "5px", fontWeight: 900, color: "red" }}
              >
                {planDetails.markertype.markername}
              </Typography>
            </div>
            : <div className="flex flex-row">
              <img
                style={{ height: "5px", width: "5px" }}
                src="assets/icons/dot marker.png"
                alt="marker"
              />
              <Typography
                style={{ fontSize: "5px", fontWeight: 900, color: "red" }}
              >
                {props.index}
              </Typography>
            </div>
          }
        </>
      );
    } else if (projectDialog.Dialogtype === "edit") {
    
      return (
        <>
          {planDetails.markertype !== undefined ?
            <div className="flex flex-row">
              <img
                style={{ height: "15px", width: "15px" }}
                //src="assets/icons/dot marker.png"
                src={`assets/icons/${planDetails.markertype.markerUrl}`}
                alt="marker"
              />
              <Typography
                style={{ fontSize: "5px", fontWeight: 900, color: "red" }}
              >
                {planDetails.markertype.markername}
              </Typography>
            </div>
            : <div className="flex flex-row">
              <img
                style={{ height: "5px", width: "5px" }}
                src="assets/icons/dot marker.png"
                alt="marker"
              />
              <Typography
                style={{ fontSize: "5px", fontWeight: 900, color: "red" }}
              >
                {props.index}
              </Typography>
            </div>
          }
        </>
      );
    }

  };

  const handleOpenImageDialog = (name, file) => {
    setimageView({ open: true, name: name, file: file });
  };

  const handleImageChange = (image) => {
    setForm(
      _.set(
        { ...form },
        image.name,

        {
          id: FuseUtils.generateGUID(),
          url: image.url,
          type: "image",
          file: image.file,
        }
      )
    );
  };

  const removeImage = (type) => {
    if (type === "image1") {
      setForm({ ...form, image1: "" });
      if (projectDialog.Dialogtype === "edit") {
        if (form.pictures && form.pictures[0]) {
          dispatch(
            deleteImageTask({
              projectId: projectDetails._id,
              taskId: taskDetails1._id,
              imageId: form.pictures[0]._id,
            })
          );
        }
      }
    }
    if (type === "image2") {
      setForm({ ...form, image2: "" });
      if (projectDialog.Dialogtype === "edit") {
        if (form.pictures && form.pictures[1]) {
          dispatch(
            deleteImageTask({
              projectId: projectDetails._id,
              taskId: taskDetails1._id,
              imageId: form.pictures[1]._id,
            })
          );
        }
      }
    }
    if (type === "image3") {
      setForm({ ...form, image3: "" });
      if (projectDialog.Dialogtype === "edit") {
        if (form.pictures && form.pictures[2]) {
          dispatch(
            deleteImageTask({
              projectId: projectDetails._id,
              taskId: taskDetails1._id,
              imageId: form.pictures[2]._id,
            })
          );
        }
      }
    }
  };

  const initDialog = useCallback(() => {
    if (projectDialog.Dialogtype === "edit" && projectDialog.data) {

      let formData = JSON.parse(JSON.stringify(projectDialog.data));
      formData.image1 = "";
      formData.image2 = "";
      formData.image3 = "";
      if (formData.dims.length) {
        formData.dim1 = formData.dims[0].value;
        if (formData.dims[1]) {
          formData.dim2 = formData.dims[1].value;
        }
        if (formData.dims[2]) {
          formData.dim3 = formData.dims[2].value;
        }
      }
      if(projectDialog.data !== undefined)
      {
        if (projectDialog.data.status === 3) {
          setForm({
            ...formData,
            completed: true,
          });
        } else {
          setForm({ ...formData });
        }
      }
      
      setSelectedDate({
        startDate: projectDialog.data.startDate,
        dueDate: projectDialog.data.dueDate,
      });
      if (projectDialog.data.buildingId) {
        setType("Building");
        let value = {
          building: {
            _id: projectDialog.data.buildingId,
            name: projectDialog.data.buildingName,
          },
          wing: {
            _id: projectDialog.data.wingId,
            name: projectDialog.data.wingName,
          },
          floor: {
            _id: projectDialog.data.floorId,
            name: projectDialog.data.floorName,
          },
          flat: {
            _id: projectDialog.data.flatId,
            name: projectDialog.data.flatName,
          },
        };
        setValue(value);
      } else if (projectDialog.data.planId) {
        setType("Plan");
        let plan = JSON.parse(
          JSON.stringify(
            projectDetails.plans.find(
              (item) => item._id === projectDialog.data.planId
            )
          )
        );
        if (projectDialog.data.marker) {
          plan.marker = {
            top: projectDialog.data.marker.y,
            left: projectDialog.data.marker.x,
          };
        }
        if (projectDialog.data.markertype) {
          plan.markertype = {
            markername: projectDialog.data.markertype.name,
            markerUrl: projectDialog.data.markertype.url,
          };
        }
        setSelectedPlan(plan);
        setPlanDetails(plan);
      }
    }

    if (projectDialog.Dialogtype === "new") {
      setForm({
        ...defaultFormState,
        ...projectDialog.data,
        id: FuseUtils.generateGUID(),
      });
      setSelectedDate({ startDate: new Date(), dueDate: new Date() });
      setEdit(true);
    }
  }, [projectDialog.data, projectDialog.Dialogtype, setForm]);

  useEffect(() => {
    if (projectDialog.props.open) {
      initDialog();
    }
  }, [projectDialog.props.open, initDialog]);

  useEffect(() => {
    let building = [];
    buildingsState.forEach((build) => {
      building.push({ _id: build._id, name: build.name });
    });
    setBuildings(building);
  }, [buildingOpen]);

  useEffect(() => {
    let wings = [];
    buildingsState.forEach((build) => {
      if (value.building.name === build.name) {
        build.wings.forEach((wing) => {
          wings.push({ _id: wing._id, name: wing.name });
        });
        setWings(wings);
      }
    });

    setWings(wings);
  }, [value.building]);

  useEffect(() => {
    let floors = [];
    buildingsState.forEach((build) => {
      if (value.building.name === build.name) {
        build.wings.forEach((wing) => {
          if (value.wing.name === wing.name) {
            wing.floors.forEach((floor) => {
              floors.push({ _id: floor._id, name: floor.index });
            });
          }
        });
        setFloors(floors);
      }
    });
  }, [value.wing]);

  useEffect(() => {
    let flats = [];
    buildingsState.forEach((build) => {
      if (value.building.name === build.name) {
        build.wings.forEach((wing) => {
          if (value.wing.name === wing.name) {
            wing.floors.forEach((floor) => {
              if (value.floor.name === floor.index) {
                floor.flats.forEach((flat) => {
                  flats.push({ _id: flat._id, name: flat.number });
                });
              }
            });
          }
        });
        setFlats(flats);
      }
    });
  }, [value.floor]);

  useEffect(() => {

    if (planDetails !== "" && projectDialog.Dialogtype === "edit") {
      async function fetchData() {
        var fileName = planDetails.file;
        var fileExtension = fileName.split('.').pop();

        if (fileExtension === "svg") {
          setsSvg({ showSvg: true })
          await fetch(planDetails.file)
            .then(res => res.text())
            .then(text => setState({ svg: text }));
        } else {
          setsSvg({ showSvg: false })
        }
      }
      fetchData();
    }
  }, [planDetails]);



  const taskAdd = () => {
    setLoading({ ...loading, task: true });
    const payload = new FormData();
    if (type === "Building") {
      payload.set("buildingId", value.building._id);
      payload.set("wingId", value.wing._id);
      payload.set("floorId", value.floor._id);
      payload.set("flatId", value.flat._id);
      payload.set("buildingName", value.building.name);
      payload.set("wingName", value.wing.name);
      payload.set("floorName", value.floor.name);
      payload.set("flatName", value.flat.name);
    }
    if (type === "Plan") {
      payload.set("planId", planDetails._id);
      payload.set(
        "marker",
        `${planDetails.marker.left},${planDetails.marker.top}`
      );
      if(planDetails.markertype===undefined){
        payload.set(
          "markertype",
          `dot marker,assets/icons/dot marker.png`
        );
      }else{
        payload.set(
          "markertype",
          `${planDetails.markertype.markername},${planDetails.markertype.markerUrl}`
        ); 
      }
     
    }
    payload.set("title", form.title);
    payload.set("location", form.location);
    payload.set("description", form.description);
    payload.set("dims", `${form.dim1},${form.dim2},${form.dim3}`);
    payload.set("startDate", selectedDate.startDate);
    payload.set("dueDate", selectedDate.dueDate);
    payload.set("completion", form.completion);
    if(form.completion === 100){
      payload.set("status", "completed");
    }else{
      payload.set("status", "incompleted");
    }
    payload.set("projectName", projectName);
    if (form.assignedName && form.assignedName !== "") {
      let member = team.find((member) => member.name === form.assignedName);
      payload.set("assignedTo", JSON.stringify(member));
    }
    if (projectDialog.Dialogtype === "new") {
      if (form.image1.file) {
        payload.append("pictures", form.image1.file);
      }
      if (form.image2.file) {
        payload.append("pictures", form.image2.file);
      }
      if (form.image3.file) {
        payload.append("pictures", form.image3.file);
      }
    }
    if (projectDialog.Dialogtype === "edit") {
      if (form.image1.file) {
        payload.append("picture1", form.image1.file);
      }
      if (form.image2.file) {
        payload.append("picture2", form.image2.file);
      }
      if (form.image3.file) {
        payload.append("picture3", form.image3.file);
      }
    }

    if (edit) {
      dispatch(addTask({ projectId: projectDetails._id, payload })).then(
        (response) => {
          if (response.payload && response.payload.code === 200) {
            clearStates();
          }
          setLoading({ ...loading, task: false });
        }
      );
    } else {
      dispatch(
        editTask({
          projectId: projectDetails._id,
          taskId: taskDetails1._id,
          payload,
        })
      ).then((response) => {
        if (response.payload && response.payload.code === 200) {
          closeTaskDialog();
        }
        setLoading({ ...loading, task: false });
      });
    }
  };

  function singleCall(plan) {
    setSelectedPlan(plan);
    setPlanView(true)
  }

  function checkStatus(task)
  {
    if(task.status === 3)
     {
      dispatchWarningMessage(dispatch, "Task is completed, you can't change the marker.");
     }else if(task.status === 5)
     {
      dispatchWarningMessage(dispatch, "Task is superseded, you can't change the marker.");
     }else{
      setPlanView(true)
    }
  }

  function closeTaskDialog() {
    if (projectDialog.Dialogtype === "edit") {
      dispatch(closeEditDialog());
    } else if (projectDialog.Dialogtype === "new") {
      dispatch(closeNewDialog());
    }
  }

  function clearStates(){
    setApplied(false);
    setValue(initialValue);
    setPlanDetails("");
    setSelectedPlan("");
    setEdit(true);
    setState({ svg: null });
    setsSvg({ showSvg: null })
    setForm({ ...defaultFormState});
    setTaskList(TaskTitle);
  }

  function assign(event, newValue) {
    if(newValue !== undefined && newValue !== null){
      let member = team.find((member) => member.name === newValue.name);
      setForm({ ...form, assignedTo: member._id, assignedName: member.name });
    }
  }

  function toggleCompleted() {
    setForm({
      ...form,
      completed: !form.completed,
    });
  }

  function canBeSubmitted() {
    if(form.title !== null && form.title !== undefined){
      return (
        form.title.length > 0 && form.location.length > 0 && (applied === true || !_.isEmpty(planDetails))
      );
    }else{
      return false;
    }
  }

  function canFlatSubmitted() {
    return (
      // value.building._id.length > 0 &&
      // value.wing._id.length > 0 &&
      // value.floor._id.length > 0 &&
      value.flat !== ""
    );
  }

  function toggleTaskCompletion() {
    setLoading({ ...loading, status: true });
    if (projectDialog.data.status === 4 || 1) {
      dispatch(
        resolveIssue({
          projectId: projectDetails._id,
          taskId: projectDialog.data._id,
          status: "completed",
          completion: 100,
        })
      ).then(() => {
        setLoading({ ...loading, status: false });
      });
    }
    if (projectDialog.data.status === 3) {
      setLoading({ ...loading, status: true });
      dispatch(
        resolveIssue({
          projectId: projectDetails._id,
          taskId: projectDialog.data._id,
          status: "incompleted",
          completion: form.completion === 100 ? 0 : form.completion,
        })
      ).then(() => {
        setLoading({ ...loading, status: false });
      });
    }
  }

  const changeTitleOptionBaseOnValue = (event, value) => {
    setForm({ ...form, title: value })
  }

  const handleChangeRole = (prop) => (event) => {
    if(event.target.value !== null && event.target.value !== '' && event.target.value !== undefined ){
      let tempTasks = TaskTitle.filter((task)=> task.name.includes(event.target.value))
      setTaskList(tempTasks);
    }else{
      setTaskList(TaskTitle)
    }
    const capitalizedTitle = event.target.value.charAt(0).toUpperCase() + event.target.value.slice(1);

    setForm({ ...form, title: capitalizedTitle })
  };

  return (
    <>
      <Dialog
        // hidden={loading === true ? true : false}
        {...projectDialog.props}
        // onClose={closeTaskDialog}
        fullWidth
        maxWidth="sm"
        classes={{
          paper: "rounded-8",
        }}
      >
        <AppBar position="static" elevation={1}>
          <Toolbar className="flex w-full justify-between">
            <>
            <Typography variant="subtitle1" className="flex w-full items-center justify-start gap-10" color="inherit">
              {projectDialog.Dialogtype === "new" ? "New Task" : "Edit Task"}
            </Typography>
            {projectDialog.type==="planTask"?
            <>
             {projectDialog.index !== undefined ?
              <Typography style= {{ "color":'red',"fontStyle":"bold","fontSize":"20px","fontWeight":"850"}} variant="h5">
                {projectDialog.index}
              </Typography>
             :null}
             <div className="flex w-full items-center justify-end gap-10 ">
              <Button
                size="small"
                variant="contained"
                color="secondary"
                onClick={() => previous()}
              >
                Previous
              </Button>
              <Button
                size="small"
                variant="contained"
                color="secondary"
                onClick={() => next()}
              >
                Next
              </Button>
             </div>
            </>
           :null }
            <IconButton onClick={() => {
              closeTaskDialog();
              clearStates();
              setPlanDetails("");
              setSelectedPlan("");
              }}
            >
              <CancelIcon style={{ color: "red" }} />
            </IconButton>
            </>
           </Toolbar>
        </AppBar>
        <DialogContent classes={{ root: "p-0" }}>
          {loading.dialogue? (
            <Backdrop className={classes.backdrop} open={loading.dialogue}>
              <CircularProgress color="inherit" />
            </Backdrop>
           ) : null }

          <div className="px-16 sm:px-16 py-16">
            {planDetails ? (
              sSvg.showSvg === true ? (
                <ImageMarker
                  className={classes.img}
                  src={`data:image/svg+xml;utf8,${encodeURIComponent(state.svg)}`} alt=""
                  markers={[planDetails.marker]}
                  markerComponent={CustomMarker}
                />) : (
                <ImageMarker
                  className={classes.img}
                  src={planDetails.file}
                  markers={[planDetails.marker]}
                  markerComponent={CustomMarker}
                />
              )
            ) : null}
            {/* <Typography className={clsx(classes.root, 'mt-8 mb-16')}> */}
            <div className="flex flex-1 gap-10 mb-12 mt-12">
              <Link
                className={classes.selectionLinks}
                disabled={projectDialog.Dialogtype === "edit" ? true : false}
                hidden={
                  projectDialog.Dialogtype === "edit" && type === "Plan"
                    ? true
                    : false
                }
                component="button"
                color="secondary"
                onClick={() => {
                  setBuildingOpen(true);
                  setType("Building");
                }}
              >
                {projectDialog.Dialogtype === "edit" && type === "Building"
                  ?`${form.wingName}` + '- Wing' +
                  ", " +
                  `${form.floorName}` + '- Floor' +
                  ", " +
                  `${form.flatName}` + '- Area'
                  : projectDialog.Dialogtype === "new" && applied === true
                    ?`${value.wing.name}` +  '- Wing' +
                    "," +
                    `${value.floor.name}` +  '- Floor' +
                    "," +
                    `${value.flat.name}` + '-  Area' 
                    : projectDialog.Dialogtype === "new" && singlePlan === true ? null :planDetails.name
                    ? null
                    : selectedPlan.name
                    ? null
                    : "Select A Building"
                }
              </Link>
              <span
                className="mt-2 mr-8 ml-8"
                hidden={projectDialog.Dialogtype === "edit" ? true : projectDialog.Dialogtype === "new" && singlePlan === true ?true:planDetails.name? true: selectedPlan.name? true:false}
              >
                OR
              </span>
              <Link
                className={classes.selectionLinks}
                hidden={
                  projectDialog.Dialogtype === "edit" && type === "Building"
                    ? true
                    : false
                }
                component="button"
                onClick={() => {
                  projectDialog.Dialogtype === "new"
                    ? projectDialog.Dialogtype === "new" && singlePlan === true
                      ? singleCall(projectDialog.data) : setPlanOpen(true)
                    : checkStatus(projectDialog.data)
                }}
                color="secondary"
              >
                {planDetails.name
                  ? `Plan Name:  ${planDetails.name}`
                  : selectedPlan.name
                    ? `Plan Name:  ${selectedPlan.name}`
                    : "Mark on Plan"}
              </Link>
            </div>
            {/* </Typography> */}
            {/* <FormControl className="mt-8 mb-16" required fullWidth>
              <TextField
                label="Title"
                disabled={
                  projectDialog.Dialogtype === "edit" && edit ? true : false
                }
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                variant="outlined"
              />
            </FormControl> */}
            <FormControl className="mt-8 mb-16" required fullWidth>
            {
              projectDialog.Dialogtype === "edit" && edit ? 
              <TextField
                label="Task/Defect"
                InputProps={{style: { color: 'red',fontStyle:"bold",fontFamily:"Serif",fontSize:"18px",fontWeight: 600 },readOnly: true}}
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                variant="outlined"
              />
            :
            <Autocomplete
              value={form.title}
              id="free-solo-demo"
              freeSolo
              options={taskList.map((option) => option.name)}
              onChange={(event, value) => {
                changeTitleOptionBaseOnValue(event, value);
              }}
              variant="outlined"
              renderInput={(params) =>
                <TextField
                  {...params}
                  label="Task Name"
                  onChange={handleChangeRole("title")}
                  variant="outlined"
                />
              }
          />
            }
            </FormControl>
            <FormControl className="mt-8 mb-16" required fullWidth>
              <TextField
                 InputProps={
                  projectDialog.Dialogtype === "edit" && edit ? {style: { color: 'red',fontStyle:"bold",fontFamily:"Serif",fontSize:"18px",fontWeight: 600 },readOnly: true} :{readOnly:false} 
                }
                label="Flat/Room/Unit"
                name="location"
                value={form.location}
                onChange={handleChange}
                required
                variant="outlined"
              />
            </FormControl>
            <FormControl className="mt-8 mb-16" required fullWidth>
              <TextField
                InputProps={
                  projectDialog.Dialogtype === "edit" && edit ? {style: { color: 'red',fontStyle:"bold",fontFamily:"Serif",fontSize:"18px",fontWeight: 600 },readOnly: true} :{readOnly:false} 
                }
                label="Type Of Work"
                name="description"
                multiline
                rows="6"
                value={form.description}
                onChange={handleChange}
                variant="outlined"
              />
            </FormControl>
            <span className="mb-16">Upload Pictures</span>
            <div className="flex flex-row w-full mt-8 gap-6">
              <label
                htmlFor="button-file1"
                className="flex items-center justify-center relative w-1/3 h-128 rounded-4 mt-8 mb-16 overflow-hidden cursor-pointer shadow-1 hover:shadow-5"
              >
                <Button
                  className="h-128 w-full"
                  onClick={projectDialog.Dialogtype === "edit" && edit ? null :
                   () =>
                    handleOpenImageDialog(
                      "image1",
                      projectDialog.Dialogtype === "new"
                        ? form.image1.url
                        : form.pictures.length
                          ? form.pictures[0].pictureUrl
                          : undefined
                    )
                  }
                >
                  {projectDialog.Dialogtype === "new" ? (
                    form.image1.url ? (
                      <img src={form.image1.url} alt="picture1" />
                    ) : (
                      <Icon fontSize="large" color="action">
                        photoIcon
                      </Icon>
                    )
                  ) : projectDialog.Dialogtype === "edit" &&
                    form.image1 &&
                    form.image1.url ? (
                    <img src={form.image1.url} alt="picture1" />
                  ) : form.pictures &&
                    form.pictures.length &&
                    form.pictures[0] ? (
                    <LazyLoadImage
                      effect="blur"
                      // className="max-w-none w-auto h-full"
                      //height={200}
                      src={form.pictures[0].pictureUrl}
                      alt="picture1"
                    />
                  ) : (
                    <Icon fontSize="large" color="action">
                      photoIcon
                    </Icon>
                  )}
                </Button>
                {projectDialog.Dialogtype === "new" && form.image1.file ? (
                  <Icon
                    onClick={() => {
                      removeImage("image1");
                    }}
                    className={classes.productImageDelete}
                  >
                    delete
                  </Icon>
                ) : projectDialog.Dialogtype === "edit" &&
                  (form.image1.file ||
                    (form.pictures &&
                      form.pictures.length &&
                      form.pictures[0].pictureUrl)) ? (
                  <Icon
                    onClick={() => {
                      removeImage("image1");
                    }}
                    className={classes.productImageDelete}
                  >
                    delete
                  </Icon>
                ) : null}
              </label>
              <span>&nbsp;&nbsp;</span>
              <label
                htmlFor="button-file2"
                className="flex items-center justify-center relative w-1/3 h-128 rounded-4 mt-8 mb-16 overflow-hidden cursor-pointer shadow-1 hover:shadow-5"
              >
                <Button
                  className="h-128 w-full"
                  onClick={projectDialog.Dialogtype === "edit" && edit ? null :
                    () =>
                    handleOpenImageDialog(
                      "image2",
                      projectDialog.Dialogtype === "new"
                        ? form.image2.url
                        : form.pictures.length && form.pictures[1]
                          ? form.pictures[1].pictureUrl
                          : undefined
                    )
                  }
                >
                  {projectDialog.Dialogtype === "new" ? (
                    form.image2.url ? (
                      <img src={form.image2.url} alt="picture2" />
                    ) : (
                      <Icon fontSize="large" color="action">
                        photoIcon
                      </Icon>
                    )
                  ) : projectDialog.Dialogtype === "edit" &&
                    form.image2 &&
                    form.image2.url ? (
                    <img src={form.image2.url} alt="picture2" />
                  ) : form.pictures && form.pictures[1] && form.pictures[1] ? (
                    <LazyLoadImage
                      effect="blur"
                      // className="max-w-none w-auto h-full"
                      //height={200}
                      src={form.pictures[1].pictureUrl}
                      alt="picture2"
                    />
                  ) : (
                    <Icon fontSize="large" color="action">
                      photoIcon
                    </Icon>
                  )}
                </Button>
                {projectDialog.Dialogtype === "new" && form.image2.file ? (
                  <Icon
                    onClick={() => {
                      removeImage("image2");
                    }}
                    className={classes.productImageDelete}
                  >
                    delete
                  </Icon>
                ) : projectDialog.Dialogtype === "edit" &&
                  (form.image2.file ||
                    (form.pictures &&
                      form.pictures[1] &&
                      form.pictures[1].pictureUrl)) ? (
                  <Icon
                    onClick={() => {
                      removeImage("image2");
                    }}
                    className={classes.productImageDelete}
                  >
                    delete
                  </Icon>
                ) : null}
              </label>
              <span>&nbsp;&nbsp;</span>
              <label
                htmlFor="button-file3"
                className="flex items-center justify-center relative w-1/3 h-128 rounded-4 mt-8 mb-16 overflow-hidden cursor-pointer shadow-1 hover:shadow-5"
              >
                <Button
                  className="h-128 w-full"
                  onClick={projectDialog.Dialogtype === "edit" && edit ? null :
                    () =>
                    handleOpenImageDialog(
                      "image3",
                      projectDialog.Dialogtype === "new"
                        ? form.image3.url
                        : form.pictures.length && form.pictures[2]
                          ? form.pictures[2].pictureUrl
                          : undefined
                    )
                  }
                >
                  {projectDialog.Dialogtype === "new" ? (
                    form.image3.url ? (
                      <img src={form.image3.url} alt="picture3" />
                    ) : (
                      <Icon fontSize="large" color="action">
                        photoIcon
                      </Icon>
                    )
                  ) : projectDialog.Dialogtype === "edit" &&
                    form.image3 &&
                    form.image3.url ? (
                    <img src={form.image3.url} alt="picture3" />
                  ) : form.pictures && form.pictures[2] && form.pictures[2] ? (
                    <LazyLoadImage
                      effect="blur"
                      // className="max-w-none w-auto h-full"
                      src={form.pictures[2].pictureUrl}
                      alt="picture3"
                    />
                  ) : (
                    <Icon fontSize="large" color="action">
                      photoIcon
                    </Icon>
                  )}
                </Button>
                {projectDialog.Dialogtype === "new" && form.image3.file ? (
                  <Icon
                    onClick={() => {
                      removeImage("image3");
                    }}
                    className={classes.productImageDelete}
                  >
                    delete
                  </Icon>
                ) : projectDialog.Dialogtype === "edit" &&
                  (form.image3.file ||
                    (form.pictures &&
                      form.pictures[2] &&
                      form.pictures[2].pictureUrl)) ? (
                  <Icon
                    onClick={() => {
                      removeImage("image3");
                    }}
                    className={classes.productImageDelete}
                  >
                    delete
                  </Icon>
                ) : null}
              </label>
            </div>

            <FormControl
              className="mt-8 mb-16 flex-row gap-6"
              required
              fullWidth
            >
              <TextField
                InputProps={
                  projectDialog.Dialogtype === "edit" && edit ?
                   {style: { color: 'red',fontStyle:"bold",fontFamily:"Serif",fontSize:"18px",fontWeight: 600 },readOnly: true, endAdornment: (
                    <InputAdornment position="end">mm</InputAdornment>
                   )} :
                   {readOnly:false, endAdornment: (
                    <InputAdornment position="end">mm</InputAdornment>
                   )} 
                }
                label="Dimension 1"
                className="w-1/3"
                type="number"
                name="dim1"
                value={form.dim1}
                onChange={handleChange}
                variant="outlined"
               
              />
              <span>&nbsp;&nbsp;</span>
              <TextField
                 InputProps={
                  projectDialog.Dialogtype === "edit" && edit ?
                   {style: { color: 'red',fontStyle:"bold",fontFamily:"Serif",fontSize:"18px",fontWeight: 600 },readOnly: true, endAdornment: (
                    <InputAdornment position="end">mm</InputAdornment>
                   )} :
                   {readOnly:false, endAdornment: (
                    <InputAdornment position="end">mm</InputAdornment>
                   )} 
                }
                label="Dimension 2"
                className=" w-1/3"
                type="number"
                name="dim2"
                value={form.dim2}
                onChange={handleChange}
                variant="outlined"
              />
              <span>&nbsp;&nbsp;</span>
              <TextField
                InputProps={
                  projectDialog.Dialogtype === "edit" && edit ?
                   {style: { color: 'red',fontStyle:"bold",fontFamily:"Serif",fontSize:"18px",fontWeight: 600 },readOnly: true, endAdornment: (
                    <InputAdornment position="end">mm</InputAdornment>
                   )} :
                   {readOnly:false, endAdornment: (
                    <InputAdornment position="end">mm</InputAdornment>
                   )} 
                }
                label="Dimension 3"
                className="w-1/3"
                type="number"
                name="dim3"
                value={form.dim3}
                onChange={handleChange}
                variant="outlined"
              />
            </FormControl>
            <div className="flex mt-8 mb-16 gap-10">
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <DatePicker
                  format="MMMM dd, yyyy"
                  disabled={
                    projectDialog.Dialogtype === "edit" && edit ? true : false
                  }
                  name="startDate"
                  label="Start Date"
                  maxDate={selectedDate.dueDate}
                  value={selectedDate.startDate}
                  onChange={handleDateChange("startDate")}
                  inputVariant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <span>&nbsp;&nbsp;</span>
                <DatePicker
                  format="MMMM dd, yyyy"
                  disabled={
                    projectDialog.Dialogtype === "edit" && edit ? true : false
                  }
                  name="dueDate"
                  label="Due Date"
                  minDate={selectedDate.startDate}
                  value={selectedDate.dueDate}
                  onChange={handleDateChange("dueDate")}
                  inputVariant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </MuiPickersUtilsProvider>
            </div>
            
            <div className="flex flex-row items-center mb-12">
              <label>Completion:</label>
              <Slider
                className="ml-20 w-224"
                value={form.completion}
                disabled={
                  projectDialog.Dialogtype === "edit" && edit ? true : false
                }
                // valueLabelFormat={valueLabelFormat}
                // getAriaValueText={valuetext}
                name="completion"
                onChange={(event, newValue) =>
                  setForm({ ...form, completion: newValue })
                }
                step={null}
                valueLabelDisplay="auto"
                marks={marks}
              />
            </div>

            <div className="flex flex-row items-center">
              <label>Assign to:</label>
              <Autocomplete
                className="ml-24 w-224"
                disabled={
                  projectDialog.Dialogtype === "edit" && edit ? true : false
                }
                value={
                  projectDialog.Dialogtype === "new"
                    ? form.assignedName
                    : form.assignedTo && form.assignedTo.name
                      ? form.assignedTo.name
                      : null
                }
                onChange={(event, newValue) => {
                  // setCurrentval(newValue.name);
                  assign(event, newValue);
                }}
                options={team}
                getOptionLabel={(option) => {
                  if (typeof option === "string") {
                    return option;
                  }

                  return option.name;
                }}
                renderOption={(option) => {
                  return (
                    <>
                      <Avatar
                        className={clsx(classes.small, "mr-6")}
                        src={option.picture}
                        size="small"
                      />
                      {option.name}
                    </>
                  );
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    // label='Controllable'
                    variant="outlined"
                  />
                )}
              />
            </div>
          </div>
              </DialogContent>

        {projectDialog.Dialogtype === "new" ? (
          <DialogActions className="justify-start p-8 mt-8">
            <div className="pl-8">
              {loading.task ? (
                <CircularProgress className="ml-12" color="inherit" size={20} />
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  disabled={!canBeSubmitted()}
                  onClick={taskAdd}
                >
                  Add
                </Button>
              )}
            </div>
            <div className="pl-8">
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  closeTaskDialog();
                  clearStates()
                  setPlanDetails("");
                  setSelectedPlan("");
                }}
              >
                Close
              </Button>
            </div>
          </DialogActions>
        ) : (
          <DialogActions className="justify-start p-8">
            {edit && form.status !== 5 ? (
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  setEdit(false);
                }}
              >
                Edit
              </Button>
            ) : (
              <>
              {form.status!== 5 ?
                loading.task ? (
                  <CircularProgress
                    className="ml-12"
                    color="inherit"
                    size={20}
                  />
                ) : (
                  <Button variant="contained" color="primary" onClick={taskAdd}>
                    Save
                  </Button>
                )
                :null}
              </>
            )}

            <Button
              variant="contained"
              onClick={() => {
                closeTaskDialog();
                setForm({
                  ...defaultFormState,
                  ...projectDialog.data,
                });
                setValue(initialValue);
                setEdit(true);
                clearStates()
              }}
            >
              Close
            </Button>
            <div className="flex flex-1 justify-end">
              {loading.status ? (
                <CircularProgress className="mr-60" color="inherit" size={20} />
              ) :form.status !== 5 ? (
                <Button
                  variant="outlined"
                  color="primary"
                  className={
                    form.status === 3 ? classes.taskCompleteButton : null
                  }
                  onClick={() => toggleTaskCompletion()}
                >
                  {form.status === 3 ? "Revert" : "Mark as Complete"}
                </Button>
              ):null}
            </div>
          </DialogActions>
        )}
      </Dialog>

      <Dialog open={buildingOpen}>
        <DialogContent>
          {buildingsState.length ? (
            <>
              <FuseAnimate animation="transition.slideUpIn">
                <div className="flex flex-1 flex-col p-20 gap-16">
                  <Autocomplete
                    id="buildings"
                    options={buildings}
                    getOptionLabel={(option) => option.name}
                    onChange={(event, newValue) => {
                      setValue({ ...value, building: newValue });
                      // assignBuildings();
                    }}
                    style={{ width: 300 }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Building"
                        variant="outlined"
                      />
                    )}
                  />
                  <Autocomplete
                    // className="w-1/4"
                    id="combo-box-demo"
                    options={wings}
                    getOptionLabel={(option) => option.name}
                    onChange={(event, newValue) => {
                      setValue({ ...value, wing: newValue });
                    }}
                    style={{ width: 300 }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Wing"
                        variant="outlined"
                      />
                    )}
                  />
                  <Autocomplete
                    // className="w-1/4"
                    id="combo-box-demo"
                    options={floors}
                    getOptionLabel={(option) => option.name}
                    onChange={(event, newValue) => {
                      setValue({ ...value, floor: newValue });
                    }}
                    style={{ width: 300 }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Floor"
                        variant="outlined"
                      />
                    )}
                  />
                  <Autocomplete
                    // className="w-1/4"
                    id="combo-box-demo"
                    options={flats}
                    getOptionLabel={(option) => option.name}
                    onChange={(event, newValue) => {
                      setValue({ ...value, flat: newValue });
                    }}
                    style={{ width: 300 }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Area"
                        variant="outlined"
                      />
                    )}
                  />
                </div>
              </FuseAnimate>
              <div className="flex px-20 mb-20 items-start gap-12">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    setApplied(true);
                    setBuildingOpen(false);
                  }}
                  disabled={!canFlatSubmitted()}
                >
                  Apply
                </Button>
                <Button
                  // className="ml-10"
                  variant="contained"
                  color="primary"
                  onClick={() => setBuildingOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-10">
              <Typography vatiant="subtitle1">
                First Add Buildings and Areas
              </Typography>
              <Button
                // className="ml-10"
                variant="contained"
                onClick={() => setBuildingOpen(false)}
              >
                Cancel
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
      {planOpen === true ? (
        <>
          <Dialog
            fullWidth
            maxWidth="sm"
            open={planOpen}
            onClose={() => setPlanOpen(false)}
          >
            <DialogTitle>
              {projectDetails.plans.length ? "Select Plan" : "Add Plan First"}
            </DialogTitle>
            <DialogContent className="p-0">
              <List dense component="nav">
                {projectDetails.plans.map((plan) => (
                  plan.status === 'Active'?
                  <ListItem
                    button
                    onClick={() => {
                      setSelectedPlan(plan);
                      setPlanView(true);
                    }}
                  >
                    <div className="flex items-center justify-between w-full">
                      <ListItemText
                        primary={plan.name}
                        secondary={plan.refNo}
                      />
                      <Typography>
                        {moment(plan.uploadDate).format("DD-MM-YYYY")}
                      </Typography>
                    </div>
                  </ListItem>
                  :null))}
              </List>
              <div className="flex w-full justify-center mb-12">
                <Link
                  className="cursor-pointer"
                  onClick={() => {
                    callPlans()
                  }}
                >
                  Click here to add Plan
                </Link>
              </div>
            </DialogContent>
          </Dialog>
        </>
      ) : null}
      {planView ? (
        <MarkOnPlan
          open={true}
          data={selectedPlan !== "" ? selectedPlan : planDetails}
          close={handleClosePlan}
          saveDetails={getPlanDetails1}
        />
      ) : //   </DialogContent>
        // </Dialog>
        //
        null}
      {imageView.open ? (
        <TaskImageView
          open={imageView.open}
          close={() => {
            setimageView({ open: false, name: "", file: "" });
          }}
          data={imageView}
          saveImage={handleImageChange}
        />
      ) : null}
    </>
  );
}

export default TaskDialog;
