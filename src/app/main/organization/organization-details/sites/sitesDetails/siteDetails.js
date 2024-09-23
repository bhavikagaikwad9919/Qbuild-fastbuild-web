import React, { useRef, useEffect, useState } from "react";
import FusePageCarded from "@fuse/core/FusePageCarded";
import { useDispatch, useSelector } from "react-redux";
import SiteDetailsHeader from "./SiteDetailsHeader";
import SiteProjects from "./components/Projects/SiteProjects";
import SiteInfo from "./components/SiteInfo";
import SiteReport from "./components/report/SiteReport";
import SiteSidebarContent from "./SiteSidebarContent";
import DataStructure from "./components/DataStructure";
import Backdrop from "@material-ui/core/Backdrop";
import { makeStyles } from "@material-ui/core/styles";
import { CircularProgress } from "@material-ui/core";
import { getSite  } from "../store/sitesSlice";
import { listMember } from "app/main/organization/store/organizationSlice";

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
  appBar: {
    position: 'relative',
  },
}));

function SiteDetails(props) {
  const classes = useStyles(props);
  const pageLayout = useRef(null);
  const dispatch = useDispatch();
  const [pageLoading, setPageLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const newRoutes = useSelector(({ sites }) => sites.routes);
  const details = useSelector(({ sites }) => sites.details);
 
  useEffect(() => {
    setPageLoading(true);
    dispatch(listMember({organizationId : props.match.params.organizationId}));
    dispatch(getSite({ OrganizationId :props.match.params.organizationId, SiteId : props.match.params.siteId })).then(
      (response) => {
        setPageLoading(false);
      }
    );
  }, [dispatch, props.match.params.siteId]);


  return (
    <React.Fragment>
      <Backdrop className={classes.backdrop} open={pageLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <FusePageCarded
        classes={{
          toolbar: "p-0",
          header: "min-h-72 h-72 sm:h-136 sm:min-h-136",
        }}
        header={<SiteDetailsHeader tab={tabValue} pageLayout={pageLayout} />}
        leftSidebarContent={<SiteSidebarContent />}
        content = {(()=>{
          switch (newRoutes) {
            case "Projects":
              return <SiteProjects organizationId = {props.match.params.organizationId} />;
            case "Data-Structure":
              return <DataStructure organizationId = {props.match.params.organizationId} />;
            case "Info":
              return <SiteInfo organizationId = {props.match.params.organizationId} />; 
            case "Reports":
              return <SiteReport organizationId = {props.match.params.organizationId} />; 
            default:
              return <SiteProjects organizationId = {props.match.params.organizationId} />;
          }
        })()}
        sidebarInner
        ref={pageLayout}
        innerScroll
      />
    </React.Fragment>
  );
}

export default SiteDetails;
