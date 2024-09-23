import React from "react";
import { List, ListItem, ListItemText, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import FuseAnimate from "@fuse/core/FuseAnimate";
import { routes } from "app/auth/store/userSlice";
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

function AccountSidebarContent(props) {
  const classes = useStyles(props);
  const dispatch = useDispatch();
  const route = useSelector(({ auth }) => auth.user.route);

  return (
    <div className="pt-0">
      <FuseAnimate animation="transition.slideLeftIn" delay={200}>
        <List>
          <ListItem
            button
            selected={route === "Password" ? true : false}
            activeclassname='active'
            className={classes.listItem}
            onClick={() =>{ 
              dispatch(routes("Password"))
              props.pageLayout.current.toggleLeftSidebar()
            }}
          >
            <ListItemText
              className="truncate pr-0 pl-8"
              primary="Password"
              disableTypography={true}
            />
          </ListItem>
          
          {/* <ListItem
            button
            selected={route === "Payment" ? true : false}
            className={classes.listItem}
             onClick={() =>{
              dispatch(routes("Payment")) 
              props.pageLayout.current.toggleLeftSidebar()
            }}
          >
            <ListItemText
              className="truncate pr-0 pl-8"
              primary="Payment"
              disableTypography={true}
            />
          </ListItem> */}

          <ListItem
            button
            selected={route === "Invite" ? true : false}
            className={classes.listItem}
            onClick={() =>{
              dispatch(routes("Invite"))
              props.pageLayout.current.toggleLeftSidebar()
            }}
          >
            <ListItemText
              className="truncate pr-0 pl-8"
              primary="Invite"
              disableTypography={true}
            />
          </ListItem>

          <ListItem
            button
            selected={route === "Refund" ? true : false}
            className={classes.listItem}
            onClick={() =>{
              dispatch(routes("Refund"))
              props.pageLayout.current.toggleLeftSidebar()
            }}
          >
            <ListItemText
              className="truncate pr-0 pl-8"
              primary="Refund Policy"
              disableTypography={true}
            />
          </ListItem>

          <ListItem
            button
            selected={route === "PrivacyPolicy" ? true : false}
            className={classes.listItem}
             onClick={() =>{
              dispatch(routes("PrivacyPolicy"))
              props.pageLayout.current.toggleLeftSidebar()
            }}
          >
            <ListItemText
              className="truncate pr-0 pl-8"
              primary="Privacy Policy"
              disableTypography={true}
            />
          </ListItem>
             
          <ListItem
            button
            selected={route === "ContactUs" ? true : false}
            className={classes.listItem}
            onClick={() => {
              dispatch(routes("ContactUs"))
              props.pageLayout.current.toggleLeftSidebar()
            }}
          >
            <ListItemText
              className="truncate pr-0 pl-8"
              primary="Contact us"
              disableTypography={true}
            />
          </ListItem>
        </List>
      </FuseAnimate>
    </div>
  );
}

export default AccountSidebarContent;
