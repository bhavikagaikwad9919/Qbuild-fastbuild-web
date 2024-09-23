import React, { useState,useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Fab, Icon, Button } from "@material-ui/core";
import FuseAnimate from "@fuse/core/FuseAnimate";
import { useDispatch, useSelector } from "react-redux";
import ReactTable from "react-table-6";
import Paper from "@material-ui/core/Paper";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import MilestoneDialog from "./milestoneDialog";
import Typography from "@material-ui/core/Typography";
import { detailMilestone, openNewDialog, openEditDialog } from "app/main/projects/store/projectsSlice";
import { dispatchWarningMessage } from "app/utils/MessageDispatcher";

const useStyles = makeStyles((theme) => ({
  addButton: {
    position: "fixed",
    right: 40,
    bottom: 5,
    zIndex: 99,
  },
  root: {
    maxHeight: "68vh",
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 3,
    color: "#fff",
  },
}));

function Milestone(props) {
  const classes = useStyles(props);
  const dispatch = useDispatch();
  const loading = useSelector(({ projects }) => projects.loading);
  const [access, setAccess] = useState();
  const team = useSelector(({ projects }) => projects.details.team);
  const role = useSelector(({ auth }) => auth.user);
  const milestone = useSelector(({ projects }) => projects.milestones.milestonesList);
  const projectId = useSelector(({ projects }) => projects.details._id);

  useEffect(() => {
    team.forEach((t)=>{
      if((t._id === role.data.id && t.role === "owner") || role.role === 'admin')
      {
        setAccess(true)
      }else if(t._id === role.data.id && t.role !== "owner")
      {
         const member=t.tab_access.filter((i)=>i === "Milestones");
         console.log(member)
         if(member[0] === "Milestones")
         {
           setAccess(true)
         }
      }
   })
}, [access, role.data.id, role.role, team]);

  const openDialog = async (data) => {
    await dispatch(detailMilestone({projectId, milestoneId:data.id}));
    dispatch(openEditDialog(data));
  }

  return (
    <React.Fragment>
      <Paper className="w-full rounded-8 shadow-1">
        <div className="flex items-center justify-between px-16 h-64 border-b-1">
          <Typography className="text-16">Milestones</Typography>
          {access?
            <Button color="primary" onClick={() => dispatch(openNewDialog())} variant="contained" className="mb-8" style={{padding:'3px 16px'}} nowrap="true">Add Milestone</Button> 
          :null}
          </div>
        <FuseAnimate animation="transition.slideUpIn" delay={100}>
          <ReactTable
            className={classes.root}
            getTrProps={(state, rowInfo, column) => {
              return {
                className: "-striped -highlight items-center justify-center",
              };
            }}
            // className={clsx(classes.root)}
            data={milestone}
            // pageSize={team.length}
            columns={[
              {
                Header: "Title",
                accessor: "title",
                style: { 'white-space': 'unset' },
                Cell: ({ row }) => (
                  <Typography
                    className="font-bold hover:underline cursor-pointer"
                    color="secondary"
                    onClick={access ? () => {
                      openDialog(row._original)
                    }:() => dispatchWarningMessage(dispatch, "You don't have an access to view or update Milestone Entry.")}
                  >
                    {row.title}
                  </Typography>
                ),
                className: "font-bold",
              },
              {
                Header: "Start Date",
                accessor: "startDate",
              },
              {
                Header: "End Date",
                accessor: "endDate",
                className: "justify-center",
              },
            ]}
            defaultPageSize={10}
            noDataText="No Milestones found"
          />
        </FuseAnimate>
        <Backdrop className={classes.backdrop} open={loading}>
          <CircularProgress color="inherit" />
        </Backdrop>
     
        <FuseAnimate animation="transition.expandIn" delay={300}>
          <Fab
            color="primary"
            aria-label="add"
            className={classes.addButton}
            onClick={() => {
              dispatch(openNewDialog())
            }}
            disabled={access === true ? false :true}
          >
            <Icon>add</Icon>
          </Fab>
        </FuseAnimate>
      </Paper>
        <MilestoneDialog />
    </React.Fragment>
  );
}

export default Milestone;
