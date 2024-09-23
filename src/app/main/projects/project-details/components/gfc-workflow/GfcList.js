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
import GfcWorkflowDialog from "./GfcWorkflowDialog";
import Typography from "@material-ui/core/Typography";
import { detailGfc, openNewDialog, openEditDialog  } from "app/main/projects/store/projectsSlice";
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

function GfcList(props) {
  const classes = useStyles(props);
  const dispatch = useDispatch();
  const loading = useSelector(({ projects }) => projects.loading);
  const gfcs = useSelector(({ projects }) => projects.gfcs.gfcList);
  const projectId = useSelector(({ projects }) => projects.details._id);
  const [data, setData] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  let _id = '', trNo = '', cidcoDate = '', drawings ='', ssaDate = '', gfcStatus = '', newGfcs = [];

  useEffect(()=>{
    gfcs.forEach((el)=>{
      let filterReview = el.review.filter((el)=> el.status === 'Open');
      _id = el._id;
      trNo = el.trNo;
      ssaDate = el.ssaDate;
      drawings = el.drawings;

      if(el.status === 'Review'){
        gfcStatus = filterReview.length > 0 ? 'Open': el.review.length > 0 ? el.review[0].status : el.review.length === 0 ? 'Open': 'Closed';
      }else{
        gfcStatus = el.status
      }
  
      if (el.cidcoDate.slice(-1) === 'Z') {
        cidcoDate = moment(el.cidcoDate).format('Do MMMM YYYY');
      }

      if (el.ssaDate.slice(-1) === 'Z') {
        ssaDate = moment(el.ssaDate).format('Do MMMM YYYY');
      }
  
      newGfcs.push({ _id, trNo, cidcoDate, ssaDate, drawings, gfcStatus });
    })

    setData(newGfcs);
  },[gfcs])

  const openDialog = async (data) => {
    await dispatch(detailGfc({ projectId, gfcId:data._id })).then(
      (response) => {
        dispatch(openEditDialog(response.payload));
      }
    );
  }

  function filterCaseInsensitive(filter, row) {
    const id = filter.pivotId || filter.id;
    if(id === 'gfcStatus'){
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
    if (selectedIds.length === gfcs.length) {
      setSelectedIds([]);
    } else {
      let ids = [];
      gfcs.forEach((item) => {
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
             <Button  variant='contained' className="ml-10" onClick={() => dispatch(openNewDialog())} color="primary"> Add Gfc</Button>
           </div>
        </div>
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
            data={data}
            defaultFilterMethod={(filter, row) => filterCaseInsensitive(filter, row) }
            // pageSize={team.length}
            columns={[
              {
                Header: "TR No",
                accessor: "trNo",
               // width: 200,
                filterable: true,
                style: { 'white-space': 'unset' },
                Cell: ({ row }) => (
                  <Typography
                    className="font-bold hover:underline cursor-pointer"
                    color="secondary"
                    onClick={() => openDialog(row._original)}
                  >
                    {row.trNo}
                  </Typography>
                ),
              },
              {
                Header: "Drawings",
                accessor: "drawings",
                filterable: true,
                className: "justify-center",
                width: 100,
                style: { textAlign:"center",'white-space': 'unset' },
              },
              {
                Header: "Drawings to CIDCO issued on",
                accessor: "cidcoDate",
                filterable: true,
                className: "justify-center",
               // width: 180,
                style: { textAlign:"center",'white-space': 'unset' },
              },
              {
                Header: "Drawings to SSA issued on ",
                accessor: "ssaDate",
                filterable: true,
                className: "justify-center",
              //  width: 180,
                style: { textAlign:"center",'white-space': 'unset' },
              },
              {
                Header: 'Status',
                width: 120,
                style: { textAlign:"center",'white-space': 'unset' },
                id: 'gfcStatus',
                filterable: true,
                accessor: (d) => (
                  <Typography
                    className={
                      d.gfcStatus === 'Open'
                      ? 'bg-red-700 text-white inline p-4 rounded truncate'
                      : d.gfcStatus === 'Closed'
                      ? 'bg-green-700 text-white inline p-4 rounded truncate'
                      : d.gfcStatus === 'Discarded'
                      ? 'bg-purple-700 text-white inline p-4 rounded truncate'
                      : null
                    }
                  >
                    {d.gfcStatus}
                  </Typography>
                ),
                className: 'font-bold',
              },
            ]}
            defaultPageSize={10}
            noDataText="No Gfc found"
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
          >
            <Icon>add</Icon>
          </Fab>
        </FuseAnimate>
    
      </Paper>

      <GfcWorkflowDialog data={props.data}/>

    </React.Fragment>
  );
}

export default GfcList;
