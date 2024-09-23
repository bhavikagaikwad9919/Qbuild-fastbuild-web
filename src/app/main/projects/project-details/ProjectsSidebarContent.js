import React, { useState } from "react";
import {
  Badge,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import FuseAnimate from "@fuse/core/FuseAnimate";
import { routes } from "../store/projectsSlice";
import { useDispatch, useSelector } from "react-redux";
import Avatar from '@material-ui/core/Avatar';
import moment from "moment/moment";
import { useEffect } from "react";
import {
  openNewDialog,
  openEditDialog,
  listIndent,
  detailIndent
} from "app/main/projects/store/projectsSlice";

const useStyles = makeStyles((theme) => ({
  listItem: {
    textDecoration: "none!important",
    height: 40,
    width: "calc(100% - 16px)",
    borderRadius: "0 20px 20px 0",
    paddingLeft: 24,
    paddingRight: 12,
    "&.active": {
      pointerEvents: "none",
      "& .list-item-icon": {
      },
    },
    "& .list-item-icon": {
      marginRight: 16,
    },
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 3,
    color: '#fff',
  },
}));

function ProjectsSidebarContent(props) {
  const classes = useStyles(props);
  const dispatch = useDispatch();
  const projectDetails = useSelector(({ projects }) => projects.details);
  const selctedRoutes = useSelector(({ projects }) => projects.routes);
  const documentCount = useSelector(({ projects }) => projects.document.documentsArray.length);
  const cubeRegister = useSelector(({ projects }) => projects.cubeRegister.sampleList);
  const inventoryCount = useSelector(({ projects }) => projects.inventories.length);
  const vendorCount = useSelector(({ projects }) => projects.vendors.vendorsList.length);
  const modulesPr = useSelector(({ projects }) => projects.details.module);
  const entities = useSelector(({ projects }) => projects);
  const userId = useSelector(({ auth }) => auth.user.data.id);
  const projectName = useSelector(({ projects }) => projects.details.title);
  const projectType = useSelector(({ projects }) => projects.details.projectType);
  const details = useSelector(({ organizations }) => organizations.organization);
  const team = useSelector(({ projects }) => projects.details.team);
  const user = useSelector(({ auth }) => auth.user);
  const role = useSelector(({ auth }) => auth.user.role);
  const [modules, setModules] = useState([]);
  const [prOwner, setPrOwner] = useState(false);
  const [org, setOrg] = useState([]);
  const [orgType, setOrgType] = useState('')
  const [orgName, setOrgName] = useState('');
  const [prName, setPrName] = useState(projectName);
  const indent = useSelector(({ projects }) => projects.indent.indentlist);
  const pendingIntentsCount = useSelector(({ projects }) => projects.indent.pendingIntentsCount);

  let cubeCount = 0;
  let date = new Date();
  let today = moment(date).format("DD/MM/YYYY");

  useEffect(() => {
    team.forEach((t) => {

      if (user.role === 'admin') {
        setModules(modulesPr);
        setPrOwner(true)
      } else if (t._id === user.data.id && t.role === "owner") {
        setModules(modulesPr);
        setPrOwner(true)
      } else if (t._id === user.data.id && user.role !== "owner") {
        setModules(t.tab_access);
        setPrOwner(false)
      }

    })
  }, [team])

  useEffect(() => {
    if (projectType === 'structuralAudit') {
      dispatch(routes("Plans"))
    }
  }, [])

  useEffect(() => {
    if (details === undefined || details === null) {
      setOrgType('');
    } else {
      let type = details.orgType === undefined || details.orgType === null ? '' : details.orgType;
      setOrgType(type);
      setOrgName(details.name)
    }
  }, [details]);


  cubeRegister.forEach((element) => {
    let Date1 = moment(element.FirstResult_Reminder_Date).format("DD/MM/YYYY");
    let Date2 = moment(element.SecondResult_Reminder_Date).format("DD/MM/YYYY");

    if (process(Date1) < process(today) && element.FirstTestData[0].data.length <= 0) {
      cubeCount++;
    } else if (process(Date2) < process(today) && element.SecondTestData[0].data.length <= 0) {
      cubeCount++;
    }
  });

  function process(date) {
    var parts = date.split("/");
    return new Date(parts[2], parts[1] - 1, parts[0]);
  }

  function report() {
    dispatch(routes("Daily-Report"));
  }

  function inventory() {
    dispatch(routes("Inventory"));
  }

  return (
    <div className="pt-20">
      <FuseAnimate animation="transition.slideLeftIn" delay={200}>
        <List>
          <ListItem
            activeclassname="active"
          >
            <ListItemIcon className='min-w-30'>
              <Avatar>{projectName[0]}</Avatar>
            </ListItemIcon>
            <ListItemText
              className=" pr-0 text-16 font-bold"
              primary={projectName}
              disableTypography={true}
            />
          </ListItem>

          {projectType !== 'structuralAudit' && orgType !== 'SSA' ?
            <ListItem
              button
              selected={selctedRoutes === "Dashboard" ? true : false}
              onClick={() => {
                dispatch(routes("Dashboard"))
                props.pageLayout.current.toggleLeftSidebar()
              }}
              activeclassname="active"
              className={classes.listItem}
            >
              <ListItemText className="truncate pr-0" primary="DashBoard" disableTypography={true} />
            </ListItem>
            : null}

          {orgType === 'SSA' ?
            <>
              <ListItem
                button
                onClick={() => {
                  dispatch(routes("Drawing-Register"))
                  props.pageLayout.current.toggleLeftSidebar()
                }}
                selected={selctedRoutes === "Drawing-Register" ? true : false}
                activeclassname="active"
                className={classes.listItem}
              >
                <ListItemText
                  className="truncate pr-0"
                  primary="Drawing Register"
                  disableTypography={true}
                />
                <Badge
                  className="mr-4"
                  color="secondary"
                  showZero
                />
              </ListItem>

              <ListItem
                button
                onClick={() => {
                  dispatch(routes("SafetyNcr"))
                  props.pageLayout.current.toggleLeftSidebar()
                }}
                selected={selctedRoutes === "SafetyNcr" ? true : false}
                activeclassname="active"
                className={classes.listItem}
              >
                <ListItemText
                  className="truncate pr-0"
                  primary="Safety NCR"
                  disableTypography={true}
                />

                <Badge
                  className="mr-4"
                  color="secondary"
                  showZero
                />
              </ListItem>

              <ListItem
                button
                onClick={() => {
                  dispatch(routes("QualityNcr"))
                  props.pageLayout.current.toggleLeftSidebar()
                }}
                selected={selctedRoutes === "QualityNcr" ? true : false}
                activeclassname="active"
                className={classes.listItem}
              >
                <ListItemText
                  className="truncate pr-0"
                  primary="Quality NCR"
                  disableTypography={true}
                />

                <Badge
                  className="mr-4"
                  color="secondary"
                  showZero
                />
              </ListItem>

              <ListItem
                button
                selected={selctedRoutes === "Inspection-Request" ? true : false}
                onClick={() => dispatch(routes("Inspection-Request"))}
                activeclassname="active"
                className={classes.listItem}
              >
                <ListItemText
                  className="truncate pr-0"
                  primary="Inspection Request"
                  disableTypography={true}
                />

                <Badge
                  className="mr-4"
                  color="secondary"
                  showZero
                />
              </ListItem>

              <ListItem
                button
                selected={selctedRoutes === "Rfi-Register" ? true : false}
                onClick={() => dispatch(routes("Rfi-Register"))}
                activeclassname="active"
                className={classes.listItem}
              >
                <ListItemText
                  className="truncate pr-0"
                  primary="RFI Register"
                  disableTypography={true}
                />

                <Badge
                  className="mr-4"
                  color="secondary"
                  showZero

                />
              </ListItem>
            </>
            : null}

          {modules.length === 0 || modules.includes('Plans') || modules.includes('Upload Plan') || modules.includes('View Plan') || modules.includes('Mark On Plan') || modules.includes('Remove Plan') ?
            <ListItem
              button
              selected={selctedRoutes === "Plans" ? true : false}
              onClick={() => {
                dispatch(routes("Plans"))
                props.pageLayout.current.toggleLeftSidebar()
              }}
              className={classes.listItem}
            >
              <ListItemText
                className="truncate pr-0"
                primary="Plans"
                disableTypography={true}
              />
              <Badge
                className="mr-4"
                color="secondary"
                showZero
                badgeContent={entities.details.plans.length}
              />
            </ListItem>
            : null}

          {modules.length === 0 || modules.includes('Tasks') ?
            <ListItem
              selected={selctedRoutes === "Tasks" ? true : false}
              button
              onClick={() => {
                dispatch(routes("Tasks"))
                props.pageLayout.current.toggleLeftSidebar()
              }}
              className={classes.listItem}
            >
              <ListItemText
                className="truncate pr-0"
                primary="Tasks"
                disableTypography={true}
              />
              <Badge
                className="mr-4"
                color="secondary"
                showZero
                badgeContent={entities.tasks.tasksArray.length}
              />
            </ListItem>
            : null}

          {modules.length === 0 || modules.includes('Documents') || modules.includes('Create/Update Folder') || modules.includes('Upload Document') || modules.includes('Update Document Details') || modules.includes('View/Download Document') || modules.includes('Delete Document') ?
            <ListItem
              selected={selctedRoutes === "Documents" ? true : false}
              button
              onClick={() => {
                dispatch(routes("Documents"))
                props.pageLayout.current.toggleLeftSidebar()
              }}
              activeclassname="active"
              className={classes.listItem}
            >
              <ListItemText
                className="truncate pr-0"
                primary="Documents"
                disableTypography={true}
              />
              <Badge
                className="mr-4"
                color="secondary"
                showZero
                badgeContent={documentCount}
              />
            </ListItem>
            : null}

          {(modules.length === 0 || modules.includes('Agency') || modules.includes('Sub-Contractors')) && orgType !== 'SSA' ?
            <ListItem
              button
              onClick={() => {
                dispatch(routes("Vendors"))
                props.pageLayout.current.toggleLeftSidebar()
              }}
              selected={selctedRoutes === "Vendors" ? true : false}
              activeclassname="active"
              className={classes.listItem}
            >
              <ListItemText
                className="truncate pr-0"
                primary="Agency"
                disableTypography={true}
              />
              <Badge
                className="mr-4"
                color="secondary"
                showZero
                badgeContent={vendorCount}
              />
            </ListItem>
            : null}

          {modules.length === 0 || modules.includes('Inventory') && orgType !== 'SSA' ?
            <ListItem
              button
              onClick={() => {
                inventory()
                props.pageLayout.current.toggleLeftSidebar()
              }}
              selected={selctedRoutes === "Inventory" ? true : false}
              activeclassname="active"
              className={classes.listItem}
            >
              <ListItemText
                className="truncate pr-0"
                primary="Inventory"
                disableTypography={true}
              />
              <Badge
                className="mr-4"
                color="secondary"
                showZero
                badgeContent={inventoryCount}
              />
            </ListItem>
            : null}

          {(modules.length === 0 || modules.includes('Work BOQ')) && orgType !== 'SSA' ?
            <ListItem
              button
              selected={selctedRoutes === "Work-BOQ" ? true : false}
              onClick={() => {
                dispatch(routes("Work-BOQ"))
                props.pageLayout.current.toggleLeftSidebar()
              }}
              className={classes.listItem}
            >
              <ListItemText
                className="truncate pr-0"
                primary="Work BOQ"
                disableTypography={true}
              />
              <Badge
                className="mr-4"
                color="secondary"
                showZero
                badgeContent={entities.workBOQs.workBOQsList.length}
              />
            </ListItem>
            : null}

          {modules.length === 0 || modules.includes('Work Order') ?
            <ListItem
              button
              onClick={() => {
                dispatch(routes("Work-Order"))
                props.pageLayout.current.toggleLeftSidebar()
              }}
              selected={selctedRoutes === "Work-Order" ? true : false}
              activeclassname="active"
              className={classes.listItem}
            >
              <ListItemText
                className="truncate pr-0"
                primary="Work Order"
                disableTypography={true}
              />
              <Badge
                className="mr-4"
                color="secondary"
                showZero
                badgeContent={entities.workOrders.workOrderList.length}
              />
            </ListItem>
            : null}

         
          <ListItem
            button
            onClick={() => {
              dispatch(routes("Indent"))
              props.pageLayout.current.toggleLeftSidebar()
            }}
            selected={selctedRoutes === "Indent" ? true : false}
            activeclassname="active"
            className={classes.listItem}
          >
            <ListItemText
              className="truncate pr-0"
              primary="Indent"
              disableTypography={true}
            />
            <Badge
              className="mr-4"
              color="error"
              showZero
              badgeContent={pendingIntentsCount} />
          </ListItem>

          {modules.length === 0 || modules.includes('Purchase Order') | modules.includes('Create/Update Purchase Order') || modules.includes('View Purchase Order') || modules.includes('Download Purchase Order') ?
            <ListItem
              button
              onClick={() => {
                dispatch(routes("Purchase-Order"))
                props.pageLayout.current.toggleLeftSidebar()
              }}
              selected={selctedRoutes === "Purchase-Order" ? true : false}
              activeclassname="active"
              className={classes.listItem}
            >
              <ListItemText
                className="truncate pr-0"
                primary="Purchase Order"
                disableTypography={true}
              />
              <Badge
                className="mr-4"
                color="secondary"
                showZero
                badgeContent={entities.purchaseOrders.purchaseOrderList.length}
              />
            </ListItem>
            : null}

          {modules.length === 0 || modules.includes('Daily Data') || modules.includes('Create/Update Daily Data') || modules.includes('Remove Daily Data Entries') || modules.includes('Approve / Revert Daily Data') || modules.includes('View Daily Data') || modules.includes('Download Daily Data') ?
            <ListItem
              button
              className={classes.listItem}
              selected={selctedRoutes === "Daily-Report" ? true : false}
              onClick={() => {
                report()
                props.pageLayout.current.toggleLeftSidebar()
              }}
            >
              <ListItemText
                className="truncate pr-0"
                primary="Daily-Data"
                disableTypography={true}
              />
              <Badge
                className="mr-4"
                color="secondary"
                showZero
                badgeContent={entities.reports.length}

              />
            </ListItem>
            : null}

          {modules.length === 0 || modules.includes('Bill Register') ?
            <ListItem
              button
              onClick={() => {
                dispatch(routes("Bill-Register"))
                props.pageLayout.current.toggleLeftSidebar()
              }}
              selected={selctedRoutes === "Bill-Register" ? true : false}
              activeclassname="active"
              className={classes.listItem}
            >
              <ListItemText
                className="truncate pr-0"
                primary="Bill Register"
                disableTypography={true}
              />
              <Badge
                className="mr-4"
                color="secondary"
                showZero
                badgeContent={entities.bills.billsList.length}
              />
            </ListItem>
            : null}

          {projectDetails.projectType === "structuralAudit" ? (
            <>
              <ListItem
                button
                selected={selctedRoutes === "Observations" ? true : false}
                className={classes.listItem}
                onClick={() => {
                  dispatch(routes("Observations"))
                  props.pageLayout.current.toggleLeftSidebar()
                }}
              >
                <ListItemText
                  className="truncate pr-0"
                  primary="General Observations"
                  disableTypography={true}
                />
                <Badge
                  className="mr-4"
                  color="secondary"
                  showZero
                  badgeContent={entities.observations.observationsArray.length}
                />
              </ListItem>

              <ListItem
                button
                selected={selctedRoutes === "Information" ? true : false}
                className={classes.listItem}
                onClick={() => {
                  dispatch(routes("Information"))
                  props.pageLayout.current.toggleLeftSidebar()
                }}
              >
                <ListItemText
                  className="truncate pr-0"
                  primary="Additional Information"
                  disableTypography={true}
                />
              </ListItem>

            </>
          ) : null}

          {modules.length === 0 || modules.includes('Cube-Register') ?
            <ListItem
              button
              onClick={() => {
                dispatch(routes("Cube-Register"))
                props.pageLayout.current.toggleLeftSidebar()
              }}
              selected={selctedRoutes === "Cube-Register" ? true : false}
              activeclassname="active"
              className={classes.listItem}
            >
              <ListItemText
                className="truncate pr-0"
                primary="Cube Register"
                disableTypography={true}
              />
              {cubeCount > 0 ?
                <Badge
                  className="mr-4"
                  color="error"
                  showZero
                  badgeContent={cubeCount}
                />
                :
                <Badge
                  className="mr-4"
                  color="secondary"
                  showZero
                  badgeContent={entities.cubeRegister.sampleList.length}
                />
              }
            </ListItem>
            : null}

          {orgType === 'SSA' ? null :
            <ListItem
              button
              onClick={() => {
                dispatch(routes("Quality-Control"))
                props.pageLayout.current.toggleLeftSidebar()
              }}
              selected={selctedRoutes === "Quality-Control" ? true : false}
              activeclassname="active"
              className={classes.listItem}
            >
              <ListItemText
                className="truncate pr-0"
                primary="Checklists"
                disableTypography={true}
              />
              <Badge
                className="mr-4"
                color="secondary"
                showZero
                badgeContent={entities.checklist.checklistArray.length}
              />
            </ListItem>
          }

          {modules.length === 0 || modules.includes('Buildings And Areas') ?
            <ListItem
              button
              selected={selctedRoutes === "Upload" ? true : false}
              className={classes.listItem}
              onClick={() => {
                dispatch(routes("Upload"))
                props.pageLayout.current.toggleLeftSidebar()
              }}
            >
              <ListItemText
                className="truncate pr-0"
                primary="Buildings and Areas"
                disableTypography={true}
              />
              <Badge
                className="mr-4"
                color="secondary"
                showZero
                badgeContent={entities.details.buildings.length}
              />
            </ListItem>
            : null}

          {modules.length === 0 || modules.includes('Billing') ?
            <ListItem
              button
              onClick={() => {
                dispatch(routes("Billing"))
                props.pageLayout.current.toggleLeftSidebar()
              }}
              selected={selctedRoutes === "Billing" ? true : false}
              activeclassname="active"
              className={classes.listItem}
            >
              <ListItemText
                className="truncate pr-0"
                primary="Billing"
                disableTypography={true}
              />
              <Badge
                className="mr-4"
                color="secondary"
                showZero
                badgeContent={entities.billing.billingList.length}
              />
            </ListItem>
            : null}

              <ListItem
              selected={selctedRoutes === "Mom" ? true : false}
              button
              onClick={() => {
                dispatch(routes("Mom"))
                props.pageLayout.current.toggleLeftSidebar()
              }}
              className={classes.listItem}
            >
              <ListItemText
                className="truncate pr-0"
                primary="Mom"
                disableTypography={true}
              />
              <Badge
                className="mr-4"
                color="secondary"
                showZero
                badgeContent={entities.mom.momArray.length}
              />
            </ListItem>
          
          {/* <ListItem
            button
            onClick={() => {
              dispatch(routes("Indent"));
              props.pageLayout.current.toggleLeftSidebar();
            }}
            selected={selctedRoutes === "Indent" ? true : false}
            activeclassname="active"
            className={classes.listItem}
          >
            <ListItemText
              className="truncate pr-0"
              primary="Indent"
              disableTypography={true}
            />
           

          </ListItem>  */}




          {modules.length === 0 || modules.includes('Plans') || orgType === 'SSA' || modules.includes('Tasks') || modules.includes('Daily Data') || modules.includes('Cube-Register') || projectDetails.projectType === "structuralAudit" || modules.includes('Reports') || modules.includes('Daily Data Reports') || modules.includes("Cube Register Excel Reports") || modules.includes("Plan Summary Reports") || modules.includes("Tasks Excel Reports") ?
            <ListItem
              button
              onClick={() => {
                dispatch(routes("Report"))
                props.pageLayout.current.toggleLeftSidebar()
              }}
              selected={selctedRoutes === "Report" ? true : false}
              activeclassname="active"
              className={classes.listItem}
            >
              <ListItemText
                className="truncate pr-0"
                primary="Reports"
                disableTypography={true}
              />
            </ListItem>
            : null}

          {projectDetails.projectType === "infrastucture" ? (
            <ListItem
              button
              onClick={() => {
                dispatch(routes("Map"))
                props.pageLayout.current.toggleLeftSidebar()
              }}
              selected={selctedRoutes === "Map" ? true : false}
              activeclassname="active"
              className={classes.listItem}
            >
              <ListItemText
                className="truncate pr-0"
                primary="Map"
                disableTypography={true}
              />
            </ListItem>
          ) : null}
          {projectDetails.projectType === "infrastucture" ? (
            <ListItem
              button
              onClick={() => {
                dispatch(routes("Map"))
                props.pageLayout.current.toggleLeftSidebar()
              }}
              selected={selctedRoutes === "Map" ? true : false}
              activeclassname="active"
              className={classes.listItem}
            >
              <ListItemText
                className="truncate pr-0"
                primary="Map"
                disableTypography={true}
              />
            </ListItem>
          ) : null}




          {prOwner === true ?
            <ListItem
              button
              onClick={() => {
                dispatch(routes("Settings"))
                props.pageLayout.current.toggleLeftSidebar()
              }}
              selected={selctedRoutes === "Settings" ? true : false}
              activeclassname="active"
              className={classes.listItem}
            >
              <ListItemText className="truncate pr-0" primary="Settings" disableTypography={true} />
            </ListItem>
            : null}
        </List>
      </FuseAnimate>
    </div>
  );
}

export default ProjectsSidebarContent;
//export default withReducer('projects', reducer)(Report);
