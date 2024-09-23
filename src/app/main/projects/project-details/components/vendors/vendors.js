import React, { useState,useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Fab, Icon, Button } from "@material-ui/core";
import FuseAnimate from "@fuse/core/FuseAnimate";
import FuseLoading from "@fuse/core/FuseLoading";
import Typography from "@material-ui/core/Typography";
import { useDispatch, useSelector } from "react-redux";
import ReactTable from "react-table-6";
import Paper from "@material-ui/core/Paper";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import VendorDialog from "./vendorsDialog";
import { dispatchWarningMessage } from "app/utils/MessageDispatcher";
import { detailVendor, openNewDialog, openEditDialog } from "app/main/projects/store/projectsSlice";
import { getOrganization, getAgencies } from "app/main/organization/store/organizationSlice";

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

function Vendors(props) {
  const classes = useStyles(props);
  const dispatch = useDispatch();
  const vendors = useSelector(({ projects }) => projects.vendors.vendorsList);
  const loading = useSelector(({ projects }) => projects.loading);
  const [dialog, setDialog] = useState(false);
  const [dialogType, setDialogType] = useState("new");
  const [access, setAccess] = useState();
  const team = useSelector(({ projects }) => projects.details.team);
  const role = useSelector(({ auth }) => auth.user);
  const projectDetails = useSelector(({ projects }) => projects.details);


  const handleCloseDialog = () => {
    setDialog(false);
  };

  useEffect(() => {
    dispatch(getOrganization({ OrganizationId : projectDetails.organizationId })).then(
      (response) => {
        dispatch(getAgencies(projectDetails.organizationId));
      }
    );

    if(sessionStorage.getItem("link") === 'link'){
      sessionStorage.removeItem("link");
      dispatch(openNewDialog())
    }
  }, []);

  useEffect(() => {
    team.map((t)=>{
      if(t._id === role.data.id && t.role === "owner"|| role.role === 'admin')
      {
        setAccess(true)
      }else if(t._id === role.data.id && t.role !== "owner")
      {
         const member=t.tab_access.filter((i)=>i === "Sub-Contractors");
         console.log(member)
         if(member[0] === "Sub-Contractors")
         {
           setAccess(true)
         }
      }
   })
}, [access]);

  if (!vendors) {
    return <FuseLoading />;
  }

  const openDialog = async (data) => {
    // if(data.organizationId){
    //   dispatchWarningMessage(dispatch, "Please go to the Agency in the organization to view or update Agency")
    // }else{
      await dispatch(detailVendor(data._id));
      dispatch(openEditDialog(data));
    //}
  }

  function filterCaseInsensitive(filter, row) {
    const id = filter.pivotId || filter.id;
    return (
      row[id] !== undefined && id !== 'contact' ?
        String(row[id].toLowerCase()).startsWith(filter.value.toLowerCase())
      :
        false
    );
  }

  return (
    <React.Fragment>
      <Paper className="w-full rounded-8 shadow-1">
        <div className="flex items-center justify-between px-16 h-64 border-b-1">
          <Typography className="text-16 font-bold">Agency</Typography>
          {access?
            <Button color="primary" onClick={() => dispatch(openNewDialog())} variant="contained" className="mb-8" style={{padding:'3px 16px'}} nowrap="true">Add Agency</Button> 
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
            data={vendors}
            filterable
            defaultFilterMethod={(filter, row) => filterCaseInsensitive(filter, row) }
            // pageSize={team.length}
            columns={[
              {
                Header: "Name",
                style: { 'white-space': 'unset' },
                accessor: "name",
                Cell: ({ row }) => (
                  <a
                    className="cursor-pointer"
                    onClick={access?() => {
                      openDialog(row._original);
                    }:() => dispatchWarningMessage(dispatch, "You don't have access to view or update agency.")}
                  >
                    {row.name}
                  </a>
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
                className: "font-bold",
              },
              {
                Header: "City",
                style: { 'white-space': 'unset' },
                accessor: "city",
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
                Header: "Contact",
                style: { 'white-space': 'unset' },
                className: "justify-center",
                id: 'contact',
                accessor: (i) => (
                  <Typography>
                    {i.contact +"  "}
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
                Header: "Type",
                style: { 'white-space': 'unset' },
                accessor: "agencyType",
                className: "justify-center",
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
            ]}
            defaultPageSize={10}
            noDataText="No Agency found"
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
      
        <VendorDialog />
    </React.Fragment>
  );
}

export default Vendors;
