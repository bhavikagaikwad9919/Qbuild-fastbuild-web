import React, { useState,useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Fab, Icon, Button } from "@material-ui/core";
import FuseAnimate from "@fuse/core/FuseAnimate";
import { useDispatch, useSelector } from "react-redux";
import ReactTable from "react-table-6";
import Paper from "@material-ui/core/Paper";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import IrDialog from "./IrDialog";
import Typography from "@material-ui/core/Typography";
import { detailIr, openNewDialog, openEditDialog, deleteIrs } from "app/main/projects/store/projectsSlice";
import moment from 'moment';
import Checkbox from "@material-ui/core/Checkbox";
import Dialog from "@material-ui/core/Dialog";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
  addButton: {
    display: "flex",
    position: "fixed",
    right: 40,
    bottom: 5,
    zIndex: 99,
    columnGap: "10px",
  },
  delete: {
    color: "red",
  },
  root: {
    maxHeight: "68vh",
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 3,
    color: "#fff",
  },
  delete: {
    color: "red",
  },
}));

function IrList(props) {
  const classes = useStyles(props);
  const dispatch = useDispatch();
  const loading = useSelector(({ projects }) => projects.loading);
  const irs = useSelector(({ projects }) => projects.irs.irList);
  const projectId = useSelector(({ projects }) => projects.details._id);
  const role = useSelector(({ auth }) => auth.user.role);
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [hide, setHide] = useState(false);
  const team = useSelector(({ projects }) => projects.details.team);
  const user = useSelector(({ auth }) => auth.user);

  let _id = '', irsNo = '', irDate = '', activity = '', location = '', floor = '', irStatus = '', newIrs = [];

  useEffect(()=>{
    irs.forEach((el)=>{
      _id = el._id;
      irsNo = el.irsNo;
      activity = el.activity;
      irStatus = el.status;
      location = el.location;
      floor = el.floor;
  
      if (el.irDate.slice(-1) === 'Z') {
        irDate = moment(el.irDate).format('Do MMMM YYYY');
      }
  
      newIrs.push({ _id, irsNo, irDate, activity, location, floor, irStatus });
    })

    setData(newIrs);
  },[irs])

  useEffect(() => {
    team.forEach((t)=>{
      if(t._id === user.data.id && t.role === "CIDCO Official"){
        setHide(true)
      }
   })
  }, [user.data.id, team])

  const openDialog = async (data) => {
    await dispatch(detailIr({ projectId, irId:data._id })).then(
      (response) => {
        dispatch(openEditDialog(response.payload));
      }
    );
  }

  function filterCaseInsensitive(filter, row) {
    const id = filter.pivotId || filter.id;
    if(id === 'irStatus'){
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

  const selectAllIds = () => {
    if (selectedIds.length === irs.length) {
      setSelectedIds([]);
    } else {
      let ids = [];
      irs.forEach((item) => {
        ids.push(item._id);
      });
      setSelectedIds(ids);
    }
  };

  const handleChange = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((_id) => _id !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  return (
    <React.Fragment>
      <Paper className="w-full rounded-8 shadow-1">
        <div className="flex flex-1 flex-row w-full mb-12">
          <div className="flex w-full items-center justify-start gap-10" >
            <Typography className="text-16 ml-10 font-bold">{props.data.folderName}</Typography>
          </div>
          <div className="flex w-md items-end justify-end"  >
           <div className="flex px-12 flex-row gap-5 ml-40">
             <Button  variant='contained' onClick={() => props.close()} color="primary"> Back</Button>
              {hide === true ? null :
                <Button  variant='contained' className="ml-10" onClick={() => dispatch(openNewDialog())} color="primary"> Add Ir</Button>
              }
             </div>
          </div>
        </div>
        <FuseAnimate animation="transition.slideUpIn" delay={100}>
        {role === 'admin' ?
          <ReactTable
            className={classes.root}
            getTrProps={(state, rowInfo, column) => {
              return {
                className: "-striped -highlight items-center justify-center",
              };
            }}
            data={data}
            defaultFilterMethod={(filter, row) => filterCaseInsensitive(filter, row) }
            columns={[
              {
                Header:  () => (
                  <Checkbox
                    onClick={(event) => {
                      event.stopPropagation();
                      selectAllIds();
                    }}
                    checked={
                      selectedIds.length === Object.keys(irs).length &&
                      selectedIds.length > 0
                    }
                  />),
                accessor: "",
                Cell: (row) => {
                  return (
                    <Checkbox
                      onClick={(event) => {
                        event.stopPropagation();
                        handleChange(row.value._id);
                      }}
                      checked={selectedIds.includes(row.value._id)}
                    />
                  );
                },
                className: "justify-center",
                sortable: false,
                filterable: false,
                width: 55,
              },
              {
                Header: "IRS No",
                accessor: "irsNo",
                width: 300,
                filterable: true,
                style: { 'white-space': 'unset' },
                Cell: ({ row }) => (
                  <Typography
                    className="font-bold hover:underline cursor-pointer"
                    color="secondary"
                    onClick={() => openDialog(row._original)}
                  >
                    {row.irsNo}
                  </Typography>
                ),
              },
              {
                Header: "Date",
                accessor: "irDate",
                filterable: true,
                className: "justify-center",
                width: 180,
                style: { textAlign:"center",'white-space': 'unset' },
              },
              {
                Header: "Activity",
                accessor: "activity",
                filterable: true,
                className: "justify-center",
                style: { textAlign:"center",'white-space': 'unset' },
              },
              {
                Header: "Location",
                accessor: "location",
                filterable: true,
                className: "justify-center",
                width: 100,
                style: { textAlign:"center",'white-space': 'unset' },
              },
              {
                Header: "Floor",
                accessor: "floor",
                filterable: true,
                className: "justify-center",
                width: 100,
                style: { textAlign:"center",'white-space': 'unset' },
              },
              {
                Header: 'Status',
                width: 100,
                style: { textAlign:"center",'white-space': 'unset' },
                id: 'irStatus',
                filterable: true,
                accessor: (d) => (
                  <Typography
                    className={
                      d.irStatus === 'OPEN'
                        ? 'bg-red-700 text-white inline p-4 rounded truncate'
                        : d.irStatus === 'CLOSED'
                        ? 'bg-green-700 text-white inline p-4 rounded truncate'
                        : null
                    }
                  >
                    {d.irStatus}
                  </Typography>
                ),
                className: 'font-bold',
              }, 
            ]}
            defaultPageSize={10}
            noDataText="No Irs found"
          />
          :
          <ReactTable
            className={classes.root}
            getTrProps={(state, rowInfo, column) => {
              return {
                className: "-striped -highlight items-center justify-center",
              };
            }}
            // className={clsx(classes.root)}
            data={data}
            defaultFilterMethod={(filter, row) => filterCaseInsensitive(filter, row) }
            // pageSize={team.length}
            columns={[
              {
                Header: "IRS No",
                accessor: "irsNo",
                width: 300,
                filterable: true,
                style: { 'white-space': 'unset' },
                Cell: ({ row }) => (
                  <Typography
                    className="font-bold hover:underline cursor-pointer"
                    color="secondary"
                    onClick={() => openDialog(row._original)}
                  >
                    {row.irsNo}
                  </Typography>
                ),
              },
              {
                Header: "Date",
                accessor: "irDate",
                filterable: true,
                className: "justify-center",
                width: 180,
                style: { textAlign:"center",'white-space': 'unset' },
              },
              {
                Header: "Activity",
                accessor: "activity",
                filterable: true,
                className: "justify-center",
                style: { textAlign:"center",'white-space': 'unset' },
              },
              {
                Header: "Location",
                accessor: "location",
                filterable: true,
                className: "justify-center",
                width: 100,
                style: { textAlign:"center",'white-space': 'unset' },
              },
              {
                Header: "Floor",
                accessor: "floor",
                filterable: true,
                className: "justify-center",
                width: 100,
                style: { textAlign:"center",'white-space': 'unset' },
              },
              {
                Header: 'Status',
                width: 100,
                style: { textAlign:"center",'white-space': 'unset' },
                id: 'irStatus',
                filterable: true,
                accessor: (d) => (
                  <Typography
                    className={
                      d.irStatus === 'OPEN'
                        ? 'bg-red-700 text-white inline p-4 rounded truncate'
                        : d.irStatus === 'CLOSED'
                        ? 'bg-green-700 text-white inline p-4 rounded truncate'
                        : null
                    }
                  >
                    {d.irStatus}
                  </Typography>
                ),
                className: 'font-bold',
              },
            ]}
            defaultPageSize={10}
            noDataText="No Ir found"
          />
        }
        </FuseAnimate>

        <Backdrop className={classes.backdrop} open={loading}>
          <CircularProgress color="inherit" />
        </Backdrop>

        <div className={clsx(classes.addButton)}>
        {selectedIds.length ? (
          <FuseAnimate animation="transition.expandIn" delay={300}>
            <Fab
              color="primary"
              aria-label="delete"
              onClick={() => {
                setOpen(true);
              }}
            >
              <Icon className={classes.delete}>delete</Icon>
            </Fab>
          </FuseAnimate>
        ) : null}
     
        {hide === true ? null :
          <FuseAnimate animation="transition.expandIn" delay={300}>
            <Fab
              color="primary"
              aria-label="add"
              className={classes.add}
              onClick={() => {
                dispatch(openNewDialog())
              }}
            >
              <Icon>add</Icon>
            </Fab>
          </FuseAnimate>
        }
        </div>
      </Paper>

      <IrDialog data={props.data}/>

      <Dialog
        open={open}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">
          Delete Selected Irs ?
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
              setOpen(false);
              dispatch(deleteIrs({ projectId, folderId: props.data._id, ids: selectedIds })).then(
                (response) => {
                  setSelectedIds([]);
                }
              );
            }}
            color="primary"
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default IrList;
