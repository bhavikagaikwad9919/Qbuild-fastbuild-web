import React, { useState,useEffect, useRef  } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Fab, Icon } from "@material-ui/core";
import FuseAnimate from "@fuse/core/FuseAnimate";
import { useDispatch, useSelector } from "react-redux";
import ReactTable from "react-table-6";
import Paper from "@material-ui/core/Paper";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import moment from 'moment';
import ReportSummaryList from "./ReportSummaryList";
import ReportSummaryHeader from "./ReportSummaryHeader";
import FusePageCarded from "@fuse/core/FusePageCarded";
import { getReportSummary } from "app/main/summary/store/reportSlice";

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

function ReportSummary(props) {
  const dispatch = useDispatch();
  const pageLayout = useRef(null);
  useEffect(() => {
    dispatch(getReportSummary());
  }, [dispatch]);

  return (
    <React.Fragment>
    <FusePageCarded
      classes={{
        content: "flex flex-col",
        leftSidebar: "w-256 border-0",
        header: "min-h-72 h-72 sm:h-136 sm:min-h-136",
      }}
      header={<ReportSummaryHeader />}
      content={<ReportSummaryList />}
      sidebarInner
      ref={pageLayout}
      innerScroll
    />
  </React.Fragment>
  );
}

export default ReportSummary;
