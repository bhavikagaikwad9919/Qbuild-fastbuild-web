import React from "react";
import { useSelector } from "react-redux";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import FuseAnimateGroup from "@fuse/core/FuseAnimateGroup";
import moment from "moment";
import Tasks from "./Tasks";
import DailyReport from "./daily-report/DailyReport";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";

const useStyles = makeStyles({
  centerText: {
    textAlign: "center",
  },
});

function Dashboard(props) {
  const classes = useStyles();
  const team = useSelector(({ projects }) => projects.details.team);
  const plans = useSelector(({ projects }) => projects.details.plans);
  // const report = useSelector(({ reports }) => reports.reports.report);
  let issues = [];
  let newReport = [];
  let issuesCount = 0;
  let activeIssueCount = 0;

  plans.forEach((plan) => {
    plan.issues.forEach((issue) => {
      // issuesCount = issuesCount + 1;
      issuesCount++;
      if (issue.status === "Active") {
        activeIssueCount++;
      }
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
      issue.startDate = moment(issue.startDate).format("DD-MM-YYYY, hh:mm A");
      issue.endDate = moment(issue.endDate).format("DD-MM-YYYY, hh:mm A");
    }
  });

  // report.forEach((element) => {
  //   if (element.status === 3) {
  //     newReport.push({ element });
  //   }
  // });

  return (
    <FuseAnimateGroup
      className="flex flex-wrap"
      enter={{
        animation: "transition.slideUpBigIn",
      }}
    >
      <div className="widget flex w-full sm:w-1/2 md:w-1/4 p-12">
        <Paper className="w-full rounded-8 shadow-none border-1">
          <div className="text-center py-8">
            <Typography
              className={clsx(classes.centerText, "text-60 leading-none ")}
              color="Primary"
            >
              {team.length}
            </Typography>
          </div>
          <div className="flex items-center py-8 border-t-1">
            <Typography
              className={clsx(
                classes.centerText,
                "text-15 items-center w-full"
              )}
              color="textSecondary"
            >
              Team Member
            </Typography>
          </div>
        </Paper>
      </div>
      <div className="widget flex w-full sm:w-1/2 md:w-1/4 p-12">
        <Paper className="w-full rounded-8 shadow-none border-1">
          <div className="text-center py-8">
            <Typography
              className={clsx(classes.centerText, "text-60 leading-none ")}
              color="Primary"
            >
              {plans.length}
            </Typography>
          </div>
          <div className="flex items-center py-8 border-t-1">
            <Typography
              className={clsx(
                classes.centerText,
                "text-15  items-center w-full"
              )}
              color="textSecondary"
            >
              Project Plans
            </Typography>
          </div>
        </Paper>
      </div>
      <div className="widget flex w-full sm:w-1/2 md:w-1/4 p-12">
        <Paper className="w-full rounded-8 shadow-none border-1">
          <div className="text-center py-8">
            <Typography
              className={clsx(classes.centerText, "text-60 leading-none")}
              color="Primary"
            >
              {activeIssueCount}
            </Typography>
          </div>
          <div className="flex items-center border-t-1 py-8">
            <Typography
              className={clsx(
                classes.centerText,
                "text-15  items-center w-full "
              )}
              color="textSecondary"
            >
              Active Tasks
            </Typography>
          </div>
        </Paper>
      </div>
      <div className="widget flex w-full sm:w-1/2 md:w-1/4 p-12">
        <Paper className="w-full rounded-8 shadow-none border-1">
          <div className="text-center py-8">
            <Typography
              className={clsx(classes.centerText, "text-60 leading-none ")}
              color="Primary"
            >
              {issuesCount}
            </Typography>
          </div>
          <div className="flex items-center border-t-1 py-8">
            <Typography
              className={clsx(classes.centerText, "text-15  w-full")}
              color="textSecondary"
            >
              Total Tasks
            </Typography>
          </div>
        </Paper>
      </div>
      <div className="flex flex-col w-full border-t-1 mt-12">
        <Typography
          className={clsx(classes.centerText, "my-12 text-15  w-full")}
          color="Primary"
        >
          Tasks Table
        </Typography>
        <Tasks />
        <Typography
          className={clsx(classes.centerText, "my-12 text-15  w-full")}
          color="Primary"
        >
          Daily-Report Table
        </Typography>
        <DailyReport />
      </div>
      <div>
        {/* <ReactTable
          filterable
          className='-striped -highlight h-full sm:rounded-16 overflow-hidden'
          getTrProps={(state, rowInfo, column) => {
            return {
              className: '-striped -highlight',
            };
          }}
          data={report}
          columns={[
            {
              Header: 'Report Date',
              accessor: 'createdAt',
              className: 'font-bold',
              Cell: ({ row }) => <a>{row.createdAt}</a>,
            },
            {
              Header: 'Status',
              id: 'status',
              accessor: (d) => d.status,
              getProps: (state, rowInfo) => {
                if (rowInfo && rowInfo.row) {
                  if (rowInfo.row.status === '3') {
                    return {
                      style: {
                        color: 'orange',
                      },
                    };
                  }
                }
                return {};
              },
              className: 'font-bold',
            },
          ]}
          //defaultPageSize={10}
          noDataText='No Daily-Report found'
        /> */}
      </div>
      {/* <ReactTable
        // filterable
        className='-striped -highlight h-200 w-full sm:rounded-16 overflow-hidden'
        data={issues}
        columns={[
          {
            Header: 'Name',
            className: 'font-bold',
            accessor: 'taskName',
          },
          {
            Header: 'Reported Date',
            accessor: 'startDate',
          },
          {
            Header: 'Due Date',
            accessor: 'endDate',
          },
          {
            Header: 'Plan Name',
            accessor: 'planName',
          },
          {
            Header: 'Status',
            accessor: 'status',
            getProps: (state, rowInfo) => {
              if (rowInfo && rowInfo.row) {
                return {
                  style: {
                    color:
                      rowInfo.row.status === 'Active'
                        ? 'green'
                        : 'Deleted'
                        ? 'red'
                        : null,
                  },
                };
              }
              return {};
            },
          },
        ]}
        defaultPageSize={10}
        noDataText='No Task found'
      /> */}
    </FuseAnimateGroup>
  );
}

export default Dashboard;
