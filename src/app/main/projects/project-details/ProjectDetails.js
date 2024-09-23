import React, { useRef, useEffect } from "react";
import FusePageSimple from "@fuse/core/FusePageSimple";
import FusePageCarded from "@fuse/core/FusePageCarded";
import FuseLoading from "@fuse/core/FuseLoading";
import { useDispatch, useSelector } from "react-redux";
import {
  getProject,
  getReports,
  listInventories,
  getVendors,
  getInformation,
  listDocuments,
  listDocumentFolders,
  listDrawingFolders,
  listMilestones,
  listItems,
  listIndent,
  listPurchaseOrders,
  listTasks,
  getBillings,
  getBillingLastRecord,
  getTutorial,
  listObservations,
  getCubeRegister,
  listBills,
  listWorkOrders,
  listSafetyNcrs,
  listQualityNcrs,
  listIrFolders,
  listRfis,
  listGfcFolders,
  routes as newRoutes
} from "../store/projectsSlice";
import ProjectsSidebarContent from "./ProjectsSidebarContent";
import ProjectsHeader from "./projectsDetailsHeader/ProjectsDetailsHeader";
import Team from "./components/team/Team";
import Plans from "./components/plans/Plans";
import Tasks from "./components/task/TaskList";
import Upload from "./Upload";
import DailyReport from "./components/daily-report/DailyReport";
import Document from "./components/documents/Document";
import Inventory from "./components/inventory/Inventory";
import Report from "./components/report/Report";
import QualityControl from "./components/quality-control/cheklist/CheckList";
import Templates from "./components/quality-control/template/TemplateList";
import TemplateDetails from "./components/quality-control/template/TemplateDetails";
import Vendors from "./components/vendors/vendors";
import Settings from "./components/settings/SettingsPanel";
import Information from "./components/aditional-information/AdditionalInformation";
import Observations from "./components/observations/ObservationList";
import Map from "./components/map/Map";
import Billing from "./components/billing/billing";
import Mom from "./components/mom/mom";
import CubeRegister from "./components/cube-register/CubeRegister";
import BillRegister from "./components/bill-register/BillRegister";
import PurchaseOrder from "./components/purchase-order/PurchaseOrder";
import WorkOrder from "./components/work-order/WorkOrder";
import Milestone from "./components/milestone/milestone";
import SafetyNcr from "./components/safety-ncr/SafetyNcr";
import QualityNcr from "./components/quality-ncr/QualityNcr";
import WorkBOQ from "./components/work-boq/WorkBOQ";
import Indent from "./components/indent/Indent"
import DrawingRegister from "./components/drawing-register/DrawingRegister";
import { getNotification } from "app/main/notifications/store/notificationSlice";
import InspectionRequest from "./components/ir/InspectionRequest";
import RfiRegister from "./components/rfi-register/RfiRegister";
import GfcWorkflow from "./components/gfc-workflow/GfcWorkflow";
//import { dispatchSuccessMessage } from "app/utils/MessageDispatcher";
import { getData } from "app/main/dataStructure/store/dataSlice";
import { getSite } from "app/main/organization/organization-details/sites/store/sitesSlice";
import Dashboard from "../dashbords/user-dashboard/UserDashboard";
import { getOrganization  } from "app/main/organization/store/organizationSlice";

