import React, { useRef, useEffect, useState } from "react";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import FusePageCarded from "@fuse/core/FusePageCarded";
import { useDispatch, useSelector } from "react-redux";
import OrganizationHeader from "./organizationDetailsHeader";
import OrgMembers from "./member/OrgMembers";
import OrgProjects from "./projects/OrgProjects";
import OrgInfo from "./info/OrgInfo";
import OrgSites from "./sites/OrgSites";
import OrgDataStructure from "./dataStructure/OrgDataStructure";
import SSADashboard from "./dashboard/SSADashboard";
import OrgAgency from "./agency/OrgAgency";
import ReportSummary from "./summary/ReportSummary";
import Backdrop from "@material-ui/core/Backdrop";
import { makeStyles } from "@material-ui/core/styles";
import { CircularProgress } from "@material-ui/core";
import Chip from "@material-ui/core/Chip";
import { Typography } from "@material-ui/core";
import {  getAgencies  } from "../store/organizationSlice";
import { routes, getOrganization, listSite, listMember, getProjects } from "../store/organizationSlice";

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
  appBar: {
    position: 'relative',
  },
}));

function OrganizationDetails(props) {
  const classes = useStyles(props);
  const pageLayout = useRef(null);
  const dispatch = useDispatch();
  const [pageLoading, setPageLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const selectedRoutes = useSelector(({ organizations }) => organizations.routes);
  const newRoutes = useSelector(({ organizations }) => organizations.routes);
  const members = useSelector( ({ organizations }) => organizations.members);
  const agency = useSelector( ({ organizations }) => organizations.agency);
  const sites = useSelector( ({ organizations }) => organizations.sites);
  const associatedProjects = useSelector(({ organizations }) => organizations.associatedProjects);
  const ownedProjects = useSelector(({ organizations }) => organizations.ownedProjects);
  const orgProjects = useSelector(({ organizations }) => organizations.projects);
  const role = useSelector(({ auth }) => auth.user.role);
  const details = useSelector(({ organizations }) => organizations.organization);
  const userId = useSelector(({ auth }) => auth.user.data.id);
  const user = useSelector(({ auth }) => auth.user);
  const modulesOrg = ["Members","Sites","Info","Dashboard","Data Structure"];
  const [modules, setModules] = useState([]);
  const [orgOwner, setOrgOwner] = useState(false);

  let orgType = details.orgType;

  useEffect(() => {
    setPageLoading(true);
    dispatch(getOrganization({ OrganizationId : props.match.params.organizationId })).then(
      (response) => {
        dispatch(listSite({organizationId : props.match.params.organizationId}));
        dispatch(listMember({organizationId : props.match.params.organizationId}));
        dispatch(getAgencies(props.match.params.organizationId));
        dispatch(getProjects());
        setPageLoading(false);
      }
    );
  }, [dispatch, props.match.params.organizationId]);

  useEffect(() =>{
    if(user.role === 'admin' || userId === details.createdBy)
      {
        setModules(modulesOrg);
        setOrgOwner(true)
      }else{
        members.forEach((t)=>{
       if(t._id === user.data.id && t.designation === "Owner")
        {
          setModules(modulesOrg);
          setOrgOwner(true)
        }else if(t._id === user.data.id && t.designation !== "Owner")
        {
          setModules(t.access);
          setOrgOwner(false)
       }
      })
    }
  }, [members])

  function handleChangeTab(event, value) {
    setTabValue(value);
  }

  useEffect(() =>{
    if(modules.length === 0){
      setTabValue(0);
      dispatch(routes("Projects"))
    }else if(modules.length > 0){
      dispatch(routes(modules[0]))
    }
  }, [modules])

  return (
    <React.Fragment>
      <Backdrop className={classes.backdrop} open={pageLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <FusePageCarded
        classes={{
          toolbar: "p-0",
          header: "min-h-136 h-136 sm:h-136 sm:min-h-136",
        }}
        header={<OrganizationHeader tab={tabValue} pageLayout={pageLayout} />}
        contentToolbar={
          <Tabs
            value={tabValue}
            onChange={handleChangeTab}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
          >
            { modules.includes('Members')? 
            <Tab 
              selected={selectedRoutes === "Members" ? true : false} 
              className="h-64 normal-case"
              onClick={() => dispatch(routes("Members"))}
              label={
                <div>
                  <Typography variant="subtitle">
                    Members
                  </Typography>
                  <Chip
                    className="ml-12"
                    label={members.length}
                    size="small"
                    color="secondary"
                  />
                </div>
              }
            />
            :null}

            {orgType === 'SSA' && (modules.includes('Sites')) ? 
              <Tab
                selected={selectedRoutes === "Sites" ? true : false} 
                className="h-64 normal-case"
                onClick={() => dispatch(routes("Sites"))}
                label={
                  <div>
                    <Typography variant="subtitle"> Sites </Typography>
                    <Chip
                      className="ml-12"
                      label={sites.length}
                      size="small"
                      color="secondary"
                    />
                  </div>
                }
              />
            :null}

            <Tab
              selected={selectedRoutes === "Projects" ? true : false} 
              className="h-64 normal-case"
              onClick={() => dispatch(routes("Projects"))}
              label={
                <div>
                  <Typography variant="subtitle">
                    Projects
                  </Typography>
                  <Chip
                    className="ml-12"
                    label={role === 'admin' ? orgProjects.length : ownedProjects.length + associatedProjects.length}
                    size="small"
                    color="secondary"
                  />
                </div>
              }
            />     

            <Tab 
              selected={selectedRoutes === "Agency" ? true : false} 
              className="h-64 normal-case"
              onClick={() => dispatch(routes("Agency"))}
              label={
                <div>
                  <Typography variant="subtitle">
                    Agency
                  </Typography>
                  <Chip
                    className="ml-12"
                    label={agency.length}
                    size="small"
                    color="secondary"
                  />
                </div>
              }
            />

            {modules.includes('Info') ?
              <Tab
                selected={selectedRoutes === "Info" ? true : false}
                className="h-64 normal-case"
                label="Organization Info"
                onClick={() => dispatch(routes("Info"))}
              />
            :null}
            
            {modules.includes('Dashboard') && orgType === 'SSA' ? 
              <Tab
                selected={selectedRoutes === "SSADashboard" ? true : false}
                className="h-64 normal-case"
                label="Dashboard"
                onClick={() => dispatch(routes("SSADashboard"))}
              />
            :null}

            {modules.includes('Data Structure') ? 
              <Tab
                selected={selectedRoutes === "OrgDataStructure" ? true : false}
                className="h-64 normal-case"
                label="Data Structure"
                onClick={() => dispatch(routes("OrgDataStructure"))}
              />  
            :null}

            {user.role === 'admin' ?
              <Tab
                selected={selectedRoutes === "Summary" ? true : false}
                className="h-64 normal-case"
                label="Report Summary"
                onClick={() => dispatch(routes("Summary"))}
              /> 
            :null}
            
          </Tabs>
        }
        content = {(()=>{
          switch (newRoutes) {
            case "Projects":
              return <OrgProjects />;
            case "Members":
              return <OrgMembers />;
            case "Sites":
              return <OrgSites />;  
            case "Agency":
              return <OrgAgency />;   
            case "Info":
              return <OrgInfo />;
            case "OrgDataStructure":
              return <OrgDataStructure /> ; 
            case "SSADashboard":
              return <SSADashboard />;  
            case "Summary" :
              return <ReportSummary />
            default:
              return <OrgProjects />;
          }
        })()}
      // ref={pageLayout}
        innerScroll
      />
    </React.Fragment>
  );
}

export default OrganizationDetails;