import React, { useState, useRef, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Fab, Icon, Typography, Button } from "@material-ui/core";
import FuseAnimate from "@fuse/core/FuseAnimate";
import FuseLoading from "@fuse/core/FuseLoading";
import { useDispatch, useSelector } from "react-redux";
import ReactTable from "react-table-6";
import {
  listInventories,
  getInventory,
  openEditDialog,
  openNewDialog, 
} from "app/main/projects/store/projectsSlice";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import InventoryDialog from "./InventoryDialog";
import InventoryUpdateDialog from "./InventoryUpdateDialog";
import Paper from "@material-ui/core/Paper";
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
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

function Inventory(props) {
  const classes = useStyles(props);
  const dispatch = useDispatch();
  const projectId = useSelector(({ projects }) => projects.details._id);
  const inventory = useSelector(({ projects }) => projects.inventories);
  const loading = useSelector(({ projects }) => projects.loading);
  const team = useSelector(({ projects }) => projects.details.team);
  const projectDialog = useSelector(({ projects }) => projects.projectDialog);
  const [access, setAccess] = useState();
  const role = useSelector(({ auth }) => auth.user);

  useEffect(() => {
    dispatch(listInventories(projectId));
  }, [dispatch, projectId]);

  useEffect(() => {
    team.forEach((t)=>{
      if((t._id === role.data.id && t.role === "owner") || role.role === 'admin')
      {
        setAccess(true)
      }else if(t._id === role.data.id && t.role !== "owner")
      {
         const member=t.tab_access.filter((i)=>i === "Inventory");
         console.log(member)
         if(member[0] === "Inventory")
         {
           setAccess(true)
         }
      }

      if(sessionStorage.getItem("inv") === 'inv'){
        sessionStorage.removeItem("inv");
        dispatch(openNewDialog())
      }
   })
}, [access, role.data.id, role.role, team]);

  const inv = useRef(null);
  
  const handleClick = () => {
    inv.current.click();
  };

  const rowSubmit = (inventoryId) => {
    dispatch(getInventory({ projectId, inventoryId })).then((response) => {
      dispatch(openEditDialog(response));
    });
  };

  if (!inventory) {
    return <FuseLoading />;
  }
  
  function filterCaseInsensitive(filter, row) {
    const id = filter.pivotId || filter.id;
    if(id === 'brand' || id ==='supplier'){
      return (
        row[id] !== undefined ?
          String(row[id].props.children.toLowerCase()).includes(filter.value.toLowerCase())
        :
          false
      );
    }else{
      return (
        row[id] !== undefined ?
          String(row[id].toLowerCase()).startsWith(filter.value.toLowerCase())
        :
          false
      );
    }
  }

  return (
    <React.Fragment>
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Paper className="w-full rounded-8 shadow-1">
        <div className="flex items-center justify-between px-16 h-64 border-b-1">
          <Typography className="text-16 font-bold">Inventory</Typography>
          {access?
            <Button color="primary" onClick={() => dispatch(openNewDialog())} variant="contained" className="mb-8" style={{padding:'3px 16px'}} nowrap="true">Add Inventory</Button> 
          :null}
          </div>
        <FuseAnimate animation="transition.slideUpIn" delay={100}>
          <ReactTable
            className={classes.root}
            getTrProps={(state, rowInfo, column) => {
              return {
                className: "-striped -highlight",
              };
            }}
            data={inventory}
            filterable
            defaultFilterMethod={(filter, row) => filterCaseInsensitive(filter, row) }
            columns={[
              {
                Header: "Name",
                accessor: "type",
                style: { 'white-space': 'unset' },
                className: "font-bold",
                Cell: ({ row }) => (
                  <Typography
                    className="font-bold hover:underline cursor-pointer"
                    color="secondary"
                    ref={inv}
                    onClick={access?() => rowSubmit(row._original._id):() =>dispatchWarningMessage(dispatch, "You don't have access to view or update inventory.")}
                  >
                    {row._original.type}
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
                Header: "Quantity",
                id: "quantity",
                accessor: (d) => {
                  if (d.quantity === null) {
                    return 0;
                  } else {
                    return d.quantity.toFixed(2);
                  }
                },
                Cell: (row) => (
                  <div style={{ textAlign: "center" }}>{row.value}</div>
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
                Header: "Unit",
                id: "unit",
                accessor: "unit",
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
                Header: "Brand",
                id: 'brand',
                accessor: (i) => (
                  <Typography>
                    {i.brand +" "}
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
                Header: "Supplier",
                id: 'supplier',
                style: { 'white-space': 'unset' },
                accessor: (i) => (
                  <Typography>
                    {i.supplier +" "}
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
            ]}
            defaultPageSize={20}
            noDataText="No Inventory found"
          />
        </FuseAnimate>
      </Paper>
 
        <Fab
          color="primary"
          aria-label="add"
          className={classes.addButton}
          onClick={() => dispatch(openNewDialog())}
          disabled={access === true ? false :true}
        >
          <Icon>add</Icon>
        </Fab>

        {projectDialog.Dialogtype ==='new' ? ( <InventoryUpdateDialog /> ):null}
     
        {projectDialog.Dialogtype !=='new' ? ( <InventoryDialog onInventoryClick={handleClick} /> ):null}
    </React.Fragment>
  );
}

export default Inventory;
