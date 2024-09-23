import React, { useState, useEffect } from "react";
import { Typography } from "@material-ui/core";
//import FuseUtils from "@fuse/utils";
import MenuItem from "@material-ui/core/MenuItem";
import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Icon,
  IconButton,
  Fab,
  Grid,
} from "@material-ui/core";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import {
  updateWorkProgress,
  saveReport,
  openEditDialog,
  closeNewDialog,
  getDetailReport,
  addWorkProgressData,
  updateWorkProgressData,
  routes,
  getExecutableQty,
  updateItem
} from "app/main/projects/store/projectsSlice";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import { dispatchWarningMessage } from "app/utils/MessageDispatcher";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) =>({
  addButton: {
    position: "absolute",
    right: 12,
    bottom: 12,
    zIndex: 99,
  },
  delete: {
    color: "red",
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

let initialState = {
  title: "",
  unit: "",
  itemId: "",
  valueType: "Count",
  planQty: 0,
  executedQty: "",
  percentage: 0,
  description: "",
};

function WorkProgress(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const workProgress = useSelector(({ projects }) => projects.workProgress);
  const [newworkProgress, setNewWorkProgress] = useState(workProgress);
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState(initialState);
  const [type, setType] = useState("Edit");
  const [list, setList] = useState({
    id: "",
    title: "",
    unit: "",
    itemId: "",
    valueType: "",
    planQty: 0,
    executedQty: "",
    percentage: 0,
    description: "",
  });
  const [workProgressId, setWorkProgressId] = useState("");
  const loading = useSelector(({ projects }) => projects.loading);
  const [delete1, setDelete1] = useState(false);
  const projectId = useSelector(({ projects }) => projects.details._id);
  const [deleteAccess, setDeleteAccess] = useState();
  const [createAccess, setCreateAccess] = useState();
  const team = useSelector(({ projects }) => projects.details.team);
  const user = useSelector(({ auth }) => auth.user);
  const workBOQ = useSelector(({ projects }) => projects.workBOQs.workBOQsList);
  const modules = useSelector(({ projects }) => projects.details.module);
  const [access, setAccess] = useState();
  const [tillExec, setTillExec] = useState(0);

  useEffect(() => {
    team.forEach((t)=>{
     if((t._id === user.data.id && t.role === "owner") || user.role === 'admin' || t.role === 'purchaseOfficer')
     {
       setDeleteAccess(true);
       setCreateAccess(true);
       setAccess(true)
     }else if(t._id === user.data.id && t.role !== "owner")
     {
       setDeleteAccess(t.tab_access.includes("Daily Data") || t.tab_access.includes("Remove Daily Data Entries"));
       setCreateAccess(t.tab_access.includes("Daily Data") || t.tab_access.includes("Create/Update Daily Data"));
       const member = t.tab_access.filter((i)=> i === "Work BOQ");
        console.log(member)
        if(member[0] === "Work BOQ")
        {
          setAccess(true)
        }
      }
    })
   }, [user.data.id, user.role, team]);


  useEffect(() => {
    dispatch(updateWorkProgress(newworkProgress));
  }, [dispatch, newworkProgress]);

  const handleOpen = () => {
    setType("New");
    setOpen(true);
  };

  const handleChange = (prop) => (event) => {
    if(type === 'New')
    {
     if(prop === 'title' && event.target.value !== undefined){
        let wo = workBOQ.find((vname) => vname.workItem === event.target.value);
        setValues({ ...values, [prop]: event.target.value, 'itemId': wo.id, 'unit': wo.unit, 'planQty': wo.quantity });
     }else if(event.target.value !== undefined){
        setValues({ ...values, [prop]: event.target.value });
     }
    }else {
     if(prop === 'title' && event.target.value !== undefined){
        let wo = workBOQ.find((vname) => vname.workItem === event.target.value);
        setValues({ ...values, [prop]: event.target.value,'itemId': wo.id, 'unit': wo.unit, 'planQty': wo.quantity });
      }else if(event.target.value !== undefined){
        setValues({ ...values, [prop]: event.target.value });
      }
    }
  };

  const handleChangeQty = (prop) => (event) => {
    setTillExec(event.target.value)
  }

  function getExcecutedQty(data){
    if(data.totalExecuted === undefined || data.totalExecuted === 0 || data.totalExecuted < 0){
      dispatch(getExecutableQty({projectId, itemId : data.id})).then((response) => {
        setTillExec(response.payload)
      });
    }else if(data.quantity < data.totalExecuted){
      dispatch(getExecutableQty({projectId, itemId : data.id})).then((response) => {
        setTillExec(response.payload)
      });
    }else{
      setTillExec(data.totalExecuted)
    }
  }

  function handleOpenList( id,title, valueType, unit, itemId, planQty, executedQty, percentage, description) {
    let filterItem = workBOQ.filter((wb)=> wb.id === itemId);

    setType("Edit");
    setOpen(true);
    setList({ id, title, valueType, unit, itemId, planQty, executedQty, percentage, description });
    setValues({ title, unit, itemId, valueType, planQty, executedQty, percentage, description });
  
    if(filterItem.length > 0){
      if(filterItem[0].totalExecuted === undefined || filterItem[0].totalExecuted === 0 || filterItem[0].totalExecuted < 0){
        dispatch(getExecutableQty({projectId, itemId})).then((response) => {
          setTillExec(response.payload)
        });
      }else{
        setTillExec(filterItem[0].totalExecuted)
      }
    }else{
      dispatch(getExecutableQty({projectId, itemId})).then((response) => {
        setTillExec(response.payload)
      });
    }
  }

  const handleClose = () => {
    setOpen(false);
    setValues({
        title: "",
        unit: "",
        itemId: "",
        valueType: "",
        planQty: 0,
        executedQty: "",
        percentage: 0,
        description: "",
    });
  };

  function listChange() {
    let workProgress1 = JSON.parse(JSON.stringify(workProgress));
    let filterwp = workProgress.filter((wkp)=> wkp.title !== list.title);
    let wp = filterwp.filter((wkp)=> wkp.title === values.title);

    if(tillExec > values.planQty){
      dispatchWarningMessage(dispatch, "Executed Qty greater than plan Qty.")
    }else if (values.executedQty > (values.planQty - tillExec + list.executedQty)) {
      dispatchWarningMessage(dispatch, `Executed Qty is greater than available Qty. Available Quantity ${values.planQty - tillExec + list.executedQty}`)
    }

    if(wp.length > 0){
      dispatchWarningMessage(dispatch, "Entry for selected Item already added. Please Check.")
    } else {
      workProgress1.forEach((item) => {
        if (item._id === list.id) {
          let percentage = (values.executedQty / values.planQty) * 100; 
          item.title = values.title;
          item.unit = values.unit;
          item.itemId = values.itemId;
          item.valueType = values.valueType;
          item.planQty = Number(values.planQty);
          item.executedQty = Number(values.executedQty);
          item.percentage = percentage.toFixed(2);
          item.description = values.description;
          item.totalExecuted = Number(tillExec) + (Number(values.executedQty) - Number(list.executedQty));
        }
      });

      if(props.data.Dialogtype === 'edit')
      {
        setOpen(false);
        dispatch(updateWorkProgressData({ projectId, "type":"update", reportId:props.data.data._id,Data:workProgress1})).then(
          (response) => {
            let temp = {
              workItem: values.title,
              unit: values.unit, 
              quantity: Number(values.planQty),
              totalExecuted: Number(tillExec) + (Number(values.executedQty) - Number(list.executedQty)),
            }
            dispatch(updateItem({ projectId, data : temp, workBOQId: values.itemId }))
            setValues(initialState);
            dispatch(getDetailReport({ projectId,reportId:props.data.data._id})).then(
              (response) => {
                let row = {
                  "_id": response.payload._id,
                  "createdAt": response.payload.createdAt,
                  "submittedDate": response.payload.submittedDate,
                  "approvalDate": response.payload.approvalDate,
                  "status": response.payload.status === 0 ? 'Inactive' :response.payload.status === 1 ? 'New' : response.payload.status === 2 ? 'Submitted' :response.payload.status === 3 ? 'Approved' : response.payload.status === 4 ? 'Reverted':null,
                }
                dispatch(openEditDialog(row));
              }
            );
          }
        );
      }else{
        setOpen(false);
      }
    }
  }
  
  function addList() {
    let wp = workProgress.filter((wkp)=> wkp.title === values.title);

    if(tillExec > values.planQty){
      dispatchWarningMessage(dispatch, "Executed Qty greater than plan Qty.")
    }else if (values.executedQty > (values.planQty - tillExec)) {
      dispatchWarningMessage(dispatch, `Executed Qty is greater than available Qty. Available Quantity ${(Number(values.planQty) - Number(tillExec)).toFixed(2)}`)
    }

    if(wp.length > 0){
      dispatchWarningMessage(dispatch, "Entry for selected Item already added. Please Check.")
    } else {
      let data;
      let percentage = (values.executedQty / values.planQty) * 100; 
        data = {
            title: values.title,
            valueType: values.valueType,
            unit: values.unit,
            itemId: values.itemId,
            planQty: Number(values.planQty),
            executedQty: Number(values.executedQty),
            percentage: percentage.toFixed(2),
            description: values.description,
            totalExecuted: Number(tillExec) + Number(values.executedQty),
        };

      setValues(initialState);
      
      if(props.data.Dialogtype === 'edit')
      {
        dispatch(addWorkProgressData({ projectId, reportId:props.data.data._id,Data:data})).then(
          (response) => {
            let temp = {
              workItem: values.title,
              unit: values.unit, 
              quantity: Number(values.planQty),
              totalExecuted: Number(tillExec) + Number(values.executedQty),
            }
            dispatch(updateItem({ projectId, data : temp, workBOQId: values.itemId }))
            dispatch(getDetailReport({ projectId,reportId:props.data.data._id})).then(
              (response) => {
                let row = {
                  "_id": response.payload._id,
                  "createdAt": response.payload.createdAt,
                  "submittedDate": response.payload.submittedDate,
                  "approvalDate": response.payload.approvalDate,
                  "status": response.payload.status === 0 ? 'Inactive' :response.payload.status === 1 ? 'New' : response.payload.status === 2 ? 'Submitted' :response.payload.status === 3 ? 'Approved' : response.payload.status === 4 ? 'Reverted':null,
                }
                dispatch(openEditDialog(row));
              }
            );
          }
        );
      }else{
        let bodyFormData = new FormData();
        bodyFormData.set("wing", "");
        bodyFormData.set("building", "");
        bodyFormData.set("floor", "");
        bodyFormData.set("flat", "");
        bodyFormData.set("inventory", JSON.stringify([]));
        bodyFormData.set("labour", JSON.stringify([]));
        bodyFormData.set("hindrance", JSON.stringify([]));
        bodyFormData.set("sitevisitor", JSON.stringify([]));
        bodyFormData.set("staff", JSON.stringify([]));
        bodyFormData.set("notes", JSON.stringify([]));
        bodyFormData.set("consumption", JSON.stringify([]));
        bodyFormData.set("equipment", JSON.stringify([]));
        bodyFormData.set("workProgress", JSON.stringify([data]));
        bodyFormData.set("existingAttachments", JSON.stringify([]));
        bodyFormData.append("attachments", '');
        bodyFormData.set("date", props.date);

        dispatch(saveReport({ projectId, formData: bodyFormData })).then(
          (response) => {
            let temp = {
              workItem: values.title,
              unit: values.unit, 
              quantity: Number(values.planQty),
              totalExecuted:  Number(tillExec) + Number(values.executedQty),
            }
            dispatch(updateItem({ projectId, data : temp, workBOQId: values.itemId }))
            if(response.payload === undefined)
            {
              setOpen(false);
              props.onClose();
            }else{
              dispatch(getDetailReport({ projectId: projectId, reportId: response.payload._id })).then(
                () => {
                  dispatch(closeNewDialog())
                  dispatch(openEditDialog(response.payload));
                }
              );
            }
          }
        );
      }
    }
  }

  function deleteList(id) {
    if(props.data.Dialogtype === 'edit')
    {
      setDelete1(true);
      setWorkProgressId(id);
    }else{
      let workProgress = JSON.parse(JSON.stringify(workProgress));
      let deletedWorkProgress = workProgress.filter((item) => item._id !== id);
      setNewWorkProgress(deletedWorkProgress);
    }
  }
 

  function deleteWorkProgress() {
    let lat = JSON.parse(JSON.stringify(workProgress));
    let deletedWorkProgress = lat.filter((item) => item._id !== workProgressId);
    setDelete1(false);

    let workProgressData = lat.filter((item) => item._id === workProgressId);
    let exeCount = 0;
    if(workProgressData.length > 0){
      if(workProgressData[0].totalExecuted === undefined || workProgressData[0].totalExecuted === 0 ){
        dispatch(getExecutableQty({projectId, itemId : workProgressData[0].itemId})).then((response) => {
          exeCount = response.payload;
        });
      }else{
        exeCount = workProgressData[0].totalExecuted;
      }
    }

    dispatch(updateWorkProgressData({ projectId,"type":"delete", reportId:props.data.data._id,Data:deletedWorkProgress})).then(
      (response) => {
        let temp = {
          workItem: workProgressData[0].title,
          unit: workProgressData[0].unit, 
          quantity: Number(workProgressData[0].planQty),
          totalExecuted: Number(exeCount) - Number(workProgressData[0].executedQty),
        }
        dispatch(updateItem({ projectId, data : temp, workBOQId: workProgressData[0].itemId }))
        dispatch(getDetailReport({ projectId,reportId:props.data.data._id})).then(
          (response) => {
            let row = {
              "_id": response.payload._id,
              "createdAt": response.payload.createdAt,
              "submittedDate": response.payload.submittedDate,
              "approvalDate": response.payload.approvalDate,
              "status": response.payload.status === 0 ? 'Inactive' :response.payload.status === 1 ? 'New' : response.payload.status === 2 ? 'Submitted' :response.payload.status === 3 ? 'Approved' : response.payload.status === 4 ? 'Reverted':null,
            }
            dispatch(openEditDialog(row));
          }
        );
      }
    );
  }

  const disableButton = () =>{
    return (
      values.title.length > 0 &&
      values.executedQty > 0
    );
  }

  props.onCountChange({ WorkProgress: workProgress.length });

  function redirectToWorkBOQ(){
    if(modules.length === 0 || modules.includes("Work BOQ")){
      if(access === true){
        handleClose()
        props.onClose();
        sessionStorage.setItem("boq", 'boq');
        dispatch(routes("Work-BOQ"))
      }else{
        dispatchWarningMessage(dispatch, "You don't have access to add a Item from Work BOQ.")
      }
    }else{
      dispatchWarningMessage(dispatch, "Please include Work BOQ module from Settings to Add Item.")
    }
  }

  if (!workProgress.length) {
    return (
      <div className="flex flex-1 items-center justify-center h-full">
        <Typography color="textSecondary" variant="h5">
          There are no Work Activity Data!
        </Typography>
        <Fab
          color="primary"
          aria-label="add"
          disabled={createAccess === true ? false :true}
          className={classes.addButton}
          onClick={handleOpen}
        >
          <Icon>add</Icon>
        </Fab>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <Backdrop className={classes.backdrop} open={loading}>
           <CircularProgress color="inherit" />
          </Backdrop>
          {type === "Edit" ? (
            <DialogTitle id="alert-dialog-title">{"Update Data"}</DialogTitle>
          ) : (
            <DialogTitle id="alert-dialog-title">{"Add Data"}</DialogTitle>
          )}
          <DialogContent>
          <div className='flex flex-1 flex-col gap-8 w-full mt-10'> 
            <FormControl fullWidth variant="outlined">
              <InputLabel id="demo-simple-select-outlined-label">
                Select Item
              </InputLabel>
              <Select
                fullWidth
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={values.title}
                onChange={handleChange("title")}
                label="Item Work"
              >
                {workBOQ.map((wo) => (
                  <MenuItem key={wo.id} value={wo.workItem} onClick={()=> getExcecutedQty(wo)}>
                    <Typography>{wo.workItem}</Typography>
                  </MenuItem>
                ))}
                <Link
                  className="cursor-pointer ml-10 mt-10 mb-10"
                  onClick={() => { redirectToWorkBOQ() }}
                >
                  Click here to Add New Item
                </Link>
              </Select>
            </FormControl>

           {values.title !== ''?
           <>
              <div className="grid grid-cols-2 divide-x divide-gray-400">
                <TextField
                  variant="outlined"
                  className="w-1 mr-10 my-4"
                  label="Unit"
                  disabled
                  value={values.unit}
                  onChange={handleChange("unit")}
                />
                <TextField
                  variant="outlined"
                  className="w-1 ml-10 my-4"
                  label="Planned Qty"
                  type="Number"
                  disabled
                  value={values.planQty}
                  onChange={handleChange("planQty")}
                />
              </div>
              
              <div className="grid grid-cols-2 divide-x divide-gray-400">
                <TextField
                  variant="outlined"
                  className="w-1 mr-10 my-4"
                  label="Till Executed Qty"
                  type="Number"
                  disabled
                  value={tillExec}
                  onChange={handleChangeQty("tillQty")}
                />
                <TextField
                  variant="outlined"
                  className="w-1 ml-10 my-4"
                  label="Today's Executed Qty"
                  type="Number"
                  value={values.executedQty}
                  onChange={handleChange("executedQty")}
                />
              </div>
           </>: null}
           
            <TextField
              variant="outlined"
              multiline
              rows="2"
              className="my-10"
              label="Description"
              value={values.description}
              onChange={handleChange("description")}
            />
              
          </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              CLOSE
            </Button>
            {type === "Edit" ? (
              <Button disabled={!disableButton()} onClick={() => listChange()} color="primary" autoFocus>
                UPDATE
              </Button>
            ) : (
              <Button disabled={!disableButton()} onClick={() => addList()} color="primary" autoFocus>
                ADD
              </Button>
            )}
          </DialogActions>
        </Dialog>
      </div>
    );
  }
  return (
    <React.Fragment>
      <List
        component="nav"
        // className={classes.root}
        aria-label="mailbox folders"
      >
        {workProgress.map((item) => (
          <React.Fragment>
            <Grid container alignItems="center" direction="row">
              <Grid item xs={11}>
                <ListItem
                  button
                  key={item._id}
                  //onTouchTap={handleTouchTap(item.id)}
                  onClick={createAccess ? (ev) => {
                    handleOpenList(
                      item._id,
                      item.title,
                      item.valueType,
                      item.unit,
                      item.itemId,
                      item.planQty,
                      item.executedQty,
                      item.percentage,
                      item.description,
                    );
                  }: () => dispatchWarningMessage(dispatch, "You do not have access to update Work Activity. Contact Project Owner.")}
                >
                  <ListItemText
                    primary={item.title}
                    secondary={
                      <>
                        <Typography>
                          {item.unit ? item.executedQty + " " + item.unit : null}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              </Grid>
              <Grid item xs={1}>
                <IconButton
                  onClick={deleteAccess ? () => deleteList(item._id):
                    () => dispatchWarningMessage(dispatch, "You do not have access to delete this entry. Contact Project Owner.")}
                  variant="contained"
                >
                  <Icon className={classes.delete}>delete</Icon>
                </IconButton>
              </Grid>
            </Grid>
          </React.Fragment>
        ))}
      </List>

      <Fab
        color="primary"
        aria-label="add"
        disabled={createAccess === true ? false :true}
        className={classes.addButton}
        onClick={handleOpen}
      >
        <Icon>add</Icon>
      </Fab>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Backdrop className={classes.backdrop} open={loading}>
          <CircularProgress color="inherit" />
        </Backdrop>
        {type === "Edit" ? (
          <DialogTitle id="alert-dialog-title">{"Update Work Activity"}</DialogTitle>
        ) : (
          <DialogTitle id="alert-dialog-title">{"Add Work Activity"}</DialogTitle>
        )}
        <DialogContent>
        <div className='flex flex-1 flex-col gap-8 w-full mt-10'>
            <FormControl fullWidth variant="outlined">
               <InputLabel id="demo-simple-select-outlined-label">
                 Select Item
               </InputLabel>
               <Select
                 fullWidth
                 labelId="demo-simple-select-outlined-label"
                 id="demo-simple-select-outlined"
                 value={values.title}
                 onChange={handleChange("title")}
                 label="Item Work"
                >
                  {workBOQ.map((wo) => (
                    <MenuItem
                      key={wo.id}
                      value={wo.workItem}
                      onClick={()=> getExcecutedQty(wo)}
                    >
                      <Typography>{wo.workItem}</Typography>
                    </MenuItem>
                  ))}
                  <Link
                    className="cursor-pointer ml-10 mt-10 mb-10"
                    onClick={() => { 
                      redirectToWorkBOQ();
                    }}
                  >
                    Click here to Add New Item
                  </Link>
                </Select>
            </FormControl>
           {values.title !== ''?
           <>
              <div className="grid grid-cols-2 divide-x divide-gray-400">
                <TextField
                  variant="outlined"
                  className="w-1 mr-10 my-4"
                  label="Unit"
                  disabled
                  value={values.unit}
                  onChange={handleChange("unit")}
                />
                <TextField
                  variant="outlined"
                  className="w-1 ml-10 my-4"
                  label="Planned Qty"
                  type="Number"
                  disabled
                  value={values.planQty}
                  onChange={handleChange("planQty")}
                />
              </div>
              
              <div className="grid grid-cols-2 divide-x divide-gray-400">
                <TextField
                  variant="outlined"
                  className="w-1 mr-10 my-4"
                  label="Till Executed Qty"
                  type="Number"
                  disabled
                  value={tillExec}
                  onChange={handleChangeQty("tillQty")}
                />
                <TextField
                  variant="outlined"
                  className="w-1 ml-10 my-4"
                  label="Today's Executed Qty"
                  type="Number"
                  value={values.executedQty}
                  onChange={handleChange("executedQty")}
                />
              </div>
           </>: null}
              
            <TextField
              variant="outlined"
              multiline
              rows="2"
              className="my-10"
              label="Description"
              value={values.description}
              onChange={handleChange("description")}
            />
              
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            CLOSE
          </Button>
          {type === "Edit" ? (
            <Button disabled={!disableButton()} onClick={() => listChange()} color="primary" autoFocus>
              UPDATE
            </Button>
          ) : (
            <Button disabled={!disableButton()} onClick={() => addList()} color="primary" autoFocus>
              ADD
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <Dialog open={delete1}>
        <Backdrop className={classes.backdrop} open={loading}>
         <CircularProgress color="inherit" />
       </Backdrop>
       <DialogTitle id="alert-dialog-slide-title">
         Do you want to delete Work Activity Entry ?
       </DialogTitle>
       <DialogActions>
          <Button
            onClick={() => {
            setDelete1(false);
           }}
           color="primary"
          >
           No
          </Button>
          <Button
           onClick={() => {deleteWorkProgress()}}
           color="primary"
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default WorkProgress;
