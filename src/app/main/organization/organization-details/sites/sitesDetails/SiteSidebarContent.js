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
import { routes } from "../store/sitesSlice";
import { useDispatch, useSelector } from "react-redux";
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';

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

function SiteSidebarContent(props) {
  const classes = useStyles(props);
  const dispatch = useDispatch();
  const selctedRoutes = useSelector(({ sites }) => sites.routes);
  const siteName = useSelector(({ sites }) => sites.details.name);

  return (
    <div className="pt-20">
      <FuseAnimate animation="transition.slideLeftIn" delay={200}>
        <List>
          <ListItem
            activeclassname="active"
          >
            <ListItemIcon className='min-w-30'>
              <Avatar>{siteName === undefined ? '' : siteName[0]}</Avatar>
            </ListItemIcon>
            <ListItemText
              className="truncate pr-0 text-16 font-bold"
              primary={siteName}
              disableTypography={true}
            />     
          </ListItem>

          <ListItem
            button
            selected={selctedRoutes === "Projects" ? true : false}
            onClick={() => dispatch(routes("Projects"))}
            activeclassname="active"
            className={classes.listItem}
          >
            <ListItemText
              className="truncate pr-0"
              primary="Projects"
              disableTypography={true}
            />

            <Badge
              className="mr-4"
              color="secondary"
              showZero
              //badgeContent={entities.details.team.length}
            />
          </ListItem>

          <ListItem
            button
            selected={selctedRoutes === "Data-Structure" ? true : false}
            onClick={() => dispatch(routes("Data-Structure"))}
            activeclassname="active"
            className={classes.listItem}
          >
            <ListItemText
              className="truncate pr-0"
              primary="Data Structure"
              disableTypography={true}
            />

            <Badge
              className="mr-4"
              color="secondary"
              showZero
            />
          </ListItem>

          {/* <ListItem
            button
            selected={selctedRoutes === "Reports" ? true : false}
            onClick={() => dispatch(routes("Reports"))}
            className={classes.listItem}
          >
            <ListItemText
              className="truncate pr-0"
              primary="Reports"
              disableTypography={true}
            />
            <Badge
              className="mr-4"
              color="secondary"
              showZero
            />
          </ListItem> */}
          
          <ListItem
            button
            selected={selctedRoutes === "Info" ? true : false}
            onClick={() => dispatch(routes("Info"))}
            className={classes.listItem}
          >
            <ListItemText
              className="truncate pr-0"
              primary="Info"
              disableTypography={true}
            />
            <Badge
              className="mr-4"
              color="secondary"
              showZero
            />
          </ListItem>
        </List>
      </FuseAnimate>
    </div>
  );
}

export default SiteSidebarContent;
