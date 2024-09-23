import FuseAnimate from "@fuse/core/FuseAnimate";
import FuseAnimateGroup from "@fuse/core/FuseAnimateGroup";
import Fab from "@material-ui/core/Fab";
import Icon from "@material-ui/core/Icon";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CircularProgress from "@material-ui/core/CircularProgress";
import Backdrop from "@material-ui/core/Backdrop";
import {
  listTasks,
  deleteTasks,
  openNewDialog,
} from "app/main/projects/store/projectsSlice";
import Paper from "@material-ui/core/Paper";
import TaskListItem from "./TaskListItem";
import TaskDialog from "./TaskDialog";
import Input from "@material-ui/core/Input";
import clsx from "clsx";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import FuseLoading from "@fuse/core/FuseLoading";
import { InputLabel } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
  root: {
    // display: "flex-container",
    // maxHeight: "68vh",
    // backgroundColor: theme.palette.background.paper,
  },
  list: {
    display: "flex",
    overflow: "auto",
    // maxHeight: "60vh",
  },
  addButton: {
    position: "fixed",
    right: 40,
    bottom: 5,
    zIndex: 99,
  },
  deleteButton: {
    position: "fixed",
    right: 100,
    bottom: 5,
    zIndex: 99,
    color: "white",
    backgroundColor: "red",
  },
  delete: {
    color: "red",
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

function TaskList(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const projectId = useSelector(({ projects }) => projects.details._id);
  const tasks = useSelector(({ projects }) => projects.tasks.tasksArray);
  const team = useSelector(({ projects }) => projects.details.team);
  const loading = useSelector(({ projects }) => projects.loading);
  const [filteredTask, setFilteredTask] = useState(tasks);
  const [searchText, setSearchText] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState({
    status: "",
    assignedTo: "",
  });
  const [pageLoading, setLoading] = useState(false);
  const [access, setAccess] = useState();
  const role = useSelector(({ auth }) => auth.user);
  
  useEffect(() => {
    team.forEach((t)=>{
      if((t._id === role.data.id && t.role === "owner") || role.role === 'admin')
      {
        setAccess(true)
      }else if(t._id === role.data.id && t.role !== "owner")
      {
         const member=t.tab_access.filter((i)=>i === "Tasks");
         console.log(member)
         if(member[0] === "Tasks")
         {
           setAccess(true)
         }
      }
   })
  }, [access]);

  useEffect(() => {
    setFilteredTask(tasks);
  }, [tasks]);

  useEffect(() => {
    if (filter.status !== "" || filter.assignedTo !== "") {
      setLoading(true);
      let newFilter = {};
      if (filter.status !== "") {
        newFilter.status = filter.status;
      } else {
        newFilter.status = undefined;
      }
      if (filter.assignedTo !== "") {
        let member = team.find((member) => member.name === filter.assignedTo);
        newFilter.assignedTo = member._id;
      } else {
        newFilter.assignedTo = "";
      }

      dispatch(listTasks({ projectId, filter: newFilter })).then((response) => {
        setLoading(false);
      });
    } else {
      if (props.features !== "off") {
        dispatch(listTasks({ projectId })).then((response) => {
          setLoading(false);
        });
      }
    }
  }, [filter]);

  const handleAssignChange = (event) => {
    if (event.target.value === "") {
      setFilter({ ...filter, assignedTo: event.target.value });
    } else {
      let member = team.find((member) => member.name === event.target.value);
      if (filter.assignedTo !== member._id) {
        setFilter({ ...filter, assignedTo: event.target.value });
      }
    }
  };
  const handleStatusChange = (event) => {
    setFilter({ ...filter, status: event.target.value });
  };

  const handleInputChange = (event) => {
    let newTasks = [];
    setFilteredTask([]);
    setSearchText(event.target.value);
    let sText = event.target.value;
    if (sText !== "") {
      tasks.forEach((task) => {
        if (task.title.includes(searchText)) {
          newTasks.push(task);
        }
      });

      setFilteredTask(newTasks);
    } else {
      setFilteredTask(tasks);
    }
  };

  const handleChange = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((_id) => _id !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  if (!filteredTask) {
    return <FuseLoading />;
  }

  return (
    <>
      <div className={clsx(classes.root)}>
        <Backdrop className={classes.backdrop} open={loading}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <div className="flex items-center justify-between px-16 h-48 border-b-1">
          <Typography className="text-16 font-bold">Tasks</Typography> 
          {access?
            <Button color="primary" onClick={() => dispatch(openNewDialog())} variant="contained" className="mb-8" style={{padding:'3px 16px'}} nowrap="true">Add Tasks</Button> 
          :null}
        </div>
        {props.features !== "off" ? (
          <div className="flex flex-1 w-full items-center justify-between ml-4 pr-8 mb-24 gap-12">
            <div className="w-1/3">
              <div
                className="search-input-wrapper flex items-center w-full px-16"
                elevation={1}
              >
                <Input
                  variant="outlined"
                  placeholder="Search..."
                  disableUnderline
                  fullWidth
                  inputProps={{
                    "aria-label": "Search",
                  }}
                  value={searchText}
                  onChange={(ev) => handleInputChange(ev)}
                />
                <Icon color="action">search</Icon>
              </div>
            </div>
            <div className="flex items-center w-1/3 shadow-none">
              <FormControl
                variant="outlined"
                fullWidth
                // className="rounded-8 h-44"
              >
                <InputLabel>Status</InputLabel>
                <Select
                  placeholder="Search..."
                  // className="rounded-8 search-item h-44 no-underline"
                  key="status"
                  label="status"
                  // style={{ backgroundColor: "white" }}
                  value={filter.status}
                  onChange={handleStatusChange}
                >
                  <MenuItem value="">None</MenuItem>
                  <MenuItem value="complete">Complete</MenuItem>
                  <MenuItem value="incomplete">Incomplete</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div className="w-1/3">
              <FormControl
                variant="outlined"
                fullWidth
                // className="rounded-8 h-44"
              >
                <InputLabel>Assigned To</InputLabel>
                <Select
                  placeholder="Search..."
                  // className="rounded-8 h-44"
                  style={{ backgroundColor: "white" }}
                  label="Assigned To"
                  variant="outlined"
                  value={filter.assignedTo}
                  onChange={handleAssignChange}
                >
                  <MenuItem value="">None</MenuItem>
                  {team.map((member) => (
                    <MenuItem value={member.name}>{member.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </div>
        ) : null}
        {filteredTask.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            {/* <Paper className='w-full h-full rounded-8 shadow-1'> */}
            <Typography color="textSecondary" variant="h5">
              No tasks yet!
            </Typography>
            {/* </Paper> */}
          </div>
        ) : (
          <div className={clsx(classes.list)}>
            {pageLoading ? (
              <div className="flex flex-1 items-center justify-center h-full">
                <CircularProgress color="secondary" />
              </div>
            ) : (
              <Paper className="w-full shadow-1 h-full">
                <List className="p-0">
                  <FuseAnimateGroup
                    enter={{
                      animation: "transition.slideUpBigIn",
                    }}
                  >
                    {filteredTask.map((todo) => (
                      <TaskListItem
                        todo={todo}
                        key={todo._id}
                        onIdSelect={handleChange}
                        ids={selectedIds}
                      />
                    ))}
                  </FuseAnimateGroup>
                </List>
              </Paper>
            )}
          </div>
        )}
        <TaskDialog />
      </div>

      {props.features !== "off" ? (
        <>
          {selectedIds.length ? (
            <FuseAnimate animation="transition.expandIn" delay={300}>
              <Fab
                className={classes.deleteButton}
                // color="danger"
                aria-label="delete"
                onClick={() => setOpen(true)}
                disabled={access === true ? false :true}
              >
                <Icon>delete</Icon>
              </Fab>
            </FuseAnimate>
          ) : null}

          <FuseAnimate animation="transition.expandIn" delay={300}>
            <Fab
              color="primary"
              aria-label="add"
              className={classes.addButton}
              onClick={() => {
                dispatch(openNewDialog());
              }}
              disabled={access === true ? false :true}
            >
              <Icon>add</Icon>
            </Fab>
          </FuseAnimate>
         
        </>
      ) : null}
      <Dialog open={open}>
        <Backdrop className={classes.backdrop} open={loading}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <DialogTitle id="alert-dialog-slide-title">
          Delete Selected Tasks ?
        </DialogTitle>
        <DialogActions>
          <Button
            onClick={() => {
              setOpen(false);
            }}
            color="primary"
          >
            No
          </Button>
          <Button
            onClick={() => {
              dispatch(deleteTasks({ projectId, values: selectedIds })).then(
                (response) => {
                  setSelectedIds([]);
                  setOpen(false);
                }
              );
            }}
            color="primary"
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default TaskList;
