import React, { useState } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";
import Icon from "@material-ui/core/Icon";
import { Typography } from "@material-ui/core";
import FuseAnimate from "@fuse/core/FuseAnimate";
import FuseLoading from "@fuse/core/FuseLoading";
import moment from "moment";
import { useSelector } from "react-redux";
import ReactTable from "react-table-6";

const useStyles = makeStyles((theme) => ({
  addButton: {
    position: "fixed",
    right: 12,
    bottom: 12,
    zIndex: 99,
  },
}));

function Tasks(props) {
  const classes = useStyles();
  const plans = useSelector(({ projects }) => projects.details.plans);
  const routes = useSelector(({ projects }) => projects.routes);
  // const [show, setShow] = useState(false);
  // if (routes === 'Tasks' ? setShow(true) : setShow(false));
  let issues = [];
  plans.forEach((plan) => {
    plan.issues.forEach((issue) => {
      issues.push({
        planName: plan.name,
        taskName: issue.title,
        startDate: issue.startDate,
        endDate: issue.endDate,
        status: issue.status,
      });
    });
  });

  issues.forEach((issue) => {
    if (issue.startDate === null) {
      issue.startDate = "-";
      issue.endDate = "-";
    } else {
      issue.startDate = moment(issue.startDate).format("DD-MM-YYYY hh:mm A");
      issue.endDate = moment(issue.endDate).format("DD-MM-YYYY hh:mm A");
    }
  });

  //const [data, setData] = useState(issues);

  if (!plans) {
    return <FuseLoading />;
  }

  return (
    // <h1>TEAM</h1>
    <>
      <FuseAnimate animation="transition.slideUpIn" delay={100}>
        <ReactTable
          filterable={routes === "Tasks" ? true : false}
          showPagination={routes === "Tasks" ? true : false}
          className="-striped -highlight  overflow-hidden"
          data={issues}
          columns={[
            {
              Header: "Name",
              //className: 'font-bold',
              accessor: "taskName",
            },
            {
              Header: "Reported Date",
              accessor: "startDate",
            },
            {
              Header: "Due Date",
              accessor: "endDate",
            },
            {
              Header: "Plan Name",
              accessor: "planName",
            },
            {
              Header: "Status",
              id: "status",
              accessor: (d) => (
                <Typography
                  className={
                    d.status === "Deleted"
                      ? "bg-red-700 text-white inline p-4 rounded truncate"
                      : d.status === "Active"
                      ? "bg-green-700 text-white inline p-4 rounded truncate"
                      : "bg-purple-700 text-white inline p-4 rounded truncate "
                  }
                >
                  {d.status}
                </Typography>
              ),
            },
          ]}
          defaultPageSize={routes === "Tasks" ? 10 : 5}
          noDataText="No Task found"
        />
      </FuseAnimate>
      <FuseAnimate animation="transition.expandIn" delay={300}>
        {/* <div className ="flex flex-col flex-auto relative"> */}
        <Fab
          color="primary"
          aria-label="add"
          className={classes.addButton}
          onClick
        >
          <Icon>add</Icon>
        </Fab>
      </FuseAnimate>
    </>
  );
}

export default Tasks;
