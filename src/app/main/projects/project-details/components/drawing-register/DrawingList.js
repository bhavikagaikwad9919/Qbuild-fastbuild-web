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
import DrawingDialog from "./DrawingDialog";
import Typography from "@material-ui/core/Typography";
import { detailDrawing, openNewDialog, openEditDialog, deleteDrawings } from "app/main/projects/store/projectsSlice";
import { dispatchWarningMessage } from "app/utils/MessageDispatcher";
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

function DrawingList(props) {
  const classes = useStyles(props);
  const dispatch = useDispatch();
  const loading = useSelector(({ projects }) => projects.loading);
  const drawings = useSelector(({ projects }) => projects.drawings.drawingList);
  const projectId = useSelector(({ projects }) => projects.details._id);
  const role = useSelector(({ auth }) => auth.user.role);
  const [type, setType] = useState('Latest');
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [hide, setHide] = useState(false);
  const team = useSelector(({ projects }) => projects.details.team);
  const user = useSelector(({ auth }) => auth.user);

  let _id = '', drawingName = '', drawingNo = '', discp = '', drawingDate = '', revision = '', drawingStatus = '', trNo = '', newDrawings = [];

  useEffect(()=>{
    let newData = drawings.filter((dt)=> dt.status === 'Latest');
    newData.forEach((el)=>{
      _id = el._id;
      drawingName = el.drawingName;
      drawingNo = el.drawingNo;
      revision = el.revision;
      drawingStatus = el.status;
      discp = el.discp;
      trNo = el.trNo;
  
      if (el.drawingDate.slice(-1) === 'Z') {
        drawingDate = moment(el.drawingDate).format('Do MMMM YYYY');
      }
  
      newDrawings.push({ _id, drawingName, drawingNo, drawingDate, revision, drawingStatus, discp, trNo});
    })

    setData(newDrawings);
  },[drawings])

  useEffect(() => {
    team.forEach((t)=>{
      if(t._id === user.data.id && t.role === "CIDCO Official"){
        setHide(true)
      }
   })
  }, [user.data.id, team]);

  const openDialog = async (data) => {
    await dispatch(detailDrawing({ projectId, drawingId:data._id })).then(
      (response) => {
        dispatch(openEditDialog(response.payload));
      }
    );
  
  }

  function filterCaseInsensitive(filter, row) {
    const id = filter.pivotId || filter.id;
      return (
        row[id] !== undefined ?
          String(row[id].toLowerCase()).startsWith(filter.value.toLowerCase())
        :
          false
      );
  }

  function customFilter(value){
    if(value === 'All')
    {
      setType("All");
      newDrawings = [];
      drawings.forEach((el)=>{
        _id = el._id;
        drawingName = el.drawingName;
        drawingNo = el.drawingNo;
        revision = el.revision;
        drawingStatus = el.status;
        discp = el.discp;
        trNo = el.trNo;
    
        if (el.drawingDate.slice(-1) === 'Z') {
          drawingDate = moment(el.drawingDate).format('Do MMMM YYYY');
        }
    
        newDrawings.push({ _id, drawingName, drawingNo, drawingDate, revision, drawingStatus, discp, trNo});
      })
      setData(newDrawings);
    }else{
      setType(value);
      newDrawings = [];
      let newData = drawings.filter((dt)=> dt.status === value);
      newData.forEach((el)=>{
        _id = el._id;
        drawingName = el.drawingName;
        drawingNo = el.drawingNo;
        revision = el.revision;
        drawingStatus = el.status;
        discp = el.discp;
        trNo = el.trNo;
    
        if (el.drawingDate.slice(-1) === 'Z') {
          drawingDate = moment(el.drawingDate).format('Do MMMM YYYY');
        }
    
        newDrawings.push({ _id, drawingName, drawingNo, drawingDate, revision, drawingStatus, discp, trNo});
      })

      setData(newDrawings);
    }
  }

  const selectAllIds = () => {
    if (selectedIds.length === drawings.length) {
      setSelectedIds([]);
    } else {
      let ids = [];
      drawings.forEach((item) => {
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
                <Button  variant='contained' className="ml-10" onClick={() => dispatch(openNewDialog())} color="primary"> Add Drawing</Button>
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
            // className={clsx(classes.root)}
            data={data}
            defaultFilterMethod={(filter, row) => filterCaseInsensitive(filter, row) }
            // pageSize={team.length}
            columns={[
              {
                Header:  () => (
                  <Checkbox
                    onClick={(event) => {
                      event.stopPropagation();
                      selectAllIds();
                    }}
                    checked={
                      selectedIds.length === Object.keys(drawings).length &&
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
                Header: "Drawing Name",
                accessor: "drawingName",
                filterable: true,
                style: { 'white-space': 'unset' },
                width: 300,
                Cell: ({ row }) => (
                  <Typography
                    className="font-bold hover:underline cursor-pointer"
                    color="secondary"
                    onClick={ () => {
                      openDialog(row._original)
                    }}
                  >
                    {row.drawingName}
                  </Typography>
                ),
                className: "font-bold",
              },
              {
                Header: "Drawing No",
                accessor: "drawingNo",
                filterable: true,
                style: { 'white-space': 'unset' },
                width: 250,
              },
              {
                Header: "Drawing Date",
                accessor: "drawingDate",
                filterable: true,
                className: "justify-center",
                style: { 'white-space': 'unset' },
                width: 150,
              },
              {
                Header: "Revision",
                accessor: "revision",
                filterable: true,
                className: "justify-center",
                width: 100,
              },
              {
                Header: "TR No.",
                filterable: true,
                accessor: "trNo",
                className: "justify-center",
              },
              {
                Header: "Status",
                filterable: true,
                accessor: "drawingStatus",
                className: "justify-center",
                Filter: ({ filter, onChange }) =>
              <select
                onChange={event => customFilter(event.target.value)}
                style={{ width: "100%" }}
                value={type}
              >
                <option value="All">All</option>
                <option value="Latest">Latest</option>
                <option value="Supersede">Supersede</option>
              </select>
              },
            ]}
            defaultPageSize={10}
            noDataText="No Drawings found"
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
                Header: "Drawing Name",
                accessor: "drawingName",
                filterable: true,
                style: { 'white-space': 'unset' },
                width: 300,
                Cell: ({ row }) => (
                  <Typography
                    className="font-bold hover:underline cursor-pointer"
                    color="secondary"
                    onClick={ () => {
                      openDialog(row._original)
                    }}
                  >
                    {row.drawingName}
                  </Typography>
                ),
                className: "font-bold",
              },
              {
                Header: "Drawing No",
                accessor: "drawingNo",
                filterable: true,
                style: { 'white-space': 'unset' },
                width: 250,
              },
              {
                Header: "Drawing Date",
                accessor: "drawingDate",
                filterable: true,
                className: "justify-center",
                style: { 'white-space': 'unset' },
                width: 150,
              },
              {
                Header: "Revision",
                accessor: "revision",
                filterable: true,
                className: "justify-center",
                width: 100,
              },
              {
                Header: "TR No.",
                filterable: true,
                accessor: "trNo",
                className: "justify-center",
              },
              {
                Header: "Status",
                filterable: true,
                accessor: "drawingStatus",
                className: "justify-center",
                Filter: ({ filter, onChange }) =>
              <select
                onChange={event => customFilter(event.target.value)}
                style={{ width: "100%" }}
                value={type}
              >
                <option value="All">All</option>
                <option value="Latest">Latest</option>
                <option value="Supersede">Supersede</option>
              </select>
              },
            ]}
            defaultPageSize={10}
            noDataText="No Drawings found"
          />}
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
      <DrawingDialog data={props.data}/>

      <Dialog
        open={open}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">
          Delete Selected Drawings ?
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
              dispatch(deleteDrawings({ projectId, folderId: props.data._id, ids: selectedIds })).then(
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

export default DrawingList;
