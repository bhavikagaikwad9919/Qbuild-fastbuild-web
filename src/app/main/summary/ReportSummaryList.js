import React, { useState,useEffect, useRef } from "react";
import FuseAnimate from "@fuse/core/FuseAnimate";
import FuseLoading from "@fuse/core/FuseLoading";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "react-redux";
import ReactTable from "react-table-6";
import "react-table-6/react-table.css";
import moment from "moment";
import { Fab, Icon, Paper, Typography } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { showMessage } from "app/store/fuse/messageSlice";
import { getReportSummary } from "app/main/summary/store/reportSlice";
import Backdrop from '@material-ui/core/Backdrop';
import ClearIcon from "@material-ui/icons/Clear";
import IconButton from "@material-ui/core/IconButton";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles({
  root: {
    maxHeight: "76vh",
  },
});


function ReportSummaryList(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [details, setDetails] = useState([]);
  const [loading,  setLoading] = useState(false)
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  let today = new Date();

  useEffect(() => {
    setLoading(true)
    let finalDate = moment(today).format('YYYY-MM-DD');
    dispatch(getReportSummary({date : finalDate})).then((response) => {
      setDetails(response.payload);
      setLoading(false)
    })
  }, []);

  let list = [];
  let _id = '';
  let createdAt = '';
  let reportName = '';
  let actionType = '';
  let createdBy = '';
  let title = '';
  let projectName = '';

  
  details.forEach((element) => {
     _id = element._id;
     createdAt = moment(element.createdAt).format('Do MMMM YYYY, h:mm:ss A');
     reportName = element.reportName;
     actionType = element.actionType;
     createdBy = element.createdBy === undefined || element.createdBy === null ? '' : element.createdBy.name;
     title = element.title;
     projectName = element.projectId === null ? '' : element.projectId.title;

     list.push({ _id, createdAt, title, reportName, projectName, actionType, createdBy });
  })

  function filterCaseInsensitive(filter, row) {
    const id = filter.pivotId || filter.id;
    return (
      row[id] !== undefined ?
        String(row[id].toLowerCase()).startsWith(filter.value.toLowerCase())
      :
        false
    );
  }

  if (!details) {
    return (
      <div className="flex flex-1 items-center justify-center h-full">
        <FuseLoading />;
      </div>
    );
  }

  const handleDateChange = (filterDate) => { 
    setLoading(true)
    setSelectedDate(filterDate);
    let finalDate = moment(filterDate).format('YYYY-MM-DD');
    dispatch(getReportSummary({date : finalDate})).then((response) => {
      setDetails(response.payload);
      setLoading(false)
    })
  };

  const clearAll = () =>{
    setLoading(true)
    let finalDate = moment(today).format('YYYY-MM-DD');
    dispatch(getReportSummary({date : finalDate})).then((response) => {
      setDetails(response.payload);
      setLoading(false)
    })
    setSelectedDate(today);
  }

  return (
    <React.Fragment>
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color='inherit' />
      </Backdrop>
    
    <Paper className='w-full rounded-8 shadow-1'>
      <div className="flex items-center justify-between px-16 h-64 border-b-1">
          <div className="flex w-full items-center justify-start gap-10" >
            <Typography className="text-16 font-bold">Summary</Typography>
          </div>
          <div className="flex w-md items-end justify-end"  >
            <div className="flex flex-row gap-5">
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
               <DatePicker
                 maxDate={today}
                 format="dd/MM/yyyy"
                 variant='contained'
                 label="Filter"
                 value={selectedDate}
                 onChange={handleDateChange}
               />
              </MuiPickersUtilsProvider>
              <IconButton>
                <ClearIcon color="primary" onClick={()=> clearAll()}/>
              </IconButton>
              </div>
          </div>
        </div>
      <FuseAnimate animation="transition.slideUpIn">
      <ReactTable
        className={clsx(
          classes.root,
          "-striped -highlight sm:rounded-16 overflow-hidden px-6"
        )}
        data={list}
        filterable
        defaultFilterMethod={(filter, row) => filterCaseInsensitive(filter, row) }
        columns={[
          {
            Header: "Project Name",
            accessor: "projectName",
            style: { 'whiteSpace': 'unset' },
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
                Header: "Report Name",
                accessor: "reportName",
                style: { 'whiteSpace': 'unset' },
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
                Header: "Title",
                accessor: "title",
                style: { 'whiteSpace': 'unset' },
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
                Header: "Action",
                accessor: "actionType",
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
                Header: "User Name",
                accessor: "createdBy",
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
              {
                Header: "Date",
                accessor: "createdAt",
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
        defaultPageSize={20}
        noDataText="No data found"
      />
     </FuseAnimate>
    </Paper>
    </React.Fragment> 
  )
}

export default ReportSummaryList;
