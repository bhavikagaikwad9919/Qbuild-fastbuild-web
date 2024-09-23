import React,{ useState,useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Backdrop, CircularProgress, Fab, Icon, Button } from "@material-ui/core";
import FuseAnimate from "@fuse/core/FuseAnimate";
import FuseLoading from "@fuse/core/FuseLoading";
import Typography from "@material-ui/core/Typography";
import { useDispatch, useSelector } from "react-redux";
import ReactTable from "react-table-6";
import {
  openEditDialog,
  openNewDialog,
} from "app/main/projects/store/projectsSlice";
import Paper from "@material-ui/core/Paper";
import TeamDialog from "./TeamDialog";
import Avatar from "@material-ui/core/Avatar";
import { dispatchWarningMessage } from "app/utils/MessageDispatcher";
 
const useStyles = makeStyles((theme) => ({
  addButton: {
    position: "fixed",
    right: 40,
    bottom: 5,
    zIndex: 99,
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
  root: {
    maxHeight: "58vh",
  },
}));

function Team(props) {
  const classes = useStyles(props);
  const dispatch = useDispatch();
  const team = useSelector(({ projects }) => projects.details.team);
  const loading = useSelector(({ projects }) => projects.loading);

  const [access, setAccess] = useState();
  const role = useSelector(({ auth }) => auth.user);

  useEffect(() => {
    team.forEach((t)=>{
      if((t._id === role.data.id && t.role === "owner") || role.role === 'admin')
      {
        setAccess(true)
      }else if(t._id === role.data.id && t.role !== "owner")
      {
         const member=t.tab_access.filter((i)=>i === "Team");
         console.log(member)
         if(member[0] === "Team")
         {
           setAccess(true)
         }
      }
   })
}, [access, role.data.id, role.role, team]);

  if (!team) {
    return <FuseLoading />;
  }

  return (
    // <h1>TEAM</h1>

    <React.Fragment>
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Paper className="w-full rounded-8 shadow-1">
        <div className="flex items-center justify-between px-16 h-64 border-b-1">
          <Typography className="text-16">Team Members</Typography>  
          {access?
            <Button color="primary" onClick={() => dispatch(openNewDialog())} variant="contained" className="mb-8" style={{padding:'3px 16px'}} nowrap="true">Add Member</Button> 
          :null}
        </div>
        <FuseAnimate animation="transition.slideUpIn" delay={100}>
          <ReactTable
            className={classes.root}
            getTrProps={(state, rowInfo, column) => {
              return {
                className: "items-center justify-center",
              };
            }}
            filterable
            // className={clsx(classes.root)}
            data={team}
            // pageSize={team.length}
            columns={[
              {
                Header: "",
                accessor: "",
                Cell: (row) => (
                  <Avatar
                    src={
                      row.original.picture && row.original.picture !== ""
                        ? row.original.picture
                        : "assets/images/avatars/profile.jpg"
                    }
                  >
                    {row.original.name.charAt(0).toUpperCase()}
                  </Avatar>
                ),
                width: 55,
                filterable: true,
                sortable: false,
              },
              {
                Header: "Name",
                accessor: "name",
                filterable: true,
                style: { 'whiteSpace': 'unset' },
                Cell: ({ row }) => (
                  <a
                    className="cursor-pointer"
                    onClick={access?() => dispatch(openEditDialog(row._original)):() =>dispatchWarningMessage(dispatch, "You don't have access to view or update team members.")}
                  >
                    {row.name}
                  </a>
                ),
                className: "font-bold",
              },
              {
                Header: "Email", 
                accessor: "email",
                filterable: true,
                style: { 'whiteSpace': 'unset' },
              },
              {
                Header: "Contact",
                style: { 'whiteSpace': 'unset' },
                accessor: "contact",
                filterable: true,
                className: "justify-center",
              },
              {
                Header: "Role",
                style: { 'whiteSpace': 'unset' },
                filterable: true,
                id: "role",
                accessor: (d) => {
                  if (d.role === "siteIncharge") {
                    return "Site Incharge";
                  } else if (d.role === "siteEngineer") {
                    return "Site Engineer";
                  } else if (d.role === "owner") {
                    return " Project Owner";
                  } else if (d.role === "projectManager") {
                    return "Project Manager";
                  } else if (d.role === "purchaseOfficer") {
                    return "Purchase Officer";
                  } else if (d.role === "liaisonOfficer") {
                    return "Liaison Officer";
                  } else if (d.role === "reraOfficer") {
                    return "RERA Officer";
                  } else if (d.role === "superVisior") {
                    return "Supervisior";
                  } else if (d.role === "contractor") {
                    return "Contractor";
                  } else if (d.role === "afterSales") {
                    return "After Sales";
                  } else if (d.role === "architect") {
                    return "Architect";
                  } else {
                    return d.role;
                  }
                },
              },
            ]}
            defaultPageSize={10}
            noDataText="No Team found"
          />
        </FuseAnimate>
 
        <FuseAnimate animation="transition.expandIn" delay={300}>
          <Fab
            color="primary"
            aria-label="add"
            className={classes.addButton}
            onClick={(ev) => dispatch(openNewDialog())}
            disabled={access === true ? false :true}
          >
            <Icon>add</Icon>
          </Fab>
        </FuseAnimate>
        <TeamDialog />
      </Paper>
    </React.Fragment>
  );
}

export default Team;
