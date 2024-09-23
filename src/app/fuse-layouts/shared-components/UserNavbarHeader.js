import AppBar from "@material-ui/core/AppBar";
import Avatar from "@material-ui/core/Avatar";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import clsx from "clsx";
import React from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import * as authActions from "app/auth/store/userSlice";
import Icon from '@material-ui/core/Icon';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import {
  clearStates,
  clearEntities,
} from "app/main/projects/store/projectsSlice";
import { navigateTo } from "app/utils/Navigator";
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    "&.user": {
      "& .username, & .email": {
        transition: theme.transitions.create("opacity", {
          duration: theme.transitions.duration.shortest,
          easing: theme.transitions.easing.easeInOut,
        }),
      },
    },
  },
  avatar: {
    width: 72,
    height: 72,
    position: "absolute",
    top: 92,
    padding: 8,
    background: theme.palette.background.default,
    boxSizing: "content-box",
    left: "50%",
    transform: "translateX(-50%)",
    transition: theme.transitions.create("all", {
      duration: theme.transitions.duration.shortest,
      easing: theme.transitions.easing.easeInOut,
    }),
    "& > img": {
      borderRadius: "50%",
    },
  },
  icon: {
    position: "absolute",
    right: 0,
    bottom: 0,
  },
}));

function UserNavbarHeader(props) {
  const user = useSelector(({ auth }) => auth.user);

  const dispatch = useDispatch();
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const ITEM_HEIGHT = 48;
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const accounts = () => {
    let userId = user.data.id;
    navigateTo(`/accounts/${userId}`);
  };

  return (
    <>
      <AppBar
        position="static"
        color="primary"
        elevation={0}
        classes={{ root: classes.root }}
        className="user relative  pt-24 pb-64 mb-32 z-0"
      >
        <div className="flex flex-col items-center justify-center">
          <Typography
            className="username text-16 whitespace-no-wrap"
            color="inherit"
          >
            {user.data.displayName}
          </Typography>
          <Typography
            className="email text-13 mt-8 opacity-50 whitespace-no-wrap"
            color="inherit"
          >
            {user.data.email}
          </Typography>
        </div>

        <Avatar
          className={clsx(classes.avatar, "avatar")}
          alt="user photo"
          src={
            user.data.photoURL && user.data.photoURL !== ""
              ? user.data.photoURL
              : "assets/images/avatars/profile.jpg"
          }
        />
        <IconButton
          className={clsx(classes.icon)}
          aria-label="more"
          aria-controls="long-menu"
          aria-haspopup="true"
          onClick={handleClick}
          color="inherit"
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="long-menu"
          anchorEl={anchorEl}
          keepMounted
          open={open}
          onClose={handleClose}
          PaperProps={{
            style: {
              maxHeight: ITEM_HEIGHT * 4.5,
              width: "20ch",
            },
          }}
        >
          <MenuItem
            onClick={() => {
              accounts();
              handleClose();
            }}
          >
            Accounts
          </MenuItem>
          {user.role === 'admin' ?
              <>
                <MenuItem 
                  component={Link} 
                  to='/dashboard' 
                  onClick={handleClose} 
                  role='button'
                >
                  <ListItemIcon className='min-w-40'>
                    <Icon>dashboard</Icon>
                  </ListItemIcon>
                  <ListItemText primary='DashBoard' />
                </MenuItem> 

                <MenuItem
                  component={Link}
                  to='/users'
                  onClick={handleClose}
                  role='button'
                >
                  <ListItemIcon className='min-w-40'>
                   <Icon>people</Icon>
                  </ListItemIcon>
                  <ListItemText primary='Users' />
                </MenuItem>

                <MenuItem
                  component={Link}
                  to='/reportSummary'
                  onClick={handleClose}
                  role='button'
                >
                  <ListItemIcon className='min-w-40'>
                    <Icon>report</Icon>
                  </ListItemIcon>
                  <ListItemText primary='Report Summary' />
                </MenuItem>
            
                <MenuItem
                  component={Link}
                  to='/dataStructure'
                  onClick={handleClose}
                  role='button'
                >
                  <ListItemIcon className='min-w-40'>
                    <Icon>report</Icon>
                  </ListItemIcon>
                  <ListItemText primary='Data Structure' />
                </MenuItem> 
              </>
          :null}
          {/* <MenuItem
            onClick={() => {
              privacy();
              handleClose();
            }}
          >
            Privacy Policy
          </MenuItem>
          <MenuItem
            onClick={() => {
              refund();
              handleClose();
            }}
          >
            Refund Policy
          </MenuItem> */}
          <MenuItem
            onClick={() => {
              dispatch(clearStates());
              dispatch(clearEntities());
              dispatch(authActions.logoutUser());
            }}
          >
            Logout
          </MenuItem>
        </Menu>
      </AppBar>
    </>
  );
}

export default UserNavbarHeader;
