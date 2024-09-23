import _ from "@lodash";
import Checkbox from "@material-ui/core/Checkbox";
import FuseUtils from "@fuse/utils";
import ListItem from "@material-ui/core/ListItem";
import Typography from "@material-ui/core/Typography";
import clsx from "clsx";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  openEditDialog,
  taskDetails,
} from "app/main/projects/store/projectsSlice";
import Chip from "@material-ui/core/Chip";
import moment from "moment";
import { makeStyles } from "@material-ui/core/styles";
import { dispatchWarningMessage } from "app/utils/MessageDispatcher";

const useStyles = makeStyles((theme) => ({
  taskTitle: {
    fontWeight: 600,
  },
}));

function TaskListItem(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const projectId = useSelector(({ projects }) => projects.details._id);
  const route = useSelector(({ projects }) => projects.routes);
  const team = useSelector(({ projects }) => projects.details.team);
  const [access, setAccess] = useState();
  const role = useSelector(({ auth }) => auth.user);
  
useEffect(() => {
    team.map((t)=>{
      if(t._id === role.data.id && t.role === "owner" || role.role === 'admin')
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

  return (
    <ListItem
      id={FuseUtils.generateGUID()}
      className={clsx("border-solid border-b-1 py-16 px-0 sm:px-8")}
      onClick={access?(ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        dispatch(taskDetails({ projectId, taskId: props.todo._id })).then(
          (response) => {
            dispatch(openEditDialog(response.payload));
          }
        );
      }:() => dispatchWarningMessage(dispatch, "You don't have access to view or update task details.")}
      dense
      button
    >
      {route === "Tasks" ? (
        <Checkbox
          tabIndex={-1}
          disableRipple
          checked={props.ids.includes(props.todo._id)}
          onClick={(ev) => {
            ev.stopPropagation();
            props.onIdSelect(props.todo._id);
          }}
        />
      ) : null}

      <div className="flex flex-1 justify-between">
        <div className="flex-col relative overflow-hidden px-8">
          <Typography
            variant="subtitle1"
            className={classes.taskTitle}
            color={props.todo.completed ? "textSecondary" : "inherit"}
          >
            {props.todo.title}
          </Typography>
          <div>
            <div className="flex flex-row gap-10">
              {props.todo.location ? (
                <>
                  <Typography
                    color="textSecondary"
                    className="todo-notes truncate"
                  >
                    Area: {props.todo.location}
                  </Typography>
                  <Typography>|</Typography>
                </>
              ) : null}

              {props.todo.assignedTo ? (
                <>
                  <Typography
                    color="textSecondary"
                    className="todo-notes truncate"
                  >
                    Assigned To: {props.todo.assignedTo}
                  </Typography>
                  <Typography>|</Typography>
                </>
              ) : null}
              {/* {props.todo.planIndex ? (
                <>
                  <Typography
                    color="textSecondary"
                    className="todo-notes truncate"
                  >
                    Index: {props.todo.planIndex}
                  </Typography>
                  <Typography>|</Typography>
                </>
              ) : null} */}
              <Typography color="textSecondary" className="todo-notes truncate">
                Reported By {props.todo.reportedBy}
              </Typography>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-10">
          {props.todo.status === 3 ? (
            <Chip
              size="small"
              style={{ backgroundColor: "green" }}
              label="Completed"
            />
          ) :props.todo.status === 5?
            <Chip
              size="small"
              style={{ backgroundColor: "purple-700" }}
              label="Supersede"
            />:
           (
            <Chip
              size="small"
              style={{ backgroundColor: "#ffcf4ca3" }}
              label="Open"
            />
          )}
          <Typography variant="caption">
            {moment(props.todo.uploadDate).format("DD-MM-YYYY, hh:mm A")}
          </Typography>
        </div>
      </div>
    </ListItem>
  );
}

export default React.memo(TaskListItem);
