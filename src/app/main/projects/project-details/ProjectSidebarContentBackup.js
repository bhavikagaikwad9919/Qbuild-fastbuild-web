import React, { useEffect, useState } from "react";
import {
  Badge,
  Icon,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import FuseAnimate from "@fuse/core/FuseAnimate";
import { routes } from "../store/projectsSlice";
import { useDispatch, useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
  listItem: {
    //color: 'inherit!important',
    textDecoration: "none!important",
    height: 40,
    width: "calc(100% - 16px)",
    borderRadius: "0 20px 20px 0",
    paddingLeft: 24,
    paddingRight: 12,
    "&.active": {
      //backgroundColor: theme.palette.secondary.main,
      //color: theme.palette.secondary.contrastText + '!important',
      pointerEvents: "none",
      "& .list-item-icon": {
        //color: 'inherit',
      },
    },
    "& .list-item-icon": {
      marginRight: 16,
    },
  },
}));

function ProjectsSidebarContent(props) {
  const classes = useStyles(props);
  const dispatch = useDispatch();
  const projectDetails = useSelector(({ projects }) => projects.details);
  const selctedRoutes = useSelector(({ projects }) => projects.routes);
  const documentCount = useSelector(
    ({ projects }) => projects.document.documentsArray.length
  );
  const inventoryCount = useSelector(
    ({ projects }) => projects.inventories.length
  );
  const vendorCount = useSelector(
    ({ projects }) => projects.vendors.vendorsList.length
  );
  const [count, setCount] = useState({
    team: 0,
    plans: 0,
  });

  useEffect(() => {
    if (projectDetails) {
      setCount({
        ...count,
        team: projectDetails.team.length,
        plans: projectDetails.plans.length,
      });
    }
  }, []);

  function report() {
    dispatch(routes("Daily-Report"));
  }
  function inventory() {
    dispatch(routes("Inventory"));
  }
  return (
    <div className="pt-24">
      <FuseAnimate animation="transition.slideLeftIn" delay={200}>
        <List>
          <ListItem
            button
            selected={selctedRoutes === "Team" ? true : false}
            onClick={() => dispatch(routes("Team"))}
            activeclassname="active"
            className={classes.listItem}
          >
            <ListItemText
              className="truncate pr-0"
              primary="Team"
              disableTypography={true}
            />

            <Badge
              className="mr-4"
              color="secondary"
              showZero
              badgeContent={count.team}
            />
          </ListItem>

          <ListItem
            selected={selctedRoutes === "Documents" ? true : false}
            button
            onClick={() => dispatch(routes("Documents"))}
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
          <ListItem
            button
            selected={selctedRoutes === "Plans" ? true : false}
            onClick={() => dispatch(routes("Plans"))}
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
              badgeContent={count.plans}
            />
          </ListItem>
          <ListItem
            button
            onClick={() => inventory()}
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
          <ListItem
            button
            onClick={() => dispatch(routes("Vendors"))}
            selected={selctedRoutes === "Vendors" ? true : false}
            activeclassname="active"
            className={classes.listItem}
          >
            <ListItemText
              className="truncate pr-0"
              primary="Sub-Contractors"
              disableTypography={true}
            />
            <Badge
              className="mr-4"
              color="secondary"
              showZero
              badgeContent={vendorCount}
            />
          </ListItem>
          <ListItem
            button
            className={classes.listItem}
            selected={selctedRoutes === "Daily-Report" ? true : false}
            onClick={() => report()}
          >
            <ListItemText
              className="truncate pr-0"
              primary="Daily-Report"
              disableTypography={true}
            />
          </ListItem>

          <ListItem
            selected={selctedRoutes === "Tasks" ? true : false}
            button
            onClick={() => dispatch(routes("Tasks"))}
            className={classes.listItem}
          >
            <ListItemText
              className="truncate pr-0"
              primary="Tasks"
              disableTypography={true}
            />
          </ListItem>
          {projectDetails.projectType === "structuralAudit" ? (
            <>
              <ListItem
                button
                selected={selctedRoutes === "Information" ? true : false}
                className={classes.listItem}
                onClick={() => dispatch(routes("Information"))}
              >
                <ListItemText
                  className="truncate pr-0"
                  primary="Additional Information"
                  disableTypography={true}
                />
              </ListItem>
              <ListItem
                button
                selected={selctedRoutes === "Observations" ? true : false}
                className={classes.listItem}
                onClick={() => dispatch(routes("Observations"))}
              >
                <ListItemText
                  className="truncate pr-0"
                  primary="General Observations"
                  disableTypography={true}
                />
              </ListItem>
            </>
          ) : null}

          <ListItem
            button
            onClick={() => dispatch(routes("Quality-Control"))}
            selected={selctedRoutes === "Quality-Control" ? true : false}
            activeclassname="active"
            className={classes.listItem}
          >
            <ListItemText
              className="truncate pr-0"
              primary="Quality Control"
              disableTypography={true}
            />
          </ListItem>
          <ListItem
            button
            selected={selctedRoutes === "Upload" ? true : false}
            className={classes.listItem}
            onClick={() => dispatch(routes("Upload"))}
          >
            <ListItemText
              className="truncate pr-0"
              primary="Buildings and Areas"
              disableTypography={true}
            />
          </ListItem>
          <ListItem
            button
            onClick={() => dispatch(routes("Report"))}
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

          {projectDetails.projectType === "infrastructure" ? (
            <ListItem
              button
              onClick={() => dispatch(routes("Map"))}
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
          <ListItem
            button
            onClick={() => dispatch(routes("Settings"))}
            selected={selctedRoutes === "Settings" ? true : false}
            activeclassname="active"
            className={classes.listItem}
          >
            <ListItemText
              className="truncate pr-0"
              primary="Settings"
              disableTypography={true}
            />
          </ListItem>
        </List>
      </FuseAnimate>
    </div>
  );
}

export default ProjectsSidebarContent;
//export default withReducer('projects', reducer)(Report);