function ProjectDetails(props) {
  const pageLayout = useRef(null);
  const dispatch = useDispatch();
  const user = useSelector(({ auth }) => auth.user);
  //const notify = useSelector(({ notification }) => notification.entities);

  useEffect(() => {
    dispatch(getProject(props.match.params.projectId)).then((response) => {
      let modules = response.payload.module;
      let type = response.payload.projectType;
      let siteId = response.payload.siteId;
      let organizationId = response.payload.organizationId;

      if(type === "structuralAudit"){
        dispatch(newRoutes("Plans"));
      }else if(organizationId === undefined){
        dispatch(newRoutes("Dashboard"));
      }else if(organizationId === '62a3283d39f1809c9a65f804'){
        dispatch(newRoutes("Drawing-Register"));
      }else{
        dispatch(newRoutes("Dashboard"));
      }

      if(modules.includes('Daily Data') || modules.length === 0){
        dispatch(getReports(props.match.params.projectId));
      }
 
      if(modules.includes('Inventory') || modules.length === 0){
        dispatch(listInventories(props.match.params.projectId));
      }
    
      if(modules.includes('Agency') || modules.length === 0){
        dispatch(getVendors(props.match.params.projectId));
      }
    
      if(modules.includes('Billing') || modules.length === 0){
        dispatch(getBillings(props.match.params.projectId));
        dispatch(getBillingLastRecord(props.match.params.projectId));
      }
    
      if(modules.includes('Documents') || modules.length === 0){
        dispatch(listDocuments(props.match.params.projectId));
        dispatch(listDocumentFolders(props.match.params.projectId));
      }
    
      if(modules.includes('Milestones') || modules.length === 0){
        dispatch(listMilestones(props.match.params.projectId));
      }
    
      if(modules.includes('Bill Register') || modules.length === 0){
        dispatch(listBills(props.match.params.projectId));
      }
    
      if(modules.includes('Purchase Order') || modules.length === 0){
        dispatch(listPurchaseOrders(props.match.params.projectId));
      }
    
      if(modules.includes('Cube-Register') || modules.length === 0){
        dispatch(getCubeRegister(props.match.params.projectId));
      }
      console.log("123",props.match.params.projectId)

        dispatch(listIndent({projectId:props.match.params.projectId,page: 1, limit:50}));

      if(type === 'structuralAudit'){
        dispatch(getInformation(props.match.params.projectId));
        dispatch(listObservations(props.match.params.projectId));
      }
      
      dispatch(listWorkOrders(props.match.params.projectId));
      dispatch(getNotification(user.data.id));
      dispatch(listDrawingFolders(props.match.params.projectId));
      dispatch(listSafetyNcrs(props.match.params.projectId));
      dispatch(listQualityNcrs(props.match.params.projectId));
      dispatch(listItems(props.match.params.projectId));
      dispatch(listIrFolders(props.match.params.projectId));
      dispatch(listRfis(props.match.params.projectId));
      dispatch(listGfcFolders(props.match.params.projectId));

      if(organizationId !== undefined && siteId !== undefined){
        dispatch(getSite({OrganizationId : organizationId, SiteId: siteId}));
      }

      if(organizationId !== undefined){
        dispatch(getOrganization({ OrganizationId : organizationId }));
      }
    });
  }, []);
  const details = useSelector(({ projects }) => projects.details);
  const routes = useSelector(({ projects }) => projects.routes);

  useEffect(() => {
    var projectId = props.match.params.projectId;
    dispatch(getTutorial());
    dispatch(listTasks({ projectId }));
    dispatch(getData());
  }, []);


  // if(notify.length > 0){
  //   notify.forEach((noti)=>{
  //     if(noti.status === 1){
  //       dispatchSuccessMessage(dispatch, 'You have a new notifications. Please Check.');
  //     }
  //   })
  // }

  if (!details) {
    return <FuseLoading />;
  }
  return (
    <React.Fragment>
      <FusePageCarded
        classes={{
           // contentWrapper: "p-20 sm:px-24 sm:pt-0",
            content: "flex flex-col h-full p-10",
            leftSidebar: "w-256 border-0",
           // header: "min-h-72 h-72 sm:h-136 sm:min-h-136",//
        }}
        header={<ProjectsHeader pageLayout={pageLayout} />}
        content={(() => {
          switch (routes) {
            case "Upload":
              return <Upload />;
          case "Dashboard":
            return <Dashboard />;
            case "Tasks":
              return <Tasks />;
              case "Mom":
                return <Mom />;
            case "Milestone":
              return <Milestone />;
            case "Work-BOQ":
              return <WorkBOQ />; 
              case "Indent":
              return <Indent />;  
            case "Inspection-Request":
              return <InspectionRequest />;
            case "Rfi-Register":
              return <RfiRegister />;
            case "Gfc-Workflow":
              return <GfcWorkflow />;
            case "Plans":
              return <Plans />;
            case "Drawing-Register":
              return <DrawingRegister />;
            case "SafetyNcr":
              return <SafetyNcr />;
            case "QualityNcr":
              return <QualityNcr />;
            case "Team":
              return <Team />;
            case "Daily-Report":
              return <DailyReport />;
            case "Documents":
              return <Document />;
            case "FolderDoc":
              return <Document />;
            case "SubfolderDoc":
              return <Document />;
            case "Inventory":
              return <Inventory />;
            case "Report":
              return <Report />;
            case "Purchase-Order":
              return <PurchaseOrder />;
            case "Work-Order":
              return <WorkOrder />;
            case "Cube-Register":
              return <CubeRegister />;
            case "Bill-Register":
              return <BillRegister />;
            case "Quality-Control":
              return <QualityControl />;
            case "Templates":
              return <Templates />;
            case "Template-Details":
              return <TemplateDetails />;
            case "Vendors":
              return <Vendors />;
              case "Billing":
              return <Billing />;
            case "Settings":
              return <Settings />;
            case "Information":
              return <Information />;
            case "Observations":
              return <Observations />;
            case "Map":
              return <Map />;
            default:
              return <Upload />;
          }
        })()}
        leftSidebarContent={<ProjectsSidebarContent pageLayout={pageLayout} />}
        sidebarInner
        ref={pageLayout}
        innerScroll
      />
    </React.Fragment>
  );
}

export default ProjectDetails;
