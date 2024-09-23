import React,{ useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import {
  openEditDialog,
  openNewDialog,
  getDetailReport,
  downloadDailyReport,
  viewDailyReport,
  getReports
} from 'app/main/projects/store/projectsSlice';
import ViewReport from "./ViewReport";
import ViewSSaReport from "./viewSSaReport"
import { Fab, Icon, Typography, Button} from '@material-ui/core';
import ClearIcon from "@material-ui/icons/Clear";
import IconButton from "@material-ui/core/IconButton";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { ThemeProvider } from "@material-ui/core/styles";
import { selectMainTheme } from "app/store/fuse/settingsSlice";
import FuseAnimate from '@fuse/core/FuseAnimate';
import FuseLoading from '@fuse/core/FuseLoading';
import Paper from '@material-ui/core/Paper';
import { useDispatch, useSelector } from 'react-redux';
import ReactTable from 'react-table-6';
import ReportDialog from './ReportDialog';
import moment from 'moment';
import { dispatchWarningMessage } from "app/utils/MessageDispatcher";

const useStyles = makeStyles((theme) => ({
  addButton: {
    position: 'fixed',
    right: 40,
    bottom: 5,
    zIndex: 99,
  },
  root: {
    maxHeight: '70vh',
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

function DailyReport(props) {
  const classes = useStyles(props);
  const dispatch = useDispatch();
  const mainTheme = useSelector(selectMainTheme);
  const report = useSelector(({ projects }) => projects.reports);
  const route = useSelector(({ projects }) => projects.routes);
  const details = useSelector(({ organizations }) => organizations.organization);
  const loading = useSelector(({ projects }) => projects.loading);
  const projectId = useSelector(({ projects }) => projects.details._id);
  const projectName = useSelector(({ projects }) => projects.details.title);
  const team = useSelector(({ projects }) => projects.details.team);
  const role = useSelector(({ auth }) => auth.user);
  const userId = useSelector(({ auth }) => auth.user.data.id)
  const [reportData, setReportData] = useState([])
  const [createAccess, setCreateAccess] = useState();
  const [viewOpen, setViewOpen] = useState();
  const [deleteAccess, setDeleteAccess] = useState();
  const [approveAccess, setApproveAccess] = useState();
  const [dailyData, setDailyData] = useState([]);
  const [selectedDate, setSelectedDate] = React.useState(null);
  const [hide, setHide] = useState(false);
  let today = new Date();
  let reports = [];
  let _id = '';
  let createdAt = '';
  let submittedDate = '';
  let approvalDate = '';
  let status = '';

  useEffect(() => {
    team.map((t)=>{
     if(t._id === role.data.id && t.role === "owner"|| role.role === 'admin' || t.role === 'purchaseOfficer')
     {
       setDeleteAccess(true);
       setCreateAccess(true);
       setApproveAccess(true);
     }else if(t._id === role.data.id && t.role !== "owner")
     {
       setDeleteAccess(t.tab_access.includes("Daily Data") || t.tab_access.includes("Remove Daily Data Entries"));
       setCreateAccess(t.tab_access.includes("Daily Data") || t.tab_access.includes("Create/Update Daily Data"));
       setApproveAccess(t.tab_access.includes("Daily Data") || t.tab_access.includes("Approve / Revert Daily Data"));
    //   setViewAccess(t.tab_access.includes("Daily Data") || t.tab_access.includes("View/Download Report"));
     }

     if(t._id === userId && t.role === "CIDCO Official"){
      setHide(true)
    }
    })
   }, []);

  useEffect(()=>{
    report.forEach((element) => {
      _id = element._id;
    
      if (element.createdAt.slice(-1) === 'Z') {
        createdAt = moment(element.createdAt).format('Do MMMM YYYY');
      }
      if (element.submittedDate && element.submittedDate.slice(-1) === 'Z') {
        submittedDate = moment(element.submittedDate).format('Do MMMM YYYY, h:mm A');
      } else {
        submittedDate = '-';
      }
      if (element.approvalDate && element.approvalDate.slice(-1) === 'Z') {
        approvalDate = moment(element.approvalDate).format(
          'Do MMMM YYYY, h:mm A'
        );
      } else {
        approvalDate = '-';
      }
      if (element.status === 0) {
        status = 'Inactive';
      }
      if (element.status === 1) {
        status = 'New';
      }
      if (element.status === 2) {
        status = 'Submitted';
      }
      if (element.status === 3) {
        status = 'Approved';
      }
      if (element.status === 4) {
        status = 'Reverted';
      }
      reports.push({ _id, createdAt, submittedDate, approvalDate, status });
    });

    setReportData(reports);
  }, [report]); 

  useEffect(() => {
    dispatch(getReports(projectId));
  }, [dispatch, projectId]);
 
  let orgType = '';
  if(details === undefined || details === null){
    orgType = '';
  }else{
    orgType = details.orgType === undefined || details.orgType === null ? '' : details.orgType
  }

  if (!report) {
    return <FuseLoading />;
  }

  let newReport = [];
  reports.forEach((item) => {
    if (item.status === 'Submitted' || item.status === 'Approved') {
      newReport.push(item);
    }
  });


  const handleDateChange = (date) => {
   
    let filteredDate = moment(date).format('MM-YYYY'), reports = [];
   
    report.forEach((element) => {
      if(moment(element.createdAt).format('MM-YYYY') === filteredDate){
        _id = element._id;
        if (element.createdAt.slice(-1) === 'Z') {
          createdAt = moment(element.createdAt).format('Do MMMM YYYY');
        }
        if (element.submittedDate && element.submittedDate.slice(-1) === 'Z') {
          submittedDate = moment(element.submittedDate).format('Do MMMM YYYY, h:mm A');
        } else {
          submittedDate = '-';
        }
        if (element.approvalDate && element.approvalDate.slice(-1) === 'Z') {
          approvalDate = moment(element.approvalDate).format(
            'Do MMMM YYYY, h:mm A'
          );
        } else {
          approvalDate = '-';
        }

        if (element.status === 0) {
          status = 'Inactive';
        }
        if (element.status === 1) {
          status = 'New';
        }
        if (element.status === 2) {
          status = 'Submitted';
        }
        if (element.status === 3) {
          status = 'Approved';
        }
        if (element.status === 4) {
          status = 'Reverted';
        }
        reports.push({ _id, createdAt, submittedDate, approvalDate, status });
      }
      setReportData(reports)
    });

    if(today<date)
    {
      dispatchWarningMessage(dispatch, "Selected Date should not be greater than Today."); 
    }
    setSelectedDate(date);
  };

  const clearAll = () =>{
    report.forEach((element) => {
      _id = element._id;
    
      if (element.createdAt.slice(-1) === 'Z') {
        createdAt = moment(element.createdAt).format('Do MMMM YYYY');
      }
      if (element.submittedDate && element.submittedDate.slice(-1) === 'Z') {
        submittedDate = moment(element.submittedDate).format('Do MMMM YYYY, h:mm A');
      } else {
        submittedDate = '-';
      }
      if (element.approvalDate && element.approvalDate.slice(-1) === 'Z') {
        approvalDate = moment(element.approvalDate).format(
          'Do MMMM YYYY, h:mm A'
        );
      } else {
        approvalDate = '-';
      }
      if (element.status === 0) {
        status = 'Inactive';
      }
      if (element.status === 1) {
        status = 'New';
      }
      if (element.status === 2) {
        status = 'Submitted';
      }
      if (element.status === 3) {
        status = 'Approved';
      }
      if (element.status === 4) {
        status = 'Reverted';
      }
      reports.push({ _id, createdAt, submittedDate, approvalDate, status });
    });

    setReportData(reports);
    setSelectedDate(null);
  }

  function handleClose(){
    setViewOpen(false)
  }

  function getReport(projectId, row) {
    dispatch(getDetailReport({ projectId: projectId, reportId: row._id })).then(
      () => {
        dispatch(openEditDialog(row));
      }
    );
  }

  function viewReport(data){
    dispatch(viewDailyReport({ projectId, reportId: data._id, userId})).then((response) => {
      setDailyData(response.payload);
      setViewOpen(true);
    });
  }

  return (
    <React.Fragment>
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color='inherit' />
      </Backdrop>
      <Paper className='w-full rounded-8 shadow-1'>
        <div className="flex items-center justify-between px-16 h-64 border-b-1">
          <div className="flex w-full items-center justify-start gap-10" >
            <Typography className="text-16 font-bold">Daily Data</Typography>
          </div>
          <div className="flex w-md items-end justify-end"  >
            <div className="flex flex-row gap-5">
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
               <DatePicker
                 inputFormat="yyyy-MM"
                 views={['year', 'month']}
                 maxDate={today}
                 className="w-1/3"
                 variant='contained'
                 label="Filter"
                 value={selectedDate}
                 onChange={handleDateChange}
               />
              </MuiPickersUtilsProvider>
              <IconButton>
                <ClearIcon color="primary" onClick={()=> clearAll()}/>
              </IconButton>
              {createAccess && hide === false?
                <Button color="primary" onClick={() => dispatch(openNewDialog())} variant="contained" style={{padding:'3px 16px'}} nowrap="true">Add Daily Data</Button> 
              :null}
              </div>
            
          </div>  
        </div>
        <FuseAnimate animation='transition.slideUpIn' delay={100}>
          <ReactTable
            filterable={route === 'Daily-Report' ? true : false}
            showPagination={route === 'Daily-Report' ? true : false}
            className={classes.root}
            getTrProps={(state, rowInfo, column) => {
              return {
                className: '-striped -highlight',
              };
            }}
            data={route === 'Daily-Report' ? reportData : newReport}
            columns={[
              {
                Header: 'Report Date',
                accessor: 'createdAt',
                style: { 'white-space': 'unset' },
                className: 'font-bold',
                Cell: ({ row }) => (
                  <a
                    className='cursor-pointer'
                    onClick={createAccess || deleteAccess || approveAccess ? () => getReport(projectId, row._original):
                      () => dispatchWarningMessage(dispatch, "You don't have access to open Daily Data Dialog. Contact Project Owner")}
                  >
                    {row.createdAt}
                  </a>
                ),
              },
              {
                Header: 'Submitted Time',
                id: 'submittedDate',
                style: { 'white-space': 'unset' },
                accessor: 'submittedDate',
                className: 'justify-center',
              },
              {
                Header: 'Approval Time',
                id: 'approvalDate',
                style: { 'white-space': 'unset' },
                accessor: 'approvalDate',
                className: 'justify-center',
              },
              {
                Header: 'Status',
                style: { textAlign:"center",'white-space': 'unset' },
                id: 'status',
                accessor: (d) => (
                  <Typography
                    className={
                      d.status === 'Submitted'
                        ? 'bg-yellow-700 text-white inline p-4 rounded truncate'
                        : d.status === 'Approved'
                        ? 'bg-green-700 text-white inline p-4 rounded truncate'
                        : d.status === 'New'
                        ? 'bg-blue  -700 text-white inline p-4 rounded truncate'
                        : d.status === 'Reverted'
                        ? 'bg-red  -700 text-white inline p-4 rounded truncate'
                        : 'bg-purple-700 text-white inline p-4 rounded truncate '
                    }
                  >
                    {d.status}
                  </Typography>
                ),
                className: 'font-bold',
              },
              {
                Header: 'Download / View ',
                style: { textAlign:"center",'white-space': 'unset' },
                id:'download_report',
                accessor: "downloadDailyReport",
                Cell: ({ row }) => (
                  <>
                    <a
                      className="cursor-pointer"
                      onClick={createAccess || deleteAccess ?() => {
                      dispatch(
                        downloadDailyReport({
                          projectId,
                          projectName,
                          date: row._original.createdAt,
                          reportId: row._original._id,
                          userId,
                          orgType
                        })
                      );
                    }: () => dispatchWarningMessage(dispatch, "You don't have access to Download Report. Contact Project Owner")}
                  >
                    Download
                  </a>
                  <span> / </span>
                  <a
                      className="cursor-pointer"
                      onClick={createAccess || deleteAccess ?() => {
                      viewReport(row._original)
                    }: () => dispatchWarningMessage(dispatch, "You don't have access to View Report. Contact Project Owner")}
                  >
                    View
                  </a>
                  </>
                ),
                className: 'font-bold',
              }
            ]}
            defaultPageSize={route === 'Daily-Report' ? 10 : 5}
            noDataText='No Daily-Data found'
          />
        </FuseAnimate>
      </Paper>
      {/* <FuseAnimate animation='transition.expandIn' delay={300}> */}
      {route === 'Daily-Report' ? (hide === true ? null :
        <Fab
          color='primary'
          aria-label='add'
          disabled={createAccess === true ? false :true}
          className={classes.addButton}
          onClick={() => dispatch(openNewDialog())}
        >
          <Icon>add</Icon>
        </Fab>
      ) : null}
      {/* </FuseAnimate> */}
      <ReportDialog />

      {viewOpen ?
       (orgType === 'SSA' ?
          <ViewSSaReport open={viewOpen} data={dailyData} close={handleClose} />
        :
          <ViewReport open={viewOpen} data={dailyData} from="list" close={handleClose} /> 
       ) 
      :null}
    </React.Fragment>
  );
}

// export default withReducer('reports', reducer)(Report);
export default DailyReport;
