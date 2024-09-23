import React, { useState,useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Fab, Icon } from "@material-ui/core";
import FuseAnimate from "@fuse/core/FuseAnimate";
import { useDispatch, useSelector } from "react-redux";
import ReactTable from "react-table-6";
import Paper from "@material-ui/core/Paper";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import SafetyNcrDialog from "./SafetyNcrDialog";
import Typography from "@material-ui/core/Typography";
import ViewNcr from "./ViewNcr";
import moment from "moment";
import { dispatchWarningMessage } from "app/utils/MessageDispatcher";
import { detailSafetyData,  openNewDialog, openEditDialog, addEntryToSummary } from "app/main/projects/store/projectsSlice";

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

function SafetyNcr(props) {
  const classes = useStyles(props);
  const dispatch = useDispatch();
  const loading = useSelector(({ projects }) => projects.loading);
  const safetyNcr = useSelector(({ projects }) => projects.safetyNcrs.safetyNcrsList);
  const projectId = useSelector(({ projects }) => projects.details._id);
  const [data, setData] = useState([]);
  const [ncr, setNcr] = useState([]);
  const [viewOpen, setViewOpen] = useState([]);
  const user = useSelector(({ auth }) => auth.user);
  const team = useSelector(({ projects }) => projects.details.team);
  const [access, setAccess] = useState(false);
  const userId = useSelector(({ auth }) => auth.user.data.id);
  const [hide, setHide] = useState(false);

  useEffect(() => {
    team.forEach((t)=>{
      if((t._id === user.data.id && t.role === "owner") || user.role === 'admin')
      {
        setAccess(true)
      }else if(t._id === user.data.id && t.role !== "owner")
      {
         const member=t.tab_access.filter((i)=>i === "Safety NCR");
         console.log(member)
         if(member[0] === "Safety NCR")
         {
           setAccess(true)
         }
      }

      if(t._id === user.data.id && t.role === "CIDCO Official"){
        setHide(true)
      }
    })
  }, [access, user.data.id, user.role, team]);

  let _id = '', refNo = '', issueDate = '', description = '', closingDate = '', ncrStatus = '', ncrDoc = [], age = '', newNcrs = [];
  useEffect(()=>{
    let day = 24 * 60 * 60 * 1000;
    let date = new Date();
    let today = moment(date).format("DD-MM-YYYY");

    safetyNcr.forEach((el)=>{
      let startDate = moment(el.issueDate).format('DD-MM-YYYY');
      _id = el._id;
      refNo = el.refNo;
      description = el.description;
      ncrStatus = el.status;
      ncrDoc = el.ncrDoc;
  
      if (el.issueDate.slice(-1) === 'Z') {
        issueDate = moment(el.issueDate).format('Do MMMM YYYY');
      }

      if(el.closingDate !== undefined && el.closingDate !== null){
        let endDate = moment(el.closingDate).format('DD-MM-YYYY');
        if (el.closingDate.slice(-1) === 'Z') {
          closingDate = moment(el.closingDate).format('Do MMMM YYYY');
        }
 
        age = Math.round(Math.abs((process(endDate) - process(startDate)) / day));
      }else{
        closingDate = '';
        age = Math.round(Math.abs((process(today) - process(startDate)) / day));
      }
      
      newNcrs.push({ _id, refNo, description, issueDate, closingDate, ncrStatus, ncrDoc, age});
    })

    setData(newNcrs);
  },[safetyNcr])

  function process(date){
    var parts = date.split("-");
    return new Date(parts[2], parts[1] - 1, parts[0]);
  }

  const handleClose = () => {
    setViewOpen(false);
  };

  const openDialog = async (data) => {
    await dispatch(detailSafetyData({safetyDataId : data._id}));
    dispatch(openEditDialog(data));
  }

  function filterCaseInsensitive(filter, row) {
    const id = filter.pivotId || filter.id;
    if(id === 'ncrStatus'){
      return (
        row[id] !== undefined ?
          String(row[id].props.children.toLowerCase()).includes(filter.value.toLowerCase())
        :
          false
      );
    }else if(id === 'age'){
      let temp = row[id].toString();
      return (
        row[id] !== undefined ?
          String(temp.toLowerCase()).includes(filter.value.toLowerCase())
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

  const viewNcrReport = (details) =>{
    let reportName = "Safety NCR", actionType = "View", title = `${details.refNo}`;
    dispatch(detailSafetyData({safetyDataId : details._id})).then((response) => {
      setNcr(response.payload);
      setViewOpen(true);
      dispatch(addEntryToSummary ({ projectId, userId, reportName, actionType, title }));
    });
  }

  const downloadDocument = (data) =>{
    if(data.ncrDoc.length > 0){
      const url = data.ncrDoc[0].pictureUrl;
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${data.ncrDoc[0].name}`);
      document.body.appendChild(link);
      link.click();
      let reportName = "Safety NCR", actionType = "Download", title = `${data.refNo}`;
      dispatch(addEntryToSummary ({ projectId, userId, reportName, actionType, title }));
    }else{
      dispatchWarningMessage(dispatch, "NCR document not found.")
    }
  }

  return (
    <React.Fragment>
      <Paper className="w-full rounded-8 shadow-1">
        <div className="flex items-center justify-between px-16 h-64 border-b-1">
          <Typography className="text-16">Safety NCR</Typography>
        </div>
        <FuseAnimate animation="transition.slideUpIn" delay={100}>
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
                Header: "Ref No.",
                accessor: "refNo",
                filterable: true,
                style: { 'whiteSpace': 'unset' },
                width: 300,
                Cell: ({ row }) => (
                  <Typography
                    className="font-bold hover:underline cursor-pointer"
                    color="secondary"
                    onClick={access ? () => openDialog(row._original)
                      : () => dispatchWarningMessage(dispatch, "You don't have an access to update a issue.")
                    }
                  >
                    {row.refNo}
                  </Typography>
                ),
                className: "font-bold",
              },
              {
                Header: "Issue Date",
                accessor: "issueDate",
                filterable: true,
                style: { textAlign:"center",'white-space': 'unset' },
              },
              {
                Header: "Closing Date",
                accessor: "closingDate",
                filterable: true,
                style: { textAlign:"center",'white-space': 'unset' },
              },
              {
                Header: 'Status',
                style: { textAlign:"center",'white-space': 'unset' },
                id: 'ncrStatus',
                filterable: true,
                accessor: (d) => (
                  <Typography
                    className={
                      d.ncrStatus === 'Open'
                        ? 'bg-red-700 text-white inline p-4 rounded truncate'
                        : d.ncrStatus === 'Closed'
                        ? 'bg-green-700 text-white inline p-4 rounded truncate'
                        : null
                    }
                  >
                    {d.ncrStatus}
                  </Typography>
                ),
                className: 'font-bold',
              },
              {
                Header: "Age",
                accessor: "age",
                filterable: true,
                style: { textAlign:"center",'white-space': 'unset' },
              },
              {
                Header: 'Download / View',
                id:'view_po',
                style: { 'white-space': 'unset' },
                accessor: "view",
                Cell: ({ row }) => (
                  <>
                   <a className="cursor-pointer" onClick={() => downloadDocument(row._original)}> Download </a>
                   <span> / </span>
                   <a
                      className="cursor-pointer"
                      onClick={access ? () => {
                        viewNcrReport(row._original)
                      }: () => dispatchWarningMessage(dispatch, "You don't have an access to view a report.")}
                    >
                      View
                   </a>
                  </>
                ),
                className: 'font-bold',
              }
            ]}
            defaultPageSize={10}
            noDataText="No Data found"
          />
        </FuseAnimate>
        <Backdrop className={classes.backdrop} open={loading}>
          <CircularProgress color="inherit" />
        </Backdrop>
     
        {hide === true ? null :
          <FuseAnimate animation="transition.expandIn" delay={300}>
            <Fab
              color="primary"
              aria-label="add"
              className={classes.addButton}
              onClick={access?() => {
                dispatch(openNewDialog())
              }: () => dispatchWarningMessage(dispatch, "You don't have an access to add an issue.")}
            >
              <Icon>add</Icon>
            </Fab>
          </FuseAnimate>  
        }
      </Paper>
      <SafetyNcrDialog />

      {viewOpen === true ? <ViewNcr data={ncr} open={viewOpen} close={handleClose} /> :null}
    </React.Fragment>
  );
}

export default SafetyNcr;
